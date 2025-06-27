import { useContext, createContext } from 'react';
import { Todo } from './types';

/**
 * Configuration options for notification preferences
 * Controls when and how notifications are displayed to the user
 */
export interface NotificationPreferences {
  /** Master switch for enabling/disabling all notifications */
  enabled: boolean;

  /** Settings for due date reminder notifications */
  dueDateReminders: {
    /** Enable/disable all due date reminders */
    enabled: boolean;
    /** Number of minutes before due date to send first reminder */
    beforeDue: number;
    /** Whether to send notification exactly when task becomes due */
    whenDue: boolean;
    /** Whether to send notification when task is past its due date */
    whenOverdue: boolean;
  };

  /** Whether to play sound effects with notifications */
  soundEnabled: boolean;

  /** Whether to send a daily summary of pending tasks */
  dailySummary: boolean;

  /** Whether to remind about tasks with no updates for a long period */
  staleTaskReminders: boolean;
}

/**
 * Context type for notification system functionality
 * Provides methods for managing notifications and preferences
 */
export interface NotificationContextType {
  /** Current notification preferences */
  preferences: NotificationPreferences;

  /** 
   * Update notification preferences
   * @param newPrefs - Partial preferences to merge with current settings
   */
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;

  /** 
   * Show a notification message
   * @param message - The notification message to display
   * @param type - The type/severity of the notification
   */
  showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;

  /** 
   * Check todos and send notifications for due tasks
   * @param todos - Array of todos to check for due dates
   */
  checkAndNotifyDueTasks: (todos: Todo[]) => void;

  /** Whether browser notification permission is granted */
  hasPermission: boolean;

  /** 
   * Request browser notification permission from user
   * @returns Promise resolving to whether permission was granted
   */
  requestPermission: () => Promise<boolean>;

  /** 
   * Show a toast notification
   * @param message - The toast message to display
   * @param type - The type/severity of the toast
   */
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

/**
 * Create the notification context with undefined default value
 * Must be provided by NotificationProvider component
 */
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Extend Window interface to include our custom property for global todos access
 * Used for debugging and notification checking
 */
declare global {
  interface Window {
    __TODOS__?: Todo[];
  }
}

/**
 * Default notification preferences
 * Used when user hasn't set custom preferences
 */
export const defaultPreferences: NotificationPreferences = {
  enabled: true,
  dueDateReminders: {
    enabled: true,
    beforeDue: 30,
    whenDue: true,
    whenOverdue: true
  },
  soundEnabled: true,
  dailySummary: true,
  staleTaskReminders: true
};

/**
 * Local storage keys for persisting notification data
 * Used to maintain user preferences across sessions
 */
export const STORAGE_KEYS = {
  /** Key for storing notification preferences */
  PREFERENCES: 'todo-notification-preferences',
  /** Key for storing last notification timestamps */
  LAST_NOTIFICATIONS: 'todo-last-notifications'
};

/**
 * Hook to access notification context
 * Provides type-safe access to notification functionality
 * @throws {Error} If used outside of NotificationProvider
 * @returns {NotificationContextType} The notification context
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 