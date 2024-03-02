import axios, { AxiosResponse } from 'axios';
import { College } from './types/types';
import { redirectToAuth } from '../utils/routing';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't include credentials by default - this causes CORS issues with wildcard origins
  // withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('access_token');
    console.log(`API Request to ${config.url}:`, config.data);
    
    if (token) {
      // Use Bearer token authentication - Django REST with JWT
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Comment out Token authentication since we're using JWT
      // config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response ? {
      url: error.config?.url,
      status: error.response.status,
      data: error.response.data
    } : error);
    
    // Skip redirects for auth-related endpoints
    const authEndpoints = [
      '/api/users/token/',
      '/api/users/token/refresh/',
      '/api/token/',
      '/api/token/refresh/',
      '/api/auth/token/',
      '/api/auth/token/refresh/',
      '/api/auth/login/',
      '/api/users/login/'
    ];
    
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401 && 
        !authEndpoints.some(endpoint => error.config.url?.includes(endpoint))) {
      // Redirect to auth page instead of login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      redirectToAuth();
    }
    return Promise.reject(error);
  }
);

// User interfaces
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

// Auth endpoints
export const auth = {
  register: (data: RegisterData) => api.post('/api/users/register/', data),
  
  // Enhanced login function with raw fetch fallback
  login: async (data: LoginData) => {
    console.log('Starting login process with:', data);
    
    // First try all regular axios approaches
    try {
      // Try different credential formats since Django backends can vary
      const formatsTried: string[] = [];
      
      // First try with username+password (most common)
      if (data.username) {
        try {
          console.log('Trying login with username field');
          formatsTried.push('username');
          const response = await api.post('/api/users/token/', { 
            username: data.username,
            password: data.password
          });
          return response;
        } catch (error) {
          console.log('Username login failed:', error);
        }
      }
      
      // Next try with email+password
      if (data.email) {
        try {
          console.log('Trying login with email field');
          formatsTried.push('email');
          const response = await api.post('/api/users/token/', { 
            email: data.email,
            password: data.password 
          });
          return response;
        } catch (error) {
          console.log('Email login failed:', error);
        }
      }
      
      // Finally try with only the essential fields
      try {
        console.log('Trying login with minimal fields');
        formatsTried.push('minimal');
        
        // Use email as username if username is not provided
        const credentials = {
          username: data.username || data.email,
          password: data.password
        };
        
        const response = await api.post('/api/users/token/', credentials);
        return response;
      } catch (axiosError) {
        console.log('All axios login attempts failed, trying direct fetch', axiosError);
        
        // If all axios approaches fail, try with raw fetch
        // This bypasses axios interceptors which might be interfering
        const baseUrl = API_BASE_URL;
        const fetchResponse = await fetch(`${baseUrl}/api/users/token/`, {
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
          console.error('Fetch login failed:', errorText);
          throw new Error(`Login failed: ${fetchResponse.status} ${errorText}`);
        }
        
        const tokenData = await fetchResponse.json();
        console.log('Fetch login succeeded:', tokenData);
        
        // Convert to axios response format
        return {
          data: tokenData,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: Object.fromEntries(fetchResponse.headers.entries()),
          config: {},
        } as AxiosResponse;
      }
    } catch (error) {
      console.error(`All login formats failed. Last error:`, error);
      throw error;
    }
  },
  
  refreshToken: (refresh: string) => api.post('/api/users/token/refresh/', { refresh }),
  logout: () => api.post('/api/users/logout/'),
  
  // getCurrentUser now tries both Token and Bearer auth if needed
  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return Promise.reject(new Error('No token found'));
    
    try {
      // Try with Bearer auth for JWT first
      const response = await axios.get(`${API_BASE_URL}/api/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response;
    } catch (error) {
      console.log('Bearer auth failed, trying Token auth:', error);
      
      // If Bearer auth fails, try Token auth
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/me/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          }
        });
        return response;
      } catch (tokenError) {
        console.error('Both auth methods failed:', tokenError);
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

// Notes endpoints
export const notes = {
  getAll: (page = 1) => api.get('/api/notes/', { params: { page } }),
  getById: (id: number) => api.get(`/api/notes/${id}/`),
  create: (data: FormData) => api.post('/api/notes/', data),
  update: (id: number, data: FormData) => api.put(`/api/notes/${id}/`, data),
  delete: (id: number) => api.delete(`/api/notes/${id}/`),
};

// Subjects endpoints
export const subjects = {
  getAll: () => api.get('/api/subjects/'),
  getById: (id: number) => api.get(`/api/subjects/${id}/`),
  getQuestionPapers: (id: number) => api.get(`/api/subjects/${id}/papers/`),
};

// Resources endpoints
export const resources = {
  getAll: () => api.get('/api/resources/'),
  getById: (id: number) => api.get(`/api/resources/${id}/`),
  create: (data: FormData) => api.post('/api/resources/', data),
  update: (id: number, data: FormData) => api.put(`/api/resources/${id}/`, data),
  delete: (id: number) => api.delete(`/api/resources/${id}/`),
};

export const collegeService = {
  getAll: (): Promise<AxiosResponse<College[]>> => api.get('/api/colleges/'),
  getById: (id: string): Promise<AxiosResponse<College>> => api.get(`/api/colleges/${id}/`),
  create: (data: College): Promise<AxiosResponse<College>> => api.post('/api/colleges/', data),
  update: (id: string, data: Partial<College>): Promise<AxiosResponse<College>> => 
    api.put(`/api/colleges/${id}/`, data),
  delete: (id: string): Promise<AxiosResponse<void>> => api.delete(`/api/colleges/${id}/`),
};

// Add a test connection function
export const testConnection = async () => {
  try {
    // Try a simple GET request to check if the API is available
    const response = await api.get('/');
    console.log('API connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error };
  }
};

// Function to discover available endpoints
export const discoverEndpoints = async () => {
  try {
    // Try to get the API root to discover endpoints
    const response = await api.get('/');
    console.log('Available API endpoints:', response.data);
    return { success: true, endpoints: response.data };
  } catch (error) {
    console.error('Failed to discover API endpoints:', error);
    
    // Try alternatives
    try {
      const apiResponse = await api.get('/api/');
      console.log('Alternative API endpoints found:', apiResponse.data);
      return { success: true, endpoints: apiResponse.data };
    } catch (altError) {
      console.error('Alternative API discovery failed:', altError);
      return { success: false, error: altError };
    }
  }
};