import React from 'react';
import { Handle } from '@xyflow/react';

const WaitNode = ({ data }) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl shadow-lg border-2 border-yellow-700 min-w-[200px]">
      <div className="font-bold text-lg mb-1">{data.label}</div>
      <div className="text-sm opacity-90 mb-2">{data.description}</div>
      <div className="text-xs opacity-80">
        <div className="font-medium">Type: {data.waitType || 'delay'}</div>
        {data.waitType === 'delay' && data.delayAmount && data.delayUnit && (
          <div>Wait {data.delayAmount} {data.delayUnit}</div>
        )}
        {data.waitType === 'until' && data.waitUntil && (
          <div>Until: {new Date(data.waitUntil).toLocaleString()}</div>
        )}
        {data.waitType === 'date' && data.specificDate && (
          <div>Date: {new Date(data.specificDate).toLocaleDateString()}</div>
        )}
      </div>
      <Handle 
        type="target" 
        position="left" 
        className="w-4 h-4 bg-yellow-300 border-2 border-white rounded-full"
        style={{ left: '-8px' }}
      />
      <Handle 
        type="source" 
        position="right" 
        className="w-4 h-4 bg-yellow-300 border-2 border-white rounded-full"
        style={{ right: '-8px' }}
      />
    </div>
  );
};

export default WaitNode;
