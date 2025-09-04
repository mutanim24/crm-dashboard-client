/**
 * Test file to demonstrate workflow integration with React Flow
 * This file shows how to use the workflow utilities with sample data
 */

import React, { useState, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  ReactFlowProvider,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import TriggerNode from './components/TriggerNode/TriggerNode';
import ActionNode from './components/ActionNode/ActionNode';
import FormNode from './components/FormNode/FormNode';
import WaitNode from './components/WaitNode/WaitNode';
import ConditionNode from './components/ConditionNode/ConditionNode';
import WebhookNode from './components/WebhookNode/WebhookNode';
import { convertWorkflowToReactFlow, convertReactFlowToWorkflow, getDefaultNodeData, generateNodeId } from './utils/workflowUtils';
import { NODE_TYPES } from './types/workflow';
import { sampleWorkflow, complexWorkflow } from './sampleWorkflow';

// Node types for React Flow
const nodeTypes = {
  [NODE_TYPES.TRIGGER]: TriggerNode,
  [NODE_TYPES.ACTION]: ActionNode,
  [NODE_TYPES.FORM]: FormNode,
  [NODE_TYPES.WAIT]: WaitNode,
  [NODE_TYPES.CONDITION]: ConditionNode,
  [NODE_TYPES.WEBHOOK]: WebhookNode,
};

const WorkflowIntegrationTest = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState('sample');
  const [workflowJson, setWorkflowJson] = useState({});

  // Load sample workflow when component mounts
  useEffect(() => {
    loadWorkflow(currentWorkflow);
  }, [currentWorkflow]);

  const loadWorkflow = (workflowType) => {
    let workflowData;
    
    if (workflowType === 'sample') {
      workflowData = sampleWorkflow;
    } else if (workflowType === 'complex') {
      workflowData = complexWorkflow;
    } else {
      return;
    }
    
    // Convert workflow to React Flow format
    const { nodes, edges } = convertWorkflowToReactFlow(workflowData);
    setNodes(nodes);
    setEdges(edges);
    setWorkflowJson(workflowData);
    
    console.log('Loaded workflow:', workflowData);
  };

  const onConnect = (params) => {
    setEdges((eds) => addEdge({ 
      ...params, 
      type: 'smoothstep', 
      animated: true, 
      markerEnd: { type: MarkerType.ArrowClosed }
    }, eds));
  };

  const handleAddNode = (nodeType) => {
    const position = { x: 100, y: 100 + (nodes.length * 100) };
    
    // Get default data for the node type
    const defaultData = getDefaultNodeData(nodeType);
    
    const newNode = {
      id: generateNodeId(),
      type: nodeType,
      position,
      data: defaultData
    };
    
    setNodes((nds) => nds.concat(newNode));
  };

  const handleSaveWorkflow = () => {
    // Convert React Flow format back to workflow format
    const viewport = { x: 0, y: 0, zoom: 1 }; // In a real app, get this from ReactFlow instance
    const definition = convertReactFlowToWorkflow(nodes, edges, viewport);
    
    const updatedWorkflow = {
      ...workflowJson,
      definition,
      lastModified: new Date().toISOString()
    };
    
    setWorkflowJson(updatedWorkflow);
    console.log('Saved workflow:', updatedWorkflow);
    
    // In a real app, this would be sent to the backend
    alert('Workflow saved! Check the console for the updated workflow JSON.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Workflow Integration Test</h1>
        <p className="text-gray-600 mb-4">
          This demonstrates the integration between the workflow JSON schema and React Flow canvas.
        </p>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setCurrentWorkflow('sample')}
            className={`px-4 py-2 rounded-lg ${
              currentWorkflow === 'sample'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Load Sample Workflow
          </button>
          
          <button
            onClick={() => setCurrentWorkflow('complex')}
            className={`px-4 py-2 rounded-lg ${
              currentWorkflow === 'complex'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Load Complex Workflow
          </button>
          
          <button
            onClick={() => handleAddNode(NODE_TYPES.ACTION)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Action Node
          </button>
          
          <button
            onClick={handleSaveWorkflow}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Workflow
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 border border-gray-300 rounded-lg bg-white">
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
        
        <div className="w-96 ml-4 border border-gray-300 rounded-lg bg-white p-4 overflow-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Workflow JSON</h2>
          <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(workflowJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

const WorkflowIntegrationTestWrapper = () => {
  return (
    <ReactFlowProvider>
      <WorkflowIntegrationTest />
    </ReactFlowProvider>
  );
};

export default WorkflowIntegrationTestWrapper;
