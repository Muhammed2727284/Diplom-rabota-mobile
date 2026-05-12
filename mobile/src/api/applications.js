import api from './client';

export const applyToVacancy = (vacancyId, data) =>
  api.post(`/vacancies/${vacancyId}/apply/`, data);
export const getMyApplications = () => api.get('/my/applications/');
export const getVacancyApplications = (vacancyId) =>
  api.get(`/my/vacancies/${vacancyId}/applications/`);
export const updateApplicationStatus = (id, data) =>
  api.patch(`/applications/${id}/status/`, data);

export const inviteToResume = (resumeId, data) =>
  api.post(`/resumes/${resumeId}/invite/`, data);
export const getMyInvitations = () => api.get('/my/invitations/');
export const getVacancyInvitations = (vacancyId) =>
  api.get(`/my/vacancies/${vacancyId}/invitations/`);
export const updateInvitationStatus = (id, data) =>
  api.patch(`/invitations/${id}/status/`, data);
