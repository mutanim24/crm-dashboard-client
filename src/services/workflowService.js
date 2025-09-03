import api from './api';

// Helper function to get workflows from local storage
const getWorkflowsFromLocalStorage = () => {
  try {
    const storedWorkflows = localStorage.getItem('workflows');
    return storedWorkflows ? JSON.parse(storedWorkflows) : [];
  } catch (error) {
    console.error('Error reading workflows from local storage:', error);
    return [];
  }
};

// Helper function to save workflows to local storage
const saveWorkflowsToLocalStorage = (workflows) => {
  try {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  } catch (error) {
    console.error('Error saving workflows to local storage:', error);
  }
};

// Get all workflows for the authenticated user
export const getWorkflows = () => {
  // First try to get from API
  return api.get('/workflows')
    .then(response => {
      // If API call is successful, update local storage
      const workflows = response.data.data || response.data;
      saveWorkflowsToLocalStorage(workflows);
      return response;
    })
    .catch(error => {
      // If API call fails, return local storage workflows
      console.warn('API call failed, using local storage:', error);
      const mockResponse = {
        data: {
          success: true,
          data: getWorkflowsFromLocalStorage()
        }
      };
      return Promise.resolve(mockResponse);
    });
};

// Get a single workflow by ID
export const getWorkflow = (id) => {
  return api.get(`/workflows/${id}`)
    .catch(error => {
      // If API call fails, try to get from local storage
      console.warn('API call failed, using local storage:', error);
      const workflows = getWorkflowsFromLocalStorage();
      const workflow = workflows.find(w => w.id === id);
      
      if (workflow) {
        return Promise.resolve({ data: workflow });
      } else {
        return Promise.reject(error);
      }
    });
};

// Create a new workflow
export const createWorkflow = (workflowData) => {
  return api.post('/workflows', workflowData)
    .then(response => {
      // If API call is successful, update local storage
      const newWorkflow = response.data.data || response.data;
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = [...existingWorkflows, newWorkflow];
      saveWorkflowsToLocalStorage(updatedWorkflows);
      return response;
    })
    .catch(error => {
      // If API call fails, save to local storage
      console.warn('API call failed, saving to local storage:', error);
      
      // Generate a unique ID for the workflow
      const newWorkflow = {
        ...workflowData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = [...existingWorkflows, newWorkflow];
      saveWorkflowsToLocalStorage(updatedWorkflows);
      
      // Return a mock response
      const mockResponse = {
        data: {
          success: true,
          data: newWorkflow
        }
      };
      return Promise.resolve(mockResponse);
    });
};

// Create a new empty workflow (for the "Add New Workflow" button)
export const createEmptyWorkflow = () => {
  const newWorkflow = {
    name: 'New Workflow',
    definition: { nodes: [], edges: [] },
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  return api.post('/workflows', { name: 'New Workflow', definition: { nodes: [], edges: [] } })
    .then(response => {
      // If API call is successful, update local storage
      const apiWorkflow = response.data.data || response.data;
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = [...existingWorkflows, apiWorkflow];
      saveWorkflowsToLocalStorage(updatedWorkflows);
      return response;
    })
    .catch(error => {
      // If API call fails, save to local storage
      console.warn('API call failed, saving to local storage:', error);
      
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = [...existingWorkflows, newWorkflow];
      saveWorkflowsToLocalStorage(updatedWorkflows);
      
      // Return a mock response
      const mockResponse = {
        data: {
          success: true,
          data: newWorkflow
        }
      };
      return Promise.resolve(mockResponse);
    });
};

// Update an existing workflow
export const updateWorkflow = (id, workflowData) => {
  return api.put(`/workflows/${id}`, workflowData)
    .then(response => {
      // If API call is successful, update local storage
      const updatedWorkflow = response.data.data || response.data;
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = existingWorkflows.map(w => 
        w.id === id ? updatedWorkflow : w
      );
      saveWorkflowsToLocalStorage(updatedWorkflows);
      return response;
    })
    .catch(error => {
      // If API call fails, update local storage
      console.warn('API call failed, updating local storage:', error);
      
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = existingWorkflows.map(w => 
        w.id === id ? { ...w, ...workflowData, updatedAt: new Date().toISOString().split('T')[0] } : w
      );
      saveWorkflowsToLocalStorage(updatedWorkflows);
      
      // Return a mock response
      const mockResponse = {
        data: {
          success: true,
          data: { ...existingWorkflows.find(w => w.id === id), ...workflowData }
        }
      };
      return Promise.resolve(mockResponse);
    });
};

// Delete a workflow
export const deleteWorkflow = (id) => {
  return api.delete(`/workflows/${id}`)
    .then(response => {
      // If API call is successful, update local storage
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = existingWorkflows.filter(w => w.id !== id);
      saveWorkflowsToLocalStorage(updatedWorkflows);
      return response;
    })
    .catch(error => {
      // If API call fails, update local storage
      console.warn('API call failed, updating local storage:', error);
      
      const existingWorkflows = getWorkflowsFromLocalStorage();
      const updatedWorkflows = existingWorkflows.filter(w => w.id !== id);
      saveWorkflowsToLocalStorage(updatedWorkflows);
      
      // Return a mock response
      const mockResponse = {
        data: {
          success: true,
          data: { id }
        }
      };
      return Promise.resolve(mockResponse);
    });
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
