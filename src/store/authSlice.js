import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save user and token to localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user: action.payload.user, token: action.payload.token }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save user and token to localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user: action.payload.user, token: action.payload.token }));
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      
      // Remove auth data from localStorage
      localStorage.removeItem('auth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
