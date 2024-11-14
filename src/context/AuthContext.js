// src/context/AuthContext.js

import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSideBarMenuOpen, setIsSideBarMenuOpen] = React.useState(false);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        userId,
        setUserId,
        userStatus,
        setUserStatus,
        loading,
        setLoading,
        isSideBarMenuOpen,
        setIsSideBarMenuOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
