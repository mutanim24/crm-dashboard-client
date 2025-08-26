import api from './api';

// Get all pipelines
export const getPipelines = async () => {
  const response = await api.get('/pipelines');
  return response.data;
};

// Get a single pipeline by ID
export const getPipelineById = async (id) => {
  const response = await api.get(`/pipelines/${id}`);
  return response.data;
};

// Create a new pipeline
export const createPipeline = async (pipelineData) => {
  const response = await api.post('/pipelines', pipelineData);
  return response.data;
};

// Update an existing pipeline
export const updatePipeline = async (id, pipelineData) => {
  const response = await api.put(`/pipelines/${id}`, pipelineData);
  return response.data;
};

// Delete a pipeline
export const deletePipeline = async (id) => {
  const response = await api.delete(`/pipelines/${id}`);
  return response.data;
};

// Get deals for a specific pipeline
export const getPipelineDeals = async (pipelineId) => {
  const response = await api.get(`/pipelines/${pipelineId}/deals`);
  return response.data;
};

// Update a deal's stage
export const updateDealStage = async (dealId, stageId) => {
  const response = await api.put(`/deals/${dealId}`, { stageId });
  return response.data;
};

// Create a new deal
export const createDeal = async (dealData) => {
  const response = await api.post('/deals', dealData);
  return response.data;
};

// Update an existing deal
export const updateDeal = async (id, dealData) => {
  const response = await api.put(`/deals/${id}`, dealData);
  return response.data;
};

// Delete a deal
export const deleteDeal = async (id) => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};
