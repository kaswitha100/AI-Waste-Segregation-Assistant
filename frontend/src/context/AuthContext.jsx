import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('waste_ai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('waste_ai_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('waste_ai_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
          localStorage.setItem('waste_ai_user', JSON.stringify(res.data));
        } catch (err) {
          if (err?.response?.status === 401) {
            console.warn('[AuthContext] Session expired.');
            logout();
          } else {
            console.warn('[AuthContext] Backend offline or sleeping; retaining cached session.');
          }
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('waste_ai_token', access_token);
    localStorage.setItem('waste_ai_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('waste_ai_token', access_token);
    localStorage.setItem('waste_ai_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('waste_ai_token');
    localStorage.removeItem('waste_ai_user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('waste_ai_user', JSON.stringify(userData));
  };

  const addEcoPoints = (points) => {
    if (user) {
      const updated = {
        ...user,
        eco_points: (user.eco_points || 0) + points,
        scans_count: (user.scans_count || 0) + 1
      };
      updateUser(updated);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    addEcoPoints,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
