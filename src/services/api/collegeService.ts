import axios from 'axios';
import type { College } from '../types/college.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: College[];
}

export const collegeService = {
  getAll: async (): Promise<College[]> => {
    try {
      const response = await axios.get<PaginatedResponse>(`${API_URL}/colleges/`);
      console.log('API Response:', response.data);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<College> => {
    try {
      const response = await axios.get(`${API_URL}/colleges/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching college:', error);
      throw error;
    }
  }
};