import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendSms } from '../../store/integrationSlice';
import toast from 'react-hot-toast';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

const SmsComposerModal = ({ contact, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const MAX_CHARACTERS = 160;
  
  const handleSend = () => {
    if (!contact || !contact.phone) {
      toast.error('No phone number available for this contact');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    const payload = {
      phoneNumber: contact.phone,
      message: message
    };
    
    console.log('Attempting to send SMS to contact:', contact, 'with message:', message);
    
    toast.promise(
      dispatch(sendSms(payload)).unwrap(),
      {
        loading: 'Sending SMS...',
        success: 'SMS sent successfully!',
        error: (err) => {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to send SMS';
          console.error('SMS sending failed:', errorMessage, err);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsSending(false);
      setMessage('');
      onClose();
    });
  };
  
  const handleCancel = () => {
    setMessage('');
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Send SMS to ${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="sms-message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="sms-message"
            rows={4}
            maxLength={MAX_CHARACTERS}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Type your message here..."
          />
          <div className="mt-1 text-right">
            <span className={`text-xs ${message.length > MAX_CHARACTERS - 10 ? 'text-yellow-500' : 'text-gray-500'}`}>
              {message.length}/{MAX_CHARACTERS}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SmsComposerModal;
