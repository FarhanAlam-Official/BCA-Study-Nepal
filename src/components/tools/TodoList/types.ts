export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId?: string;
  userName?: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
  isCompleted: boolean;
  createdAt: Date;
  subtasks: SubTask[];
  comments: Comment[];
  sharedWith: string[]; // Array of user IDs
  owner: string; // User ID of the creator
  lastModified: Date;
}

export interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'sharedWith' | 'owner'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  addSubtask: (todoId: string, title: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  addComment: (todoId: string, content: string) => void;
  deleteComment: (todoId: string, commentId: string) => void;
  shareTodo: (todoId: string, userId: string) => void;
  unshareTask: (todoId: string, userId: string) => void;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  dueTime: string;
  category: string;
  subtasks: string[];
}

export interface SortOption {
  field: 'dueDate' | 'priority' | 'createdAt' | 'lastModified';
  direction: 'asc' | 'desc';
} 