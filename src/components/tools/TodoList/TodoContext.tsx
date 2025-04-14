import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Todo, SubTask, Comment } from './types';
import NotificationComponents from './NotificationContext';

interface TodoState {
  todos: Todo[];
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'sharedWith' | 'owner'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  addSubtask: (todoId: string, subtask: Omit<SubTask, 'id'>) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  addComment: (todoId: string, comment: Omit<Comment, 'id'>) => void;
  deleteComment: (todoId: string, commentId: string) => void;
  shareTodo: (todoId: string, userId: string) => void;
  unshareTask: (todoId: string, userId: string) => void;
}

// Create context without exporting it
const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface RawTodo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  isCompleted: boolean;
  createdAt: string;
  lastModified: string;
  subtasks: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    userId?: string;
    userName?: string;
  }>;
  sharedWith: string[];
  owner: string;
}

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            const completed = !todo.isCompleted;
            return { ...todo, isCompleted: completed };
          }
          return todo;
        })
      };

    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload
      };

    default:
      return state;
  }
};

// Create the hook as a regular function (not exported)
const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

// Main component that exports everything through its properties
const TodoComponents = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(todoReducer, { todos: [] }, () => {
      // Initialize state from localStorage
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        try {
          const parsedTodos = JSON.parse(savedTodos) as RawTodo[];
          const todos = parsedTodos.map((todo) => ({
            ...todo,
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
            createdAt: new Date(todo.createdAt),
            lastModified: new Date(todo.lastModified),
            subtasks: todo.subtasks.map((st) => ({
              ...st,
              createdAt: new Date(st.createdAt)
            })),
            comments: todo.comments.map((comment) => ({
              ...comment,
              createdAt: new Date(comment.createdAt)
            })),
            sharedWith: todo.sharedWith || [],
          }));
          window.__TODOS__ = todos;
          return { todos };
        } catch (error) {
          console.error('Failed to parse initial todos:', error);
        }
      }
      return { todos: [] };
    });

    const { showNotification } = NotificationComponents.useNotifications();

    // Save todos to localStorage whenever they change
    useEffect(() => {
      try {
        console.log('Saving todos to localStorage:', state.todos); // Debug log
        
        const todosToSave = state.todos.map(todo => ({
          ...todo,
          dueDate: todo.dueDate?.toISOString(),
          createdAt: todo.createdAt.toISOString(),
          lastModified: todo.lastModified.toISOString(),
          subtasks: todo.subtasks.map(st => ({
            ...st,
            createdAt: st.createdAt.toISOString()
          })),
          comments: todo.comments.map(comment => ({
            ...comment,
            createdAt: comment.createdAt.toISOString()
          }))
        }));
        
        const todosJson = JSON.stringify(todosToSave);
        localStorage.setItem('todos', todosJson);
        console.log('Saved todos JSON:', todosJson); // Debug log
        
        // Update the global window.__TODOS__ for the notification manager
        window.__TODOS__ = state.todos;
      } catch (error) {
        console.error('Failed to save todos:', error);
      }
    }, [state.todos]);

    // Add event listener for storage changes
    useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'todos' && e.newValue !== null) {
          try {
            const parsedTodos = JSON.parse(e.newValue) as RawTodo[];
            const todos = parsedTodos.map((todo) => ({
              ...todo,
              dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
              createdAt: new Date(todo.createdAt),
              lastModified: new Date(todo.lastModified),
              subtasks: todo.subtasks.map((st) => ({
                ...st,
                createdAt: new Date(st.createdAt)
              })),
              comments: todo.comments.map((comment) => ({
                ...comment,
                createdAt: new Date(comment.createdAt)
              })),
              sharedWith: todo.sharedWith || [],
            }));
            dispatch({ type: 'SET_TODOS', payload: todos });
            window.__TODOS__ = todos;
          } catch (error) {
            console.error('Failed to parse storage event todos:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const contextValue: TodoContextType = {
      todos: state.todos,
      addTodo: useCallback((todo) => {
        const newTodo: Todo = {
          ...todo,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          lastModified: new Date(),
          isCompleted: false,
          subtasks: [],
          comments: [],
          sharedWith: [],
          owner: 'anonymous',
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        };
        console.log('Adding new todo:', newTodo); // Debug log
        dispatch({ type: 'ADD_TODO', payload: newTodo });
        showNotification(`✅ Task "${newTodo.title}" has been added`, 'success');
      }, [showNotification]),
      updateTodo: useCallback((id, updates) => {
        const existingTodo = state.todos.find(t => t.id === id);
        if (existingTodo) {
          const updatedTodo = {
            ...existingTodo,
            ...updates,
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
          showNotification(`📝 Task "${updatedTodo.title}" has been updated`, 'info');
        }
      }, [state.todos, showNotification]),
      deleteTodo: useCallback((id) => {
        const todoToDelete = state.todos.find(t => t.id === id);
        if (todoToDelete) {
          dispatch({ type: 'DELETE_TODO', payload: id });
          showNotification(`🗑️ Task "${todoToDelete.title}" has been deleted`, 'info');
        }
      }, [state.todos, showNotification]),
      toggleTodo: useCallback((id) => {
        const todoToToggle = state.todos.find(t => t.id === id);
        if (todoToToggle) {
          dispatch({ type: 'TOGGLE_TODO', payload: id });
          if (!todoToToggle.isCompleted) {
            showNotification(`🎉 Task "${todoToToggle.title}" has been completed`, 'success');
          } else {
            showNotification(`📋 Task "${todoToToggle.title}" has been marked as incomplete`, 'info');
          }
        }
      }, [state.todos, showNotification]),
      addSubtask: useCallback((todoId, subtask) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const newSubtask: SubTask = {
            ...subtask,
            id: Math.random().toString(36).substr(2, 9)
          };
          const updatedTodo = {
            ...todo,
            subtasks: [...(todo.subtasks || []), newSubtask],
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      toggleSubtask: useCallback((todoId, subtaskId) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const updatedTodo = {
            ...todo,
            subtasks: todo.subtasks?.map(st =>
              st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
            ),
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      deleteSubtask: useCallback((todoId, subtaskId) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const updatedTodo = {
            ...todo,
            subtasks: todo.subtasks?.filter(st => st.id !== subtaskId),
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      addComment: useCallback((todoId, comment) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const newComment: Comment = {
            ...comment,
            id: Math.random().toString(36).substr(2, 9)
          };
          const updatedTodo = {
            ...todo,
            comments: [...(todo.comments || []), newComment],
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      deleteComment: useCallback((todoId, commentId) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const updatedTodo = {
            ...todo,
            comments: todo.comments?.filter(c => c.id !== commentId),
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      shareTodo: useCallback((todoId, userId) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo && !todo.sharedWith?.includes(userId)) {
          const updatedTodo = {
            ...todo,
            sharedWith: [...(todo.sharedWith || []), userId],
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos]),
      unshareTask: useCallback((todoId, userId) => {
        const todo = state.todos.find(t => t.id === todoId);
        if (todo) {
          const updatedTodo = {
            ...todo,
            sharedWith: todo.sharedWith?.filter(id => id !== userId),
            lastModified: new Date()
          };
          dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
        }
      }, [state.todos])
    };

    return (
      <TodoContext.Provider value={contextValue}>
        {children}
      </TodoContext.Provider>
    );
  },
  // Expose the hook through the components object
  useTodos: useTodoContext
};

// Only export the components object
export default TodoComponents; 