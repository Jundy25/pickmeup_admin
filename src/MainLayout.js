// src/layouts/MainLayout.js
import React from "react";
import Sidenav from "../components/Sidenav"; // Adjust the path as necessary

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidenav />

      {/* Main content area */}
      <div className="flex-grow ml-64 p-4">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;