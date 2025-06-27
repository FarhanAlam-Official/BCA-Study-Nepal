/**
 * Priority levels for todo items
 * - low: Tasks that can be done when convenient
 * - medium: Tasks that should be done soon but aren't urgent
 * - high: Urgent tasks that need immediate attention
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Core todo item interface representing a task in the system
 * Contains all properties needed to fully describe and track a todo item
 * @interface Todo
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  /** Title/name of the todo item */
  title: string;
  /** Optional detailed description of the todo item */
  description?: string;
  /** Priority level of the todo item */
  priority: Priority;
  /** Optional due date in ISO string format (e.g., "2025-04-16T04:15:00.000Z") */
  dueDate?: string;
  /** Optional category/tag for grouping related todos */
  category?: string;
  /** Whether the todo item has been completed */
  isCompleted: boolean;
  /** ISO string timestamp of when the todo was created */
  createdAt: string;
  /** ISO string timestamp of the last modification */
  lastModified: string;
  /** Array of subtasks associated with this todo */
  subtasks: SubTask[];
  /** Array of comments associated with this todo */
  comments: Comment[];
  /** Identifier of the user who owns this todo */
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
  priority: Priority;
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
  created_at: string;
  user_name: string;
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
  /** Array of all todo items */
  todos: Todo[];
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message if any operation fails */
  error: string | null;
  /** 
   * Adds a new todo item
   * @param todo - Todo data without system-managed fields
   * @returns Promise that resolves when the todo is added
   */
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'owner'>) => Promise<void>;
  /**
   * Updates an existing todo item
   * @param id - ID of the todo to update
   * @param updates - Partial todo data to apply
   * @returns Promise that resolves when the todo is updated
   */
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  /**
   * Deletes a todo item
   * @param id - ID of the todo to delete
   * @returns Promise that resolves when the todo is deleted
   */
  deleteTodo: (id: string) => Promise<void>;
  /**
   * Toggles completion status of a todo
   * @param id - ID of the todo to toggle
   * @returns Promise that resolves when the todo status is toggled
   */
  toggleTodo: (id: string) => Promise<void>;
  /**
   * Adds a subtask to a todo
   * @param todoId - ID of the parent todo
   * @param title - Title of the subtask
   * @returns Promise that resolves when the subtask is added
   */
  addSubtask: (todoId: string, title: string) => Promise<void>;
  /**
   * Toggles completion status of a subtask
   * @param todoId - ID of the parent todo
   * @param subtaskId - ID of the subtask to toggle
   * @returns Promise that resolves when the subtask status is toggled
   */
  toggleSubtask: (todoId: string, subtaskId: string) => Promise<void>;
  /**
   * Deletes a subtask
   * @param todoId - ID of the parent todo
   * @param subtaskId - ID of the subtask to delete
   * @returns Promise that resolves when the subtask is deleted
   */
  deleteSubtask: (todoId: string, subtaskId: string) => Promise<void>;
  /**
   * Adds a comment to a todo
   * @param todoId - ID of the todo
   * @param content - Content of the comment
   * @returns Promise that resolves when the comment is added
   */
  addComment: (todoId: string, content: string) => Promise<void>;
  /**
   * Deletes a comment
   * @param todoId - ID of the todo
   * @param commentId - ID of the comment to delete
   * @returns Promise that resolves when the comment is deleted
   */
  deleteComment: (todoId: string, commentId: string) => Promise<void>;
}