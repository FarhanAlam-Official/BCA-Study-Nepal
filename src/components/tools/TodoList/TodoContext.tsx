import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Todo, TodoContextType } from './types';
import NotificationComponents from './NotificationContext';
import TodoApi from './todoApi';

/**
 * Interface for the todo state
 */
interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Union type for all possible todo actions
 */
type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: { id: string; isCompleted: boolean } }
  | { type: 'SET_TODOS'; payload: Todo[] };

// Create context without exporting it
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Constants
const LOCAL_STORAGE_KEY = 'todos_state';
const AUTO_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_TODOS = 15; // Maximum number of todos allowed per user

/**
 * Reducer function to handle todo state updates
 * @param state - Current todo state
 * @param action - Action to perform on the state
 * @returns Updated todo state
 */
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  let newState: TodoState;
  
  switch (action.type) {
    case 'SET_LOADING':
      newState = {
        ...state,
        isLoading: action.payload,
        error: null
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
        isLoading: false
      };
      break;
    case 'ADD_TODO':
      newState = {
        ...state,
        todos: [...state.todos, action.payload],
        isLoading: false,
        error: null
      };
      break;
    case 'UPDATE_TODO':
      newState = {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        isLoading: false,
        error: null
      };
      break;
    case 'DELETE_TODO':
      newState = {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        isLoading: false,
        error: null
      };
      break;
    case 'TOGGLE_TODO':
      newState = {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, isCompleted: action.payload.isCompleted } : todo
        ),
        isLoading: false,
        error: null
      };
      break;
    case 'SET_TODOS':
      newState = {
        ...state,
        todos: action.payload,
        isLoading: false,
        error: null
      };
      break;
    default:
      return state;
  }

  // Save to localStorage after each state change
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState.todos));
  } catch (error) {
    // Handle storage errors silently but maintain state update
    if (error instanceof Error) {
      console.warn('Failed to save todos to localStorage:', error.message);
    }
  }
  return newState;
};

/**
 * Hook to access todo context
 * @throws Error if used outside TodoProvider
 */
const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

/**
 * Main component that exports everything through its properties
 */
