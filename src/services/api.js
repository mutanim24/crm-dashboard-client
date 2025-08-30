import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1', // Use environment variable or fallback
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      store.dispatch(logout());
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Mock API responses for development when no backend is available
const mockResponses = {
  '/auth/login': (data) => {
    // Mock successful login for demo credentials
    if (data.email === 'admin@crm.com' && data.password === 'password123') {
      return {
        data: {
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@crm.com',
            role: 'admin'
          },
          token: 'mock-jwt-token-for-demo'
        }
      };
    }
    
    // Return error for invalid credentials
    return Promise.reject({
      response: {
        status: 401,
        data: {
          error: 'Invalid email or password'
        }
      }
    });
  },
  
  '/auth/register': (data) => {
    // Check if email already exists (mock check)
    const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const userExists = existingUsers.some(user => user.email === data.email);
    
    if (userExists) {
      return Promise.reject({
        response: {
          status: 409,
          data: {
            error: 'An account with this email already exists'
          }
        }
      });
    }
    
    // Add new user to mock storage
    const newUser = {
      id: Date.now(), // Use timestamp as mock ID
      name: data.name,
      email: data.email,
      password: data.password, // In real app, this would be hashed
      role: 'user'
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(existingUsers));
    
    return {
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token: 'mock-jwt-token-for-new-user'
      }
    };
  },
  
  '/auth/profile': (data) => {
    // Mock successful profile update
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const currentUser = authData.user || {};
    
    // Update user data with new profile information
    const updatedUser = {
      ...currentUser,
      name: data.fullName || currentUser.name,
      email: data.email || currentUser.email,
      phoneNumber: data.phoneNumber || currentUser.phoneNumber || '',
      company: data.company || currentUser.company || '',
      jobTitle: data.jobTitle || currentUser.jobTitle || ''
    };
    
    // Update localStorage with new user data
    localStorage.setItem('auth', JSON.stringify({
      ...authData,
      user: updatedUser
    }));
    
    return {
      data: {
        success: true,
        data: updatedUser
      }
    };
  }
};

// Override axios request for auth endpoints when in development
const originalPost = api.post;
const originalPut = api.put;

api.post = async function(url, data, config) {
  // Check if this is an auth endpoint and we should use mock response
  // Only use mock responses if the backend is not available
  if (import.meta.env.MODE === 'development' && mockResponses[url]) {
    try {
      // First try to make a real API call
      return originalPost.call(this, url, data, config);
    } catch (error) {
      // If the real API call fails, use mock response
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.warn('Backend not available, using mock response');
        return mockResponses[url](data);
      }
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  // Otherwise use the original axios post
  return originalPost.call(this, url, data, config);
};

api.put = async function(url, data, config) {
  // Check if this is an auth endpoint and we should use mock response
  // Only use mock responses if the backend is not available
  if (import.meta.env.MODE === 'development' && mockResponses[url]) {
    try {
      // First try to make a real API call
      return originalPut.call(this, url, data, config);
    } catch (error) {
      // If the real API call fails, use mock response
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.warn('Backend not available, using mock response');
        return mockResponses[url](data);
      }
      // Otherwise, rethrow the error
      throw error;
    }
  }
  
  // Otherwise use the original axios put
  return originalPut.call(this, url, data, config);
};

// Function to simulate Kixie webhook for testing
export const simulateKixieWebhook = async (contactId) => {
  return api.post(`/webhooks/kixie/test`, { contactId });
};

// Function to update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    
    // Handle both real API response and mock response
    const responseData = response.data.data || response.data;
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update profile'
    };
  }
};

export default api;
