import { Todo, SubTask, Comment } from './types';

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TODO_PREFIX = '/api/todos';

/**
 * Interface for API responses
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

/**
 * TodoApi class handles all API interactions for todo operations
 */
class TodoApi {
  private static TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Retrieves authentication token from storage
   * Checks localStorage first, then sessionStorage
   */
  private static getAuthToken() {
    let token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      token = sessionStorage.getItem(this.TOKEN_KEY);
    }
    return token;
  }

  /**
   * Sets authentication token in storage
   * @param token - The authentication token to store
   * @param remember - If true, stores in localStorage; otherwise in sessionStorage
   */
  private static setAuthToken(token: string, remember: boolean = true) {
    if (remember) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Clears all authentication tokens from storage
   */
  private static clearAuthToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Attempts to refresh the authentication token
   * @returns boolean indicating success of refresh attempt
   */
  private static async refreshToken() {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY) || 
                        sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setAuthToken(data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Makes an authenticated request to the API
   * @param endpoint - API endpoint to call
   * @param options - Request options
   * @returns Promise with the API response
   */
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        window.location.href = '/auth/login';
        return { error: 'No authentication token found' };
      }

      // Add API prefix to endpoint if it's a todo endpoint
      const fullEndpoint = endpoint.startsWith('/api/') ? endpoint : `${API_TODO_PREFIX}${endpoint}`;

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (response.status === 401) {
        if (await this.refreshToken()) {
          return this.request(endpoint, options);
        }
        this.clearAuthToken();
        window.location.href = '/auth/login';
        return { error: 'Authentication failed' };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || response.statusText;
        return { error: errorMessage, status: response.status };
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return { status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error('API request error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }

  /**
   * Retrieves all todos for the authenticated user
   */
  static async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    const response = await this.request<Todo[] | { results: Todo[] }>('/');
    
    if (response.error) {
      return response as ApiResponse<Todo[]>;
    }

    if (response.data) {
      // Handle both array and paginated responses
      const todos = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      
      return { data: todos };
    }

    return { error: 'No data received from server' };
  }

  /**
   * Creates a new todo
   * @param todo - Todo data to create
   */
  static async createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'sharedWith' | 'owner'>): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  }

  /**
   * Updates an existing todo
   * @param id - Todo ID to update
   * @param updates - Partial todo data to update
   */
  static async updateTodo(id: string, updates: Partial<Todo>): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Deletes a todo
   * @param id - Todo ID to delete
   */
  static async deleteTodo(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/${id}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Toggles a todo's completion status
   * @param id - Todo ID to toggle
   * @param isCompleted - New completion state
   */
  static async toggleTodo(id: string, isCompleted: boolean): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed: isCompleted })
    });
  }

  /**
   * Adds a subtask to a todo
   * @param todoId - Parent todo ID
   * @param title - Subtask title
   */
  static async addSubtask(todoId: string, title: string): Promise<ApiResponse<SubTask>> {
    return this.request<SubTask>(`/${todoId}/add_subtask/`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  /**
   * Toggles a subtask's completion status
   * @param todoId - Parent todo ID
   * @param subtaskId - Subtask ID to toggle
   */
  static async toggleSubtask(todoId: string, subtaskId: string): Promise<ApiResponse<SubTask>> {
    return this.request<SubTask>(`/${todoId}/toggle_subtask/`, {
      method: 'POST',
      body: JSON.stringify({ subtask_id: subtaskId }),
    });
  }

  /**
   * Deletes a subtask
   * @param todoId - Parent todo ID
   * @param subtaskId - Subtask ID to delete
   */
  static async deleteSubtask(todoId: string, subtaskId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/${todoId}/subtasks/${subtaskId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Adds a comment to a todo
   * @param todoId - Parent todo ID
   * @param content - Comment content
   */
  static async addComment(todoId: string, content: string): Promise<ApiResponse<Comment>> {
    return this.request<Comment>(`/${todoId}/add_comment/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  /**
   * Deletes a comment
   * @param todoId - Parent todo ID
   * @param commentId - Comment ID to delete
   */
  static async deleteComment(todoId: string, commentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/${todoId}/comments/${commentId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Shares a todo with another user
   * @param todoId - Todo ID to share
   * @param userId - User ID to share with
   */
  static async shareTodo(todoId: string, userId: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/${todoId}/share/`, {
      method: 'POST',
      body: JSON.stringify({ user_ids: [userId] }),
    });
  }

  /**
   * Removes todo sharing from a user
   * @param todoId - Todo ID to unshare
   * @param userId - User ID to remove sharing from
   */
  static async unshareTask(todoId: string, userId: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/${todoId}/unshare/`, {
      method: 'POST',
      body: JSON.stringify({ user_ids: [userId] }),
    });
  }

  /**
   * Retrieves filtered and sorted todos
   * @param params - Filter and sort parameters
   */
  static async getFilteredTodos(params: {
    priority?: 'low' | 'medium' | 'high';
    isCompleted?: boolean;
    category?: string;
    search?: string;
    ordering?: string;
  }): Promise<ApiResponse<Todo[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.isCompleted !== undefined) queryParams.append('is_completed', String(params.isCompleted));
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.ordering) queryParams.append('ordering', params.ordering);

    return this.request<Todo[]>(`/?${queryParams.toString()}`);
  }
}

export default TodoApi;