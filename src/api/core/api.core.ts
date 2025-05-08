import axios, { AxiosResponse } from 'axios';
import { College } from '../../types/colleges/college.types';
import { redirectToAuth } from '../../utils/routing';
import { NoteFilters } from '../../types/notes/notes.types';
import { showError, showSuccess } from '../../utils/notifications';

/**
 * Base API URL from environment variables with fallback
 * @constant {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Remove console.log for production
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

/**
 * Axios instance configured for the application
 * Includes base configuration for headers and URL
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Credentials disabled to prevent CORS issues with wildcard origins
  // withCredentials: true,
  timeout: 15000, // 15 second timeout
});

/**
 * List of authentication-related endpoints that should skip redirect
 */
const AUTH_ENDPOINTS = [
  '/api/users/token/',
  '/api/users/token/refresh/',
  '/api/token/',
  '/api/token/refresh/',
  '/api/auth/token/',
  '/api/auth/token/refresh/',
  '/api/auth/login/',
  '/api/users/login/'
];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  () => {
    showError('Failed to prepare request');
    return Promise.reject(new Error('Request preparation failed'));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      showError('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && 
        !AUTH_ENDPOINTS.some(endpoint => error.config.url?.includes(endpoint))) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      redirectToAuth();
    }

    // Handle other common errors
    if (error.response.status === 403) {
      showError('You do not have permission to perform this action');
    } else if (error.response.status === 404) {
      showError('The requested resource was not found');
    } else if (error.response.status >= 500) {
      showError('Server error. Please try again later');
    }

    return Promise.reject(error);
  }
);

// Type definitions
interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

interface UpdateProfileData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

/**
 * Authentication related API endpoints
 */
