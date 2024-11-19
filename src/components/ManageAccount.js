import React, { useState, useEffect } from 'react';
import Header from './parts/Header';
import Sidenav from './parts/Sidenav';
import { useAuth } from '../hooks/useAuth';
import userService from '../services';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManageAccount = () => {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [initialData, setInitialData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    email: '',
    user_name: '',
    mobile_number: ''
  });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    email: '',
    user_name: '',
    mobile_number: ''
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const user = await userService.fetchAdminById(userId);
        console.log(user)
        
        if (user.message === 'Account Disabled') {
          setNotification({
            type: 'error',
            message: 'Your account has been disabled. Contact SuperAdmin for more info.'
          });
          return;
        }

        const userData = {
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          gender: user.gender,
          date_of_birth: user.date_of_birth,
          email: user.email,
          mobile_number: user.mobile_number,
          // profile_picture: user.profile_picture
        };

        setInitialData(userData);
        setFormData(userData);
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

    if (!formData.user_name) newErrors.user_name = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
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
      if (file.size > 2 * 1024 * 1024) {
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

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);
        // Assume updateAccount is the method to update user data
        await userService.updateAccount(userId, formData);
        setMessage("Account updated successfully.");
        setIsEditMode(false);
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to update account. Try again later.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidenav />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="overflow-y-auto p-4">
          <div className="flex-grow flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">Manage Account</h2>

              {message && <div className="mb-4 text-green-600 text-center">{message}</div>}

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mb-2"
                  disabled={!isEditMode}
                />
                {profilePreview && (
                  <img src={profilePreview} alt="Profile Preview" className="h-32 w-32 rounded-full mb-4 mx-auto" />
                )}
              </div>

              <div className="flex mb-4">
                <div className="flex-1 mr-2">
                  <label className="block text-gray-700">First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                    disabled={!isEditMode}
                  />
                  {errors.first_name && <div className="text-red-500">{errors.first_name}</div>}
                </div>
                <div className="flex-1 ml-2">
                  <label className="block text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                    disabled={!isEditMode}
                  />
                  {errors.last_name && <div className="text-red-500">{errors.last_name}</div>}
                </div>
              </div>

              <div className="flex mb-4">
                <div className="flex-1 mr-2">
                  <label className="block text-gray-700">Username:</label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                    disabled={!isEditMode}
                  />
                  {errors.user_name && (
                    <div className="text-red-500">{errors.user_name}</div>
                  )}
                </div>
                <div className="flex-1 ml-2">
                  <label className="block text-gray-700">Gender:</label>
                  <select
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                    disabled={!isEditMode}
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <div className="text-red-500">{errors.gender}</div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date of Birth:</label>
                <DatePicker
                  selected={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="border rounded w-full py-2 px-3 text-gray-700"
                />
                {errors.date_of_birth && (
                  <div className="text-red-500">{errors.date_of_birth}</div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:ring focus:ring-indigo-200"
                  disabled={!isEditMode}
                />
                {errors.email && <div className="text-red-500">{errors.email}</div>}
              </div>

              {isEditMode ? (
                <button
                  className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors w-full"
                  onClick={handleSave}
                >
                  Save
                </button>
              ) : (
                <button
                  className="bg-yellow-500 text-white py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors w-full"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
