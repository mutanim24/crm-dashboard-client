import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPipelines } from '@/store/pipelineSlice';
import PipelineBoard from '@/components/PipelineBoard/PipelineBoard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Button from '@/components/Button/Button';

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
    return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Pipelines</h1>
            <p className="text-gray-600">Manage your sales pipelines and track deal progress</p>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Pipelines Yet</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first pipeline to start tracking deals.</p>
              <div className="mt-6">
                <Button onClick={() => window.location.href = '/settings'}>
                  Create Pipeline
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelinePage;
