import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// --- Using react-icons for a professional and consistent icon set ---
import { HiPlus, HiOutlineEnvelope, HiEllipsisVertical, HiOutlinePencil, HiOutlineTrash, HiOutlineExclamationTriangle } from 'react-icons/hi2';

import { fetchTemplates, addTemplate, editTemplate, removeTemplate, clearError } from '../../store/templateSlice';
import TemplateList from '../../components/TemplateList/TemplateList'; // We'll assume this component renders the cards
import TemplateForm from '../../components/TemplateForm/TemplateForm';
import Button from '../../components/Button/Button';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Modal from '../../components/Modal/Modal'; // Assuming a Modal component exists
import toast from 'react-hot-toast';

// --- A Senior Dev practice: Break down UI into logical, single-responsibility components ---

const PageHeader = ({ onCreate }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
      <p className="mt-1 text-gray-500">Create and manage reusable templates for your communications.</p>
    </div>
    <Button
      variant="primary"
      onClick={onCreate}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
    >
      <HiPlus className="w-5 h-5" />
      <span>Create Template</span>
    </Button>

  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 rounded-lg">
    <HiOutlineEnvelope className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">No Templates Yet</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating your first email template.</p>
    <div className="mt-6">
      <Button variant="primary" onClick={onCreate}>
        Create Your First Template
      </Button>
    </div>
  </div>
);


const TemplatesPage = () => {
  // --- All functionality and state management remains exactly the same ---
  const dispatch = useDispatch();
  const { templates, loading, error } = useSelector((state) => state.templates);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null); // For the confirmation modal

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error); // Show error in a toast
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowFormModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowFormModal(true);
  };

  // This now opens the confirmation modal instead of a window.confirm
  const handleDeleteTemplate = (id) => {
    const template = templates.find(t => t.id === id);
    setTemplateToDelete(template);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      dispatch(removeTemplate(templateToDelete.id));
      toast.success(`Template "${templateToDelete.name}" deleted.`);
      setTemplateToDelete(null); // Close the modal
    }
  };

  const handleSubmitTemplate = (formData) => {
    if (editingTemplate) {
      dispatch(editTemplate({ id: editingTemplate.id, templateData: formData }));
      toast.success('Email template updated successfully');
    } else {
      dispatch(addTemplate(formData));
      toast.success('Email template created successfully');
    }
    setShowFormModal(false);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingTemplate(null);
  };


  // --- Redesigned UI Starts Here ---
  const renderContent = () => {
    if (loading && !templates.length) {
      return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
    }
    if (!loading && templates.length === 0) {
      return <EmptyState onCreate={handleCreateTemplate} />;
    }
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <TemplateList
          templates={templates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader onCreate={handleCreateTemplate} />

        <main className="mt-8">
          {renderContent()}
        </main>
      </div>

      {/* --- Using a proper Modal for the form --- */}
      <Modal
        isOpen={showFormModal}
        onClose={handleCloseModal}
        title={editingTemplate ? 'Edit Template' : 'Create New Template'}
        size="lg" // A larger modal is better for a form
      >
        <TemplateForm
          initialData={editingTemplate}
          onSubmit={handleSubmitTemplate}
          onClose={handleCloseModal}
          isEditing={!!editingTemplate}
        />
      </Modal>

      {/* --- Professional Delete Confirmation Modal --- */}
      <Modal
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="text-center p-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Template?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete the "{templateToDelete?.name}" template? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button onClick={() => setTemplateToDelete(null)} variant="outline">Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="danger">Delete Template</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatesPage;