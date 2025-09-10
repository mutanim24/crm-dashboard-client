import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { moveDealLocally, updateDealStageThunk } from '../../store/pipelineSlice';
import PipelineStage from './PipelineStage';
import DealForm from '../DealForm/DealForm';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
// --- Using react-icons for a professional and consistent icon set ---
import { HiPlus } from 'react-icons/hi2';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";


// --- A Senior Dev practice: Break down complex UI into logical sub-components ---
const StageColumn = ({ stage, index, onCreateDeal }) => {
  // Memoize calculations to prevent re-rendering on every drag event
  const { dealCount, totalValue } = useMemo(() => {
    const deals = stage.deals || [];
    const total = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return {
      dealCount: deals.length,
      totalValue: total
    };
  }, [stage.deals]);

  // A professional color palette to visually distinguish columns
  const borderColors = [
    'border-blue-500',
    'border-purple-500',
    'border-teal-500',
    'border-sky-500',
    'border-indigo-500',
  ];
  const colorClass = borderColors[index % borderColors.length];

  return (
    <div className="flex flex-col w-[320px] flex-shrink-0">
      {/* --- Column Header: Data-rich and Action-oriented --- */}
      <div className={`flex justify-between items-center p-3 rounded-t-lg bg-white border-b border-t-4 ${colorClass} shadow-sm`}>
        <div>
          <h2 className="font-semibold text-gray-800">{stage.name}</h2>
          <p className="text-xs text-gray-500">
            {dealCount} {dealCount === 1 ? 'Deal' : 'Deals'} • ${totalValue.toLocaleString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="!p-1.5"
          onClick={() => onCreateDeal(stage)}
          aria-label={`Add deal to ${stage.name}`}
        >
          <HiPlus className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* --- Droppable Area with Visual Feedback --- */}
      <Droppable droppableId={String(stage.id)} type="stage">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-grow min-h-[200px] p-2 rounded-b-lg bg-slate-100 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-green-50' : ''}`}
          >
            {/* The unchanged PipelineStage component renders the deals */}
            <PipelineStage stage={stage} type="stage" />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};


const PipelineBoard = ({ pipeline }) => {
  // --- All functionality and state management remains exactly the same ---
  const dispatch = useDispatch();
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [stageForNewDeal, setStageForNewDeal] = useState(null);

  const handleCreateDealClick = (stage) => {
    setStageForNewDeal(stage);
    setIsCreateDealModalOpen(true);
  };

  const handleCreateDealSuccess = (newDeal) => {
    console.log('Deal created successfully:', newDeal);
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination || (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index)) {
      return;
    }
    dispatch(moveDealLocally({
      source: result.source,
      destination: result.destination,
      draggableId: result.draggableId
    }));
    if (result.source.droppableId !== result.destination.droppableId) {
      dispatch(updateDealStageThunk({
        dealId: result.draggableId,
        stageId: result.destination.droppableId
      }));
    }
  };

  // --- Redesigned UI Starts Here ---

  if (!pipeline) {
    return (
      <div className="text-center py-20 px-6 border-2 border-dashed border-gray-200 rounded-lg mt-8">
        <HiOutlineClipboardDocumentList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No Pipeline Selected</h3>
        <p className="mt-1 text-sm text-gray-500">Please create or select a pipeline to view your deals.</p>
        <div className="mt-6">
            <Button variant="primary" onClick={() => window.location.href = '/settings'}>Go to Settings</Button>
        </div>
      </div>
    );
  }

  const displayStages = pipeline.stages?.length > 0 ? pipeline.stages : [
    { id: 'new-lead', name: 'New Lead', deals: [] },
    { id: 'contact-made', name: 'Contact Made', deals: [] },
    { id: 'proposal-sent', name: 'Proposal Sent', deals: [] },
    { id: 'negotiation', name: 'Negotiation', deals: [] }
  ];
  
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="p-1 -m-1"> {/* Negative margin trick to hide outer scrollbar */}
          <div className="flex gap-4 pb-4 overflow-x-auto">
            {displayStages.map((stage, index) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                index={index}
                onCreateDeal={handleCreateDealClick}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* --- Modal functionality remains unchanged --- */}
      <Modal isOpen={isCreateDealModalOpen} onClose={() => setIsCreateDealModalOpen(false)} title="Create New Deal" size="md">
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