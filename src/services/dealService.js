import api from './api';

// Get all deals
export const getDeals = async () => {
  const response = await api.get('/deals');
  return response.data;
};

// Get a single deal by ID
export const getDealById = async (id) => {
  const response = await api.get(`/deals/${id}`);
  return response.data;
};

// Create a new deal
export const createDeal = async (dealData) => {
  const response = await api.post('/deals', dealData);
  return response.data;
};

// Update a deal
export const updateDeal = async (id, dealData) => {
  const response = await api.put(`/deals/${id}`, dealData);
  return response.data;
};

// Update deal stage
export const updateDealStage = async (dealId, stageId) => {
  const response = await api.put(`/deals/${dealId}/stage`, { stageId });
  return response.data;
};

// Delete a deal
export const deleteDeal = async (id) => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};
