import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workflowService from '../services/workflowService';
import { toast } from 'react-hot-toast';

// Simple async thunks for API calls with the new backend contract

// Create a new workflow
export const createWorkflow = createAsyncThunk(
  'workflows/createWorkflow',
  async (workflowData, { rejectWithValue }) => {
    try {
      const response = await workflowService.createWorkflow(workflowData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create workflow');
    }
  }
);

// Create a new empty workflow
export const createEmptyWorkflow = createAsyncThunk(
  'workflows/createEmptyWorkflow',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workflowService.createEmptyWorkflow();
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create empty workflow');
    }
  }
);

// Fetch all workflows
export const fetchWorkflows = createAsyncThunk(
  'workflows/fetchWorkflows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workflowService.getWorkflows();
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workflows');
    }
  }
);

// Fetch a single workflow by ID
export const fetchWorkflow = createAsyncThunk(
  'workflows/fetchWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workflowService.getWorkflow(id);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workflow');
    }
  }
);

// Update a workflow
export const updateWorkflow = createAsyncThunk(
  'workflows/updateWorkflow',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await workflowService.updateWorkflow(id, { name });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update workflow');
    }
  }
);

// Delete a workflow
export const deleteWorkflow = createAsyncThunk(
  'workflows/deleteWorkflow',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workflowService.deleteWorkflow(id);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete workflow');
    }
  }
);

// Initial state
const initialState = {
  workflows: [],
  currentWorkflow: null,
  loading: false,
  error: null,
};

// Create slice
const workflowSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    clearCurrentWorkflow: (state) => {
      state.currentWorkflow = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create workflow
      .addCase(createWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows.unshift(action.payload);
        state.currentWorkflow = action.payload;
        toast.success('Workflow saved successfully');
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create empty workflow
      .addCase(createEmptyWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmptyWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows.unshift(action.payload);
        state.currentWorkflow = action.payload;
        toast.success('Workflow saved successfully');
      })
      .addCase(createEmptyWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch all workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        // The API response from workflowService returns response.data
        // If the API returns { success: true, data: [...] }, extract the array
        // If the API returns the array directly, use it as is
        const data = action.payload;
        if (data && Array.isArray(data)) {
          state.workflows = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          state.workflows = data.data;
        } else if (data && data.workflows && Array.isArray(data.workflows)) {
          state.workflows = data.workflows;
        } else {
          state.workflows = [];
        }
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single workflow
      .addCase(fetchWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkflow = action.payload;
      })
      .addCase(fetchWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update workflow
      .addCase(updateWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentWorkflow && state.currentWorkflow.id === action.payload.id) {
          state.currentWorkflow = action.payload;
        }
        // Update the workflow in the workflows array if it exists there
        const index = state.workflows.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workflows[index] = action.payload;
        }
        toast.success('Workflow updated successfully');
      })
      .addCase(updateWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete workflow
      .addCase(deleteWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the workflow from the workflows array
        state.workflows = state.workflows.filter(w => w.id !== action.meta.arg);
        // Clear current workflow if it's the one being deleted
        if (state.currentWorkflow && state.currentWorkflow.id === action.meta.arg) {
          state.currentWorkflow = null;
        }
        // Show success toast
        toast.success('Workflow deleted successfully');
      })
      .addCase(deleteWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Show error toast
        toast.error(action.payload || 'Failed to delete workflow');
      });
  },
});

// Export actions
export const { clearCurrentWorkflow, clearError } = workflowSlice.actions;

// Export selectors
export const selectWorkflows = (state) => state.workflows.workflows;
export const selectCurrentWorkflow = (state) => state.workflows.currentWorkflow;
export const selectWorkflowsLoading = (state) => state.workflows.loading;
export const selectWorkflowsError = (state) => state.workflows.error;

// Export reducer
export default workflowSlice.reducer;
