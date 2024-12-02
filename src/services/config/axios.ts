import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig to include `_retry`
declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
  }
}

interface ErrorResponse {
  detail?: string;
  [key: string]: unknown; // Allow additional fields in the response
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = `Too many requests. Please try again ${
        retryAfter ? `in ${retryAfter} seconds` : 'later'
      }.`;
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Handle token refresh here if needed
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.detail || error.message || 'An unknown error occurred.';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
