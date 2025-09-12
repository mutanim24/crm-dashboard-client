import React from 'react';
import { Handle } from '@xyflow/react';
import { HiOutlineTrash } from 'react-icons/hi2';

const ConditionNode = ({ data, selected }) => {
return (
  <div className={`group px-6 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl shadow-lg border-2 ${
    selected ? 'border-yellow-400 ring-2 ring-yellow-400 ring-opacity-50' : 'border-red-700'
  } min-w-[200px] relative`}>
      <button
        className="delete-node-btn absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
        data-node-id={data.id}
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-label="Delete node"
      >
        <HiOutlineTrash className="w-3 h-3" />
      </button>
      
      <div className="font-bold text-lg mb-1">{data.label}</div>
      <div className="text-sm opacity-90 mb-2">{data.description}</div>
      <div className="text-xs opacity-80">
        <div className="font-medium">Condition: {data.conditionType || 'if_field_equals'}</div>
        {data.field && (
          <div>Field: {data.field}</div>
        )}
        {data.operator && (
          <div>Operator: {data.operator}</div>
        )}
        {data.value !== undefined && (
          <div>Value: {String(data.value)}</div>
        )}
        {data.tagId && (
          <div>Tag: {data.tagId}</div>
        )}
      </div>
      <Handle 
        type="target" 
        position="left" 
        className="w-4 h-4 bg-red-300 border-2 border-white rounded-full"
        style={{ left: '-8px' }}
      />
      <Handle 
        type="source" 
        position="right" 
        className="w-4 h-4 bg-red-300 border-2 border-white rounded-full"
        style={{ right: '-8px' }}
      />
    </div>
  );
};

export default ConditionNode;
