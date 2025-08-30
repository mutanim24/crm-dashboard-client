import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { simulateIclosedWebhook } from '../../services/integrationService';

const WebhookSimulatorPage = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    appointmentTitle: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.contactName || !formData.contactEmail || !formData.appointmentTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Package the form data into a JSON object
      const payload = {
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || '',
        appointmentTitle: formData.appointmentTitle
      };

      // Show loading message
      toast.loading('Simulating webhook...', { id: 'webhook-simulation' });

      // Call the simulateIclosedWebhook service function
      const response = await simulateIclosedWebhook(payload);

      // Show success message
      toast.success('Webhook simulation successful!', { id: 'webhook-simulation' });
      
      // Log the response for debugging
      console.log('Webhook simulation response:', response);
      
      // Optionally reset the form
      setFormData({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        appointmentTitle: ''
      });
    } catch (error) {
      // Show error message
      toast.error(`Webhook simulation failed: ${error.response?.data?.error || error.message}`, { 
        id: 'webhook-simulation' 
      });
      console.error('Webhook simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">iClosed Webhook Simulator</h1>
            <p className="text-gray-600">
              This tool simulates an iClosed webhook to test the backend integration. 
              Fill in the form below and click "Send Test Webhook" to create a contact and deal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label htmlFor="appointmentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="appointmentTitle"
                name="appointmentTitle"
                value={formData.appointmentTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Initial Consultation"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Test Webhook'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• This form simulates an iClosed webhook payload</li>
              <li>• When submitted, it creates a new contact and deal in the system</li>
              <li>• The contact will be associated with the first available user</li>
              <li>• The deal will be placed in the first stage of the default pipeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookSimulatorPage;
