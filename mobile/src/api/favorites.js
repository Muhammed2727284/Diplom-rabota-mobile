import api from './client';

export const getFavorites = (params) => api.get('/favorites/', { params });
export const toggleFavorite = (data) => api.post('/favorites/toggle/', data);
export const removeFavorite = (id) => api.delete(`/favorites/${id}/`);
