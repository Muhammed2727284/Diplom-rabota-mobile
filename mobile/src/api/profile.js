import api from './client';

export const getMe = () => api.get('/me/');
export const updateMe = (data) => api.patch('/me/', data);
export const getMyProfile = () => api.get('/me/profile/');
export const updateMyProfile = (data) => api.patch('/me/profile/', data);
export const getMyOrganization = () => api.get('/me/organization/');
export const updateMyOrganization = (data) => api.patch('/me/organization/', data);
