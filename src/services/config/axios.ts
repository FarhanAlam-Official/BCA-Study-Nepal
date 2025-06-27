/**
 * Axios Configuration Module
 * This module sets up a configured axios instance with interceptors for authentication and error handling.
 */

import axios, { AxiosError } from 'axios';
import { redirectToAuth } from '../../utils/routing';

// Type declaration to support retry functionality in axios requests
declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * Interface for standardized error responses from the API
 */
interface ErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

// API base URL configuration with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Create a pre-configured axios instance with base URL and default headers
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds the authentication token to all outgoing requests if available
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Handles common API response scenarios:
 * - Rate limiting (429)
 * - Authentication errors (401)
 * - Generic error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = `Too many requests. Please try again ${
        retryAfter ? `in ${retryAfter} seconds` : 'later'
      }.`;
      return Promise.reject(new Error(message));
    }

    // Handle authentication errors with retry mechanism
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        return api(originalRequest);
      } catch (refreshError) {
        // Clear authentication and redirect to login on refresh failure
        localStorage.removeItem('access_token');
        redirectToAuth();
        return Promise.reject(refreshError);
      }
    }

    // Standardize error messages
    const errorMessage = error.response?.data?.detail || error.message || 'An unknown error occurred.';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
