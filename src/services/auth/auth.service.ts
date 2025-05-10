/**
 * Authentication Service Module
 * Handles all authentication-related operations including user registration, login,
 * token management, and profile updates.
 */

import axios, { AxiosError } from 'axios';

// API configuration
const API_URL = 'http://localhost:8000';

/**
 * List of possible endpoints for fetching user profile data
 * Tried in sequence until a successful response is received
 */
const USER_PROFILE_ENDPOINTS = [
  '/api/users/me/',
  '/api/users/profile/',
  '/api/users/current/'
];

/**
 * User interface representing the structure of user data
 * throughout the application
 */
export interface User {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  college?: string;
  semester?: number;
  bio?: string;
  profile_picture?: string;
  interests?: string[];
  skills?: string[];
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_url?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
}

/**
 * Login request data structure
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Registration request data structure
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

/**
 * Authentication response structure containing user data and tokens
 */
export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
  };
  access: string;
  refresh: string;
}

/**
 * Standard error response structure from the API
 */
interface ErrorResponse {
    detail?: string;
    message?: string;
    [key: string]: unknown;
}

export type ProfileUpdateData = FormData | Partial<User>;

/**
 * Authentication Service Class
 * Implements the Singleton pattern to ensure only one instance exists
 */
class AuthService {
  private static instance: AuthService;
  private refreshTokenPromise: Promise<string> | null = null;

