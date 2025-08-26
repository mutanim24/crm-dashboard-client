import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveKixieCreds, toggleKixieIntegration } from '../../store/integrationSlice';
import toast, { Toaster } from 'react-hot-toast';

const KixieSettingsForm = () => {
  const [businessId, setBusinessId] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error, success, isActive } = useSelector((state) => state.integration);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!businessId || !apiKey) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(saveKixieCreds({ businessId, apiKey, isActive }))
      .unwrap()
      .then(() => {
        toast.success('Credentials saved successfully!');
        setBusinessId('');
        setApiKey('');
      })
      .catch((error) => {
        toast.error(error || 'Failed to save credentials');
      });
  };

  const handleToggle = () => {
    const newActiveState = !isActive;
    
    dispatch(toggleKixieIntegration(newActiveState))
      .unwrap()
      .then(() => {
        toast.success(`Kixie integration ${newActiveState ? 'enabled' : 'disabled'} successfully!`);
      })
      .catch((error) => {
        toast.error(error || 'Failed to toggle integration');
      });
  };

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold border-b pb-2 mb-4">Kixie API Credentials</h4>
        </div>
        
        <div>
          <label htmlFor="business-id" className="block text-sm font-medium text-gray-700 mb-1">
            Kixie Business ID
          </label>
          <input
            id="business-id"
            name="businessId"
            type="password"
            placeholder="Enter your Kixie Business ID"
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
            Kixie API Key
          </label>
          <input
            id="api-key"
            name="apiKey"
            type="password"
            placeholder="Enter your Kixie API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your Kixie credentials have been saved successfully.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {isActive ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Credentials'}
        </button>
      </form>
    </>
  );
};

export default KixieSettingsForm;
