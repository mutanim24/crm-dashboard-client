import React from 'react';
import KixieSettingsForm from '../../components/KixieSettingsForm/KixieSettingsForm';

const IntegrationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Integrations</h2>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-2">Kixie Integration</h3>
          <p className="text-gray-600">
            Connect your Kixie account to enable SMS and voice calling features.
          </p>
        </div>
        <KixieSettingsForm />
      </div>
    </div>
  );
};

export default IntegrationsPage;
