import axios from 'axios';
import { College, CollegeFavorite, PaginatedResponse, ToggleFavoriteResponse, CollegeFilters } from './college';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class CollegeApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

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

    console.log('API Request URL:', `${API_BASE_URL}/api/colleges/?${params.toString()}`);
    console.log('Filters:', filters);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/colleges/`, {
        params,
        headers: this.getAuthHeaders()
      });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getFavorites(): Promise<PaginatedResponse<CollegeFavorite>> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/favorites/`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async toggleFavorite(collegeId: string): Promise<ToggleFavoriteResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/api/colleges/${collegeId}/toggle_favorite/`,
      {},
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async incrementView(collegeId: string): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/api/colleges/${collegeId}/increment-view/`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  async getLocations(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/locations/`);
    return response.data;
  }

  async getPrograms(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/programs/`);
    return response.data;
  }

  async getFacilities(): Promise<string[]> {
    const response = await axios.get(`${API_BASE_URL}/api/colleges/facilities/`);
    return response.data;
  }
}

export const collegeApi = new CollegeApi(); 