const TodoComponents = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    // Initialize state from localStorage with error handling
    const [state, dispatch] = useReducer(todoReducer, {
      todos: (() => {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          return stored ? JSON.parse(stored) : [];
        } catch (error) {
          if (error instanceof Error) {
            console.warn('Failed to load todos from localStorage:', error.message);
          }
          return [];
        }
      })(),
      isLoading: false,
      error: null
    });

    const { showNotification } = NotificationComponents.useNotifications();

    // Initial fetch from server
    useEffect(() => {
      const fetchInitialTodos = async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await TodoApi.getAllTodos();
          
          if (response.error) {
            if (!response.error.includes('authentication')) {
              showNotification('Failed to fetch initial todos', 'error');
            }
            dispatch({ type: 'SET_ERROR', payload: response.error });
            return;
          }
          
          if (response.data) {
            dispatch({ type: 'SET_TODOS', payload: response.data });
          }
        } catch (error) {
          if (error instanceof Error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            showNotification(`Failed to fetch initial todos: ${error.message}`, 'error');
          }
        }
      };

      fetchInitialTodos();
    }, [showNotification]);

    // Sync with server periodically
    useEffect(() => {
      const syncWithServer = async () => {
        try {
          // Instead of comparing, just sync current state to server
          const localTodos = state.todos;
          
          // Batch update all todos to server
          const promises = localTodos.map(async (todo) => {
            try {
              await TodoApi.updateTodo(todo.id, todo);
            } catch (error) {
              console.error(`Failed to sync todo ${todo.id}:`, error);
              return false;
            }
            return true;
          });

          const results = await Promise.allSettled(promises);
          const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
          
          if (successCount === localTodos.length) {
            console.log('Auto-sync completed successfully');
          } else {
            showNotification(`Synced ${successCount} of ${localTodos.length} todos`, 'warning');
          }
        } catch (error) {
          if (error instanceof Error) {
            showNotification(`Auto-sync failed: ${error.message}`, 'error');
          }
        }
      };

      // Initial sync
      syncWithServer();

      // Set up periodic sync
      const intervalId = setInterval(syncWithServer, AUTO_SYNC_INTERVAL);

      // Cleanup on unmount
      return () => clearInterval(intervalId);
    }, [state.todos, showNotification]);

    // Sync with server when user leaves/closes page
    useEffect(() => {
      const syncBeforeUnload = async (event: BeforeUnloadEvent) => {
        try {
          // Directly sync current state to server without comparison
          const localTodos = state.todos;
          
          // Use Promise.all to sync all todos in parallel
          await Promise.all(localTodos.map(todo => TodoApi.updateTodo(todo.id, todo)));
          
          // No need to handle deleted todos separately since server will have the current state
        } catch (error) {
          console.error('Error syncing todos on exit:', error);
          // Show a warning to user that sync failed
          event.preventDefault();
          event.returnValue = 'Changes may not have been saved. Are you sure you want to leave?';
        }
      };

      window.addEventListener('beforeunload', syncBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', syncBeforeUnload);
        // Final sync on unmount
        syncBeforeUnload(new Event('beforeunload') as BeforeUnloadEvent);
      };
    }, [state.todos]);

    const addTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'subtasks' | 'comments' | 'sharedWith' | 'owner'>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Check if user has reached the todo limit
        const activeTodos = state.todos.filter(t => !t.isCompleted);
        if (activeTodos.length >= MAX_TODOS) {
          dispatch({ type: 'SET_ERROR', payload: 'Todo limit reached' });
          showNotification(
            'Max 15 active todos reached. Complete or delete some to add new ones.',
            'warning'
          );
          return;
        }

        // First create todo on backend to get an ID
        const response = await TodoApi.createTodo({
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority,
          dueDate: todo.dueDate,
          category: todo.category || '',
          isCompleted: todo.isCompleted || false
        });
        
        if (response.error) {
          const errorMessage = response.error === 'No authentication token found' || response.error === 'Authentication failed'
            ? 'Your session has expired. Please log in again.'
            : `Failed to create todo: ${response.error}`;
          
          dispatch({ type: 'SET_ERROR', payload: response.error });
          showNotification(errorMessage, 'error');
          return;
        }
        
        if (response.data) {
          // Update local state with the new todo
          dispatch({ type: 'ADD_TODO', payload: response.data });
          showNotification('Task created successfully', 'success');
          
          // Explicitly update localStorage
          const updatedTodos = [...state.todos, response.data];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: 'SET_ERROR', payload: error.message });
          showNotification(`Failed to create todo: ${error.message}`, 'error');
        }
      }
    }, [dispatch, showNotification, state.todos]);

    const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const updateData: Partial<Todo> = {};
      
      if ('title' in updates) updateData.title = updates.title;
      if ('description' in updates) updateData.description = updates.description;
      if ('priority' in updates) updateData.priority = updates.priority;
      if ('dueDate' in updates) updateData.dueDate = updates.dueDate;
      if ('category' in updates) updateData.category = updates.category;
      if ('isCompleted' in updates) updateData.isCompleted = updates.isCompleted;
      
      const response = await TodoApi.updateTodo(id, updateData);
      
      if (response.error) {
        const errorMessage = response.error === 'No authentication token found' || response.error === 'Authentication failed'
          ? 'Your session has expired. Please log in again.'
          : `Failed to update task: ${response.error}`;
        
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(errorMessage, 'error');
      } else if (response.data) {
        dispatch({ type: 'UPDATE_TODO', payload: response.data });
        showNotification('Task updated successfully', 'success');
      }
    }, [dispatch, showNotification]);

    const deleteTodo = useCallback(async (id: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.deleteTodo(id);
      
      if (response.error) {
        const errorMessage = response.error === 'No authentication token found' || response.error === 'Authentication failed'
          ? 'Your session has expired. Please log in again.'
          : `Failed to delete task: ${response.error}`;
        
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(errorMessage, 'error');
      } else {
        dispatch({ type: 'DELETE_TODO', payload: id });
        showNotification('Task deleted', 'error');
      }
    }, [dispatch, showNotification]);

    const toggleTodo = useCallback(async (id: string): Promise<void> => {
      const todo = state.todos.find(t => t.id === id);
      if (!todo) {
        showNotification('Task not found', 'error');
        return;
      }

      const newState = !todo.isCompleted;
      
      // Update local state immediately
      dispatch({ 
        type: 'TOGGLE_TODO', 
        payload: { id, isCompleted: newState }
      });

      // Show notification
      showNotification(
        `Task marked as ${newState ? 'complete' : 'incomplete'}`,
        newState ? 'success' : 'info'
      );

      // Update localStorage immediately
      try {
        const updatedTodos = state.todos.map(t => 
          t.id === id ? { ...t, isCompleted: newState, lastModified: new Date().toISOString() } : t
        );
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
      } catch (error) {
        console.warn('Failed to save todos to localStorage:', error);
      }
    }, [state.todos, dispatch, showNotification]);

    const addSubtask = useCallback(async (todoId: string, title: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.addSubtask(todoId, title);
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(response.error, 'error');
      } else if (response.data) {
        const todoResponse = await TodoApi.getAllTodos();
        if (todoResponse.data) {
          dispatch({ type: 'SET_TODOS', payload: todoResponse.data });
          showNotification('Subtask added successfully', 'success');
        }
      }
    }, [dispatch, showNotification]);

    const toggleSubtask = useCallback(async (todoId: string, subtaskId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.toggleSubtask(todoId, subtaskId);
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(response.error, 'error');
      } else if (response.data) {
        const todoResponse = await TodoApi.getAllTodos();
        if (todoResponse.data) {
          dispatch({ type: 'SET_TODOS', payload: todoResponse.data });
          showNotification('Subtask status updated', 'success');
        }
      }
    }, [dispatch, showNotification]);

    const deleteSubtask = useCallback(async (todoId: string, subtaskId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.deleteSubtask(todoId, subtaskId);
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(response.error, 'error');
      } else {
        const todoResponse = await TodoApi.getAllTodos();
        if (todoResponse.data) {
          dispatch({ type: 'SET_TODOS', payload: todoResponse.data });
          showNotification('Subtask deleted successfully', 'success');
        }
      }
    }, [dispatch, showNotification]);

    const addComment = useCallback(async (todoId: string, content: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.addComment(todoId, content);
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(response.error, 'error');
      } else if (response.data) {
        const todoResponse = await TodoApi.getAllTodos();
        if (todoResponse.data) {
          dispatch({ type: 'SET_TODOS', payload: todoResponse.data });
          showNotification('Comment added successfully', 'success');
        }
      }
    }, [dispatch, showNotification]);

    const deleteComment = useCallback(async (todoId: string, commentId: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await TodoApi.deleteComment(todoId, commentId);
      if (response.error) {
        dispatch({ type: 'SET_ERROR', payload: response.error });
        showNotification(response.error, 'error');
      } else {
        const todoResponse = await TodoApi.getAllTodos();
        if (todoResponse.data) {
          dispatch({ type: 'SET_TODOS', payload: todoResponse.data });
          showNotification('Comment deleted successfully', 'success');
        }
      }
    }, [dispatch, showNotification]);

    const value = {
      todos: state.todos,
      isLoading: state.isLoading,
      error: state.error,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      addComment,
      deleteComment,
    };

    return (
      <TodoContext.Provider value={value}>
        {children}
      </TodoContext.Provider>
    );
  },
  // Expose the hook through the components object
  useTodos: useTodoContext
};

// Only export the components object
export default TodoComponents; 