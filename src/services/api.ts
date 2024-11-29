// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add token to requests if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const collegeService = {
//   getAll: () => api.get('/colleges/'),
//   getById: (id: string) => api.get(`/colleges/${id}/`),
//   create: (data: any) => api.post('/colleges/', data),
//   update: (id: string, data: any) => api.put(`/colleges/${id}/`, data),
//   delete: (id: string) => api.delete(`/colleges/${id}/`),
// };

// export const noteService = {
//   getAll: () => api.get('/notes/'),
//   getBySemester: (semester: number) => api.get(`/notes/by_semester/?semester=${semester}`),
//   create: (data: FormData) => api.post('/notes/', data),
//   delete: (id: string) => api.delete(`/notes/${id}/`),
// };

// export const eventService = {
//   getAll: () => api.get('/events/'),
//   register: (id: string) => api.post(`/events/${id}/register/`),
// };

// export const questionPaperService = {
//   getAll: () => api.get('/question-papers/'),
//   getByYear: (year: number) => api.get(`/question-papers/by_year/?year=${year}`),
// };

// export const authService = {
//   login: (username: string, password: string) => 
//     api.post('/token/', { username, password }),
//   refreshToken: (refresh: string) => 
//     api.post('/token/refresh/', { refresh }),
// };

// export default api;