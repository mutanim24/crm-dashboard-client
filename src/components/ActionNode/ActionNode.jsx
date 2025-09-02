import React from 'react';
import { Handle } from 'reactflow';

const ActionNode = ({ data }) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg border-2 border-green-700 min-w-[200px]">
      <div className="font-bold text-lg mb-1">{data.label}</div>
      <div className="text-sm opacity-90">{data.description}</div>
      <Handle 
        type="target" 
        position="left" 
        className="w-4 h-4 bg-green-300 border-2 border-white rounded-full"
        style={{ left: '-8px' }}
      />
      <Handle 
        type="source" 
        position="right" 
        className="w-4 h-4 bg-green-300 border-2 border-white rounded-full"
        style={{ right: '-8px' }}
      />
    </div>
  );
};

export default ActionNode;
