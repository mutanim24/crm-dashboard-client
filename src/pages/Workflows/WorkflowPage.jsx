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
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Workflow List Sidebar */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">My Workflows</h2>
        </div>
        
        <div className="p-4">
          {workflows.length === 0 ? (
            <p className="text-gray-500 text-center">No workflows found</p>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="p-3 rounded-lg cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100"
                  onClick={() => handleLoadWorkflow(workflow.id)}
                >
                  <h3 className="font-medium text-gray-800">{workflow.name}</h3>
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
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Visual Workflow Builder</h1>
        </div>
        
        <div className="flex-1">
          <ReactFlowProvider>
            <WorkflowBuilder />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
