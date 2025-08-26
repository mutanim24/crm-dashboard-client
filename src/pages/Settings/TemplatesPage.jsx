import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplates, addTemplate, editTemplate, removeTemplate, clearError } from '../../store/templateSlice';
import TemplateList from '../../components/TemplateList/TemplateList';
import TemplateForm from '../../components/TemplateForm/TemplateForm';
import Button from '../../components/Button/Button';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import toast from 'react-hot-toast';

const TemplatesPage = () => {
  const dispatch = useDispatch();
  const { templates, loading, error } = useSelector((state) => state.templates);
  
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(removeTemplate(id));
      toast.success('Email template deleted successfully');
    }
  };

  const handleSubmitTemplate = (formData) => {
    if (editingTemplate) {
      dispatch(editTemplate({ id: editingTemplate.id, templateData: formData }));
      toast.success('Email template updated successfully');
    } else {
      dispatch(addTemplate(formData));
      toast.success('Email template added successfully');
    }
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        <Button onClick={handleCreateTemplate}>
          Create Template
        </Button>
      </div>

      {loading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error} />}
      
      {!loading && !error && (
        <TemplateList 
          templates={templates} 
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
        />
      )}

      {showModal && (
        <TemplateForm
          initialData={editingTemplate}
          onSubmit={handleSubmitTemplate}
          onClose={handleCloseModal}
          isEditing={!!editingTemplate}
        />
      )}
    </div>
  );
};

export default TemplatesPage;
