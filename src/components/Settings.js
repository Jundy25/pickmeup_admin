import React, { useState } from "react";
import Header from "./parts/Header";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    // Save settings logic
    setMessage("Settings saved!");
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Display preview
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Settings</h2>

          {message && (
            <div className="mb-4 text-green-600 text-center">{message}</div>
          )}

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="profile-picture"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mb-2"
            />
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile Preview"
                className="h-32 w-32 rounded-full mb-4 mx-auto"
              />
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <span className="ml-2 text-gray-700">Enable Notifications</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Current Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="theme">
              Theme
            </label>
            <select
              id="theme"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="language">
              Language
            </label>
            <select
              id="language"
              className="w-full p-3 border rounded-md focus:ring focus:ring-indigo-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* Add more languages as needed */}
            </select>
          </div>

          <button
            className="bg-indigo-500 text-white py-3 px-6 rounded-md hover:bg-indigo-600 transition-colors w-full"
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
