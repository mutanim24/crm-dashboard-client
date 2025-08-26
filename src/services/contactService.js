import api from './api';

// Get all contacts
export const getContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

// Get a single contact by ID
export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

// Create a new contact
export const createContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

// Update an existing contact
export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

// Delete a contact
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  // For 204 No Content responses, return the ID instead of response.data
  if (response.status === 204) {
    return id;
  }
  return response.data;
};
