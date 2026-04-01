import api from './client';

export const getVacancies = (params) => api.get('/vacancies/', { params });
export const getVacancyDetail = (id) => api.get(`/vacancies/${id}/`);
export const createVacancy = (data) => api.post('/vacancies/create/', data);
export const updateVacancy = (id, data) => api.patch(`/vacancies/${id}/edit/`, data);
export const deleteVacancy = (id) => api.delete(`/vacancies/${id}/delete/`);
export const getMyVacancies = () => api.get('/my/vacancies/');
