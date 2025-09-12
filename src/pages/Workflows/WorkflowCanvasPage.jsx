import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflow, selectCurrentWorkflow, updateWorkflow, createWorkflow } from '../../store/workflowSlice';
import {
  ReactFlow, addEdge, useNodesState, useEdgesState, Background, Controls, MiniMap,
  useReactFlow, MarkerType, ReactFlowProvider, BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'react-hot-toast';

// --- Using react-icons for a professional and consistent icon set ---
import {
  HiArrowLeft, HiOutlinePencil, HiOutlineCheck, HiOutlineXMark, HiOutlineCloudArrowUp,
  HiPlus, HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineFunnel,
  HiOutlineClock, HiCodeBracket, HiOutlineTrash
} from "react-icons/hi2";

// --- All Existing Imports are Preserved ---
import TriggerNode from '../../components/TriggerNode/TriggerNode';
import ActionNode from '../../components/ActionNode/ActionNode';
import FormNode from '../../components/FormNode/FormNode';
import WaitNode from '../../components/WaitNode/WaitNode';
import ConditionNode from '../../components/ConditionNode/ConditionNode';
import WebhookNode from '../../components/WebhookNode/WebhookNode';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import NodePropertiesPanel from '../../components/NodePropertiesPanel/NodePropertiesPanel';
import { convertWorkflowToReactFlow, convertReactFlowToWorkflow, getDefaultNodeData, generateNodeId } from '../../utils/workflowUtils';
import { NODE_TYPES } from '../../types/workflow';


// --- UI Sub-components (for a clean, professional structure) ---
const TopBar = ({ workflowName, isEditing, onNameClick, onNameChange, onNameSave, onNameCancel, onSave, onBack }) => (
  <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20">
    <div className="flex items-center gap-3">
      <Button variant="ghost" className="!p-2" onClick={onBack} aria-label="Back to Workflows">
        <HiArrowLeft className="w-5 h-5 text-gray-500" />
      </Button>
      <div className="h-6 w-px bg-slate-200"></div>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={workflowName}
            onChange={onNameChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNameSave();
              if (e.key === 'Escape') onNameCancel();
            }}
            autoFocus
            className="!py-1 !text-base"
          />
          <Button variant="ghost" className="!p-2 text-green-600" onClick={onNameSave} aria-label="Save name"><HiOutlineCheck className="w-5 h-5" /></Button>
          <Button variant="ghost" className="!p-2" onClick={onNameCancel} aria-label="Cancel editing name"><HiOutlineXMark className="w-5 h-5" /></Button>
        </div>
      ) : (
        <div onClick={onNameClick} className="group flex items-center gap-2 cursor-pointer p-2 -m-2 rounded-md hover:bg-slate-100">
          <h1 className="text-lg font-semibold text-gray-800">{workflowName}</h1>
          <HiOutlinePencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
    <div className="flex items-center gap-3">
      <Button
        variant="primary"
        onClick={onSave}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
      >
        <HiOutlineCloudArrowUp className="w-5 h-5" />
        <span>Save Workflow</span>
      </Button>

    </div>
  </header>
);

