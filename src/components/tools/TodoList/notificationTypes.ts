import { useContext } from 'react';
import { Todo } from './types';
import { NotificationContext } from './notificationContext.base';

/**
 * Configuration options for notification preferences
 */
export interface NotificationPreferences {
  /** Master switch for all notifications */
  enabled: boolean;
  /** Settings for due date reminder notifications */
  dueDateReminders: {
    /** Enable/disable all due date reminders */
    enabled: boolean;
    /** How many minutes before due date to send reminder */
    beforeDue: number;
    /** Whether to notify when task becomes due */
    whenDue: boolean;
    /** Whether to notify when task is overdue */
    whenOverdue: boolean;
  };
  /** Whether to play sound with notifications */
  soundEnabled: boolean;
  /** Whether to send daily task summary */
  dailySummary: boolean;
  /** Whether to remind about tasks with no recent activity */
  staleTaskReminders: boolean;
}

/**
 * Context type for notification system functionality
 */
export interface NotificationContextType {
  /** Current notification preferences */
  preferences: NotificationPreferences;
  /** Update notification preferences */
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  /** Show a notification message */
  showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  /** Check todos and send notifications for due tasks */
  checkAndNotifyDueTasks: (todos: Todo[]) => void;
  /** Whether browser notification permission is granted */
  hasPermission: boolean;
  /** Request browser notification permission */
  requestPermission: () => Promise<boolean>;
  /** Show a toast notification */
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

/**
 * Extend Window interface to include our custom property for global todos access
 */
declare global {
  interface Window {
    __TODOS__?: Todo[];
  }
}

/**
 * Default notification preferences
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
 */
export const STORAGE_KEYS = {
  /** Key for storing notification preferences */
  PREFERENCES: 'todo-notification-preferences',
  /** Key for storing last notification timestamps */
  LAST_NOTIFICATIONS: 'todo-last-notifications'
};

/**
 * Hook to access notification context
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