export const auth = {
  /**
   * Register a new user
   */
  register: (data: RegisterData) => api.post('/api/users/register/', data),
  
  /**
   * Enhanced login function with multiple authentication attempts
   * Tries different credential formats and falls back to fetch if needed
   */
  login: async (data: LoginData) => {
    const attempts = [
      // Username-based login
      async () => {
        if (data.username) {
          return await api.post('/api/users/token/', { 
            username: data.username,
            password: data.password
          });
        }
        throw new Error('No username provided');
      },
      
      // Email-based login
      async () => {
        if (data.email) {
          return await api.post('/api/users/token/', { 
            email: data.email,
            password: data.password 
          });
        }
        throw new Error('No email provided');
      },
      
      // Minimal credentials login
      async () => {
        const credentials = {
          username: data.username || data.email,
          password: data.password
        };
        return await api.post('/api/users/token/', credentials);
      },
      
      // Fallback to fetch API
      async () => {
        const fetchResponse = await fetch(`${API_BASE_URL}/api/users/token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username || data.email,
            password: data.password
          }),
        });
        
        if (!fetchResponse.ok) {
          const errorText = await fetchResponse.text();
          throw new Error(`Login failed: ${fetchResponse.status} ${errorText}`);
        }
        
        const tokenData = await fetchResponse.json();
        
        return {
          data: tokenData,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: Object.fromEntries(fetchResponse.headers.entries()),
          config: {},
        } as AxiosResponse;
      }
    ];

    for (const attempt of attempts) {
      try {
        return await attempt();
      } catch {
        // Continue to next attempt
        continue;
      }
    }
    
    throw new Error('All login attempts failed');
  },
  
  refreshToken: (refresh: string) => api.post('/api/users/token/refresh/', { refresh }),
  logout: () => api.post('/api/users/logout/'),
  
  /**
   * Get current user information with fallback auth methods
   * Tries Bearer token first, then falls back to Token auth
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      // Try Bearer auth (JWT)
      return await axios.get(`${API_BASE_URL}/api/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    } catch {
      // Fallback to Token auth
      try {
        return await axios.get(`${API_BASE_URL}/api/users/me/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });
      } catch (tokenError) {
        showError('Failed to get user information');
        throw tokenError;
      }
    }
  },
  
  updateProfile: (data: UpdateProfileData) => api.patch('/api/users/profile/update/', data),
  changePassword: (data: ChangePasswordData) => api.post('/api/users/change-password/', data),
  resetPassword: (email: string) => api.post('/api/users/reset-password/', { email }),
  verifyEmail: (token: string) => api.post('/api/users/verify-email/', { token }),
  resendVerification: () => api.post('/api/users/resend-verification/'),
};

/**
 * Notes-related API endpoints
 */
export const notes = {
  getAll: (page = 1, filters?: NoteFilters) => api.get('/api/notes/', { 
    params: { page, ...filters } 
  }),
  getById: (id: number) => api.get(`/api/notes/${id}/`),
  create: (data: FormData) => api.post('/api/notes/', data),
  update: (id: number, data: FormData) => api.put(`/api/notes/${id}/`, data),
  delete: (id: number) => api.delete(`/api/notes/${id}/`),
  getPrograms: () => api.get('/api/notes/programs/'),
  getByProgram: (programId: number, page = 1) => api.get('/api/notes/', {
    params: { program_id: programId, page }
  }),
  getProgramSubjects: (programId: number, semester?: number) => api.get('/api/notes/subjects_by_program/', {
    params: { program_id: programId, semester }
  }),
  getBySubject: (subjectId: number) => api.get('/api/notes/by-subject/', {
    params: { subject_id: subjectId }
  })
};

/**
 * Question Papers API endpoints
 */
export const questionPapers = {
  getAll: () => api.get('/api/question-papers/papers/'),
  getById: (id: number) => api.get(`/api/question-papers/papers/${id}/`),
  getQuestionPapers: (id: number) => api.get(`/api/question-papers/papers/${id}/papers/`),
  getPrograms: () => api.get('/api/question-papers/programs/'),
  getByProgram: (programId: number) => api.get(`/api/question-papers/programs/${programId}/subjects/`),
  getBySubject: (subjectId: number, year?: number) => api.get(`/api/question-papers/papers/by-subject/`, {
    params: { subject_id: subjectId, year }
  })
};

/**
 * Resources API endpoints
 */
export const resources = {
  getAll: () => api.get('/api/resources/'),
  getById: (id: number) => api.get(`/api/resources/${id}/`),
  create: (data: FormData) => api.post('/api/resources/', data),
  update: (id: number, data: FormData) => api.put(`/api/resources/${id}/`, data),
  delete: (id: number) => api.delete(`/api/resources/${id}/`),
};

/**
 * College management API endpoints
 */
export const collegeService = {
  getAll: (): Promise<AxiosResponse<College[]>> => api.get('/api/colleges/'),
  getById: (id: string): Promise<AxiosResponse<College>> => api.get(`/api/colleges/${id}/`),
  create: (data: College): Promise<AxiosResponse<College>> => api.post('/api/colleges/', data),
  update: (id: string, data: Partial<College>): Promise<AxiosResponse<College>> => 
    api.put(`/api/colleges/${id}/`, data),
  delete: (id: string): Promise<AxiosResponse<void>> => api.delete(`/api/colleges/${id}/`),
};

/**
 * Syllabus API endpoints
 */
export const syllabus = {
  getBySubject: (subjectId: number) => api.get(`/api/syllabus/by-subject/`, {
    params: { subject_id: subjectId }
  }),
  incrementView: (syllabusId: number) => api.post(`/api/syllabus/${syllabusId}/increment_view/`),
  download: (syllabusId: number) => api.get(`/api/syllabus/${syllabusId}/download/`)
};

/**
 * Test API connectivity
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const testConnection = async () => {
  try {
    const response = await api.get('/');
    showSuccess('API connection successful');
    return { success: true, data: response.data };
  } catch {
    showError('Failed to connect to API');
    return { success: false, error: 'Connection failed' };
  }
};

/**
 * Discover available API endpoints
 * Attempts to fetch API documentation from root and fallback endpoints
 * @returns {Promise<{success: boolean, endpoints?: any, error?: any}>}
 */
export const discoverEndpoints = async () => {
  try {
    const response = await api.get('/');
    return { success: true, endpoints: response.data };
  } catch {
    try {
      const apiResponse = await api.get('/api/');
      return { success: true, endpoints: apiResponse.data };
    } catch {
      showError('Failed to discover API endpoints');
      return { success: false, error: 'Failed to discover endpoints' };
    }
  }
};

export default api;