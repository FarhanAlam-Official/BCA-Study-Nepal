/**
 * API client for interacting with the college-related endpoints.
 * Handles all college data operations including fetching, favoriting, and filtering colleges.
 */

import axios from 'axios';
import { College, CollegeFavorite, PaginatedResponse, ToggleFavoriteResponse, CollegeFilters } from './college';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class CollegeApi {
  /**
   * Retrieves authentication headers for authenticated requests
   * @returns Object containing the Authorization header if a token exists
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Fetches colleges based on provided filters
   * @param filters - Optional filters to apply to the college search
   * @returns Promise containing paginated college results
   */
  async getColleges(filters: CollegeFilters = {}): Promise<PaginatedResponse<College>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.programs?.length) params.append('programs', filters.programs.join(','));
    if (filters.admission_status) params.append('admission_status', filters.admission_status);
    if (filters.rating_min) params.append('rating_min', filters.rating_min.toString());
    if (filters.facilities?.length) params.append('facilities', filters.facilities.join(','));
    if (filters.showFeatured) params.append('featured', 'true');
    if (filters.showFavorites) params.append('favorites', 'true');
    if (filters.sortBy) {
      params.append('sort_by', filters.sortBy);
      if (filters.sortOrder) params.append('sort_order', filters.sortOrder);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/colleges/`, {
        params,
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      // Only log API errors in development
      if (import.meta.env.DEV) {
        console.error('Failed to fetch colleges:', error);
      }
      throw error;
    }
  }

  /**
   * Retrieves user's favorite colleges
   * @returns Promise containing paginated favorite college results
   */
  async getFavorites(): Promise<PaginatedResponse<CollegeFavorite>> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/favorites/`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  /**
   * Toggles favorite status for a college
   * @param collegeId - ID of the college to toggle favorite status
   * @returns Promise containing the updated favorite status
   */
  async toggleFavorite(collegeId: string): Promise<ToggleFavoriteResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/colleges/${collegeId}/toggle_favorite/`,
      {},
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  /**
   * Increments the view count for a college
   * @param collegeId - ID of the college to increment views
   */
  async incrementView(collegeId: string): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/api/colleges/${collegeId}/increment-view/`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Fetches all available college locations
   * @returns Promise containing array of location strings
   */
  async getLocations(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/locations/`);
    return response.data;
  }

  /**
   * Fetches all available college programs
   * @returns Promise containing array of program strings
   */
  async getPrograms(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/programs/`);
    return response.data;
  }

  /**
   * Fetches all available college facilities
   * @returns Promise containing array of facility strings
   */
  async getFacilities(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/facilities/`);
    return response.data;
  }

  /**
   * Fetches detailed information for a specific college
   * @param id - ID of the college to fetch
   * @returns Promise containing college details
   */
  async getCollege(id: string): Promise<College> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/colleges/${id}/`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      // Only log API errors in development
      if (import.meta.env.DEV) {
        console.error('Failed to fetch college details:', error);
      }
      throw error;
    }
  }
}

export const collegeApi = new CollegeApi(); 