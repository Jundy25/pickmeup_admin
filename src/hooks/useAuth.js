// src/hooks/useAuth.js

import { useContext, useCallback, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { isAuthenticated, setIsAuthenticated, userRole, setUserRole, userId, setUserId, loading, setLoading } = context;

  // Check for existing auth state on mount
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id")
      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(parseInt(role));
      }
      if (user_id){
        setUserId(parseInt(user_id))
      }
      setLoading(false);
    };

    checkAuthState();
  }, [setIsAuthenticated, setUserRole, setUserId, setLoading]);

  const login = useCallback((token, role, user_id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", user_id);
    setIsAuthenticated(true);
    setUserRole(parseInt(role));
    setUserId(parseInt(user_id));
  }, [setIsAuthenticated, setUserRole, setUserId]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  }, [setIsAuthenticated, setUserRole, setUserId]);

  return {
    isAuthenticated,
    userRole,
    userId,
    login,
    logout,
    loading
  };
};