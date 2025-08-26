import api from './api';

const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      const { user, token } = response.data;
      
      // Store token and user in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user, token }));
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  },

  // Register function
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { user, token } = response.data;
      
      // Store token and user in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user, token }));
      
      return { user, token };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('auth');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const authData = localStorage.getItem('auth');
      
      if (authData) {
        const { user, token } = JSON.parse(authData);
        if (user && token) {
          return { user, token };
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      // In a real app, this would make an API call to verify the token
      // For now, we'll just check if it exists
      return !!token;
    } catch {
      return false;
    }
  },

  // Check if user is logged out
  isLoggedOut: () => {
    try {
      const authData = localStorage.getItem('auth');
      
      // Return true if no auth data exists
      return !authData;
    } catch {
      return true;
    }
  }
};

export default authService;
