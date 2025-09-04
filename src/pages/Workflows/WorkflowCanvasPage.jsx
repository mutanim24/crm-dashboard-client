import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflow, selectCurrentWorkflow, updateWorkflow, createWorkflow } from '../../store/workflowSlice';
import  {
  ReactFlow,
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
import TriggerNode from '../../components/TriggerNode/TriggerNode';
import ActionNode from '../../components/ActionNode/ActionNode';
import { toast } from 'react-hot-toast';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { FiEdit2, FiSave, FiX, FiTrash2, FiPlus } from 'react-icons/fi';

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

// Node options for the right sidebar
const nodeOptions = [
  { id: 'trigger', label: 'Add Trigger', type: 'trigger' },
  { id: 'form', label: 'Add Form', type: 'action' },
  { id: 'email', label: 'Send Email', type: 'action' },
  { id: 'wait', label: 'Wait/Delay', type: 'action' },
];

const WorkflowCanvasPageInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);

  // Load workflow data when id prop changes
  useEffect(() => {
    if (id && id !== 'new') {
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
            
            // Workflow name is displayed in the header from currentWorkflow
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
          }
        })
        .catch((error) => {
          console.error('Error fetching workflow:', error);
          toast.error('Failed to load workflow');
          setNodes(initialNodes);
          setEdges(initialEdges);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Reset to initial state if no id (new workflow)
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [id, dispatch, setNodes, setEdges, reactFlowInstance]);

  // Removed auto-zoom effect - user will manually control zoom
  // useEffect(() => {
  //   if (nodes.length > 0 && edges.length >= 0 && reactFlowInstance) {
  //     setTimeout(() => {
  //       reactFlowInstance.fitView({ duration: 300 });
  //     }, 100);
  //   }
  // }, [nodes, edges, reactFlowInstance]);

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
          label: getNodeLabel(type),
          description: getNodeDescription(type)
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleAddNode = (nodeType) => {
    const position = { x: 100, y: 100 + (nodes.length * 100) };
    
    const newNode = {
      id: `${Date.now()}`,
      type: nodeType,
      position,
      data: { 
        label: getNodeLabel(nodeType),
        description: getNodeDescription(nodeType)
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setShowSidebar(false);
  };

  const handleBackToList = () => {
    navigate('/workflows');
  };

  const getNodeLabel = (type) => {
    switch(type) {
      case 'trigger': return 'Trigger';
      case 'form': return 'Form';
      case 'email': return 'Send Email';
      case 'wait': return 'Wait/Delay';
      default: return 'Node';
    }
  };

  const getNodeDescription = (type) => {
    switch(type) {
      case 'trigger': return 'Workflow trigger';
      case 'form': return 'Collect information';
      case 'email': return 'Send email notification';
      case 'wait': return 'Add delay or wait condition';
      default: return 'Workflow node';
    }
  };

  // Workflow name editing functions
  useEffect(() => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
    } else if (id === 'new') {
      setWorkflowName('New Workflow');
    }
  }, [currentWorkflow, id]);

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setWorkflowName(e.target.value);
  };

  const handleNameSave = () => {
    if (workflowName.trim() && id && id !== 'new') {
      dispatch(updateWorkflow({ id, name: workflowName.trim() }))
        .unwrap()
        .then(() => {
          setIsEditingName(false);
          toast.success('Workflow name updated');
        })
        .catch(() => {
          toast.error('Failed to update workflow name');
        });
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
    } else {
      setWorkflowName('New Workflow');
    }
    setIsEditingName(false);
  };

  // Save workflow to backend and local storage
  const handleSaveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        definition: {
          nodes,
          edges,
          viewport: reactFlowInstance?.getViewport(),
          lastModified: new Date().toISOString(),
        }
      };
      
      let response;
      if (id && id !== 'new') {
        // Update existing workflow
        response = await dispatch(updateWorkflow({ id, name: workflowName }));
      } else {
        // Create new workflow
        response = await dispatch(createWorkflow(workflowData));
        // Update the URL with the new workflow ID
        navigate(`/workflows/${response.payload.id}`);
      }
      
      // Show success message is handled by the slice
      
      // Redirect to workflow list after a short delay
      setTimeout(() => {
        navigate('/workflows');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  };

  // Load workflow from local storage
  const loadWorkflowFromLocalStorage = (workflowId) => {
    try {
      const savedData = localStorage.getItem(`workflow_${workflowId}`);
      if (savedData) {
        const workflowData = JSON.parse(savedData);
        setNodes(workflowData.nodes || initialNodes);
        setEdges(workflowData.edges || initialEdges);
        
        if (workflowData.viewport && reactFlowInstance) {
          setTimeout(() => {
            reactFlowInstance.setViewport(workflowData.viewport);
          }, 100);
        }
        
        if (workflowData.name) {
          setWorkflowName(workflowData.name);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading workflow from local storage:', error);
      return false;
    }
  };

  // Check for saved workflow on component mount
  useEffect(() => {
    if (id && id !== 'new') {
      const hasSavedData = loadWorkflowFromLocalStorage(id);
      if (!hasSavedData) {
        // If no saved data, try to load from API
        setIsLoading(true);
        dispatch(fetchWorkflow(id))
          .unwrap()
          .then((workflowData) => {
            if (workflowData && workflowData.definition) {
              const { nodes: loadedNodes, edges: loadedEdges } = workflowData.definition;
              
              if (loadedNodes && Array.isArray(loadedNodes)) {
                setNodes(loadedNodes);
              }
              
              if (loadedEdges && Array.isArray(loadedEdges)) {
                setEdges(loadedEdges);
              }
              
              if (workflowData.definition.viewport && reactFlowInstance) {
                setTimeout(() => {
                  reactFlowInstance.setViewport(workflowData.definition.viewport);
                }, 100);
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching workflow:', error);
            toast.error('Failed to load workflow');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [id, dispatch, setNodes, setEdges, reactFlowInstance]);

  // Delete node function
  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  // Custom node with delete button
  const CustomNode = ({ data, id }) => {
    return (
      <div className="relative">
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 min-w-[150px]">
          <div className="font-medium text-gray-800">{data.label}</div>
          <div className="text-xs text-gray-500 mt-1">{data.description}</div>
        </div>
        <button
          onClick={() => handleDeleteNode(id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
          title="Delete node"
        >
          <FiTrash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  // Add custom node type
  const customNodeTypes = {
    ...nodeTypes,
    default: CustomNode,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading workflow...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Small workflow name display at the top */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleBackToList}
            variant="outline"
            size="sm"
          >
            ← Back
          </Button>
          <div className="flex items-center">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={workflowName}
                  onChange={handleNameChange}
                  autoFocus
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={handleNameSave}
                  className="text-green-600 hover:text-green-800"
                >
                  ✓
                </button>
                <button 
                  onClick={handleNameCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center cursor-pointer" onClick={handleNameClick}>
                <span className="text-sm font-medium text-gray-700">
                  {workflowName}
                </span>
                <FiEdit2 className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
          >
            <FiSave className="w-4 h-4 mr-1" />
            Save Workflow
          </button>
        </div>
      </div>

      {/* Main Content - Canvas takes up remaining space */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
            >
              <FiPlus className="w-5 h-5 mr-1" />
              +
            </button>
          </div>
          
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={customNodeTypes}
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

        {/* Right Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-white shadow-lg border-l border-gray-200 flex flex-col">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Add Elements</h2>
              <p className="text-sm text-gray-500 mt-1">Click to add to canvas</p>
            </div>
            
            <div className="p-4 flex-1">
              <div className="space-y-3">
                {nodeOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleAddNode(option.type)}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center text-center"
                  >
                    <div className="font-semibold text-blue-800 mb-1">{option.label}</div>
                    <div className="text-xs text-blue-600">{getNodeDescription(option.type)}</div>
                    <div className="mt-3 text-blue-400">
                      {option.type === 'trigger' ? '🔥' : 
                       option.type === 'form' ? '📝' : 
                       option.type === 'email' ? '📧' : '⏱️'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={() => setShowSidebar(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WorkflowCanvasPage = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasPageInner />
    </ReactFlowProvider>
  );
};

export default WorkflowCanvasPage;
