import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workflowService from '../services/workflowService';

// Simple async thunks for API calls with the new backend contract

// Create a new workflow
export const createWorkflow = createAsyncThunk(
  'workflows/createWorkflow',
  async (workflowData, { rejectWithValue }) => {
    try {
      const response = await workflowService.createWorkflow(workflowData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create workflow');
    }
  }
);

// Fetch all workflows
export const fetchWorkflows = createAsyncThunk(
  'workflows/fetchWorkflows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workflowService.getWorkflows();
      return response.data;
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch workflow');
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
      })
      .addCase(createWorkflow.rejected, (state, action) => {
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
        state.workflows = action.payload;
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
