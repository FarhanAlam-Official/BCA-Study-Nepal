import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import authService from '../../services/auth/auth.service';
import { showError } from '../../utils/notifications';

/**
 * Base API URL for the backend server
 * Change this value according to your environment (development, staging, production)
 */
const API_URL = 'http://localhost:8000/api';

/**
 * Type definition for API error response
 */
interface ApiErrorResponse {
  message?: string;
  detail?: string;
}

/**
 * Axios instance configuration with default settings
 * - Sets base URL for all requests
 * - Configures default headers
 * - Enables credentials for CSRF token support
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for CSRF token support with Django backend
});

/**
 * Request Interceptor
 * Automatically adds authentication token to all outgoing requests
 * Handles token injection and request preprocessing
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles API response processing and error cases
 * Implements automatic token refresh on 401 (Unauthorized) responses
 * Manages authentication state and error notifications
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle unauthorized errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await authService.refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        showError('Session expired. Please log in again.');
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other API errors
    showError(
      error.response?.data?.message || 
      error.response?.data?.detail ||
      'An error occurred while processing your request.'
    );
    return Promise.reject(error);
  }
);

export default apiClient;