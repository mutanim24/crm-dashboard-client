import React from 'react';
import { Handle } from '@xyflow/react';

const FormNode = ({ data }) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg border-2 border-purple-700 min-w-[200px]">
      <div className="font-bold text-lg mb-1">{data.label}</div>
      <div className="text-sm opacity-90 mb-2">{data.description}</div>
      <div className="text-xs opacity-80">
        <div className="font-medium">Form: {data.formTitle || 'Untitled Form'}</div>
        <div>{data.formFields?.length || 0} fields</div>
      </div>
      <Handle 
        type="target" 
        position="left" 
        className="w-4 h-4 bg-purple-300 border-2 border-white rounded-full"
        style={{ left: '-8px' }}
      />
      <Handle 
        type="source" 
        position="right" 
        className="w-4 h-4 bg-purple-300 border-2 border-white rounded-full"
        style={{ right: '-8px' }}
      />
    </div>
  );
};

export default FormNode;
