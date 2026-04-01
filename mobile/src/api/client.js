import axios from 'axios';
import * as Storage from '../utils/storage';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Logout handler — AuthContext registers a callback here
// so the interceptor can force-logout when refresh fails
let _onForceLogout = null;
export const setForceLogoutHandler = (handler) => {
  _onForceLogout = handler;
};

// Refresh token lock — prevents multiple concurrent 401s
// from each trying to refresh independently (race condition)
let _refreshPromise = null;

const doRefresh = async () => {
  const refresh = await Storage.getItemAsync('refresh_token');
  if (!refresh) throw new Error('No refresh token');
  const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh });
  // ROTATE_REFRESH_TOKENS=True: server returns new access AND new refresh
  await Storage.setItemAsync('access_token', res.data.access);
  if (res.data.refresh) {
    await Storage.setItemAsync('refresh_token', res.data.refresh);
  }
  return res.data.access;
};

api.interceptors.request.use(async (config) => {
  const token = await Storage.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // If a refresh is already in progress, wait for it
        if (!_refreshPromise) {
          _refreshPromise = doRefresh().finally(() => {
            _refreshPromise = null;
          });
        }
        const newAccess = await _refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        _refreshPromise = null;
        await Storage.deleteItemAsync('access_token');
        await Storage.deleteItemAsync('refresh_token');
        if (_onForceLogout) _onForceLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
