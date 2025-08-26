import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md max-w-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Error:</span>
        </div>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
