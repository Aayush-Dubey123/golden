import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/token';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      // We could parse JWT here to get user info if needed
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.access_token) {
      saveToken(data.access_token);
      setIsAuthenticated(true);
      setUser(data.data);
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authApi.signup(userData);
    if (data.data?.access_token) {
      saveToken(data.data.access_token);
      setIsAuthenticated(true);
      setUser(data.data);
    }
    return data;
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
