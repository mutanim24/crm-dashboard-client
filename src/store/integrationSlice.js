import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveKixieCredentials, initiateKixieCall, sendKixieSms, toggleKixieIntegrationStatus } from '../services/integrationService';

// Async thunk for saving Kixie credentials
export const saveKixieCreds = createAsyncThunk(
  'integration/saveKixieCreds',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Integration slice: Saving Kixie credentials:', credentials);
      const response = await saveKixieCredentials(credentials);
      console.log('Integration slice: Kixie credentials saved successfully:', response);
      return response;
    } catch (error) {
      console.error('Integration slice: Failed to save Kixie credentials:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save Kixie credentials';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for toggling Kixie integration
export const toggleKixieIntegration = createAsyncThunk(
  'integration/toggleKixieIntegration',
  async (isActive, { rejectWithValue }) => {
    try {
      console.log('Integration slice: Toggling Kixie integration to:', isActive);
      const response = await toggleKixieIntegrationStatus(isActive);
      console.log('Integration slice: Kixie integration toggled successfully:', response);
      return { isActive };
    } catch (error) {
      console.error('Integration slice: Failed to toggle Kixie integration:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to toggle Kixie integration';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for initiating a Kixie call
export const initiateCall = createAsyncThunk(
  'integration/initiateCall',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      console.log('Integration slice: Initiating call with phone number:', phoneNumber);
      const response = await initiateKixieCall(phoneNumber);
      console.log('Integration slice: Call initiated successfully:', response);
      return response;
    } catch (error) {
      console.error('Integration slice: Call initiation failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate call';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for sending SMS
export const sendSms = createAsyncThunk(
  'integration/sendSms',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Integration slice: Sending SMS with payload:', payload);
      const response = await sendKixieSms(payload);
      console.log('Integration slice: SMS sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Integration slice: SMS sending failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send SMS';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  smsLoading: false,
  smsError: null,
  smsSuccess: false,
  isActive: true,
};

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    resetIntegrationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Kixie credentials cases
      .addCase(saveKixieCreds.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveKixieCreds.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveKixieCreds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Initiate call cases
      .addCase(initiateCall.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(initiateCall.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(initiateCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Send SMS cases
      .addCase(sendSms.pending, (state) => {
        state.smsLoading = true;
        state.smsError = null;
        state.smsSuccess = false;
      })
      .addCase(sendSms.fulfilled, (state) => {
        state.smsLoading = false;
        state.smsSuccess = true;
        state.smsError = null;
      })
      .addCase(sendSms.rejected, (state, action) => {
        state.smsLoading = false;
        state.smsError = action.payload;
        state.smsSuccess = false;
      })
      // Toggle Kixie integration cases
      .addCase(toggleKixieIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleKixieIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.isActive = action.payload.isActive;
        state.error = null;
      })
      .addCase(toggleKixieIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetIntegrationState } = integrationSlice.actions;
export default integrationSlice.reducer;
