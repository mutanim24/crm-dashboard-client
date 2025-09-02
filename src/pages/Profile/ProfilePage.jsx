import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { updateProfile, changePassword } from '../../services/api';
import { updateProfile as updateProfileAction } from '../../store/authSlice';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    // Clear any previous errors
    setPasswordError('');
    setLoading(true);
    
    try {
      // Change password in backend
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        // Clear form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setPasswordSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        // Handle API error
        setPasswordError(response.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    // Clear form and errors when toggling
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update profile in backend
      const response = await updateProfile(formData);
      
      // Update user in Redux store
      if (response.success) {
        // Update Redux store with new profile data
        dispatch(updateProfileAction(response.data));
        
        setSuccess(true);
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // Handle API error
        console.error('Error updating profile:', response.error);
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error: ${error.response?.data?.error || 'Failed to update profile'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Profile updated successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          <Card className="overflow-hidden">
            <div className="px-6 py-8">
              {/* Header with name and edit button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.fullName || 'Your Name'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {formData.jobTitle && formData.company 
                      ? `${formData.jobTitle} at ${formData.company}`
                      : formData.jobTitle || formData.company || ''}
                  </p>
                </div>
                
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="mt-4 sm:mt-0"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Bio Section */}
              {formData.bio && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                  <p className="text-gray-700">{formData.bio}</p>
                </div>
              )}

              {/* Form or Display Section */}
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <Input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          placeholder="Enter your job title"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <Input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Enter your company"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-6"
                      >
                        {loading ? 'Saving...' : 'Save Profile'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.fullName || 'Not provided'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.email || 'Not provided'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.phoneNumber || 'Not provided'}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Job Title</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.jobTitle || 'Not provided'}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Company</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.company || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={togglePasswordChange}
                        className="text-sm"
                      >
                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                      </Button>
                    </div>

                    {isChangingPassword && (
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {/* Password Success Message */}
                        {passwordSuccess && (
                          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                  Password changed successfully!
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Password Error Message */}
                        {passwordError && (
                          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">
                                  {passwordError}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <Input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="Enter current password"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <Input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="Enter new password"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <Input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              placeholder="Confirm new password"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="px-6"
                          >
                            {loading ? 'Changing...' : 'Change Password'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
