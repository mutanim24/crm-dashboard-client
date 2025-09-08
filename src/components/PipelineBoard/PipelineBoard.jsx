import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { moveDealLocally, updateDealStageThunk } from '../../store/pipelineSlice';
import PipelineStage from './PipelineStage';
import DealForm from '../DealForm/DealForm';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

const PipelineBoard = ({ pipeline }) => {
  const dispatch = useDispatch();
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [stageForNewDeal, setStageForNewDeal] = useState(null);

  // Debug: Log pipeline data
  console.log('PipelineBoard received pipeline:', pipeline);

  // Handle case where pipeline is not available
  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pipeline Found</h3>
          <p className="text-gray-500 mb-4">Create a pipeline to get started with your sales process.</p>
          <Button onClick={() => window.location.href = '/settings'}>
            Go to Settings
          </Button>
        </div>
      </div>
    );
  }

  // Ensure stages array exists and has default columns if empty
  const stages = pipeline.stages || [];
  
  // If no stages exist, create default columns
  const displayStages = stages.length === 0 ? [
    { id: 'new-lead', name: 'New Lead', deals: [] },
    { id: 'contact-made', name: 'Contact Made', deals: [] },
    { id: 'proposal-sent', name: 'Proposal Sent', deals: [] },
    { id: 'negotiation', name: 'Negotiation', deals: [] }
  ] : stages;

  const handleCreateDealClick = (stage) => {
    setStageForNewDeal(stage);
    setIsCreateDealModalOpen(true);
  };

  const handleCreateDealSuccess = (newDeal) => {
    // The deal is already added to the state by the Redux thunk
    console.log('Deal created successfully:', newDeal);
  };

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
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex space-x-4 p-4">
            {displayStages.map((stage) => (
              <div key={stage.id} className="flex-1 min-w-[300px]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">{stage.name}</h3>
                  <Button
                    size="sm"
                    onClick={() => handleCreateDealClick(stage)}
                  >
                    + Create Deal
                  </Button>
                </div>
                <PipelineStage stage={stage} type="stage" />
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Create Deal Modal */}
      <Modal
        isOpen={isCreateDealModalOpen}
        onClose={() => setIsCreateDealModalOpen(false)}
        title="Create New Deal"
        size="md"
      >
        <DealForm
          pipeline={pipeline}
          stageId={stageForNewDeal?.id}
          onClose={() => setIsCreateDealModalOpen(false)}
          onSuccess={handleCreateDealSuccess}
        />
      </Modal>
    </>
  );
};

export default PipelineBoard;