const ElementsSidebar = ({ onNodeDragStart }) => {
  const nodeOptions = [
    { type: NODE_TYPES.TRIGGER, label: 'Trigger', description: 'Start the workflow', icon: <HiOutlineSparkles className="w-5 h-5 text-purple-500" /> },
    { type: NODE_TYPES.ACTION, label: 'Action', description: 'Perform a task', icon: <HiOutlinePaperAirplane className="w-5 h-5 text-blue-500" /> },
    { type: NODE_TYPES.CONDITION, label: 'Condition', description: 'Branch the path', icon: <HiOutlineFunnel className="w-5 h-5 text-orange-500" /> },
    { type: NODE_TYPES.WAIT, label: 'Delay', description: 'Wait for a period', icon: <HiOutlineClock className="w-5 h-5 text-sky-500" /> },
    { type: NODE_TYPES.WEBHOOK, label: 'Webhook', description: 'Send data externally', icon: <HiCodeBracket className="w-5 h-5 text-slate-500" /> },
  ];

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col z-10">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-gray-800">Add Elements</h2>
        <p className="text-sm text-gray-500">Drag items onto the canvas.</p>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {nodeOptions.map(opt => (
          <div
            key={opt.type}
            onDragStart={(e) => onNodeDragStart(e, opt.type)}
            draggable
            className="group p-3 bg-white border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-green-400 hover:shadow-sm transition-all flex items-center gap-3"
          >
            <div className="bg-slate-100 p-2 rounded-md group-hover:bg-green-100 transition-colors">
              {opt.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};


// --- Main Component with Technical Fixes ---
const WorkflowCanvasPageInner = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();

  const [currentId, setCurrentId] = useState(paramId);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeProperties, setShowNodeProperties] = useState(false);

  const currentWorkflow = useSelector(selectCurrentWorkflow);

  const nodeTypes = useMemo(() => ({
    [NODE_TYPES.TRIGGER]: TriggerNode, [NODE_TYPES.ACTION]: ActionNode, [NODE_TYPES.FORM]: FormNode,
    [NODE_TYPES.WAIT]: WaitNode, [NODE_TYPES.CONDITION]: ConditionNode, [NODE_TYPES.WEBHOOK]: WebhookNode,
  }), []);

  useEffect(() => {
    if (currentId && currentId !== 'new') {
      setIsLoading(true);
      dispatch(fetchWorkflow(currentId)).unwrap().then(workflowData => {
        if (workflowData) {
          setWorkflowName(workflowData.name);
            if (workflowData.definition) {
              const { nodes: loadedNodes, edges: loadedEdges } = convertWorkflowToReactFlow(workflowData);
              setNodes(loadedNodes || initialNodes);
              setEdges(loadedEdges || initialEdges);
              if (workflowData.definition.viewport) {
                // Use requestAnimationFrame for smoother viewport transition
                requestAnimationFrame(() => {
                  reactFlowInstance.setViewport(workflowData.definition.viewport);
                });
              }
            } else {
              setNodes(initialNodes); setEdges(initialEdges);
            }
        }
      }).catch(err => {
        toast.error('Failed to load workflow.');
        console.error(err);
        navigate('/workflows');
      }).finally(() => setIsLoading(false));
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setWorkflowName('Untitled Workflow');
      setIsEditingName(true);
      setIsLoading(false);
    }
  }, [currentId, dispatch, setNodes, setEdges, reactFlowInstance, navigate]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)), [setEdges]);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const defaultData = getDefaultNodeData(type);
    const newNode = { id: generateNodeId(), type, position, data: defaultData };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    // Check if the click is on a delete button
    if (event.target.closest('.delete-node-btn')) {
      return;
    }
    setSelectedNode(node);
    setShowNodeProperties(true);
  }, []);

  const handleNodeSave = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData
            }
          };
        }
        return node;
      })
    );
    toast.success('Node updated successfully');
  }, [setNodes]);

  const handleNodeDelete = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    toast.success('Node deleted successfully');
  }, [setNodes, setEdges]);

  const handleSaveWorkflow = useCallback(async () => {
    if (!workflowName.trim()) {
      toast.error("Workflow name cannot be empty.");
      return;
    }

    // *** TECHNICAL FIX: Safety check to prevent crash ***
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      console.error("Critical Error: nodes or edges state is not an array!", { nodes, edges });
      toast.error("A critical error occurred. Cannot save.");
      return;
    }

    const toastId = toast.loading('Saving workflow...');
    try {
      // *** TECHNICAL FIX: Pass arguments separately to the utility function ***
      const viewport = reactFlowInstance ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };
      const definition = convertReactFlowToWorkflow(nodes, edges, viewport);

      const workflowPayload = {
        name: workflowName,
        definition: definition,
      };

      if (currentId && currentId !== 'new') {
        await dispatch(updateWorkflow({ id: currentId, ...workflowPayload })).unwrap();
      } else {
        const response = await dispatch(createWorkflow(workflowPayload)).unwrap();
        const newId = response.id;

        setCurrentId(newId);
        navigate(`/workflows/${newId}`, { replace: true });
      }

      toast.success('Workflow saved successfully!', { id: toastId });
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to save workflow.', { id: toastId });
      console.error('Error saving workflow:', error);
    }
  }, [currentId, workflowName, nodes, edges, reactFlowInstance, dispatch, navigate]);

  const onNodeDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Add event listener for delete button clicks
  useEffect(() => {
    const handleDeleteClick = (event) => {
      const deleteBtn = event.target.closest('.delete-node-btn');
      if (deleteBtn) {
        const nodeId = deleteBtn.getAttribute('data-node-id');
        if (nodeId) {
          handleNodeDelete(nodeId);
        }
      }
    };

    document.addEventListener('click', handleDeleteClick);
    return () => {
      document.removeEventListener('click', handleDeleteClick);
    };
  }, [handleNodeDelete]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <TopBar
        workflowName={workflowName}
        isEditing={isEditingName}
        onNameClick={() => setIsEditingName(true)}
        onNameChange={(e) => setWorkflowName(e.target.value)}
        onNameSave={handleSaveWorkflow} // Save the entire workflow when name is saved
        onNameCancel={() => { setIsEditingName(false); if (currentWorkflow) setWorkflowName(currentWorkflow.name); }}
        onSave={handleSaveWorkflow}
        onBack={() => navigate('/workflows')}
      />
      <div className="flex-1 flex min-h-0">
        <main className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes} edges={edges} onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange} onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes} fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#e2e8f0" />
            <Controls position="top-right" />
            <MiniMap position="bottom-left" zoomable pannable />
          </ReactFlow>

          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="primary"
              onClick={() => setShowSidebar(!showSidebar)}
              className="!rounded-full !p-3 shadow-lg"
              aria-label={showSidebar ? "Hide Elements" : "Show Elements"}
            >
              {showSidebar ? <HiOutlineXMark className="w-5 h-5" /> : <HiPlus className="w-5 h-5" />}
            </Button>
          </div>
        </main>
        {showSidebar && <ElementsSidebar onNodeDragStart={onNodeDragStart} />}
      </div>

      <NodePropertiesPanel
        node={selectedNode}
        isOpen={showNodeProperties}
        onClose={() => setShowNodeProperties(false)}
        onSave={handleNodeSave}
        onDelete={handleNodeDelete}
      />
    </div>
  );
};

// --- Provider Wrapper (Unchanged) ---
const WorkflowCanvasPage = () => (
  <ReactFlowProvider>
    <WorkflowCanvasPageInner />
  </ReactFlowProvider>
);

// Initial nodes for a new workflow (Unchanged)
const initialNodes = [{
  id: 'start-trigger', type: NODE_TYPES.TRIGGER, position: { x: 250, y: 150 },
  data: { label: 'Start Trigger', description: 'When something happens...' }
}];
const initialEdges = [];

export default WorkflowCanvasPage;
