/**
 * API Configuration and Endpoints
 * Centralizes API configuration and provides pre-configured axios instance
 * with authentication and common endpoint methods.
 */

import axios from 'axios';

/**
 * Pre-configured axios instance with base configuration
 * - Base URL set to local API endpoint
 * - Default headers for JSON content
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for authentication
 * Automatically adds Bearer token to requests if available in localStorage
 */
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

/**
 * Fetches list of colleges from the API
 * @returns Promise with colleges data
 */
export const fetchColleges = () => api.get('/colleges/');

/**
 * Fetches list of study notes from the API
 * @returns Promise with notes data
 */
export const fetchNotes = () => api.get('/notes/');

/**
 * Fetches list of events from the API
 * @returns Promise with events data
 */
export const fetchEvents = () => api.get('/events/');

/**
 * Fetches list of question papers from the API
 * @returns Promise with question papers data
 */
export const fetchQuestionPapers = () => api.get('/question-papers/');

export default api;