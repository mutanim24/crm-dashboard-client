import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPipelines, getPipelineById, getPipelineDeals, updateDealStage, createPipeline } from '../services/pipelineService';

// Async thunks
export const fetchPipelines = createAsyncThunk('pipelines/fetchPipelines', async () => {
  const response = await getPipelines();
  return response.data;
});

export const fetchPipelineById = createAsyncThunk('pipelines/fetchPipelineById', async (id) => {
  const response = await getPipelineById(id);
  return response.data;
});

export const fetchDeals = createAsyncThunk('pipelines/fetchDeals', async (pipelineId) => {
  const response = await getPipelineDeals(pipelineId);
  return response.data;
});

export const updateDealStageThunk = createAsyncThunk('pipelines/updateDealStage', async ({ dealId, stageId }) => {
  const response = await updateDealStage(dealId, stageId);
  return response.data;
});

export const createPipelineThunk = createAsyncThunk('pipelines/createPipeline', async (pipelineData) => {
  const response = await createPipeline(pipelineData);
  return response.data;
});

const initialState = {
  pipelines: [],
  deals: [],
  selectedPipeline: null,
  loading: false,
  error: null,
};

const pipelineSlice = createSlice({
  name: 'pipelines',
  initialState,
  reducers: {
    setSelectedPipeline: (state, action) => {
      state.selectedPipeline = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    moveDealLocally: (state, action) => {
      const { source, destination, draggableId } = action.payload;
      
      // Find the source and destination pipelines
      const sourcePipeline = state.pipelines.find(p => 
        p.stages.some(s => s.id === source.droppableId)
      );
      const destPipeline = state.pipelines.find(p => 
        p.stages.some(s => s.id === destination.droppableId)
      );
      
      if (!sourcePipeline || !destPipeline) return;
      
      // Find the source and destination stages
      const sourceStage = sourcePipeline.stages.find(s => s.id === source.droppableId);
      const destStage = destPipeline.stages.find(s => s.id === destination.droppableId);
      
      if (!sourceStage || !destStage) return;
      
      // Find the deal to move
      const dealIndex = sourceStage.deals.findIndex(d => d.id === draggableId);
      if (dealIndex === -1) return;
      
      // Remove the deal from the source stage
      const [movedDeal] = sourceStage.deals.splice(dealIndex, 1);
      
      // Insert the deal into the destination stage at the correct position
      destStage.deals.splice(destination.index, 0, movedDeal);
      
      // Update the deals array in state
      const allDeals = [];
      state.pipelines.forEach(pipeline => {
        if (pipeline.stages) {
          pipeline.stages.forEach(stage => {
            if (stage.deals) {
              allDeals.push(...stage.deals);
            }
          });
        }
      });
      state.deals = allDeals;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pipelines
      .addCase(fetchPipelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.loading = false;
        // Store the deeply nested pipeline structure
        state.pipelines = action.payload;
        
        // Extract all deals from all pipelines and stages
        const allDeals = [];
        action.payload.forEach(pipeline => {
          if (pipeline.stages) {
            pipeline.stages.forEach(stage => {
              if (stage.deals) {
                allDeals.push(...stage.deals);
              }
            });
          }
        });
        state.deals = allDeals;
        
        if (action.payload.length > 0 && !state.selectedPipeline) {
          state.selectedPipeline = action.payload[0].id;
        }
      })
      .addCase(fetchPipelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch deals
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update deal stage
      .addCase(updateDealStageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDealStageThunk.fulfilled, (state, action) => {
        state.loading = false;
        // The UI has already been updated optimistically, so we don't need to do anything here
        console.log('Deal stage updated successfully:', action.payload);
      })
      .addCase(updateDealStageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create pipeline
      .addCase(createPipelineThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPipelineThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new pipeline to the beginning of the pipelines array
        state.pipelines = [action.payload, ...state.pipelines];
      })
      .addCase(createPipelineThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedPipeline, clearError, moveDealLocally } = pipelineSlice.actions;
export default pipelineSlice.reducer;
