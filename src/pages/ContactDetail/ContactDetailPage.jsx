import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactById, editContact, removeContact } from '../../store/contactSlice';
import { initiateCall, simulateWebhook } from '../../store/integrationSlice';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Modal from '../../components/Modal/Modal';
import ContactForm from '../../components/ContactForm/ContactForm';
import SmsComposerModal from '../../components/SmsComposerModal/SmsComposerModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import ActivityItem from '../../components/ActivityItem/ActivityItem';
import toast, { Toaster } from 'react-hot-toast';

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedContact, loading, error } = useSelector((state) => state.contacts);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  
  // Fetch contact data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
  }, [dispatch, id]);
  
  const handleEditContact = async (contactData) => {
    if (!selectedContact) {
      toast.error('No contact selected for editing');
      return;
    }
    
    setIsEditing(true);
    setEditError(null);
    
    toast.promise(
      (async () => {
        console.log('Updating contact with data:', contactData);
        
        // Dispatch the edit action
        await dispatch(editContact({ id: selectedContact.id, contactData })).unwrap();
        
        // Refresh the contact data to get the updated information
        await dispatch(fetchContactById(selectedContact.id)).unwrap();
        
        // Close the modal
        setShowEditModal(false);
      })(),
      {
        loading: 'Updating contact...',
        success: 'Contact updated successfully!',
        error: (err) => {
          const errorMessage = err || 'Failed to update contact';
          setEditError(errorMessage);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsEditing(false);
    });
  };
  
  const handleDeleteContact = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    toast.promise(
      (async () => {
        await dispatch(removeContact(selectedContact.id)).unwrap();
        setShowDeleteConfirm(false);
        navigate('/contacts');
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
    });
  };
  
  const handleCallClick = () => {
    if (!selectedContact || !selectedContact.phone) {
      toast.error('No phone number available for this contact');
      return;
    }
    
    console.log('Attempting to initiate call for contact:', selectedContact);
    
    toast.promise(
      dispatch(initiateCall(selectedContact.phone)).unwrap(),
      {
        loading: 'Initiating call...',
        success: 'Call initiated! Check your Kixie device.',
        error: (err) => {
          // Display the specific error message from the backend
          const errorMessage = err.response?.data?.message || err.message || 'Failed to initiate call.';
          console.error('Call initiation failed:', errorMessage, err);
          return errorMessage;
        },
      }
    );
  };
  
  const handleSimulateWebhook = () => {
    if (!selectedContact) {
      toast.error('No contact selected');
      return;
    }
    
    setIsSimulatingWebhook(true);
    
    toast.promise(
      dispatch(simulateWebhook(selectedContact.id)),
      {
        loading: 'Simulating Kixie webhook...',
      success: () => {
          // Refresh contact data to show the new activity
          dispatch(fetchContactById(selectedContact.id));
          return 'Kixie webhook simulated successfully! Check the activity timeline.';
        },
        error: (err) => {
          return err.response?.data?.message || err.message || 'Failed to simulate webhook.';
        },
      }
    ).finally(() => {
      setIsSimulatingWebhook(false);
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
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  // No contact found
  if (!selectedContact && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Contact not found</p>
      </div>
    );
  }
  
  // Normalize tags to simple array for display
  const displayTags = Array.isArray(selectedContact.tags) 
    ? selectedContact.tags 
    : [];
  
  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {`${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim()}
            </h1>
            {selectedContact.title && (
              <p className="text-gray-600 truncate">
                {selectedContact.title} at {selectedContact.company || 'N/A'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end md:justify-start">
          <Button
            onClick={() => {
              if (selectedContact) {
                setShowEditModal(true);
              }
            }}
            variant="outline"
            disabled={!selectedContact}
            className="flex items-center"
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
            onClick={() => setIsSmsModalOpen(true)}
            variant="outline"
            disabled={!selectedContact || !selectedContact.phone}
            className="flex items-center"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Send SMS
          </Button>
          <Button
            onClick={handleSimulateWebhook}
            variant="outline"
            disabled={!selectedContact || isSimulatingWebhook}
            className="flex items-center"
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {isSimulatingWebhook ? 'Simulating...' : 'Simulate Inbound Activity'}
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            disabled={!selectedContact}
            className="flex items-center"
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
                <p className="text-gray-900">{selectedContact.firstName || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Name</h4>
                <p className="text-gray-900">{selectedContact.lastName || 'Not specified'}</p>
              </div>
              
              {selectedContact.title && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
                  <p className="text-gray-900">{selectedContact.title}</p>
                </div>
              )}
              
              {selectedContact.company && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
                  <p className="text-gray-900">{selectedContact.company}</p>
                </div>
              )}
              
              {selectedContact.email && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
              )}
              
              {selectedContact.phone && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                  <div className="flex items-center">
                    <Button
                      onClick={handleCallClick}
                      variant="outline"
                      className="flex items-center mr-2"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {selectedContact.phone}
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedContact.address && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                  <p className="text-gray-900">{selectedContact.address}</p>
                </div>
              )}
              
              {selectedContact.website && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                  <a 
                    href={selectedContact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedContact.website}
                  </a>
                </div>
              )}
            </div>
          </Card>
          
          {/* Communications Card */}
          <Card title="Kixie Communications Tester">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCallClick}
                  variant="primary"
                  disabled={!selectedContact || !selectedContact.phone}
                  className="flex items-center"
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call
                </Button>
                
                <Button
                  onClick={() => setIsSmsModalOpen(true)}
                  variant="primary"
                  disabled={!selectedContact || !selectedContact.phone}
                  className="flex items-center"
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Send SMS
                </Button>
                
                <Button
                  onClick={handleSimulateWebhook}
                  variant="outline"
                  disabled={!selectedContact || isSimulatingWebhook}
                  className="flex items-center"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {isSimulatingWebhook ? 'Simulating...' : 'Simulate Inbound Activity'}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Communication Tester Features:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Call: Initiate a call through Kixie integration</li>
                  <li>Send SMS: Send a text message to the contact</li>
                  <li>Simulate Inbound Activity: Test the activity timeline by creating a simulated call record</li>
                </ul>
              </div>
            </div>
          </Card>
          
          {/* Tags */}
          {displayTags.length > 0 && (
            <Card title="Tags">
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag, index) => {
                  // Expert-level tag name extraction with defensive programming
                  let tagName = 'Unknown Tag';
                  
                  try {
                    if (tag == null) {
                      tagName = 'Unknown Tag';
                    } else if (typeof tag === 'string') {
                      tagName = tag.trim() || 'Unknown Tag';
                    } else if (typeof tag === 'object' && tag !== null) {
                      // Handle nested object structures safely
                      tagName = tag.name || 
                               tag.tag || 
                               (tag.tag && tag.tag.name) || 
                               (tag.toString && tag.toString()) || 
                               'Unknown Tag';
                    } else {
                      tagName = String(tag).trim() || 'Unknown Tag';
                    }
                  } catch (error) {
                    console.warn('Error extracting tag name:', error, tag);
                    tagName = 'Unknown Tag';
                  }
                  
                  // Ensure we have a valid string
                  tagName = tagName ? String(tagName).trim() : 'Unknown Tag';
                  
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tagName}
                    </span>
                  );
                })}
              </div>
            </Card>
          )}
          
          {/* Notes */}
          {selectedContact.notes && (
            <Card title="Notes">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.notes}</p>
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
                <p className="text-gray-900">{formatDate(selectedContact.created_at)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                <p className="text-gray-900">{formatDate(selectedContact.updated_at)}</p>
              </div>
            </div>
          </Card>
          
          {/* Associated Deals */}
          {selectedContact.deals && selectedContact.deals.length > 0 && (
            <Card title="Associated Deals">
              <div className="space-y-3">
                {selectedContact.deals.slice(0, 5).map((deal) => (
                  <div key={deal.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <h5 className="font-medium text-gray-900">{deal.title}</h5>
                    <p className="text-sm text-gray-500">
                      {deal.value ? `$${deal.value.toLocaleString()}` : 'N/A'} • {deal.stage?.name || deal.pipeline_stage_name || 'N/A'}
                    </p>
                  </div>
                ))}
                {selectedContact.deals.length > 5 && (
                  <p className="text-sm text-gray-500">
                    +{selectedContact.deals.length - 5} more deals
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* Timeline */}
          <Card title="Activity Timeline">
            <div className="space-y-0">
              {selectedContact.activities && selectedContact.activities.length > 0 ? (
                selectedContact.activities.map((activity, index) => (
                  <ActivityItem key={activity.id || index} activity={activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No activities yet</p>
                  <p className="text-sm text-gray-400 mt-1">Activities will appear here as they occur</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Edit Contact Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="lg"
      >
        {selectedContact && (
          <ContactForm
            initialData={selectedContact}
            onSubmit={handleEditContact}
            isLoading={isEditing}
            error={editError}
          />
        )}
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
              {`${selectedContact.firstName || ''} ${selectedContact.lastName || ''}`.trim()}
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
      
      {/* SMS Composer Modal */}
      <SmsComposerModal
        contact={selectedContact}
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />
    </div>
  );
};

export default ContactDetailPage;
