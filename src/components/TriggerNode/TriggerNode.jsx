import React from 'react';
import { Handle } from 'reactflow';

const TriggerNode = ({ data }) => {
  return (
    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md border-2 border-blue-600">
      <div className="font-semibold">{data.label}</div>
      <div className="text-xs mt-1 opacity-80">{data.description}</div>
      <Handle type="source" position="right" className="w-3 h-3 bg-blue-300" />
    </div>
  );
};

export default TriggerNode;
