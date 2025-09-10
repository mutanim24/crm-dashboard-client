import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflows, selectWorkflows, selectWorkflowsLoading, deleteWorkflow } from '../../store/workflowSlice';
// --- Using react-icons for a professional and consistent icon set ---
import { HiPlus, HiOutlineCubeTransparent, HiEllipsisVertical, HiOutlineExclamationTriangle, HiOutlineArrowsRightLeft } from "react-icons/hi2";

// NOTE: These components are assumed to be in your project.
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

// --- A Senior Dev practice: Break down UI into logical, single-responsibility components ---

const PageHeader = ({ onAddNew }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
      <p className="mt-1 text-gray-500">Automate your tasks and create powerful processes.</p>
    </div>
    <Button
      variant="primary"
      onClick={onAddNew}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
    >
      <HiPlus className="w-5 h-5" />
      <span>Create Workflow</span>
    </Button>

  </div>
);

const WorkflowCard = ({ workflow, onDeleteClick }) => {
  // const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault(); // Stop the link navigation
    e.stopPropagation(); // Stop event bubbling
    onDeleteClick(workflow);
  };

  return (
    <Link
      to={`/workflows/${workflow.id}`}
      className="group block bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-green-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-green-100 transition-colors">
              <HiOutlineArrowsRightLeft className="w-6 h-6 text-gray-500 group-hover:text-green-600 transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{workflow.name}</h3>
              <p className="text-xs text-gray-400">
                Created: {new Date(workflow.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="!p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
            aria-label={`Delete workflow ${workflow.name}`}
          >
            <HiEllipsisVertical className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4 h-10">
          {workflow.description || 'No description provided.'}
        </p>
      </div>
    </Link>
  );
};

const EmptyState = ({ onAddNew }) => (
  <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 rounded-lg">
    <HiOutlineCubeTransparent className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">No Workflows Yet</h3>
    <p className="mt-1 text-sm text-gray-500">Automate your first process by creating a workflow.</p>
    <div className="mt-6">
      <Button variant="primary" onClick={onAddNew}>
        Create Your First Workflow
      </Button>
    </div>
  </div>
);


const WorkflowPage = () => {
  // --- All functionality and state management remains exactly the same ---
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workflows = useSelector(selectWorkflows);
  const loading = useSelector(selectWorkflowsLoading);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkflows()).unwrap().catch(error => {
      console.warn('Failed to fetch workflows from API, relying on local service fallback:', error);
    });
  }, [dispatch]);

  const handleAddNewWorkflow = () => navigate('/workflows/new');
  const handleDeleteClick = (workflow) => {
    setWorkflowToDelete(workflow);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (workflowToDelete) {
      dispatch(deleteWorkflow(workflowToDelete.id));
      setShowDeleteModal(false);
      setWorkflowToDelete(null);
      // toast.success("Workflow deleted successfully!");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setWorkflowToDelete(null);
  };


  // --- Redesigned UI Starts Here ---
  if (loading && !workflows.length) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader onAddNew={handleAddNewWorkflow} />

        <main className="mt-8">
          {workflows.length === 0 ? (
            <EmptyState onAddNew={handleAddNewWorkflow} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel} title="Confirm Deletion" size="sm">
        <div className="text-center p-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Workflow?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete the "{workflowToDelete?.name}" workflow? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button onClick={handleDeleteCancel} variant="outline">Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="danger">Delete Workflow</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkflowPage;