import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflow, selectCurrentWorkflow, selectWorkflowsLoading, updateWorkflow } from '../../store/workflowSlice';
import WorkflowBuilder from '../../components/WorkflowBuilder/WorkflowBuilder';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Button from '../../components/Button/Button';
import { toast } from 'react-hot-toast';

const WorkflowDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const loading = useSelector(selectWorkflowsLoading);
  const [isEditingName, setIsEditingName] = useState(false);
  const [workflowName, setWorkflowName] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      dispatch(fetchWorkflow(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
    } else if (id === 'new') {
      setWorkflowName('New Workflow');
    }
  }, [currentWorkflow, id]);

  // Handle when a workflow is created or updated
  useEffect(() => {
    if (currentWorkflow && id === 'new') {
      // If we just created a workflow, update the URL to show the real ID
      if (currentWorkflow.id && currentWorkflow.id !== 'new') {
        window.history.replaceState({}, '', `/workflows/${currentWorkflow.id}`);
      }
    }
  }, [currentWorkflow, id]);

  const handleBackToList = () => {
    navigate('/workflows');
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e) => {
    setWorkflowName(e.target.value);
  };

  const handleNameSave = () => {
    if (workflowName.trim() && id && id !== 'new') {
      dispatch(updateWorkflow({ id, name: workflowName.trim() }))
        .unwrap()
        .then(() => {
          setIsEditingName(false);
          toast.success('Workflow name updated');
        })
        .catch(() => {
          toast.error('Failed to update workflow name');
        });
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    if (currentWorkflow) {
      setWorkflowName(currentWorkflow.name);
    } else {
      setWorkflowName('New Workflow');
    }
    setIsEditingName(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!currentWorkflow && id !== 'new') {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Workflow not found</h1>
            <p className="text-gray-600 mt-2">The requested workflow could not be found.</p>
            <Button 
              onClick={handleBackToList}
              className="mt-4"
            >
              Back to Workflows
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Small workflow name display at the top */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleBackToList}
            variant="outline"
            size="sm"
          >
            ← Back
          </Button>
          <div className="flex items-center">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={workflowName}
                  onChange={handleNameChange}
                  autoFocus
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={handleNameSave}
                  className="text-green-600 hover:text-green-800"
                >
                  ✓
                </button>
                <button 
                  onClick={handleNameCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center cursor-pointer" onClick={handleNameClick}>
                <span className="text-sm font-medium text-gray-700">
                  {workflowName}
                </span>
                <svg 
                  className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Canvas takes up remaining space */}
      <div className="flex-1">
        <WorkflowBuilder 
          id={id} 
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
        />
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
