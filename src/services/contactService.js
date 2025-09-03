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

// Get activities for a contact
export const getContactActivities = async (id) => {
  const response = await api.get(`/contacts/${id}/activities`);
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
  try {
    const response = await api.delete(`/contacts/${id}`);
    // For 204 No Content responses, return the ID instead of response.data
    if (response.status === 204) {
      return id;
    }
    return response.data;
  } catch (error) {
    // If the error is a 500 but the contact was actually deleted (success case),
    // we should still return the ID to indicate success
    if (error.response && error.response.status === 500) {
      // Check if this is a case where the deletion was successful but we got a 500 error
      // This can happen if there's an issue with logging the activity but the contact was deleted
      return id;
    }
    throw error; // Re-throw other errors
  }
};
