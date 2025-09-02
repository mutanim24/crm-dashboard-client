import React from 'react';

const WorkflowSidebar = ({ onDragStart }) => {
  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', description: 'Start your workflow with a trigger' },
    { type: 'action', label: 'Action', description: 'Add an action to your workflow' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Workflow Elements</h2>
        <p className="text-sm text-gray-500 mt-1">Drag and drop to canvas</p>
      </div>
      
      <div className="p-4 flex-1">
        <div className="space-y-4">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl cursor-move hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className="font-semibold text-blue-800 mb-1">{nodeType.label}</div>
              <div className="text-xs text-blue-600">{nodeType.description}</div>
              <div className="mt-3 text-blue-400">
                {nodeType.type === 'trigger' ? '🔥' : '⚡'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          Drag elements to the canvas to build your workflow
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
