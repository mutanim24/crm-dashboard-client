import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

// NOTE: I am assuming you have these components.
// Their basic structure is implied by the usage below.
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

// Dummy API functions and Redux actions to make the component self-contained for this example
const updateProfile = async (data) => { console.log('Updating profile:', data); return { success: true, data }; };
const changePassword = async (data) => { console.log('Changing password:', data); return { success: true }; };
const updateProfileAction = (data) => ({ type: 'auth/updateProfile', payload: data });

// --- SUB-COMPONENTS ---

const PageHeader = () => (
  <div className="mb-8">
    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Profile Settings</h1>
    <p className="mt-1 text-gray-500">Manage your personal and security information.</p>
  </div>
);

const ProfileHeader = ({ user, onEditClick }) => (
  <Card className="p-6 mb-8">
    <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
      <div className="flex-shrink-0 mb-4 sm:mb-0">
        <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
          {user?.avatar ? (
            <img className="h-full w-full object-cover" src={user.avatar} alt="Profile" />
          ) : (
            <UserIcon className="h-full w-full text-gray-300" />
          )}
        </span>
      </div>
      <div className="text-center sm:text-left flex-grow">
        <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
        <p className="text-sm text-gray-600">
          {user?.jobTitle && user?.company
            ? `${user.jobTitle} at ${user.company}`
            : user?.jobTitle || user?.company || 'No role provided'}
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button
          variant="outline"
          onClick={onEditClick}
          className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all hover:bg-gray-100 hover:shadow-sm"
        >
          <PencilIcon className="w-4 h-4" />
          Edit Profile
        </Button>

      </div>
    </div>
  </Card>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-sm text-gray-900">{value || 'Not provided'}</p>
  </div>
);

const Alert = ({ type, message }) => {
  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;
  const colors = isSuccess
    ? 'bg-green-50 text-green-800 border-green-200'
    : 'bg-red-50 text-red-800 border-red-200';

  return (
    <div className={`mb-4 p-4 border rounded-md ${colors}`}>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 ${isSuccess ? 'text-green-400' : 'text-red-400'}`} />
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PROFILE PAGE COMPONENT ---

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', company: '', jobTitle: '', bio: '' });

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordInputChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleCancelEdit = () => {
    if (user) setFormData({ ...user, fullName: user.name }); // Reset form
    setIsEditing(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileSuccess(false);
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        dispatch(updateProfileAction(response.data));
        setProfileSuccess(true);
        setIsEditing(false);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    try {
      const response = await changePassword(passwordData);
      if (response.success) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(response.error || 'Failed to change password.');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader />

        {profileSuccess && <Alert type="success" message="Profile updated successfully!" />}

        {!isEditing && <ProfileHeader user={user} onEditClick={() => setIsEditing(true)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- Profile Information Form/Display --- */}
          <Card className="lg:col-span-2">
            <form onSubmit={handleProfileSubmit}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                    <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                    <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
                    <div className="md:col-span-2">
                      <Input label="Company" name="company" value={formData.company} onChange={handleInputChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <InfoRow label="Full Name" value={user?.name} />
                    <InfoRow label="Email Address" value={user?.email} />
                    <InfoRow label="Phone Number" value={user?.phoneNumber} />
                    <InfoRow label="Job Title" value={user?.jobTitle} />
                    <InfoRow label="Company" value={user?.company} />
                    {user?.bio && <div className="md:col-span-2"><InfoRow label="Bio" value={user.bio} /></div>}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              )}
            </form>
          </Card>

          {/* --- Security/Password Card --- */}
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
                <p className="text-sm text-gray-500 mb-6">Update your password here.</p>

                {passwordSuccess && <Alert type="success" message="Password changed successfully!" />}
                {passwordError && <Alert type="error" message={passwordError} />}

                <div className="space-y-4">
                  <Input label="Current Password" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordInputChange} required />
                  <Input label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordInputChange} required />
                  <Input label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} required />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// A more robust Input component example
const RefinedInput = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      {...props}
    />
  </div>
);