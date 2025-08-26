import api from './api';

export const templateService = {
  // Get all templates
  getTemplates: async () => {
    const response = await api.get('/templates');
    return response.data;
  },

  // Create a new template
  createTemplate: async (templateData) => {
    const response = await api.post('/templates', templateData);
    return response.data;
  },

  // Update an existing template
  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data;
  },

  // Delete a template
  deleteTemplate: async (id) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  }
};

export default templateService;
