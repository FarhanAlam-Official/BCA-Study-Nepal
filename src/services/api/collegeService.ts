import api from '../config/axios';
import { safeRequest } from '../utils/apiUtils';
import { College } from '../types';

export const collegeService = {
  getAll: () => safeRequest<College[]>(() => api.get('/colleges/')),
  getById: (id: string) => safeRequest<College>(() => api.get(`/colleges/${id}/`)),
  create: (data: College) => safeRequest<College>(() => api.post('/colleges/', data)),
  update: (id: string, data: College) => safeRequest<College>(() => api.put(`/colleges/${id}/`, data)),
  delete: (id: string) => safeRequest<void>(() => api.delete(`/colleges/${id}/`)),
};