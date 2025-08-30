import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { createDealThunk } from '../../store/pipelineSlice';
import { getContacts } from '../../services/contactService';
import Input from '../Input/Input';
import Button from '../Button/Button';

const DealForm = ({ pipeline, stageId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    currency: 'USD',
    contactId: '',
  });
  const [loading, setLoading] = useState(false);

  // Load contacts when component mounts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await getContacts();
        setContacts(response.data || []);
        setFilteredContacts(response.data || []);
      } catch (error) {
        console.error('Error loading contacts:', error);
        toast.error('Failed to load contacts');
      }
    };

    loadContacts();
  }, []);

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSelect = (contact) => {
    setFormData(prev => ({
      ...prev,
      contactId: contact.id
    }));
    setSearchTerm(`${contact.firstName} ${contact.lastName}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Deal title is required');
      return;
    }

    if (!pipeline || !stageId) {
      toast.error('Pipeline and stage are required');
      return;
    }

    setLoading(true);
    toast.loading('Creating deal...');

    try {
      const dealData = {
        ...formData,
        pipelineId: pipeline.id,
        stageId: stageId,
      };

      const result = await dispatch(createDealThunk(dealData)).unwrap();
      
      toast.dismiss();
      toast.success('Deal created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        value: '',
        currency: 'USD',
        contactId: '',
      });
      setSearchTerm('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data);
      }
      
      // Close modal
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create New Deal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deal Title *
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter deal title"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Value
            </label>
            <Input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact (Optional)
          </label>
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="pr-10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFormData(prev => ({ ...prev, contactId: '' }));
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          {filteredContacts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </div>
                    {contact.email && (
                      <div className="text-sm text-gray-500">{contact.email}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DealForm;
