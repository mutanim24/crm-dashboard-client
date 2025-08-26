import api from './api';

export const saveKixieCredentials = async (credentials) => {
  const response = await api.post('/integrations/kixie', credentials);
  return response.data;
};

export const initiateKixieCall = async (phoneNumber) => {
  console.log('Initiating Kixie call with phone number:', phoneNumber);
  const response = await api.post('/integrations/kixie/call', { phoneNumber });
  console.log('Kixie call response:', response.data);
  return response.data;
};

export const sendKixieSms = async (payload) => {
  console.log('Sending Kixie SMS with payload:', payload);
  const response = await api.post('/integrations/kixie/sms', payload);
  console.log('Kixie SMS response:', response.data);
  return response.data;
};

export const toggleKixieIntegrationStatus = async (isActive) => {
  console.log('Toggling Kixie integration to:', isActive);
  const response = await api.post('/integrations/kixie/toggle', { isActive });
  console.log('Kixie integration toggled successfully:', response.data);
  return response.data;
};
