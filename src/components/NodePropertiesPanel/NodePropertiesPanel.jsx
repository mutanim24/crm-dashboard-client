import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { NODE_TYPES, TRIGGER_TYPES, ACTION_TYPES, CONDITION_TYPES, CONDITION_OPERATORS, WAIT_TYPES } from '../../types/workflow';

const NodePropertiesPanel = ({ 
  node, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (node && node.data) {
      setFormData({ ...node.data });
      setErrors({});
    }
  }, [node]);

  const handleInputChange = (field, value, subField = null) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.label || formData.label.trim() === '') {
      newErrors.label = 'Label is required';
    }
    
    if (node.type === NODE_TYPES.TRIGGER) {
      if (!formData.triggerType) {
        newErrors.triggerType = 'Trigger type is required';
      }
    } else if (node.type === NODE_TYPES.ACTION) {
      if (!formData.actionType) {
        newErrors.actionType = 'Action type is required';
      }
      if (formData.actionType === ACTION_TYPES.SEND_EMAIL && !formData.emailConfig?.subject) {
        newErrors.emailSubject = 'Email subject is required';
      }
      if (formData.actionType === ACTION_TYPES.SEND_SMS && !formData.smsConfig?.message) {
        newErrors.smsMessage = 'SMS message is required';
      }
    } else if (node.type === NODE_TYPES.CONDITION) {
      if (!formData.conditionType) {
        newErrors.conditionType = 'Condition type is required';
      }
      if (formData.conditionType === CONDITION_TYPES.IF_FIELD_EQUALS && (!formData.field || !formData.value)) {
        newErrors.condition = 'Field and value are required for this condition';
      }
    } else if (node.type === NODE_TYPES.WAIT) {
      if (!formData.waitType) {
        newErrors.waitType = 'Wait type is required';
      }
      if (formData.waitType === WAIT_TYPES.DELAY && (!formData.delayAmount || formData.delayAmount <= 0)) {
        newErrors.delayAmount = 'Valid delay amount is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(node.id, formData);
      onClose();
    }
  };

  const renderTriggerFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
        <select
          value={formData.triggerType || ''}
          onChange={(e) => handleInputChange('triggerType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select trigger type</option>
          <option value={TRIGGER_TYPES.CONTACT_CREATED}>Contact Created</option>
          <option value={TRIGGER_TYPES.CONTACT_UPDATED}>Contact Updated</option>
          <option value={TRIGGER_TYPES.TAG_ADDED}>Tag Added</option>
          <option value={TRIGGER_TYPES.FORM_SUBMISSION}>Form Submission</option>
          <option value={TRIGGER_TYPES.WEBHOOK}>Webhook</option>
        </select>
        {errors.triggerType && <p className="text-red-500 text-xs mt-1">{errors.triggerType}</p>}
      </div>
    </div>
  );

  const renderActionFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
        <select
          value={formData.actionType || ''}
          onChange={(e) => handleInputChange('actionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select action type</option>
          <option value={ACTION_TYPES.SEND_EMAIL}>Send Email</option>
          <option value={ACTION_TYPES.SEND_SMS}>Send SMS</option>
          <option value={ACTION_TYPES.ADD_TAG}>Add Tag</option>
          <option value={ACTION_TYPES.REMOVE_TAG}>Remove Tag</option>
          <option value={ACTION_TYPES.CREATE_TASK}>Create Task</option>
          <option value={ACTION_TYPES.UPDATE_CONTACT}>Update Contact</option>
        </select>
        {errors.actionType && <p className="text-red-500 text-xs mt-1">{errors.actionType}</p>}
      </div>

      {formData.actionType === ACTION_TYPES.SEND_EMAIL && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
            <Input
              value={formData.emailConfig?.subject || ''}
              onChange={(e) => handleInputChange('emailConfig', e.target.value, 'subject')}
              placeholder="Enter email subject"
            />
            {errors.emailSubject && <p className="text-red-500 text-xs mt-1">{errors.emailSubject}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
            <textarea
              value={formData.emailConfig?.body || ''}
              onChange={(e) => handleInputChange('emailConfig', e.target.value, 'body')}
              placeholder="Enter email body"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {formData.actionType === ACTION_TYPES.SEND_SMS && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMS Message</label>
          <textarea
            value={formData.smsConfig?.message || ''}
            onChange={(e) => handleInputChange('smsConfig', e.target.value, 'message')}
            placeholder="Enter SMS message"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.smsMessage && <p className="text-red-500 text-xs mt-1">{errors.smsMessage}</p>}
        </div>
      )}

      {formData.actionType === ACTION_TYPES.ADD_TAG && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag ID</label>
          <Input
            value={formData.tagConfig?.tagId || ''}
            onChange={(e) => handleInputChange('tagConfig', e.target.value, 'tagId')}
            placeholder="Enter tag ID"
          />
        </div>
      )}
    </div>
  );

  const renderConditionFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
        <select
          value={formData.conditionType || ''}
          onChange={(e) => handleInputChange('conditionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select condition type</option>
          <option value={CONDITION_TYPES.IF_FIELD_EQUALS}>If Field Equals</option>
          <option value={CONDITION_TYPES.IF_TAG_EXISTS}>If Tag Exists</option>
          <option value={CONDITION_TYPES.IF_DATE_PASSED}>If Date Passed</option>
          <option value={CONDITION_TYPES.IF_CUSTOM}>Custom Logic</option>
        </select>
        {errors.conditionType && <p className="text-red-500 text-xs mt-1">{errors.conditionType}</p>}
      </div>

      {formData.conditionType === CONDITION_TYPES.IF_FIELD_EQUALS && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
            <Input
              value={formData.field || ''}
              onChange={(e) => handleInputChange('field', e.target.value)}
              placeholder="e.g., email, status"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
            <select
              value={formData.operator || ''}
              onChange={(e) => handleInputChange('operator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select operator</option>
              <option value={CONDITION_OPERATORS.EQUALS}>Equals</option>
              <option value={CONDITION_OPERATORS.NOT_EQUALS}>Not Equals</option>
              <option value={CONDITION_OPERATORS.CONTAINS}>Contains</option>
              <option value={CONDITION_OPERATORS.GREATER_THAN}>Greater Than</option>
              <option value={CONDITION_OPERATORS.LESS_THAN}>Less Than</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <Input
              value={formData.value || ''}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="Enter value"
            />
          </div>
          {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
        </div>
      )}
    </div>
  );

  const renderWaitFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Wait Type</label>
        <select
          value={formData.waitType || ''}
          onChange={(e) => handleInputChange('waitType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select wait type</option>
          <option value={WAIT_TYPES.DELAY}>Delay</option>
          <option value={WAIT_TYPES.UNTIL}>Until Specific Time</option>
          <option value={WAIT_TYPES.DATE}>Until Specific Date</option>
        </select>
        {errors.waitType && <p className="text-red-500 text-xs mt-1">{errors.waitType}</p>}
      </div>

      {formData.waitType === WAIT_TYPES.DELAY && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delay Amount</label>
            <Input
              type="number"
              value={formData.delayAmount || ''}
              onChange={(e) => handleInputChange('delayAmount', parseInt(e.target.value) || 0)}
              placeholder="Enter delay amount"
            />
            {errors.delayAmount && <p className="text-red-500 text-xs mt-1">{errors.delayAmount}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={formData.delayUnit || ''}
              onChange={(e) => handleInputChange('delayUnit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
        <Input
          value={formData.formTitle || ''}
          onChange={(e) => handleInputChange('formTitle', e.target.value)}
          placeholder="Enter form title"
        />
      </div>
    </div>
  );

  const renderWebhookFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
        <Input
          value={formData.endpoint || ''}
          onChange={(e) => handleInputChange('endpoint', e.target.value)}
          placeholder="https://example.com/webhook"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
        <select
          value={formData.method || 'POST'}
          onChange={(e) => handleInputChange('method', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>
    </div>
  );

  const renderNodeFields = () => {
    switch (node.type) {
      case NODE_TYPES.TRIGGER:
        return renderTriggerFields();
      case NODE_TYPES.ACTION:
        return renderActionFields();
      case NODE_TYPES.CONDITION:
        return renderConditionFields();
      case NODE_TYPES.WAIT:
        return renderWaitFields();
      case NODE_TYPES.FORM:
        return renderFormFields();
      case NODE_TYPES.WEBHOOK:
        return renderWebhookFields();
      default:
        return null;
    }
  };

  if (!node) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Node Properties" 
      size="lg"
      footer={
        <div className="flex justify-between gap-3">
          <Button 
            variant="danger" 
            onClick={() => {
              onDelete(node.id);
              onClose();
            }}
          >
            Delete Node
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
          <Input
            value={formData.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Enter node label"
          />
          {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter node description"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {renderNodeFields()}
      </div>
    </Modal>
  );
};

export default NodePropertiesPanel;
