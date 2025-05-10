/**
 * AuthContext
 * 
 * A comprehensive authentication context that manages user authentication state
 * and provides authentication-related functionality. Features include:
 * - User authentication (login/register)
 * - Session management
 * - Token refresh handling
 * - Error handling
 * - User profile management
 * - Persistent authentication state
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { LoginData, RegisterData } from '../services/auth/auth.service';

/**
 * User interface representing authenticated user data
 * Contains both basic user information and extended profile data
 */
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  // Profile information
  phone_number?: string;
  college?: string;
  semester?: number;
  bio?: string;
  profile_picture?: string;
  // Social media links
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_url?: string;
  // Additional metadata
  interests?: string[];
  skills?: string[];
}

/**
 * Auth context type definition
 * Provides authentication state and methods for auth operations
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
  success: string | null;
  resetMessages: () => void;
  updateUser: (userData: User) => void;
}

/**
 * API error response type
 * Represents possible error response formats from the auth API
 */
interface ApiErrorResponse {
  status?: number;
  data?: {
    detail?: string;
    non_field_errors?: string[];
    [key: string]: unknown;
  };
}

// Create context without initial value to enforce usage with provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth functionality to children
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Calculate authentication status based on token presence and user data
  const isAuthenticated = !!localStorage.getItem('access_token') && !!user;

  /**
   * Check authentication status on mount and token changes
   * Handles token refresh and user data fetching
   */
  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Try to get user data
        try {
          const userData = await authService.getCurrentUser();
          
          if (userData) {
            setUser(userData);
          } else {
            throw new Error('No user data in response');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          
          // Try refreshing the token
          try {
            await authService.refreshToken();
            
            // Try again with the new token
            const userDataAfterRefresh = await authService.getCurrentUser();
            
            if (userDataAfterRefresh) {
              setUser(userDataAfterRefresh);
            } else {
              throw new Error('Still no user data after token refresh');
            }
          } catch {
            // Clear authentication if refresh fails
            authService.logout();
            setUser(null);
          }
        }
      } catch {
        // Handle general errors
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Handle user login
   * Validates credentials and manages authentication state
   * 
   * @param credentials - User login credentials
   */
  const login = async (credentials: LoginData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await authService.login(credentials);
      
      if (!response.access) {
        throw new Error('No access token received');
      }

      // Validate token immediately after receiving it
      const isValid = await authService.testTokenValidity();
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      if (response.user) {
        setUser(response.user);
        setSuccess('Login successful!');
      } else {
        throw new Error('No user data received');
      }
    } catch (error) {
      // Clear any existing auth data
      authService.logout();
      setUser(null);

      // Check error type by name
      if (error instanceof Error) {
        switch (error.name) {
          case 'NoInternetError':
            setError('NO_INTERNET');
            break;
          case 'ServerDownError':
            setError('SERVER_DOWN');
            break;
          case 'ServerError':
            setError('SERVER_ERROR');
            break;
          case 'AuthError':
          default:
            setError('INVALID_CREDENTIALS');
            break;
        }
      } else {
        setError('INVALID_CREDENTIALS');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   * Creates new user account and manages registration state
   * 
   * @param userData - User registration data
   */
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.register(userData);
      
      // Check if we have user data in the response
      if (response && 'user' in response) {
        setUser(response.user as User);
        setSuccess('Registration successful! Your account has been created.');
      } else if (response && 'detail' in response) {
        // Some APIs return a detail message on success
        setSuccess('Registration successful! ' + response.detail);
      } else {
        // If we have a response but no user data or detail
        setSuccess('Registration successful! Please log in with your credentials.');
      }
    } catch (err) {
      const errorResponse = err as { response?: ApiErrorResponse };
      
      // Handle different error formats
      if (errorResponse.response?.data) {
        const errorData = errorResponse.response.data;
        
        // Handle string error
        if (typeof errorData === 'string') {
          setError(errorData);
        } 
        // Handle object with detail field
        else if (errorData.detail) {
          setError(errorData.detail);
        }
        // Handle validation errors object
        else {
          let errorMessage = '';
          
          Object.entries(errorData).forEach(([field, errors]) => {
            const fieldErrors = Array.isArray(errors) 
              ? errors.join(', ') 
              : String(errors);
            
            errorMessage += `${field}: ${fieldErrors}\n`;
          });
          
          setError(errorMessage || 'Registration failed. Please check your information.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   * Clears authentication state and redirects to login
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/auth', { replace: true });
  };

  /**
   * Reset error and success messages
   */
  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  /**
   * Update user data
   * Updates local user state with new data
   * 
   * @param userData - Updated user data
   */
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Provide context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    error,
    success,
    resetMessages,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 