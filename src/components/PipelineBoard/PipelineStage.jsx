import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DealCard from '../DealCard/DealCard';

const PipelineStage = ({ stage }) => {
  return (
    // This is the outer, non-scrolling container for the entire column
    <div className="flex flex-col w-80 bg-gray-100 rounded-lg shadow-sm">
      <div className="p-4 bg-gray-200 rounded-t-lg">
        <h3 className="font-semibold text-gray-800">{stage.name}</h3>
      </div>

      {/* The Droppable area will now be the scrolling container itself */}
      <Droppable droppableId={stage.id} type="deal"> 
        {(provided, snapshot) => (
          <div
            // --- THE FIX IS HERE ---
            // The ref and droppableProps are now on the element that scrolls
            ref={provided.innerRef}
            {...provided.droppableProps}
            // Add a visual cue when dragging over this column
            className={`flex-1 p-4 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-100'}`}
          >
            {stage.deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            
            {/* The placeholder is crucial for maintaining space when dragging */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default PipelineStage;