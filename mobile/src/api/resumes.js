import api from './client';

export const getResumes = (params) => api.get('/resumes/', { params });
export const getResumeDetail = (id) => api.get(`/resumes/${id}/`);
export const createResume = (data) => api.post('/resumes/create/', data);
export const updateResume = (id, data) => api.patch(`/resumes/${id}/edit/`, data);
export const deleteResume = (id) => api.delete(`/resumes/${id}/delete/`);
export const getMyResumes = () => api.get('/my/resumes/');
