import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editContact, removeContact } from '../../store/contactSlice';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import ContactForm from '../ContactForm/ContactForm';
import toast, { Toaster } from 'react-hot-toast';

const ContactDetailView = ({ contact, onBackToList }) => {
  const dispatch = useDispatch();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  const handleEditContact = async (contactData) => {
    setIsEditing(true);
    setEditError(null);
    
    try {
      await dispatch(editContact({ id: contact.id, contactData })).unwrap();
      setShowEditModal(false);
    } catch (error) {
      setEditError(error.message || 'Failed to update contact');
    } finally {
      setIsEditing(false);
    }
  };
  
  const handleDeleteContact = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    toast.promise(
      (async () => {
        await dispatch(removeContact(contact.id)).unwrap();
        onBackToList();
      })(),
      {
        loading: 'Deleting contact...',
        success: 'Contact deleted successfully!',
        error: (err) => {
          const errorMessage = err || 'Failed to delete contact';
          setDeleteError(errorMessage);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (!contact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Contact not found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button onClick={onBackToList} variant="outline" className="mb-4 sm:mb-0">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Contacts
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
            </h1>
            {contact.title && (
              <p className="text-gray-600">{contact.title} at {contact.company || 'N/A'}</p>
            )}
          </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowEditModal(true)}
            variant="outline"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </Button>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">First Name</h4>
                <p className="text-gray-900">{contact.firstName || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Name</h4>
                <p className="text-gray-900">{contact.lastName || 'Not specified'}</p>
              </div>
              
              {contact.title && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                  <p className="text-gray-900">{contact.title}</p>
                </div>
              )}
              
              {contact.company && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
                  <p className="text-gray-900">{contact.company}</p>
                </div>
              )}
              
              {contact.email && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <p className="text-gray-900">{contact.email}</p>
                </div>
              )}
              
              {contact.phone && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  <p className="text-gray-900">{contact.phone}</p>
                </div>
              )}
              
              {contact.address && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                  <p className="text-gray-900">{contact.address}</p>
                </div>
              )}
              
              {contact.website && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                  <a 
                    href={contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {contact.website}
                  </a>
                </div>
              )}
            </div>
          </Card>
          
          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <Card title="Tags">
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
          
          {/* Notes */}
          {contact.notes && (
            <Card title="Notes">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Status */}
          <Card title="Status">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                <p className="text-gray-900">{formatDate(contact.created_at)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                <p className="text-gray-900">{formatDate(contact.updated_at)}</p>
              </div>
            </div>
          </Card>
          
          {/* Associated Deals */}
          {contact.deals && contact.deals.length > 0 && (
            <Card title="Associated Deals">
              <div className="space-y-3">
                {contact.deals.slice(0, 5).map((deal) => (
                  <div key={deal.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <h5 className="font-medium text-gray-900">{deal.title}</h5>
                    <p className="text-sm text-gray-500">
                      {deal.value ? `$${deal.value.toLocaleString()}` : 'N/A'} • {deal.pipeline_stage_name}
                    </p>
                  </div>
                ))}
                {contact.deals.length > 5 && (
                  <p className="text-sm text-gray-500">
                    +{contact.deals.length - 5} more deals
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* Timeline */}
          {contact.activities && contact.activities.length > 0 && (
            <Card title="Recent Activity">
              <div className="space-y-4">
                {contact.activities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                        {activity.type.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
                {contact.activities.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{contact.activities.length - 3} more activities
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Edit Contact Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          initialData={contact}
          onSubmit={handleEditContact}
          isLoading={isEditing}
          error={editError}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Contact"
        size="md"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete <span className="font-semibold">
              {`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
            </span>? 
            This action cannot be undone.
          </p>
          
          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {deleteError}
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteContact}
              variant="danger"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Contact'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactDetailView;
