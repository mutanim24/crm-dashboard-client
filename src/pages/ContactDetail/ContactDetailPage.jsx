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
import toast from 'react-hot-toast';
import { FaEdit, FaPhone, FaSms } from "react-icons/fa"

// --- UI Sub-components (for a cleaner structure without changing imports) ---

const DetailItem = ({ label, children }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{children || '-'}</dd>
  </div>
);

const PageHeader = ({ contact, onEdit, onSms, onCall, }) => {
  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || '?';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-semibold text-green-700">
              {getInitials(contact.firstName, contact.lastName)}
            </span>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
            </h1>
            <p className="text-sm text-gray-500">
              {contact.title || 'No Title'} at {contact.company || 'No Company'}
            </p>
          </div>
        </div>
        {/* Elegant Action Buttons with Green Primary Color */}
        <div className="flex items-center gap-3 mt-4 sm:mt-0 flex-shrink-0">
          {/* Edit */}
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex items-center gap-2 rounded px-4 py-2"
          >
            <FaEdit className="w-5 h-5" />
            <span>Edit</span>
          </Button>

          {/* Call */}
          <Button
            onClick={onCall}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded p-3 shadow-sm"
          >
            <FaPhone className="w-5 h-5" />
          </Button>

          {/* SMS */}
          <Button
            onClick={onSms}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded p-3 shadow-sm"
          >
            <FaSms className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};


const ContactDetailPage = () => {
  // --- All functionality and state management remains exactly the same ---
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

  useEffect(() => {
    if (id) {
      dispatch(fetchContactById(id));
    }
  }, [dispatch, id]);

  const handleEditContact = async (contactData) => {
    setIsEditing(true); setEditError(null);
    toast.promise(
      dispatch(editContact({ id: selectedContact.id, contactData })).unwrap()
        .then(() => dispatch(fetchContactById(selectedContact.id)))
        .then(() => setShowEditModal(false)),
      {
        loading: 'Updating contact...',
        success: 'Contact updated successfully!',
        error: (err) => { setEditError(err); return err || 'Failed to update contact'; },
      }
    ).finally(() => setIsEditing(false));
  };

  const handleDeleteContact = async () => {
    setIsDeleting(true); setDeleteError(null);
    toast.promise(
      dispatch(removeContact(selectedContact.id)).unwrap()
        .then(() => { setShowDeleteConfirm(false); navigate('/contacts'); }),
      {
        loading: 'Deleting contact...',
        success: 'Contact deleted successfully!',
        error: (err) => { setDeleteError(err); return err || 'Failed to delete contact'; },
      }
    ).finally(() => setIsDeleting(false));
  };

  const handleCallClick = () => {
    if (!selectedContact?.phone) return toast.error('No phone number available.');
    toast.promise(dispatch(initiateCall(selectedContact.phone)).unwrap(), {
      loading: 'Initiating call...',
      success: 'Call initiated! Check your Kixie device.',
      error: (err) => err.response?.data?.message || err.message || 'Failed to initiate call.',
    });
  };

  const handleSimulateWebhook = () => {
    setIsSimulatingWebhook(true);
    toast.promise(
      dispatch(simulateWebhook(selectedContact.id)).unwrap()
        .then(() => dispatch(fetchContactById(selectedContact.id))),
      {
        loading: 'Simulating Kixie webhook...',
        success: 'Webhook simulated! Check the activity timeline.',
        error: (err) => err.response?.data?.message || err.message || 'Failed to simulate webhook.',
      }
    ).finally(() => setIsSimulatingWebhook(false));
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';


  // --- Redesigned UI Starts Here ---

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={`Error: ${error}`} />
      </div>
    );
  }

  if (!selectedContact) {
    return (
      <div className="text-center py-40">
        <p className="text-gray-500">Contact not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        contact={selectedContact}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteConfirm(true)}
        onSms={() => setIsSmsModalOpen(true)}
        onCall={handleCallClick}
        onSimulate={handleSimulateWebhook}
        isSimulating={isSimulatingWebhook}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 px-6 py-4">
              Contact Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 p-6">
              <DetailItem label="Full Name">{`${selectedContact.firstName} ${selectedContact.lastName}`}</DetailItem>
              <DetailItem label="Email">{selectedContact.email}</DetailItem>
              <DetailItem label="Phone">{selectedContact.phone}</DetailItem>
              <DetailItem label="Company">{selectedContact.company}</DetailItem>
              <DetailItem label="Job Title">{selectedContact.title}</DetailItem>
              <DetailItem label="Website">
                <a href={selectedContact.website} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                  {selectedContact.website}
                </a>
              </DetailItem>
            </dl>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 px-6 py-4">
              Activity Timeline
            </h3>
            <div className="p-6">
              {selectedContact.activities?.length > 0 ? (
                selectedContact.activities.map((activity, index) => (
                  <ActivityItem key={activity.id || index} activity={activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No activities recorded yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 px-6 py-4">
              Additional Info
            </h3>
            <div className="p-6 space-y-6">
              {selectedContact.tags?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag, index) => (
                      <span key={index} className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{tag.name || tag}</span>
                    ))}
                  </div>
                </div>
              )}
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

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 px-6 py-4">
              Danger Zone
            </h3>
            <div className="p-6 space-y-4">
              <Button onClick={handleSimulateWebhook} variant="outline" className="w-full" disabled={isSimulatingWebhook}>
                {isSimulatingWebhook ? 'Simulating...' : 'Simulate Inbound Activity'}
              </Button>
              <Button onClick={() => setShowDeleteConfirm(true)} variant="danger" className="w-full">
                Delete Contact
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* --- All Modals remain unchanged in functionality --- */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Contact" size="lg">
        {selectedContact && <ContactForm initialData={selectedContact} onSubmit={handleEditContact} isLoading={isEditing} error={editError} />}
      </Modal>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Contact" size="md">
        <div className="space-y-4">
          <p>Are you sure you want to delete <span className="font-semibold">{`${selectedContact.firstName} ${selectedContact.lastName}`}</span>? This action cannot be undone.</p>
          {deleteError && <ErrorMessage message={deleteError} />}
          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" disabled={isDeleting}>Cancel</Button>
            <Button onClick={handleDeleteContact} variant="danger" disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Contact'}</Button>
          </div>
        </div>
      </Modal>

      <SmsComposerModal contact={selectedContact} isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} />
    </div>
  );
};

export default ContactDetailPage;