import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/token';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('golden_kulcha_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.access_token || data.data?.access_token) {
      const token = data.access_token || data.data.access_token;
      saveToken(token);
      setIsAuthenticated(true);
      const userData = data.data || {};
      setUser(userData);
      try {
        localStorage.setItem('golden_kulcha_user', JSON.stringify(userData));
      } catch (e) {
        console.error('Failed to save user in localStorage', e);
      }
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await authApi.signup(userData);
    if (data.data?.access_token) {
      saveToken(data.data.access_token);
      setIsAuthenticated(true);
      const uData = data.data;
      setUser(uData);
      try {
        localStorage.setItem('golden_kulcha_user', JSON.stringify(uData));
      } catch (e) {
        console.error('Failed to save user in localStorage', e);
      }
    }
    return data;
  };

  const demoLogin = async (role) => {
    const data = await authApi.demoLogin(role);
    if (data.access_token || data.data?.access_token) {
      const token = data.access_token || data.data.access_token;
      saveToken(token);
      setIsAuthenticated(true);
      const userData = data.data || {};
      setUser(userData);
      try {
        localStorage.setItem('golden_kulcha_user', JSON.stringify(userData));
      } catch (e) {
        console.error('Failed to save user in localStorage', e);
      }
    }
    return data;
  };

  const logout = () => {
    removeToken();
    try {
      localStorage.removeItem('golden_kulcha_user');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, signup, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
