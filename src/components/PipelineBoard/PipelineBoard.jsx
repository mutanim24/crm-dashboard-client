import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { moveDealLocally, updateDealStageThunk } from '../../store/pipelineSlice';
import PipelineStage from './PipelineStage';

const PipelineBoard = ({ pipeline }) => {
  const dispatch = useDispatch();

  const handleDragEnd = (result) => {
    // If there's no destination, the drag was cancelled or invalid
    if (!result.destination) {
      return;
    }

    // If the source and destination are the same, no need to do anything
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    // Dispatch the action to move the deal locally
    dispatch(moveDealLocally({
      source: result.source,
      destination: result.destination,
      draggableId: result.draggableId
    }));

    // Update the deal's stage in the backend only if it was moved to a different column
    if (result.source.droppableId !== result.destination.droppableId) {
      dispatch(updateDealStageThunk({
        dealId: result.draggableId,
        stageId: result.destination.droppableId
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-4 p-4">
          {pipeline.stages.map((stage) => (
            <PipelineStage key={stage.id} stage={stage} type="stage" />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default PipelineBoard;
