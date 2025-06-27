import axios from 'axios';
import { Resource, Category, Tag, ResourceFilters, PaginatedResponse, FavoriteResponse, ResourceFavorite } from '../../types/resource-radar/resource-radar.types';
import { showError } from '../../utils/notifications';

/**
 * Runtime configuration interface for Next.js environment variables
 */
interface RuntimeConfig {
  NEXT_PUBLIC_API_URL?: string;
}

interface CustomWindow extends Window {
  __NEXT_DATA__?: {
    runtimeConfig?: RuntimeConfig;
  };
}

// Use environment variable or fallback to default URL
const API_BASE_URL = typeof window !== 'undefined' 
  ? ((window as CustomWindow).__NEXT_DATA__?.runtimeConfig?.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/resource-radar/v1')
  : 'http://localhost:8000/api/resource-radar/v1';

/**
 * ResourceRadarAPI class handles all API interactions for the resource radar feature
 */
class ResourceRadarAPI {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    // Add request interceptor to handle authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Let the main auth system handle 401 errors
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch resources with optional filters
   */
  async getResources(filters: ResourceFilters = {}): Promise<PaginatedResponse<Resource>> {
    try {
      const { data } = await this.axiosInstance.get('/resources/', { params: filters });
      return data;
    } catch {
      showError('Failed to fetch resources. Please try again later.');
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  /**
   * Fetch a single resource by ID
   */
  async getResource(id: string): Promise<Resource | null> {
    try {
      const { data } = await this.axiosInstance.get(`/resources/${id}/`);
      return data;
    } catch {
      showError('Failed to fetch resource details.');
      return null;
    }
  }

  /**
   * Increment view count for a resource
   */
  async incrementView(id: string): Promise<void> {
    try {
      await this.axiosInstance.post(`/resources/${id}/increment_view/`);
    } catch {
      // Silent fail for view increments as it's not critical
    }
  }

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<PaginatedResponse<Category>> {
    try {
      const { data } = await this.axiosInstance.get('/categories/');
      return data;
    } catch {
      showError('Failed to fetch categories.');
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  /**
   * Fetch a single category by slug
   */
  async getCategory(slug: string): Promise<Category | null> {
    try {
      const { data } = await this.axiosInstance.get(`/categories/${slug}/`);
      return data;
    } catch {
      showError('Failed to fetch category details.');
      return null;
    }
  }

  /**
   * Fetch all tags
   */
  async getTags(): Promise<PaginatedResponse<Tag>> {
    try {
      const { data } = await this.axiosInstance.get('/tags/');
      return data;
    } catch {
      showError('Failed to fetch tags.');
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  /**
   * Fetch a single tag by slug
   */
  async getTag(slug: string): Promise<Tag | null> {
    try {
      const { data } = await this.axiosInstance.get(`/tags/${slug}/`);
      return data;
    } catch {
      showError('Failed to fetch tag details.');
      return null;
    }
  }

  /**
   * Fetch user's favorite resources
   */
  async getFavorites(): Promise<PaginatedResponse<ResourceFavorite>> {
    try {
      const { data } = await this.axiosInstance.get('/favorites/');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        showError('Failed to fetch favorites.');
      }
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  /**
   * Toggle favorite status for a resource
   */
  async toggleFavorite(resourceId: string): Promise<FavoriteResponse> {
    try {
      const { data } = await this.axiosInstance.post(`/resources/${resourceId}/toggle_favorite/`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw error;
        }
      }
      showError('Failed to update favorite status.');
      throw error;
    }
  }

  /**
   * Search resources by query string
   */
  async searchResources(query: string): Promise<PaginatedResponse<Resource>> {
    try {
      const { data } = await this.axiosInstance.get('/resources/search/', {
        params: { q: query }
      });
      return data;
    } catch {
      showError('Search failed. Please try again.');
      return { count: 0, next: null, previous: null, results: [] };
    }
  }

  /**
   * Fetch featured resources
   */
  async getFeaturedResources(): Promise<Resource[]> {
    try {
      const { data } = await this.axiosInstance.get('/resources/featured/');
      return data;
    } catch {
      showError('Failed to fetch featured resources.');
      return [];
    }
  }

  /**
   * Fetch popular resources
   */
  async getPopularResources(): Promise<Resource[]> {
    try {
      const { data } = await this.axiosInstance.get('/resources/popular/');
      return data;
    } catch {
      showError('Failed to fetch popular resources.');
      return [];
    }
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }
}

export const resourceRadarApi = new ResourceRadarAPI(); 