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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import WorkflowSidebar from '../WorkflowSidebar/WorkflowSidebar';
import TriggerNode from '../TriggerNode/TriggerNode';
import ActionNode from '../ActionNode/ActionNode';
import FormNode from '../FormNode/FormNode';
import WaitNode from '../WaitNode/WaitNode';
import ConditionNode from '../ConditionNode/ConditionNode';
import WebhookNode from '../WebhookNode/WebhookNode';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createWorkflow, fetchWorkflow } from '../../store/workflowSlice';
import { convertWorkflowToReactFlow, convertReactFlowToWorkflow, getDefaultNodeData, generateNodeId } from '../../utils/workflowUtils';
import { NODE_TYPES } from '../../types/workflow';

// Initial nodes
const initialNodes = [
  {
    id: '1',
    type: NODE_TYPES.TRIGGER,
    position: { x: 100, y: 100 },
    data: { 
      label: 'When Tag is Added', 
      description: 'Starts when a tag is added to a contact',
      triggerType: 'tag_added'
    },
  },
];

// Initial edges
const initialEdges = [];

// Memoize nodeTypes outside the component to prevent recreation on every render
const nodeTypes = {
  [NODE_TYPES.TRIGGER]: TriggerNode,
  [NODE_TYPES.ACTION]: ActionNode,
  [NODE_TYPES.FORM]: FormNode,
  [NODE_TYPES.WAIT]: WaitNode,
  [NODE_TYPES.CONDITION]: ConditionNode,
  [NODE_TYPES.WEBHOOK]: WebhookNode,
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
            // Convert workflow definition to React Flow format
            const { nodes, edges } = convertWorkflowToReactFlow(workflowData);
            setNodes(nodes);
            setEdges(edges);
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
      
      // Get default data for the node type
      const defaultData = getDefaultNodeData(type);
      
      const newNode = {
        id: generateNodeId(),
        type,
        position,
        data: defaultData
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
      
      // Get the current viewport
      const viewport = reactFlowInstance.getViewport();
      
      // Convert React Flow format to workflow definition
      const definition = convertReactFlowToWorkflow(nodes, edges, viewport);
      
      const workflowData = {
        name: workflowName.trim(),
        definition
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
    <div className="flex h-full">
      <WorkflowSidebar onDragStart={onDragStart} />
      
      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button 
            onClick={resetWorkflow}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Reset
          </button>
          <button 
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Save
          </button>
          <button 
            onClick={() => {
              const newNode = {
                id: `${Date.now()}`,
                type: 'action',
                position: { x: 100, y: 100 },
                data: { 
                  label: 'New Action',
                  description: 'Workflow action'
                },
              };
              setNodes((nds) => nds.concat(newNode));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            +
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
          <Controls position="top-right" />
        </ReactFlow>
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
