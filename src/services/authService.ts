import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000';
const USER_PROFILE_ENDPOINTS = [
  '/api/users/me/',
  '/api/users/profile/',
  '/api/users/current/'
];

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

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

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

interface ErrorResponse {
    detail?: string;
    message?: string;
    [key: string]: unknown;
}

export type ProfileUpdateData = FormData | Partial<User>;

class AuthService {
  private static instance: AuthService;
  private refreshTokenPromise: Promise<string> | null = null;

  private constructor() {
    // Add axios interceptor for token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Use the existing refresh token promise if one is in progress
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
            // If refresh fails, clear tokens and redirect to login
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

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
        
        // Handle 401 errors specifically
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
      });

      const { access, refresh } = response.data;
      if (!access || !refresh) {
        throw new Error('Invalid token response from server');
      }

      // Store tokens with consistent naming
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Try each possible profile endpoint
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
        } catch (err) {
          // Continue trying other endpoints
          void err; // Avoid unused variable warning
          continue;
        }
      }

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
    } catch (err) {
      // Clear any existing tokens
      this.logout();
      
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      
      throw err;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // Clear any pending refresh token promise
    this.refreshTokenPromise = null;
  }

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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

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

  async resetPassword(uidb64: string, token: string, newPassword: string) {
    try {
      const response = await axios.post(`${API_URL}/api/users/password-reset/confirm/`, {
        uidb64,
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