import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as Storage from '../utils/storage';
import { loginUser, registerUser, logoutUser } from '../api/auth';
import { getMe } from '../api/profile';
import { setForceLogoutHandler } from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register force-logout handler so the axios interceptor
  // can clear user state when refresh token fails
  const forceLogout = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    setForceLogoutHandler(forceLogout);
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await Storage.getItemAsync('access_token');
      if (token) {
        const res = await getMe();
        setUser(res.data);
      }
    } catch (e) {
      // Token invalid or refresh failed — interceptor already cleared storage
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    await Storage.setItemAsync('access_token', res.data.access);
    await Storage.setItemAsync('refresh_token', res.data.refresh);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email, password, confirm_password, role) => {
    const res = await registerUser({ email, password, confirm_password, role });
    await Storage.setItemAsync('access_token', res.data.access);
    await Storage.setItemAsync('refresh_token', res.data.refresh);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      const refresh = await Storage.getItemAsync('refresh_token');
      if (refresh) await logoutUser(refresh);
    } catch (e) {
      // Logout API may fail if token expired — that's ok
    }
    await Storage.deleteItemAsync('access_token');
    await Storage.deleteItemAsync('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
