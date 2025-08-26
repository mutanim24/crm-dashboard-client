import React from 'react';
import { format } from 'date-fns';

const ActivityItem = ({ activity }) => {
  // Format the activity type to be more readable
  const formatActivityType = (type) => {
    if (!type) return 'Unknown Activity';
    
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Time not specified';
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  // Get appropriate icon based on activity type
  const getActivityIcon = (type) => {
    if (!type) return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">A</div>;
    
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('call')) {
      return (
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      );
    } else if (lowerType.includes('sms') || lowerType.includes('text')) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      );
    } else if (lowerType.includes('contact')) {
      return (
        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    } else if (lowerType.includes('tag')) {
      return (
        <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
          {formatActivityType(type).charAt(0)}
        </div>
      );
    }
  };

  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 mr-3">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            {formatActivityType(activity.type)}
          </p>
          <p className="text-xs text-gray-500">
            {formatTimestamp(activity.createdAt)}
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {activity.note || activity.description || 'No description available'}
        </p>
        {activity.user && (
          <p className="text-xs text-gray-500 mt-1">
            By {activity.user.firstName} {activity.user.lastName}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
