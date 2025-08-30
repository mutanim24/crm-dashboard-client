import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const IClosedSettingsPage = () => {
  const [copied, setCopied] = useState(false);
  
  // This would typically come from an API or environment variable
  const webhookUrl = 'https://[your-crm-domain].com/api/v1/webhooks/iclosed';
  
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success('Webhook URL copied to clipboard!');
      
      // Reset button text after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy URL. Please copy it manually.');
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold border-b pb-2 mb-4">iClosed Integration</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Status Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <h2 className="text-xl font-semibold">Status: Active</h2>
          </div>
          <p className="text-gray-600">
            This integration automatically syncs data from your iClosed account via Zapier. 
            Follow the steps below to connect your account.
          </p>
        </div>
        
        {/* Webhook URL Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Webhook URL</h2>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 p-3 rounded-md font-mono text-sm overflow-x-auto">
              {webhookUrl}
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>
        
        {/* Setup Instructions Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-700">
            <li>Log in to your Zapier account and click "Create Zap"</li>
            <li>
              <span className="font-medium">Trigger:</span> Search for and select the <strong>iClosed</strong> app. 
              Choose the event you want to sync (e.g., "Call Booked")
            </li>
            <li>
              <span className="font-medium">Action:</span> Search for and select the <strong>Webhooks by Zapier</strong> app
            </li>
            <li>Choose "POST" as the Action Event</li>
            <li>Paste the unique Webhook URL from this page into the "URL" field</li>
            <li>Set the "Payload Type" to <code className="bg-gray-100 px-1 rounded">json</code></li>
            <li>
              Map the data from the iClosed trigger to the "Data" fields (e.g., <code className="bg-gray-100 px-1 rounded">name</code>, 
              <code className="bg-gray-100 px-1 rounded">email</code>, <code className="bg-gray-100 px-1 rounded">phone</code>)
            </li>
            <li>Test the webhook and turn on your Zap</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default IClosedSettingsPage;
