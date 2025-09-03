import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflows, selectWorkflows, selectWorkflowsLoading, deleteWorkflow } from '../../store/workflowSlice';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { toast } from 'react-hot-toast';

const WorkflowPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workflows = useSelector(selectWorkflows);
  const loading = useSelector(selectWorkflowsLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);

  useEffect(() => {
    // Try to fetch workflows from API first
    const fetchWorkflowsWithFallback = async () => {
      try {
        await dispatch(fetchWorkflows()).unwrap();
      } catch (error) {
        console.warn('Failed to fetch workflows from API, using local storage:', error);
        // If API fails, we'll rely on the workflow service to load from local storage
        // The workflow service already handles this fallback
      }
    };
    
    fetchWorkflowsWithFallback();
  }, [dispatch]);

  const handleLoadWorkflow = (workflowId) => {
    navigate(`/workflows/${workflowId}`);
  };

  const handleAddNewWorkflow = () => {
    // Navigate directly to the new workflow canvas page
    navigate('/workflows/new');
  };

  const handleDeleteClick = (workflow) => {
    setWorkflowToDelete(workflow);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (workflowToDelete) {
      dispatch(deleteWorkflow(workflowToDelete.id));
      setShowDeleteModal(false);
      setWorkflowToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setWorkflowToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">My Workflows</h1>
          <p className="text-gray-600 mt-1">Create and manage your automated workflows</p>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Add New Workflow Button */}
          <div className="mb-6">
            <Button 
              onClick={handleAddNewWorkflow}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add New Workflow
            </Button>
          </div>
          
          {workflows.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">No workflows found</div>
              <div className="text-sm text-gray-500 mb-8">Create your first workflow to get started</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="p-6 rounded-xl transition-all duration-200 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] relative"
                >
                  <div 
                    className="absolute top-4 right-4 flex space-x-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(workflow);
                    }}
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      className="p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                  
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleLoadWorkflow(workflow.id)}
                  >
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 pr-8">{workflow.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {workflow.description || 'No description'}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Created: {new Date(workflow.createdAt).toLocaleDateString()}
                      </p>
                      <div className="text-blue-500">
                        Edit →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Workflow"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-6">Are you sure you want to delete this workflow?</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleDeleteCancel}
              variant="secondary"
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="danger"
              className="px-4 py-2"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkflowPage;
