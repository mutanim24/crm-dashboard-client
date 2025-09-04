import { mockWorkflow } from '../types/workflow';
import { NODE_TYPES } from '../types/workflow';

/**
 * Convert workflow JSON to React Flow format
 * @param {object} workflow - Workflow object from the backend
 * @returns {object} - Object with nodes and edges in React Flow format
 */
export const convertWorkflowToReactFlow = (workflow) => {
  if (!workflow || !workflow.definition) {
    return { nodes: [], edges: [] };
  }

  const { nodes: workflowNodes, edges: workflowEdges } = workflow.definition;
  
  // Convert nodes to React Flow format
  const nodes = (workflowNodes || []).map(node => ({
    ...node,
    // Ensure all required fields are present
    id: node.id || `node-${Date.now()}`,
    type: node.type || NODE_TYPES.ACTION,
    position: node.position || { x: 100, y: 100 },
    data: {
      label: node.data?.label || 'Untitled Node',
      description: node.data?.description || 'No description',
      ...node.data // Include all other data properties
    }
  }));

  // Convert edges to React Flow format
  const edges = (workflowEdges || []).map(edge => ({
    ...edge,
    // Ensure all required fields are present
    id: edge.id || `edge-${Date.now()}`,
    source: edge.source || '',
    target: edge.target || '',
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: 'arrowclosed' }
  }));

  return { nodes, edges };
};

/**
 * Convert React Flow format to workflow JSON
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {object} viewport - React Flow viewport state
 * @returns {object} - Workflow definition object
 */
export const convertReactFlowToWorkflow = (nodes, edges, viewport = {}) => {
  // Convert nodes to workflow format
  const workflowNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      label: node.data?.label || 'Untitled Node',
      description: node.data?.description || 'No description',
      ...Object.fromEntries(
        Object.entries(node.data || {})
          .filter(([key]) => !key.startsWith('_')) // Remove internal React Flow properties
      )
    }
  }));

  // Convert edges to workflow format
  const workflowEdges = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    condition: edge.condition,
    label: edge.label
  }));

  return {
    nodes: workflowNodes,
    edges: workflowEdges,
    viewport: {
      x: viewport.x || 0,
      y: viewport.y || 0,
      zoom: viewport.zoom || 1
    },
    lastModified: new Date().toISOString()
  };
};

/**
 * Get a sample workflow for testing
 * @returns {object} - Sample workflow object
 */
export const getSampleWorkflow = () => {
  return JSON.parse(JSON.stringify(mockWorkflow));
};

/**
 * Validate workflow against schema
 * @param {object} workflow - Workflow object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateWorkflow = (workflow) => {
  if (!workflow || typeof workflow !== 'object') {
    return false;
  }

  // Check required fields
  if (!workflow.name || typeof workflow.name !== 'string') {
    return false;
  }

  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    return false;
  }

  if (!workflow.edges || !Array.isArray(workflow.edges)) {
    return false;
  }

  // Validate nodes
  for (const node of workflow.nodes) {
    if (!node.id || typeof node.id !== 'string') {
      return false;
    }

    if (!node.type || ![
      NODE_TYPES.TRIGGER,
      NODE_TYPES.ACTION,
      NODE_TYPES.FORM,
      NODE_TYPES.WAIT,
      NODE_TYPES.CONDITION,
      NODE_TYPES.WEBHOOK
    ].includes(node.type)) {
      return false;
    }

    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      return false;
    }

    if (!node.data || typeof node.data !== 'object') {
      return false;
    }
  }

  // Validate edges
  for (const edge of workflow.edges) {
    if (!edge.id || typeof edge.id !== 'string') {
      return false;
    }

    if (!edge.source || typeof edge.source !== 'string') {
      return false;
    }

    if (!edge.target || typeof edge.target !== 'string') {
      return false;
    }

    // Check if source and target nodes exist
    if (!workflow.nodes.find(n => n.id === edge.source)) {
      return false;
    }

    if (!workflow.nodes.find(n => n.id === edge.target)) {
      return false;
    }
  }

  return true;
};

/**
 * Get default node data based on type
 * @param {string} type - Node type
 * @returns {object} - Default data for the node
 */
export const getDefaultNodeData = (type) => {
  switch (type) {
    case NODE_TYPES.TRIGGER:
      return {
        label: 'New Trigger',
        description: 'Workflow trigger',
        triggerType: 'contact_created'
      };
    case NODE_TYPES.ACTION:
      return {
        label: 'New Action',
        description: 'Workflow action',
        actionType: 'send_email'
      };
    case NODE_TYPES.FORM:
      return {
        label: 'New Form',
        description: 'Collect information',
        formTitle: 'Form Title',
        formFields: [
          {
            id: 'field1',
            name: 'Field 1',
            type: 'text',
            required: false
          }
        ]
      };
    case NODE_TYPES.WAIT:
      return {
        label: 'Wait/Delay',
        description: 'Add delay or wait condition',
        waitType: 'delay',
        delayAmount: 24,
        delayUnit: 'hours'
      };
    case NODE_TYPES.CONDITION:
      return {
        label: 'Condition',
        description: 'Add a condition',
        conditionType: 'if_field_equals',
        field: 'email',
        operator: 'equals',
        value: ''
      };
    case NODE_TYPES.WEBHOOK:
      return {
        label: 'Webhook',
        description: 'Send or receive data via webhook',
        endpoint: 'https://example.com/webhook',
        method: 'POST'
      };
    default:
      return {
        label: 'New Node',
        description: 'Workflow node'
      };
  }
};

/**
 * Generate a unique node ID
 * @returns {string} - Unique node ID
 */
export const generateNodeId = () => {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique edge ID
 * @returns {string} - Unique edge ID
 */
export const generateEdgeId = () => {
  return `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
