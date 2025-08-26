import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPipelines } from '@/store/pipelineSlice';
import PipelineBoard from '@/components/PipelineBoard/PipelineBoard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

const PipelinePage = () => {
  const dispatch = useDispatch();
  
  const { pipelines, loading, error } = useSelector((state) => state.pipelines);
  
  // Debug: Log pipelines from Redux
  console.log('Pipelines from Redux:', pipelines);
  
  // Fetch pipelines when component mounts
  useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);
  
  // Conditional rendering based on state
  if (loading && pipelines.length === 0) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Pipelines</h1>
          <p className="text-gray-600">Manage your sales pipelines and track deal progress</p>
        </div>
        
        {/* Pipeline Board */}
        {pipelines.length > 0 ? (
          <PipelineBoard pipeline={pipelines[0]} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500 text-center">
              No pipelines found. Create a pipeline to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelinePage;
