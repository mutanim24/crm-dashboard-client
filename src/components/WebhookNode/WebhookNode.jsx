import React from 'react';
import { Handle } from '@xyflow/react';

const WebhookNode = ({ data }) => {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl shadow-lg border-2 border-teal-700 min-w-[200px]">
      <div className="font-bold text-lg mb-1">{data.label}</div>
      <div className="text-sm opacity-90 mb-2">{data.description}</div>
      <div className="text-xs opacity-80">
        <div className="font-medium">Endpoint: {data.endpoint || 'Not set'}</div>
        <div>Method: {data.method || 'POST'}</div>
        {data.authentication && (
          <div>Auth: {data.authentication.type || 'none'}</div>
        )}
      </div>
      <Handle 
        type="target" 
        position="left" 
        className="w-4 h-4 bg-teal-300 border-2 border-white rounded-full"
        style={{ left: '-8px' }}
      />
      <Handle 
        type="source" 
        position="right" 
        className="w-4 h-4 bg-teal-300 border-2 border-white rounded-full"
        style={{ right: '-8px' }}
      />
    </div>
  );
};

export default WebhookNode;
