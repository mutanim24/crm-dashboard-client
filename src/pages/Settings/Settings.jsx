import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// --- Using react-icons for a professional and consistent icon set ---
import { HiOutlineUserCircle, HiOutlineBellAlert, HiOutlinePuzzlePiece, HiOutlineEnvelope, HiChevronRight, HiOutlineCheckCircle } from 'react-icons/hi2';

// NOTE: These components are assumed to be in your project.
// Their styling is implied by the usage below.
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';


// --- A Senior Dev practice: Break down UI into logical, single-responsibility components ---

const Navigation = ({ activeTab, setActiveTab, user }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
        <HiOutlineUserCircle className="h-full w-full text-gray-400" />
      </span>
      <div>
        <h2 className="font-semibold text-gray-900">{user?.name || 'User'}</h2>
        <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
      </div>
    </div>
    <nav className="flex flex-col gap-1">
      <TabButton icon={<HiOutlineUserCircle className="w-5 h-5" />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      <TabButton icon={<HiOutlineBellAlert className="w-5 h-5" />} label="Notifications" isActive={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
      <TabButton icon={<HiOutlinePuzzlePiece className="w-5 h-5" />} label="Integrations" isActive={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
      <TabButton icon={<HiOutlineEnvelope className="w-5 h-5" />} label="Email Templates" isActive={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
    </nav>
  </div>
);

const TabButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
      ? 'bg-green-50 text-green-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
  >
    <span className={`transition-colors ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
      {icon}
    </span>
    <span className="ml-3">{label}</span>
  </button>
);

const SettingsCard = ({ title, description, children, footerContent }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
    <div className="p-6">
      {children}
    </div>
    {footerContent && (
      <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end">
        {footerContent}
      </div>
    )}
  </div>
);

const ToggleSwitch = ({ name, checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
    <div>
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
    </label>
  </div>
);

const SettingsLinkCard = ({ icon, title, description, path }) => (
  <Link to={path} className="group block bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-green-300">
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center">
        <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-green-100 transition-colors">
          <span className="text-gray-500 group-hover:text-green-600 transition-colors">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);


const Settings = () => {
  // --- All functionality and state management remains exactly the same ---
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', company: '', title: '' });
  const [notificationSettings, setNotificationSettings] = useState({ email: true, push: true, sms: false, emailType: { dealUpdates: true, taskReminders: true, marketing: false } });

  const handleProfileChange = (e) => setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNotificationChange = (e) => {
    const { name, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNotificationSettings(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: checked } }));
    } else if (type === 'checkbox') {
      setNotificationSettings(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleSaveProfile = (e) => { e.preventDefault(); console.log('Saving profile:', profileForm); alert('Profile updated!'); };
  const handleSaveNotifications = (e) => { e.preventDefault(); console.log('Saving notification settings:', notificationSettings); alert('Notifications updated!'); };


  // --- Redesigned UI Starts Here ---
  return (
    <div className="flex-1 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* --- Navigation Sidebar --- */}
          <div className="lg:col-span-1">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
          </div>

          {/* --- Tab Content --- */}
          <main className="lg:col-span-4">
            {activeTab === 'profile' && (
              <SettingsCard
                title="Personal Information"
                description="Update your photo and personal details here."
                footerContent={<Button
                  type="submit"
                  form="profile-form"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
                >
                  <HiOutlineCheckCircle className="w-5 h-5" />
                  <span>Save Changes</span>
                </Button>
                }
              >
                <form id="profile-form" onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                  <Input label="Email Address" type="email" name="email" value={profileForm.email} onChange={handleProfileChange} />
                  <Input label="Phone Number" type="tel" name="phone" value={profileForm.phone} onChange={handleProfileChange} />
                  <Input label="Company" name="company" value={profileForm.company} onChange={handleProfileChange} />
                  <div className="md:col-span-2">
                    <Input label="Job Title" name="title" value={profileForm.title} onChange={handleProfileChange} />
                  </div>
                </form>
              </SettingsCard>
            )}

            {activeTab === 'notifications' && (
              <SettingsCard
                title="Notifications"
                description="Manage how you receive notifications from the platform."
                footerContent={<Button
                  type="submit"
                  form="notifications-form"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 shadow-sm transition-colors"
                >
                  <HiOutlineCheckCircle className="w-5 h-5" />
                  <span>Save Changes</span>
                </Button>
                }
              >
                <form id="notifications-form" onSubmit={handleSaveNotifications} className="space-y-2">
                  <ToggleSwitch name="email" checked={notificationSettings.email} onChange={handleNotificationChange} label="Email Notifications" description="Receive updates via email." />
                  <ToggleSwitch name="push" checked={notificationSettings.push} onChange={handleNotificationChange} label="Push Notifications" description="Get alerts on your mobile or desktop device." />
                  <ToggleSwitch name="sms" checked={notificationSettings.sms} onChange={handleNotificationChange} label="SMS Notifications" description="Receive important alerts via text message." />
                </form>
              </SettingsCard>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <SettingsLinkCard
                  icon={<HiOutlinePuzzlePiece className="w-6 h-6" />}
                  title="Manage Integrations"
                  description="Connect and manage third-party services."
                  path="/settings/integrations"
                />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <SettingsLinkCard
                  icon={<HiOutlineEnvelope className="w-6 h-6" />}
                  title="Email Templates"
                  description="Create and manage reusable email templates."
                  path="/settings/templates"
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;