import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchColleges = () => api.get('/colleges/');
export const fetchNotes = () => api.get('/notes/');
export const fetchEvents = () => api.get('/events/');
export const fetchQuestionPapers = () => api.get('/question-papers/');

export default api;