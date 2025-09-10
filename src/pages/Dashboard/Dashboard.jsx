import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon,
  PlusIcon,
  EnvelopeIcon,
  CalendarIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// NOTE: I am assuming you have these components.
// If not, their basic structure is implied by the usage below.
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import PipelineBoard from '../../components/PipelineBoard/PipelineBoard';
import { fetchPipelines } from '../../store/pipelineSlice';


// --- MOCK DATA (Moved outside the component for performance) ---

const statsData = [
  {
    title: 'Total Contacts',
    value: '2,543',
    change: '+12%',
    changeType: 'positive',
    icon: UsersIcon,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Active Deals',
    value: '127',
    change: '+8%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+23%',
    changeType: 'positive',
    icon: ArrowTrendingUpIcon,
    iconBgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-2%',
    changeType: 'negative',
    icon: ChartPieIcon,
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
];

const quickActions = [
  { title: 'Add Contact', icon: PlusIcon, path: '/contacts' },
  { title: 'Create Deal', icon: CurrencyDollarIcon, path: '/pipelines' },
  { title: 'Send Email', icon: EnvelopeIcon, path: '/contacts' },
  { title: 'Schedule Task', icon: ListBulletIcon, path: '/settings' },
];

const recentActivities = [
  { id: 1, action: 'New contact added', contact: 'John Smith', time: '2m ago' },
  { id: 2, action: 'Deal won', contact: 'Acme Corp - $5,000', time: '1h ago' },
  { id: 3, action: 'Email opened', contact: 'Jane Doe', time: '3h ago' },
  { id: 4, action: 'Meeting scheduled', contact: 'Tech Solutions', time: '5h ago' },
  { id: 5, action: 'Follow-up completed', contact: 'Global Inc', time: '1d ago' }
];

// --- SUB-COMPONENTS ---

const DashboardHeader = ({ userName }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
        Welcome back, {userName}!
      </h1>
      <p className="mt-1 text-gray-500">
        Here's a summary of your sales pipeline.
      </p>
    </div>
    <Button
      className="mt-4 sm:mt-0"
      onClick={() => alert('Navigate to Create New page')}
    >

      Create New
    </Button>
  </div>
);

const StatCard = ({ item }) => (
  <Card className="p-5">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${item.iconBgColor}`}>
        <item.icon className={`w-6 h-6 ${item.iconColor}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{item.title}</p>
        <p className="text-2xl font-semibold text-gray-800">{item.value}</p>
      </div>
    </div>
    <p className={`text-sm mt-2 ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
      }`}>
      {item.change} vs last month
    </p>
  </Card>
);

const QuickAction = ({ action, navigate }) => (
  <Button
    variant="outline"
    className="w-full p-4 flex flex-col items-center justify-center text-center h-full"
    onClick={() => navigate(action.path)}
  >
    <action.icon className="w-7 h-7 mb-2 text-gray-500 group-hover:text-primary" />
    <span className="text-sm font-medium text-gray-700">{action.title}</span>
  </Button>
);

const ActivityItem = ({ activity }) => (
  <div className="flex space-x-4">
    <div className="flex flex-col items-center">
      <span className="block w-3 h-3 bg-indigo-500 rounded-full"></span>
      <span className="block w-px h-full bg-gray-200"></span>
    </div>
    <div className="pb-6">
      <p className="text-sm text-gray-800">
        <span className="font-medium">{activity.action}</span>
        {' - '}
        <span className="text-gray-600">{activity.contact}</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
    </div>
  </div>
);

// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { pipelines, selectedPipeline, loading } = useSelector((state) => state.pipelines);
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(fetchPipelines());
  }, [dispatch]);

  const TabButton = ({ title, tabName }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-3 py-2 font-medium text-sm rounded-md transition-colors ${activeTab === tabName
          ? 'bg-primary text-white'
          : 'text-gray-500 hover:bg-gray-100'
        }`}
    >
      {title}
    </button>
  );

  return (
    <div className="flex-1 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader userName={user?.name || 'User'} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} item={stat} />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-6">
          <TabButton title="Overview" tabName="overview" />
          <TabButton title="Pipeline" tabName="pipeline" />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
              </h3>
              <div>
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Actions
              </h3>
              {/* The list-based layout is more scannable and scalable */}
              <div className="mt-4 flex flex-col gap-2">
                {quickActions.map((action, index) => (
                  <QuickAction key={index} action={action} navigate={navigate} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : pipelines.length > 0 ? (
              <PipelineBoard pipeline={pipelines.find(p => p.id === selectedPipeline) || pipelines[0]} />
            ) : (
              <Card className="p-6 text-center text-gray-500">
                No pipelines found.
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
