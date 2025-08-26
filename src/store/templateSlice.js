import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import templateService from '../services/templateService';

// Initial state
const initialState = {
  templates: [],
  loading: false,
  error: null,
  currentTemplate: null,
};

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async () => {
    const response = await templateService.getTemplates();
    return response;
  }
);

export const addTemplate = createAsyncThunk(
  'templates/addTemplate',
  async (templateData) => {
    const response = await templateService.createTemplate(templateData);
    return response;
  }
);

export const editTemplate = createAsyncThunk(
  'templates/editTemplate',
  async ({ id, templateData }) => {
    const response = await templateService.updateTemplate(id, templateData);
    return response;
  }
);

export const removeTemplate = createAsyncThunk(
  'templates/removeTemplate',
  async (id) => {
    await templateService.deleteTemplate(id);
    return id;
  }
);

// Create slice
const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Add template
    builder
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Edit template
    builder
      .addCase(editTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(
          (template) => template.id === action.payload.id
        );
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(editTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Remove template
    builder
      .addCase(removeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(
          (template) => template.id !== action.payload
        );
      })
      .addCase(removeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentTemplate, clearCurrentTemplate, clearError } = templateSlice.actions;
export default templateSlice.reducer;