  private constructor() {
    // Configure axios interceptor for automatic token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Reuse existing refresh token promise if one is in progress
            if (!this.refreshTokenPromise) {
              this.refreshTokenPromise = this.refreshToken();
            }
            
            const newToken = await this.refreshTokenPromise;
            this.refreshTokenPromise = null;
            
            // Update the authorization header
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear tokens but don't redirect
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get the singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   * @param userData Registration data including username, email, and password
   * @returns Promise with registration response
   */
  async register(userData: RegisterData): Promise<Record<string, unknown>> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register/`,
        userData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Registration failed:', err.response?.data);
        throw err;
      }
      throw err;
    }
  }

  /**
   * Initiate password reset process
   * @param email User's email address
   * @returns Promise with reset response
   */
  async forgotPassword(email: string) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/password-reset/`, 
        { 
          email,
          redirect_url: `${window.location.origin}/#/reset-password`
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error('Password reset error:', axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('Server configuration error. Please contact support.');
        }
        
        throw new Error(
          axiosError.response?.data?.detail || 
          axiosError.response?.data?.message || 
          'Failed to send reset instructions'
        );
      }
      throw new Error('Failed to send reset instructions');
    }
  }

  /**
   * Authenticate user and retrieve tokens
   * @param credentials Login credentials (email and password)
   * @returns Promise with authentication response including tokens and user data
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const tokenEndpoint = `${API_URL}/api/users/token/`;
      
      const response = await axios.post(tokenEndpoint, {
        email: credentials.email,
        password: credentials.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 5000
      });

      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error('Invalid token response from server');
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Attempt to fetch user profile data from available endpoints
      let userData = null;

      for (const endpoint of USER_PROFILE_ENDPOINTS) {
        try {
          const profileResponse = await axios.get(`${API_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${access}`,
              'Accept': 'application/json'
            },
          });

          if (profileResponse.data) {
            userData = profileResponse.data;
            break;
          }
        } catch {
          // Continue trying other endpoints
          continue;
        }
      }

      // Fall back to token response data or create minimal user profile
      if (!userData) {
        // If no profile endpoint worked, try to extract user data from token response
        if (response.data.user) {
          userData = response.data.user;
        } else {
          // Create minimal user data from email
          userData = {
            id: 0,
            email: credentials.email,
            username: credentials.email.split('@')[0],
            first_name: '',
            last_name: '',
            is_verified: false
          };
        }
      }

      localStorage.setItem('user', JSON.stringify(userData));

      return {
        user: userData,
        access,
        refresh,
      };
    } catch (error) {
      this.logout();
      
      // Handle network errors
      if (axios.isAxiosError(error)) {
        // Check if there's a response object
        if (error.response) {
          // Server responded with error status
          if (error.response.status === 500) {
            const serverError = new Error('SERVER_ERROR');
            serverError.name = 'ServerError';
            throw serverError;
          }
          // Authentication error (401)
          if (error.response.status === 401) {
            const authError = new Error('INVALID_CREDENTIALS');
            authError.name = 'AuthError';
            throw authError;
          }
        } else if (error.request) {
          // Request was made but no response received - server is down
          const serverError = new Error('SERVER_DOWN');
          serverError.name = 'ServerDownError';
          throw serverError;
        } else {
          // Something happened in setting up the request - no internet
          const networkError = new Error('NO_INTERNET');
          networkError.name = 'NoInternetError';
          throw networkError;
        }
      }
      
      // For any other errors
      const authError = new Error('INVALID_CREDENTIALS');
      authError.name = 'AuthError';
      throw authError;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Clear any pending refresh token promise
    this.refreshTokenPromise = null;
  }

  /**
   * Retrieve the current authenticated user's data
   * @returns User data from local storage or null if not authenticated
   */
  async getCurrentUser() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    
    const cachedUser = localStorage.getItem('user');
    
    try {
      // Try each possible profile endpoint with the token
      for (const endpoint of USER_PROFILE_ENDPOINTS) {
        try {
          const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
          });

          if (response.data) {
            // Update cached user
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
          }
        } catch (err) {
          // Continue trying other endpoints
          void err; // Avoid unused variable warning
          continue;
        }
      }
      
      // If we couldn't get fresh data, return cached data
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (err) {
      console.error('Error fetching current user:', err);
      return cachedUser ? JSON.parse(cachedUser) : null;
    }
  }

  /**
   * Check if a user is currently logged in
   * @returns boolean indicating authentication status
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get the current access token
   * @returns Current access token or null if not authenticated
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Refresh the access token using the refresh token
   * @returns Promise with new access token
   * @throws Error if token refresh fails
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
        refresh: refreshToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true,
      });

      const newToken = response.data.access;
      if (!newToken) {
        throw new Error('Invalid refresh token response');
      }

      localStorage.setItem('access_token', newToken);
      return newToken;
    } catch (error) {
      // Log error for debugging purposes
      console.error('Token refresh failed:', error);
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Test if the current access token is valid
   * @returns Promise<boolean> indicating token validity
   */
  async testTokenValidity(): Promise<boolean> {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    // Try each possible profile endpoint
    for (const endpoint of USER_PROFILE_ENDPOINTS) {
      try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });

        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          return true;
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // Try to refresh the token
          try {
            const newToken = await this.refreshToken();
            // Retry the request with the new token
            const retryResponse = await axios.get(`${API_URL}${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Accept': 'application/json'
              },
            });
            if (retryResponse.data) {
              localStorage.setItem('user', JSON.stringify(retryResponse.data));
              return true;
            }
          } catch (refreshError) {
            // Log error and continue to next endpoint
            console.error('Token refresh during validation failed:', refreshError);
            continue;
          }
        }
      }
    }

    // Only logout if all endpoints failed and token refresh failed
    this.logout();
    return false;
  }

  /**
   * Reset user's password using reset token
   * @param uidb64 Base64 encoded user ID
   * @param token Password reset token
   * @param newPassword New password to set
   * @returns Promise with reset response
   */
  async resetPassword(uidb64: string, token: string, newPassword: string) {
    try {
      const response = await axios.post(`${API_URL}/api/users/password-reset/confirm/`, {
        uid: uidb64,
        token,
        new_password: newPassword,
        confirm_password: newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error('Reset password error:', axiosError.response?.data);
        throw new Error(
          axiosError.response?.data?.detail || 
          axiosError.response?.data?.message || 
          'Failed to reset password'
        );
      }
      throw new Error('Failed to reset password');
    }
  }

  /**
   * Verify OTP for user registration
   * @param email User's email
   * @param otp One-time password to verify
   * @returns Promise with verification response
   */
  async verifyOTP(email: string, otp: string): Promise<{ message: string; access?: string; refresh?: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/verify-otp/`, 
        { email, otp },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      // If OTP verification is successful and tokens are returned, store them
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('OTP verification failed:', err.response?.data);
        throw err;
      }
      throw err;
    }
  }

  /**
   * Request a new OTP for registration
   * @param email User's email
   * @returns Promise with resend response
   */
  async resendOTP(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/resend-otp/`, 
        { email },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('OTP resend failed:', err.response?.data);
        throw err;
      }
      throw err;
    }
  }

  /**
   * Cancel a pending registration
   * @param email User's email
   * @returns Promise with cancellation response
   */
  async cancelRegistration(email: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/cancel-registration/`, 
        { email },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Registration cancellation failed:', err.response?.data);
        throw err;
      }
      throw err;
    }
  }

  /**
   * Update user profile information
   * @param data Updated profile data or FormData for file uploads
   * @returns Promise with updated user data
   */
  async updateProfile(data: FormData): Promise<User> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await axios.patch(
      `${API_URL}/api/users/profile/update/`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    return response.data;
  }

    /**
   * Standardize error handling across the service
   * @param error Error object to process
   * @throws Standardized error with appropriate message
   */
  handleError(error: unknown): never {
    if (error instanceof Error) {
      console.error('Error handling:', error.message);
    } else {
      console.error('Error handling:', error);
    }
    throw error;
  }
}

const authService = AuthService.getInstance();
export default authService;