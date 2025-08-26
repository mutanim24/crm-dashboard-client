import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflow, selectCurrentWorkflow, selectWorkflowsLoading } from '../../store/workflowSlice';
import WorkflowBuilder from '../../components/WorkflowBuilder/WorkflowBuilder';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Button from '../../components/Button/Button';

const WorkflowDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentWorkflow = useSelector(selectCurrentWorkflow);
  const loading = useSelector(selectWorkflowsLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchWorkflow(id));
    }
  }, [id, dispatch]);

  const handleBackToList = () => {
    navigate('/workflows');
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

  if (!currentWorkflow) {
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
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Header */}
      <div className="bg-white border-b p-4 flex flex-col">
        <div className=" flex flex-col space-y-2">
          <Button 
            onClick={handleBackToList}
            variant="outline"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Edit Workflow
            </h1>
            <p className="text-gray-600">
              {currentWorkflow.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <span className="text-sm text-gray-500">
            Created: {new Date(currentWorkflow.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <WorkflowBuilder id={id} />
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
