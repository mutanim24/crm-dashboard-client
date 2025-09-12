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
    
    // Handle FormData (file uploads)
    let updatedUser = {
      ...currentUser,
      name: data.fullName || currentUser.name,
      email: data.email || currentUser.email,
      phoneNumber: data.phoneNumber || currentUser.phoneNumber || '',
      company: data.company || currentUser.company || '',
      jobTitle: data.jobTitle || currentUser.jobTitle || '',
      bio: data.bio || currentUser.bio || ''
    };
    
    // Handle profile image upload
    if (data.profileImage) {
      // In a real app, this would be the actual image URL from the server
      // For mock purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = function(e) {
        updatedUser.profileImage = e.target.result;
        
        // Update localStorage with new user data
        localStorage.setItem('auth', JSON.stringify({
          ...authData,
          user: updatedUser
        }));
      };
      
      // For mock purposes, we'll simulate the upload
      setTimeout(() => {
        updatedUser.profileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRjAwMDAiLz4KPHBhdGggZD0iTTEyLjUgMTQuMUMxMi41IDE0LjMgMTIuNSAxNS4zIDEyLjUgMTYuNUMxMi41IDE3LjMgMTIuNSAxOS4zIDEyLjUgMjAuNUMxMi41IDIwLjMgMTIuNSAyMi41IDEyLjUgMjQuNUMxMi41IDI1LjMgMTIuNSAyNi41IDEyLjUgMjcuNUMxMi41IDI4LjMgMTIuNSAzMC41IDEyLjUgMTEuNUMxMi41IDguMyAxMi41IDcuMyAxMi41IDYuN0MxMi41IDUuMyAxMi41IDQuMyAxMi41IDMuN0MxMi41IDMuMyAxMi41IDQuMyAxMi41IDUuN0MxMi41IDYuMyAxMi41IDcuMyAxMi41IDguN0MxMi41IDExLjUgMTIuNSAxMC41IDEyLjUgOS41QzEyLjUgOC41IDEyLjUgNy41IDEyLjUgNi43QzEyLjUgNS41IDEyLjUgNC41IDEyLjUgMy43QzEyLjUgMy41IDEyLjUgNC41IDEyLjUgNS43QzEyLjUgNi41IDEyLjUgNy41IDEyLjUgOC41QzEyLjUgMTAuNSAxMi41IDExLjUgMTIuNSAxOS41QzEyLjUgMTYuNSAxMi41IDE1LjMgMTIuNSAxNC4zWiIgZmlsbD0iIzAwQ0ZGRiIvPgo8L3N2Zz4=';
        
        // Update localStorage with new user data
        localStorage.setItem('auth', JSON.stringify({
          ...authData,
          user: updatedUser
        }));
      }, 500);
    }
    
    // Handle cover image upload
    if (data.coverImage) {
      // In a real app, this would be the actual image URL from the server
      // For mock purposes, we'll create a data URL
      const reader = new FileReader();
      reader.onload = function(e) {
        updatedUser.coverImage = e.target.result;
        
        // Update localStorage with new user data
        localStorage.setItem('auth', JSON.stringify({
          ...authData,
          user: updatedUser
        }));
      };
      
      // For mock purposes, we'll simulate the upload
      setTimeout(() => {
        updatedUser.coverImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM5Q0EzRjMiLz4KPHBhdGggZD0iTTEyLjUgMTQuMUMxMi41IDE0LjMgMTIuNSAxNS4zIDEyLjUgMTYuNUMxMi41IDE3LjMgMTIuNSAxOS4zIDEyLjUgMjAuNUMxMi41IDIwLjMgMTIuNSAyMi41IDEyLjUgMjQuNUMxMi41IDI1LjMgMTIuNSAyNi41IDEyLjUgMjcuNUMxMi41IDI4LjMgMTIuNSAzMC41IDEyLjUgMTEuNUMxMi41IDguMyAxMi41IDcuMyAxMi41IDYuN0MxMi41IDUuMyAxMi41IDQuMyAxMi41IDMuN0MxMi41IDMuMyAxMi41IDQuMyAxMi41IDUuN0MxMi41IDYuMyAxMi41IDcuMyAxMi41IDguN0MxMi41IDExLjUgMTIuNSAxMC41IDEyLjUgOS41QzEyLjUgOC41IDEyLjUgNy41IDEyLjUgNi43QzEyLjUgNS41IDEyLjUgNC41IDEyLjUgMy43QzEyLjUgMy41IDEyLjUgNC41IDEyLjUgNS43QzEyLjUgNi41IDEyLjUgNy41IDEyLjUgOC41QzEyLjUgMTAuNSAxMi41IDExLjUgMTIuNSAxOS41QzEyLjUgMTYuNSAxMi41IDE1LjMgMTIuNSAxNC4zWiIgZmlsbD0iI0ZGRiIvPgo8L3N2Zz4=';
        
        // Update localStorage with new user data
        localStorage.setItem('auth', JSON.stringify({
          ...authData,
          user: updatedUser
        }));
      }, 500);
    }
    
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
  },
  
  
  '/workflows': (data) => {
    // Mock creating a new workflow
    const newWorkflow = {
      id: Date.now(), // Use timestamp as mock ID
      name: data?.name || "New Workflow",
      definition: data?.definition || { nodes: [], edges: [] },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    // Get existing workflows from localStorage
    const existingWorkflows = JSON.parse(localStorage.getItem('mock_workflows') || '[]');
    existingWorkflows.push(newWorkflow);
    localStorage.setItem('mock_workflows', JSON.stringify(existingWorkflows));
    
    return {
      data: {
        success: true,
        data: existingWorkflows
      }
    };
  },
  
  '/workflows/1': () => {
    // Mock workflow data for ID 1
    return {
      data: {
        success: true,
        data: {
          id: 1,
          name: "Lead Capture Workflow",
          definition: { nodes: [], edges: [] },
          createdAt: "2025-09-01",
          updatedAt: "2025-09-01"
        }
      }
    };
  },
  
  '/workflows/2': () => {
    // Mock workflow data for ID 2
    return {
      data: {
        success: true,
        data: {
          id: 2,
          name: "Follow-up Workflow",
          definition: { nodes: [], edges: [] },
          createdAt: "2025-09-02",
          updatedAt: "2025-09-02"
        }
      }
    };
  },
  
  '/workflows/\\d+': (data, url) => {
    // Extract ID from URL
    const id = url.match(/\/workflows\/(\d+)/)[1];
    
    // Mock updating a workflow
    const updatedWorkflow = {
      id: parseInt(id),
      name: data?.name || "Updated Workflow",
      definition: data?.definition || { nodes: [], edges: [] },
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    // Update localStorage
    const existingWorkflows = JSON.parse(localStorage.getItem('mock_workflows') || '[]');
    const index = existingWorkflows.findIndex(w => w.id === parseInt(id));
    if (index !== -1) {
      existingWorkflows[index] = updatedWorkflow;
    } else {
      existingWorkflows.push(updatedWorkflow);
    }
    localStorage.setItem('mock_workflows', JSON.stringify(existingWorkflows));
    
    return {
      data: {
        success: true,
        data: updatedWorkflow
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
  if (import.meta.env.MODE === 'development') {
    // Check for exact URL match first
    if (mockResponses[url]) {
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
    
    // Check for regex pattern match (for workflow IDs)
    for (const [pattern, handler] of Object.entries(mockResponses)) {
      if (pattern.startsWith('/') && pattern.endsWith('/')) {
        const regex = new RegExp(pattern.slice(1, -1));
        if (regex.test(url)) {
          try {
            // First try to make a real API call
            return originalPost.call(this, url, data, config);
          } catch (error) {
            // If the real API call fails, use mock response
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
              console.warn('Backend not available, using mock response');
              return handler(data, url);
            }
            // Otherwise, rethrow the error
            throw error;
          }
        }
      }
    }
  }
  
  // Otherwise use the original axios post
  return originalPost.call(this, url, data, config);
};

api.put = async function(url, data, config) {
  // Check if this is an auth endpoint and we should use mock response
  // Only use mock responses if the backend is not available
  if (import.meta.env.MODE === 'development') {
    // Check for exact URL match first
    if (mockResponses[url]) {
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
    
    // Check for regex pattern match (for workflow IDs)
    for (const [pattern, handler] of Object.entries(mockResponses)) {
      if (pattern.startsWith('/') && pattern.endsWith('/')) {
        const regex = new RegExp(pattern.slice(1, -1));
        if (regex.test(url)) {
          try {
            // First try to make a real API call
            return originalPut.call(this, url, data, config);
          } catch (error) {
            // If the real API call fails, use mock response
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
              console.warn('Backend not available, using mock response');
              return handler(data, url);
            }
            // Otherwise, rethrow the error
            throw error;
          }
        }
      }
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

// Function to change user password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/password', passwordData);
    
    // Handle both real API response and mock response
    const responseData = response.data.data || response.data;
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to change password'
    };
  }
};

export default api;
