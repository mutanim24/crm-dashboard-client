import React from 'react';
import { format } from 'date-fns';
import { FaCalendarCheck, FaPhone, FaEnvelope, FaStickyNote } from 'react-icons/fa';

const ActivityItem = ({ activity }) => {
  // Get appropriate icon based on activity type
  const getActivityIcon = (type) => {
    const iconClasses = "w-6 h-6 rounded-full flex items-center justify-center text-white";
    
    switch (type) {
      case 'APPOINTMENT_BOOKED':
        return (
          <div className={`${iconClasses} bg-blue-500`}>
            <FaCalendarCheck className="w-4 h-4" />
          </div>
        );
      case 'CALL':
        return (
          <div className={`${iconClasses} bg-green-500`}>
            <FaPhone className="w-4 h-4" />
          </div>
        );
      case 'EMAIL':
        return (
          <div className={`${iconClasses} bg-purple-500`}>
            <FaEnvelope className="w-4 h-4" />
          </div>
        );
      case 'NOTE':
        return (
          <div className={`${iconClasses} bg-yellow-500`}>
            <FaStickyNote className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} bg-gray-500`}>
            <span className="text-xs font-medium">{type.charAt(0)}</span>
          </div>
        );
    }
  };

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Time not specified';
    try {
      const date = new Date(timestamp);
      return format(date, 'MMMM dd, yyyy \'at\' h:mm a');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  // Parse and display activity data
  const renderActivityContent = () => {
    if (!activity.data) {
      return activity.note || activity.description || 'No details available';
    }

    try {
      const data = typeof activity.data === 'string' ? JSON.parse(activity.data) : activity.data;
      
      switch (activity.type) {
        case 'APPOINTMENT_BOOKED':
          if (data.deal_name) {
            return `Appointment Booked: ${data.deal_name}`;
          }
          if (data.subject) {
            return `Appointment: ${data.subject}`;
          }
          return `Appointment Booked`;
          
        case 'CALL':
          if (data.notes) {
            return `Call Notes: ${data.notes}`;
          }
          if (data.duration) {
            return `Call (${data.duration} minutes)`;
          }
          return 'Call';
          
        case 'EMAIL':
          if (data.subject) {
            return `Email: ${data.subject}`;
          }
          if (data.body) {
            return `Email: ${data.body.substring(0, 100)}${data.body.length > 100 ? '...' : ''}`;
          }
          return 'Email';
          
        case 'NOTE':
          return data.note || data.content || activity.note || 'Note';
          
        default:
          return data.note || data.description || activity.note || 'Activity';
      }
    } catch (error) {
      console.error('Error parsing activity data:', error);
      return activity.note || activity.description || 'No details available';
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
            {activity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          <p className="text-xs text-gray-500">
            {formatTimestamp(activity.timestamp || activity.createdAt)}
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {renderActivityContent()}
        </p>
        {activity.user && (
          <p className="text-xs text-gray-500 mt-1">
            By {activity.user.first_name} {activity.user.last_name}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
