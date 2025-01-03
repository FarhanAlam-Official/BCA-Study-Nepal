import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { College, Note, QuestionPaper, AuthResponse, Event } from './types/types';

const API_URL = 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const collegeService = {
  getAll: (): Promise<AxiosResponse<College[]>> => api.get('/colleges/'),
  getById: (id: string): Promise<AxiosResponse<College>> =>
    api.get(`/colleges/${id}/`),
  create: (data: College): Promise<AxiosResponse<College>> =>
    api.post('/colleges/', data),
  update: (id: string, data: Partial<College>): Promise<AxiosResponse<College>> =>
    api.put(`/colleges/${id}/`, data),
  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/colleges/${id}/`),
};

export const noteService = {
  getAll: (): Promise<AxiosResponse<Note[]>> => api.get('/notes/'),
  getBySemester: (semester: number): Promise<AxiosResponse<Note[]>> =>
    api.get(`/notes/by_semester/?semester=${semester}`),
  create: (data: FormData): Promise<AxiosResponse<Note>> =>
    api.post('/notes/', data),
  delete: (id: string): Promise<AxiosResponse<void>> =>
    api.delete(`/notes/${id}/`),
  download: async (fileUrl: string): Promise<void> => {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};

export const questionPaperService = {
  getAll: (): Promise<AxiosResponse<QuestionPaper[]>> => api.get('/question-papers/'),
  getByYear: (year: number): Promise<AxiosResponse<QuestionPaper[]>> =>
    api.get(`/question-papers/by_year/?year=${year}`),
  download: async (fileUrl: string): Promise<void> => {
    try {
      const response = await axios.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};

export const eventService = {
  getAll: (): Promise<AxiosResponse<Event[]>> => api.get('/events/'),
  register: (id: string): Promise<AxiosResponse<void>> =>
    api.post(`/events/${id}/register/`),
};

export const authService = {
  login: (username: string, password: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/token/', { username, password }),
  refreshToken: (refresh: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/token/refresh/', { refresh }),
};

export default api;
