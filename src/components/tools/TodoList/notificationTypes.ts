import { useContext } from 'react';
import { Todo } from './types';
import { NotificationContext } from './notificationContext.base';

export interface NotificationPreferences {
  enabled: boolean;
  dueDateReminders: {
    enabled: boolean;
    beforeDue: number; // minutes
    whenDue: boolean;
    whenOverdue: boolean;
  };
  soundEnabled: boolean;
  dailySummary: boolean;
  staleTaskReminders: boolean;
}

export interface NotificationContextType {
  preferences: NotificationPreferences;
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  checkAndNotifyDueTasks: (todos: Todo[]) => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __TODOS__?: Todo[];
  }
}

export const defaultPreferences: NotificationPreferences = {
  enabled: true,
  dueDateReminders: {
    enabled: true,
    beforeDue: 30, // 30 minutes before
    whenDue: true,
    whenOverdue: true
  },
  soundEnabled: true,
  dailySummary: true,
  staleTaskReminders: true
};

// Storage keys
export const STORAGE_KEYS = {
  PREFERENCES: 'todo-notification-preferences',
  LAST_NOTIFICATIONS: 'todo-last-notifications'
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 