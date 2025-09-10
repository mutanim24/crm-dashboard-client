import { React, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// --- React Icons are used for a consistent, professional icon set ---
import { HiCog6Tooth, HiPlus, HiMiniBanknotes, HiChartBar, HiScale, HiTrophy, HiOutlineExclamationTriangle, HiOutlineClipboardDocumentList } from "react-icons/hi2";

import { fetchPipelines } from '@/store/pipelineSlice';
import PipelineBoard from '@/components/PipelineBoard/PipelineBoard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage'; // Keeping import
import Button from '@/components/Button/Button';


// --- UI Sub-component: Page Header ---
// Refined with better button styling and a clean separator.
const PageHeader = ({ onAddDeal, onSettings }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Sales Pipeline</h1>
      <p className="mt-1 text-gray-500">An overview of your current sales activity and performance.</p>
    </div>
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* Settings Button */}
      <Button
        variant="outline"
        onClick={onSettings}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        aria-label="Pipeline Settings"
      >
        <HiCog6Tooth className="w-6 h-6 text-gray-600" />
      </Button>



      {/* Add Deal Button */}
      <Button
        variant="primary"
        onClick={onAddDeal}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors w-full sm:w-auto"
      >
        <HiPlus className="w-5 h-5" />
        <span>Add Deal</span>
      </Button>
    </div>

  </div>
);

// --- UI Sub-component: Statistic Card ---
// A more elegant design with the icon integrated into the layout.
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// --- UI Sub-component: Error State ---
// A cleaner, card-based design that feels more integrated.
const RedesignedErrorState = ({ error }) => (
  <div className="bg-white rounded-lg border border-red-200 p-12 text-center mt-8">
    <HiOutlineExclamationTriangle className="mx-auto h-12 w-12 text-red-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">Failed to Load Pipeline</h3>
    <p className="mt-1 text-sm text-gray-500">There was an issue fetching the pipeline data.</p>
    <p className="mt-4 text-xs font-mono text-red-700 bg-red-50 p-3 rounded-md">{error}</p>
    <div className="mt-6">
      <Button variant="primary" onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  </div>
);

// --- UI Sub-component: Empty State ---
// Uses a card-based design for consistency.
const EmptyState = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center mt-8">
    <HiOutlineClipboardDocumentList className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-900">No Pipeline Exists</h3>
    <p className="mt-1 text-sm text-gray-500">Create your first sales pipeline to begin tracking deals.</p>
    <div className="mt-6">
      <Button variant="primary" onClick={() => window.location.href = '/settings'}>Create Pipeline</Button>
    </div>
  </div>
);


const PipelinePage = () => {
  // --- All functionality and state management remains exactly the same ---
  const dispatch = useDispatch();
  const { pipelines, loading, error } = useSelector((state) => state.pipelines);

  useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);

  const { dealCount, totalValue } = useMemo(() => {
    if (!pipelines || pipelines.length === 0) return { dealCount: 0, totalValue: 0 };
    const firstPipeline = pipelines[0];
    const deals = firstPipeline.stages?.flatMap(stage => stage.deals) || [];
    const total = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return { dealCount: deals.length, totalValue: total };
  }, [pipelines]);

  // --- Redesigned UI Starts Here ---

  const renderContent = () => {
    if (loading && pipelines.length === 0) {
      return (
        <div className="flex justify-center items-center py-40"><LoadingSpinner /></div>
      );
    }
    if (error) {
      return <RedesignedErrorState error={error} />;
    }
    if (pipelines.length === 0) {
      return <EmptyState />;
    }
    return <div className="mt-8"><PipelineBoard pipeline={pipelines[0]} /></div>;
  };

  return (
    // A cooler, more professional background color
    <div className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          onAddDeal={() => alert('Navigate to Add Deal Page')}
          onSettings={() => window.location.href = '/settings'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <StatCard
            title="Pipeline Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={<HiMiniBanknotes className="h-6 w-6 text-green-700" />}
          />
          <StatCard
            title="Active Deals"
            value={dealCount}
            icon={<HiChartBar className="h-6 w-6 text-green-700" />}
          />
          <StatCard
            title="Avg. Deal Size"
            value={dealCount > 0 ? `$${Math.round(totalValue / dealCount).toLocaleString()}` : '$0'}
            icon={<HiScale className="h-6 w-6 text-green-700" />}
          />
          <StatCard
            title="Est. Win Rate"
            value="24%" // Placeholder
            icon={<HiTrophy className="h-6 w-6 text-green-700" />}
          />
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default PipelinePage;