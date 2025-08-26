import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import toast from 'react-hot-toast';

const ContactForm = ({ initialData, onSubmit, isLoading, error, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  
  // Initialize form with initial data when editing
  useEffect(() => {
    if (initialData) {
      const firstName = initialData.firstName || (initialData.name ? initialData.name.split(' ')[0] : '');
      const lastName = initialData.lastName || (initialData.name ? initialData.name.split(' ').slice(1).join(' ') : '');
      
      // With the new data contract, tags are just an array of strings
      const processedTags = Array.isArray(initialData.tags) 
        ? initialData.tags
        : [];
      
      setFormData({
        firstName,
        lastName,
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        tags: processedTags
      });
    } else {
      // Reset form for a new contact
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        tags: []
      });
    }
  }, [initialData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      // Simple check for duplicates
      const tagExists = formData.tags.some(tag => tag.toLowerCase() === newTag.trim().toLowerCase());
      
      if (!tagExists) {
        // Add new tag as a simple string
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // The data is already in the correct format for the API
    const formattedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      tags: formData.tags
    };
    
    console.log('ContactForm - Submitting with data:', formattedData);
    
    onSubmit(formattedData);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} required className="w-full" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <Input id="company" name="company" type="text" value={formData.company} onChange={handleInputChange} className="w-full" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={handleKeyPress} placeholder="Add a tag" className="flex-1" />
          <Button type="button" onClick={handleAddTag} variant="outline">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 -mr-1 p-0.5 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Remove</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
