import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from '../Card/Card';

const DealCard = ({ deal, index }) => {
  return (
    <Draggable draggableId={String(deal.id)} index={index} isDropDisabled={false}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 hover:shadow-md transition-shadow cursor-move ${
            snapshot.isDragging ? 'opacity-50' : ''
          }`}
        >
          <Card>
            <div className="font-semibold text-gray-800">{deal.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              ${deal.value.toLocaleString()}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DealCard;
