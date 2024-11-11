import React, { useState, useEffect } from 'react';
import Header from './parts/Header';
import Sidenav from './parts/Sidenav';
import { useAuth } from '../hooks/useAuth';
import userService from '../services';

const ManageAccount = () => {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [initialData, setInitialData] = useState({
    user_name: '',
    email: '',
    // profile_picture: null
  });
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    // profilePicture: null
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await userService.fetchAdminById(userId);
        
        if (user.message === 'Account Disabled') {
          setNotification({
            type: 'error',
            message: 'Your account has been disabled. Contact SuperAdmin for more info.'
          });
          return;
        }

        const userData = {
          user_name: user.user_name,
          email: user.email,
          // profile_picture: user.profile_picture
        };

        setInitialData(userData);
        setFormData(prev => ({
          ...prev,
          ...userData
        }));

        if (user.profile_picture) {
          setProfilePreview(user.profile_picture);
        }
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to fetch user data. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_name) {
      newErrors.user_name = 'Username is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required when changing password';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setNotification({
          type: 'error',
          message: 'Profile picture must be less than 2MB'
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    try {
        setIsLoading(true);
        const formDataToSend = new FormData();
        let hasChanges = false;

        // Check for actual changes and append only changed values
        if (formData.user_name && formData.user_name !== initialData.user_name) {
            formDataToSend.append('user_name', formData.user_name);
            hasChanges = true;
        }

        if (formData.email && formData.email !== initialData.email) {
            formDataToSend.append('email', formData.email);
            hasChanges = true;
        }
        
        if (formData.newPassword) {
            formDataToSend.append('currentPassword', formData.currentPassword);
            formDataToSend.append('newPassword', formData.newPassword);
            formDataToSend.append('newPassword_confirmation', formData.confirmPassword);
            hasChanges = true;
        }

        // If no changes, show message and return early
        if (!hasChanges) {
            setNotification({
                type: 'info',
                message: 'No changes detected'
            });
            setIsLoading(false);
            return;
        }

        const response = await userService.updateAccount(userId, formDataToSend);
        
        // Handle the response based on status
        if (response.status === 304) {
            setNotification({
                type: 'info',
                message: response.message
            });
        } else {
            setNotification({
                type: 'success',
                message: response.message || 'Profile updated successfully!'
            });
            
            // Update initial data with new values
            if (response.user) {
                setInitialData({
                    user_name: response.user.user_name,
                    email: response.user.email
                });
                
                // Update form data to match new values
                setFormData(prev => ({
                    ...prev,
                    user_name: response.user.user_name,
                    email: response.user.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        }

    } catch (error) {
        console.error('Submit error:', error);
        setNotification({
            type: 'error',
            message: error.message || 'An error occurred while updating your profile.'
        });
    } finally {
        setIsLoading(false);
    }
};

  if (isLoading && !formData.user_name) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="z-[9999]">
        <Sidenav />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <div className="overflow-y-auto p-4">
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">Manage Account</h2>

              {notification.message && (
                <div className={`mb-4 p-4 rounded ${
                  notification.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {notification.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full p-2 border rounded"
                  />
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      className="h-32 w-32 rounded-full mt-4 mx-auto object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  />
                  {errors.user_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full p-3 rounded text-white ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;