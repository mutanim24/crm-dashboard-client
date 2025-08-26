import api from './api';

// Get all workflows for the authenticated user
export const getWorkflows = () => {
  return api.get('/workflows');
};

// Get a single workflow by ID
export const getWorkflow = (id) => {
  return api.get(`/workflows/${id}`);
};

// Create a new workflow
export const createWorkflow = (workflowData) => {
  return api.post('/workflows', workflowData);
};

// Update an existing workflow
export const updateWorkflow = (id, workflowData) => {
  return api.put(`/workflows/${id}`, workflowData);
};

// Delete a workflow
export const deleteWorkflow = (id) => {
  return api.delete(`/workflows/${id}`);
};

// Create a workflowService object with all methods
const workflowService = {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};

export default workflowService;
