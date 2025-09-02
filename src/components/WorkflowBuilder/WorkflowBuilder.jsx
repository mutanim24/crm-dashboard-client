import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowSidebar from '../WorkflowSidebar/WorkflowSidebar';
import TriggerNode from '../TriggerNode/TriggerNode';
import ActionNode from '../ActionNode/ActionNode';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createWorkflow, fetchWorkflow } from '../../store/workflowSlice';

// Initial nodes
const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'When Tag is Added', 
      description: 'Starts when a tag is added to a contact' 
    },
  },
];

// Initial edges
const initialEdges = [];

// Memoize nodeTypes outside the component to prevent recreation on every render
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

const WorkflowBuilderInner = ({ id }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  const [workflowName, setWorkflowName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Load workflow data when id prop changes
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch(fetchWorkflow(id))
        .unwrap()
        .then((workflowData) => {
          if (workflowData && workflowData.definition) {
            // Extract nodes, edges, and viewport from the definition object
            const { nodes: loadedNodes, edges: loadedEdges } = workflowData.definition;
            
            if (loadedNodes && Array.isArray(loadedNodes)) {
              setNodes(loadedNodes);
            }
            
            if (loadedEdges && Array.isArray(loadedEdges)) {
              setEdges(loadedEdges);
            }
            
            setWorkflowName(workflowData.name || '');
            
            // Restore viewport if available
            if (workflowData.definition.viewport && reactFlowInstance) {
              setTimeout(() => {
                reactFlowInstance.setViewport(workflowData.definition.viewport);
              }, 100);
            }
          } else {
            // Reset to initial state if no definition
            setNodes(initialNodes);
            setEdges(initialEdges);
            setWorkflowName('');
          }
        })
        .catch((error) => {
          console.error('Error fetching workflow:', error);
          toast.error('Failed to load workflow');
          setNodes(initialNodes);
          setEdges(initialEdges);
          setWorkflowName('');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset to initial state if no id
      setNodes(initialNodes);
      setEdges(initialEdges);
      setWorkflowName('');
    }
  }, [id, dispatch, setNodes, setEdges, reactFlowInstance]);

  // Fit view when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 && edges.length >= 0 && reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 300 });
      }, 100);
    }
  }, [nodes, edges, reactFlowInstance]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      animated: true, 
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { 
          label: type === 'trigger' ? 'New Trigger' : 'New Action',
          description: type === 'trigger' ? 'Workflow trigger' : 'Workflow action'
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const resetWorkflow = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setWorkflowName('');
  };

  // Save workflow using reactFlowInstance.toObject()
  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    if (nodes.length === 0) {
      toast.error('Please add at least one node to the workflow');
      return;
    }

    try {
      toast.loading('Saving workflow...');
      
      // Get the complete serializable canvas state
      const flowObject = reactFlowInstance.toObject();
      
      const workflowData = {
        name: workflowName.trim(),
        definition: flowObject // Send the entire ReactFlow object
      };

      await dispatch(createWorkflow(workflowData)).unwrap();
      
      toast.success('Workflow saved successfully!');
      setWorkflowName('');
    } catch (error) {
      toast.error(error || 'Failed to save workflow');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center space-x-4">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Enter workflow name..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSaveWorkflow}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
        >
          Save Workflow
        </button>
      </div>
      
      <div className="flex flex-1">
        <WorkflowSidebar onDragStart={onDragStart} />
        
        <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button 
              onClick={resetWorkflow}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            >
              Reset
            </button>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            className="bg-gray-50"
          >
            <Background color="#e5e7eb" gap={24} />
            <Controls />
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.style?.backgroundColor) {
                  return n.style.backgroundColor;
                }
                return '#eee';
              }}
              nodeColor={(n) => {
                if (n.style?.backgroundColor) {
                  return n.style.backgroundColor;
                }
                return '#fff';
              }}
              nodeBorderRadius={2}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

const WorkflowBuilder = ({ id }) => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner id={id} />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
