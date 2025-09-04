# Workflow Integration with React Flow

This document explains how the workflow JSON schema is integrated with React Flow to create a dynamic workflow builder.

## Overview

The workflow builder allows users to create and manage workflows visually using React Flow. The workflow data is stored in a JSON format that matches the schema defined in `backend/src/utils/workflowSchema.js`.

## Key Components

### 1. Workflow Schema (`backend/src/utils/workflowSchema.js`)

Defines the structure for workflows including:
- Node types: trigger, action, form, wait, condition, webhook
- Edge connections between nodes
- Metadata and settings

### 2. Workflow Utilities (`front-end/src/utils/workflowUtils.js`)

Helper functions for converting between workflow JSON and React Flow format:
- `convertWorkflowToReactFlow(workflow)` - Converts workflow JSON to React Flow nodes/edges
- `convertReactFlowToWorkflow(nodes, edges, viewport)` - Converts React Flow data back to workflow format
- `getDefaultNodeData(nodeType)` - Returns default data for a specific node type
- `generateNodeId()` - Generates unique IDs for nodes

### 3. Node Components

Individual React Flow node components for each node type:
- `TriggerNode` - For workflow triggers
- `ActionNode` - For workflow actions
- `FormNode` - For form collection
- `WaitNode` - For delays and wait conditions
- `ConditionNode` - For conditional logic
- `WebhookNode` - For API/webhook integrations

### 4. Workflow Canvas Pages

- `WorkflowCanvasPage` - Main workflow builder interface
- `WorkflowBuilder` - Alternative workflow builder component

## How It Works

### Loading a Workflow

1. Fetch workflow data from the API or local storage
2. Convert the workflow JSON to React Flow format using `convertWorkflowToReactFlow()`
3. Set the nodes and edges in React Flow state
4. Restore the viewport position if available

```javascript
const { nodes, edges } = convertWorkflowToReactFlow(workflowData);
setNodes(nodes);
setEdges(edges);
```

### Saving a Workflow

1. Get the current nodes and edges from React Flow
2. Convert back to workflow format using `convertReactFlowToWorkflow()`
3. Include viewport state and metadata
4. Send to the backend API

```javascript
const viewport = reactFlowInstance.getViewport();
const definition = convertReactFlowToWorkflow(nodes, edges, viewport);
const workflowData = {
  name: workflowName,
  definition,
  viewport,
  lastModified: new Date().toISOString()
};
```

### Adding Nodes

1. Get default data for the node type using `getDefaultNodeData()`
2. Create a new node with a unique ID using `generateNodeId()`
3. Add to React Flow nodes state

```javascript
const defaultData = getDefaultNodeData(nodeType);
const newNode = {
  id: generateNodeId(),
  type: nodeType,
  position,
  data: defaultData
};
setNodes((nds) => nds.concat(newNode));
```

### Handling Changes

React Flow hooks handle changes to nodes and edges:
- `onNodesChange` - Updates node positions, deletions, etc.
- `onEdgesChange` - Updates edge connections
- `onConnect` - Handles new connections between nodes

## Sample Workflows

Two sample workflows are provided for testing:

1. `sampleWorkflow` - Simple welcome email sequence
2. `complexWorkflow` - Lead qualification process with conditions

These can be loaded in the test interface to see the integration in action.

## Testing

Run the test component to see the integration:

```javascript
import WorkflowIntegrationTest from './src/testWorkflowIntegration';

// Use in your app
<WorkflowIntegrationTest />
```

This provides:
- Buttons to load sample workflows
- Ability to add nodes
- Real-time JSON display
- Save functionality

## State Management

The workflow state is managed using Redux Toolkit:
- `workflowSlice.js` - Handles API calls and state updates
- Local storage fallback for offline functionality

## API Integration

The workflow service handles communication with the backend:
- `createWorkflow()` - Saves new workflows
- `fetchWorkflow()` - Loads existing workflows
- `updateWorkflow()` - Updates workflow metadata
- `deleteWorkflow()` - Removes workflows

## Future Enhancements

1. **Node Configuration Panels** - Detailed forms for configuring each node type
2. **Validation** - Ensure workflow meets business rules
3. **Execution Engine** - Run workflows based on the JSON definition
4. **Collaboration** - Real-time multi-user editing
5. **Templates** - Pre-built workflow templates
6. **Analytics** - Workflow performance metrics

## Troubleshooting

### Common Issues

1. **Node not rendering** - Check node type matches the schema
2. **Edges not connecting** - Verify source/target node IDs exist
3. **Data loss on refresh** - Check local storage and API calls
4. **Viewport not restoring** - Ensure viewport is saved in workflow definition

### Debug Tips

- Use browser dev tools to inspect React Flow state
- Check console for JSON conversion errors
- Verify API responses match expected schema
- Test with sample workflows to isolate issues
