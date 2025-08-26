import React from 'react';

const WorkflowSidebar = ({ onDragStart }) => {
  const nodeTypes = [
    { type: 'trigger', label: 'Trigger', description: 'Start your workflow with a trigger' },
    { type: 'action', label: 'Action', description: 'Add an action to your workflow' },
  ];

  return (
    <div className="w-64 bg-white p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Workflow Elements</h2>
      <p className="text-sm text-gray-600 mb-4">Drag and drop elements to the canvas</p>
      
      <div className="space-y-3">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(event) => onDragStart(event, nodeType.type)}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
          >
            <div className="font-medium text-blue-800">{nodeType.label}</div>
            <div className="text-xs text-blue-600 mt-1">{nodeType.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowSidebar;
