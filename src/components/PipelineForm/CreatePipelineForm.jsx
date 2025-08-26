import React, { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';

const CreatePipelineForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Pipeline name is required';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Pipeline Name *
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter pipeline name"
          required
          className="w-full"
          error={formErrors.name}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter pipeline description (optional)"
          className="w-full"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          text="Cancel"
          variant="outline"
          disabled={isLoading}
        />
        <Button
          type="submit"
          text={isLoading ? 'Creating...' : 'Create Pipeline'}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default CreatePipelineForm;
