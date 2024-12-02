import api from '../config/axios';
import { safeRequest } from '../utils/apiUtils';

interface AuthResponse {
  access: string;
  refresh: string;
}

export const login = (username: string, password: string) =>
  safeRequest<AuthResponse>(() => api.post('/token/', { username, password }));

export const refreshToken = (refresh: string) =>
  safeRequest<AuthResponse>(() => api.post('/token/refresh/', { refresh }));