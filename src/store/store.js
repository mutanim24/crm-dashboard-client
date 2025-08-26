import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pipelineReducer from './pipelineSlice';
import workflowReducer from './workflowSlice';
import contactReducer from './contactSlice';
import templateReducer from './templateSlice';
import integrationReducer from './integrationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pipelines: pipelineReducer,
    workflows: workflowReducer,
    contacts: contactReducer,
    templates: templateReducer,
    integration: integrationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
