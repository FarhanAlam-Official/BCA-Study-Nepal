/**
 * Core todo item interface representing a task in the system
 * @interface Todo
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string, e.g., "2025-04-16T04:15:00.000Z"
  category?: string;
  isCompleted: boolean;
  createdAt: string;
  lastModified: string;
  subtasks: SubTask[];
  comments: Comment[];
  sharedWith: string[];
  owner: string;
}

/**
 * Data structure for creating or updating a todo item
 * Omits system-managed fields like id, timestamps, and relationships
 * @interface TodoData
 */
export interface TodoData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO string, e.g., "2025-04-16T04:15:00.000Z"
  category?: string;
  isCompleted?: boolean;
}

/**
 * Represents a subtask within a todo item
 * @interface SubTask
 */
export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

/**
 * Represents a comment on a todo item
 * @interface Comment
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
}

/**
 * Configuration for sorting todo items
 * @interface SortOption
 */
export interface SortOption {
  field: 'createdAt' | 'dueDate' | 'priority' | 'lastModified';
  direction: 'asc' | 'desc';
}

/**
 * Context type for managing todo state and operations
 * Provides all necessary methods for CRUD operations on todos
 * @interface TodoContextType
 */
export interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  /** 
   * Adds a new todo item
   * @param todo - Todo data without system-managed fields
   */
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'sharedWith' | 'owner'>) => Promise<void>;
  /**
   * Updates an existing todo item
   * @param id - ID of the todo to update
   * @param updates - Partial todo data to apply
   */
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  /**
   * Deletes a todo item
   * @param id - ID of the todo to delete
   */
  deleteTodo: (id: string) => Promise<void>;
  /**
   * Toggles completion status of a todo
   * @param id - ID of the todo to toggle
   */
  toggleTodo: (id: string) => Promise<void>;
  /**
   * Adds a subtask to a todo
   * @param todoId - ID of the parent todo
   * @param title - Title of the subtask
   */
  addSubtask: (todoId: string, title: string) => Promise<void>;
  /**
   * Toggles completion status of a subtask
   * @param todoId - ID of the parent todo
   * @param subtaskId - ID of the subtask to toggle
   */
  toggleSubtask: (todoId: string, subtaskId: string) => Promise<void>;
  /**
   * Deletes a subtask
   * @param todoId - ID of the parent todo
   * @param subtaskId - ID of the subtask to delete
   */
  deleteSubtask: (todoId: string, subtaskId: string) => Promise<void>;
  /**
   * Adds a comment to a todo
   * @param todoId - ID of the todo
   * @param content - Content of the comment
   */
  addComment: (todoId: string, content: string) => Promise<void>;
  /**
   * Deletes a comment
   * @param todoId - ID of the todo
   * @param commentId - ID of the comment to delete
   */
  deleteComment: (todoId: string, commentId: string) => Promise<void>;
  /**
   * Shares a todo with another user
   * @param todoId - ID of the todo to share
   * @param userId - ID of the user to share with
   */
  shareTodo: (todoId: string, userId: string) => Promise<void>;
  /**
   * Removes todo sharing from a user
   * @param todoId - ID of the todo
   * @param userId - ID of the user to unshare with
   */
  unshareTask: (todoId: string, userId: string) => Promise<void>;
}