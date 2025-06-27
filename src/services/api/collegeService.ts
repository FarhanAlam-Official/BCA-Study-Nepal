import axios from 'axios';
import type { College, CollegeFilters } from '../types/college.types';

// Update this to match your Django backend URL
const API_URL = 'http://localhost:8000/api';

// Create axios instance with basic configuration only
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Remove the auth interceptors and simplify error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const collegeService = {
    getAll: async (filters?: CollegeFilters) => {
        try {
            const response = await axiosInstance.get<PaginatedResponse<College>>('/colleges/', { params: filters });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching colleges:', error);
            return [];
        }
    },

    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get<College>(`/colleges/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching college:', error);
            return null;
        }
    },

    getBySlug: async (slug: string) => {
        try {
            const response = await axiosInstance.get<College>(`/colleges/${slug}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching college:', error);
            return null;
        }
    }
};