import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    title: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    emailType: {
      dealUpdates: true,
      taskReminders: true,
      marketing: false,
    },
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setNotificationSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('.')) {
      // Handle nested emailType settings
      const [parent, child] = name.split('.');
      setNotificationSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Saving profile:', profileForm);
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log('Saving notification settings:', notificationSettings);
    alert('Notification settings updated successfully!');
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
            <Button 
              onClick={() => navigate('/settings/templates')}
              variant="secondary"
            >
              Manage Templates
            </Button>
          </div>
          <p className="text-gray-600">
            Create and manage email templates for your communications.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>
            <Button 
              onClick={() => navigate('/settings/integrations')}
              variant="secondary"
            >
              Manage Integrations
            </Button>
          </div>
          <p className="text-gray-600">
            Connect third-party services to extend your CRM capabilities.
          </p>
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Settings */}
              <div className="lg:col-span-2">
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                  <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <Input
                          type="text"
                          name="company"
                          value={profileForm.company}
                          onChange={handleProfileChange}
                          placeholder="Enter your company"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <Input
                          type="text"
                          name="title"
                          value={profileForm.title}
                          onChange={handleProfileChange}
                          placeholder="Enter your job title"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        type="submit"
                        text="Save Profile"
                        className="px-6"
                      />
                    </div>
                  </form>
                </Card>

              </div>

              {/* Notification Settings */}
              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                  <form onSubmit={handleSaveNotifications}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email Notifications
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive updates via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="email"
                            checked={notificationSettings.email}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Push Notifications
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive push notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="push"
                            checked={notificationSettings.push}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            SMS Notifications
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive text message alerts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="sms"
                            checked={notificationSettings.sms}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                        </label>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Email Notification Types
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">
                              Deal Updates
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="emailType.dealUpdates"
                                checked={notificationSettings.emailType.dealUpdates}
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">
                              Task Reminders
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="emailType.taskReminders"
                                checked={notificationSettings.emailType.taskReminders}
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">
                              Marketing Updates
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="emailType.marketing"
                                checked={notificationSettings.emailType.marketing}
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        type="submit"
                        text="Save Notification Settings"
                        className="w-full"
                      />
                    </div>
                  </form>
                </Card>
              </div>
            </div>
      </div>
    </div>
  );
};

export default Settings;
