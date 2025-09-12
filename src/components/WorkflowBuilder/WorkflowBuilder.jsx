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
import { createWorkflow, fetchWorkflow, updateWorkflow } from '../../store/workflowSlice';
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

const WorkflowBuilderInner = ({ id, workflowName: parentWorkflowName, onWorkflowNameChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  const [workflowName, setWorkflowName] = useState(parentWorkflowName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [workflowDefinition, setWorkflowDefinition] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const dispatch = useDispatch();

  // Sync workflow name with parent component
  useEffect(() => {
    if (onWorkflowNameChange && workflowName !== parentWorkflowName) {
      onWorkflowNameChange(workflowName);
    }
  }, [workflowName, parentWorkflowName, onWorkflowNameChange]);

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
            
            // Initialize workflow definition
            setWorkflowDefinition(workflowData.definition);
            setHasUnsavedChanges(false);
          } else {
            // Reset to initial state if no definition
            setNodes(initialNodes);
            setEdges(initialEdges);
            setWorkflowName('');
            setWorkflowDefinition(null);
            setHasUnsavedChanges(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching workflow:', error);
          toast.error('Failed to load workflow');
          setNodes(initialNodes);
          setEdges(initialEdges);
          setWorkflowName('');
          setWorkflowDefinition(null);
          setHasUnsavedChanges(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset to initial state if no id
      setNodes(initialNodes);
      setEdges(initialEdges);
      setWorkflowName('');
      setWorkflowDefinition(null);
      setHasUnsavedChanges(false);
    }
  }, [id, dispatch, setNodes, setEdges, reactFlowInstance]);

  // Update workflow definition when nodes or edges change
  useEffect(() => {
    if (id && id !== 'new' && nodes.length > 0) {
      const viewport = reactFlowInstance ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };
      const definition = convertReactFlowToWorkflow(nodes, edges, viewport);
      setWorkflowDefinition(definition);
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, id, reactFlowInstance]);

  // Update workflow definition when workflow name changes
  useEffect(() => {
    if (id && id !== 'new' && workflowDefinition) {
      const updatedDefinition = {
        ...workflowDefinition,
        name: workflowName.trim()
      };
      setWorkflowDefinition(updatedDefinition);
      setHasUnsavedChanges(true);
    }
  }, [workflowName, id, workflowDefinition]);

  // Fit view when nodes or edges change (only when not loading)
  useEffect(() => {
    if (nodes.length > 0 && edges.length >= 0 && reactFlowInstance && !isLoading) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: 300 });
      }, 100);
    }
  }, [nodes, edges, reactFlowInstance, isLoading]);

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
      
      // Use the workflowDefinition state if available (for existing workflows)
      // Otherwise create a new definition
      const viewport = reactFlowInstance ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };
      const definition = workflowDefinition || convertReactFlowToWorkflow(nodes, edges, viewport);
      
      const workflowData = {
        name: workflowName.trim(),
        definition
      };

      // Check if we're updating an existing workflow or creating a new one
      if (id && id !== 'new') {
        // Update existing workflow
        await dispatch(updateWorkflow({ id, ...workflowData })).unwrap();
        setHasUnsavedChanges(false);
        toast.success('Workflow updated successfully!');
      } else {
        // Create new workflow
        const result = await dispatch(createWorkflow(workflowData)).unwrap();
        
        // If we successfully created a workflow, navigate to its detail page
        if (result && result.id) {
          // We don't need to navigate here as the component will handle it
          setWorkflowDefinition(workflowData.definition);
          setHasUnsavedChanges(false);
          toast.success('Workflow created successfully!');
        } else {
          toast.success('Workflow created successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error(error?.message || 'Failed to save workflow');
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
          {/* Show unsaved changes indicator for existing workflows */}
          {id && id !== 'new' && hasUnsavedChanges && (
            <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex items-center shadow-md">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              Unsaved Changes
            </div>
          )}
          
          <button 
            onClick={resetWorkflow}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            Reset
          </button>
          <button 
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
          >
            {id && id !== 'new' ? 'Update' : 'Save'}
            {id && id !== 'new' && hasUnsavedChanges && (
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
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

const WorkflowBuilder = ({ id, workflowName, onWorkflowNameChange }) => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner id={id} workflowName={workflowName} onWorkflowNameChange={onWorkflowNameChange} />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
