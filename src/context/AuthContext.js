// src/context/AuthContext.js

import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
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
