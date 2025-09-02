import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkflows, selectWorkflows, selectWorkflowsLoading } from '../../store/workflowSlice';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowBuilder from '../../components/WorkflowBuilder/WorkflowBuilder';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const WorkflowPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workflows = useSelector(selectWorkflows);
  const loading = useSelector(selectWorkflowsLoading);

  useEffect(() => {
    dispatch(fetchWorkflows());
  }, [dispatch]);

  const handleLoadWorkflow = (workflowId) => {
    navigate(`/workflows/${workflowId}`);
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
      {/* Workflow List Sidebar */}
      <div className="w-72 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">My Workflows</h2>
          <p className="text-sm text-gray-500 mt-1">Click to edit</p>
        </div>
        
        <div className="p-4">
          {workflows.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No workflows found</div>
              <div className="text-sm text-gray-500">Create your first workflow to get started</div>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="p-4 rounded-xl cursor-pointer transition-all duration-200 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]"
                  onClick={() => handleLoadWorkflow(workflow.id)}
                >
                  <h3 className="font-semibold text-gray-800">{workflow.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {workflow.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(workflow.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Visual Workflow Builder</h1>
          <p className="text-gray-600 mt-1">Drag and drop elements to build your workflow</p>
        </div>
        
        <div className="flex-1 bg-gray-50">
          <ReactFlowProvider>
            <WorkflowBuilder />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
