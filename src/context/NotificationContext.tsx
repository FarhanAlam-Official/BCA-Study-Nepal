/**
 * NotificationContext
 * 
 * A comprehensive notification system that handles both in-app toast notifications
 * and browser notifications. It provides functionality for:
 * - Toast notifications with different severity levels
 * - Browser notifications with sound support
 * - Due date reminders for tasks
 * - Notification preferences management
 * - Persistent storage of notification settings
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Todo } from '../components/tools/TodoList/types';
import {
  NotificationContextType,
  NotificationPreferences,
  defaultPreferences,
  STORAGE_KEYS
} from '../components/tools/TodoList/notificationTypes';
import { toast, ToastContainer } from 'react-toastify';

// Create context without initial value to enforce usage with provider
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Custom hook to access notification context
 * @throws {Error} If used outside of NotificationProvider
 */
const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationComponents = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    // Initialize preferences from localStorage with fallback to defaults
    const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
        return defaultPreferences;
      }
    });

    const [hasPermission, setHasPermission] = useState(false);
    
    // Initialize notification history from localStorage
    const [lastNotificationTimes, setLastNotificationTimes] = useState<Record<string, number>>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LAST_NOTIFICATIONS);
        return stored ? JSON.parse(stored) : {};
      } catch (error) {
        console.error('Failed to load notification history:', error);
        return {};
      }
    });

    /**
     * Persist preferences to localStorage whenever they change
     */
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save notification preferences:', error);
      }
    }, [preferences]);

    /**
     * Persist notification history to localStorage whenever it changes
     */
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_NOTIFICATIONS, JSON.stringify(lastNotificationTimes));
      } catch (error) {
        console.error('Failed to save notification history:', error);
      }
    }, [lastNotificationTimes]);

    /**
     * Shows a notification using toast and browser notifications
     * @param message - The notification message
     * @param type - The type of notification
     * @param isGlobal - Whether the notification is global or task-specific
     */
    const showNotification = useCallback((
      message: string, 
      type: 'info' | 'warning' | 'error' | 'success',
      isGlobal: boolean = false
    ) => {
      if (!preferences.enabled) return;

      const containerId = isGlobal ? "global-notifications" : "todo-notifications";

      // Show toast notification with appropriate styling and behavior
      toast(message, { 
        type,
        position: "top-right",
        containerId,
        autoClose: type === 'error' ? 5000 : 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      });

      // Show browser notification for important alerts if permission is granted
      if ((type === 'warning' || type === 'error') && Notification.permission === 'granted') {
        try {
          new Notification('Todo Reminder', {
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'todo-notification',
            requireInteraction: true
          });
        } catch (error) {
          console.error('Failed to show browser notification:', error);
        }
      }

      // Play notification sound if enabled and tab is visible
      if (preferences.soundEnabled && document.hasFocus() && document.visibilityState === 'visible') {
        try {
          const audio = new Audio('/assets/sounds/notification.mp3');
          audio.volume = 0.4;
          audio.play().catch(error => {
            if (error.name !== 'NotAllowedError') {
              console.error('Failed to play notification sound:', error);
            }
          });
        } catch (error) {
          console.error('Failed to play notification sound:', error);
        }
      }
    }, [preferences.enabled, preferences.soundEnabled]);

    /**
     * Checks for due tasks and sends notifications based on preferences
     * Implements cooldown periods to prevent notification spam
     * 
     * @param todos - Array of todos to check for due dates
     */
    const checkAndNotifyDueTasks = useCallback((todos: Todo[]) => {
      if (!preferences.enabled || !preferences.dueDateReminders.enabled) return;

      const now = new Date();
      const currentTime = now.getTime();

      // Define notification cooldown periods to prevent spam
      const COOLDOWN = {
        BEFORE_DUE: 1 * 60 * 1000,     // 1 minute for upcoming reminders
        WHEN_DUE: 1 * 60 * 1000,       // 1 minute for due soon reminders
        OVERDUE: 5 * 60 * 1000         // 5 minutes for overdue reminders
      };

      todos.forEach(todo => {
        if (todo.isCompleted || !todo.dueDate) return;

        const dueDate = new Date(todo.dueDate);
        const minutesUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60));
        const lastNotificationTime = lastNotificationTimes[todo.id] || 0;
        const timeSinceLastNotification = currentTime - lastNotificationTime;

        let shouldNotify = false;
        let notificationType: 'info' | 'warning' | 'error' = 'info';
        let message = '';
        let requiredCooldown = COOLDOWN.BEFORE_DUE;

        // Check overdue tasks
        if (preferences.dueDateReminders.whenOverdue && minutesUntilDue < 0) {
          shouldNotify = true;
          notificationType = 'error';
          const overdueDuration = Math.abs(minutesUntilDue);
          message = overdueDuration < 60
            ? `⚠️ OVERDUE: "${todo.title}" is overdue by ${overdueDuration} minutes!`
            : `⚠️ OVERDUE: "${todo.title}" is overdue by ${Math.floor(overdueDuration / 60)} hours and ${overdueDuration % 60} minutes!`;
          requiredCooldown = COOLDOWN.OVERDUE;
        }
        // Check tasks due very soon (within 5 minutes)
        else if (preferences.dueDateReminders.whenDue && minutesUntilDue >= 0 && minutesUntilDue <= 5) {
          shouldNotify = true;
          notificationType = 'warning';
          message = minutesUntilDue === 0
            ? `⏰ DUE NOW: "${todo.title}" is due right now!`
            : `⏰ DUE SOON: "${todo.title}" is due in ${minutesUntilDue} minutes!`;
          requiredCooldown = COOLDOWN.WHEN_DUE;
        }
        // Check upcoming tasks based on user preference
        else if (preferences.dueDateReminders.beforeDue && minutesUntilDue > 5 && minutesUntilDue <= preferences.dueDateReminders.beforeDue) {
          shouldNotify = true;
          notificationType = 'info';
          message = `🔔 UPCOMING: "${todo.title}" will be due in ${minutesUntilDue} minutes`;
          requiredCooldown = COOLDOWN.BEFORE_DUE;
        }

        // Send notification if conditions are met and cooldown period has passed
        if (shouldNotify && timeSinceLastNotification >= requiredCooldown) {
          showNotification(message, notificationType, true);
          setLastNotificationTimes(prev => ({
            ...prev,
            [todo.id]: currentTime
          }));
        }
      });
    }, [preferences, lastNotificationTimes, showNotification]);

    /**
     * Watch for notification permission changes and handle accordingly
     */
    useEffect(() => {
      if (!('Notification' in window)) return;

      const handlePermissionChange = () => {
        const granted = Notification.permission === 'granted';
        setHasPermission(granted);
        
        // Disable notifications if permissions are revoked
        if (!granted) {
          setPreferences(prev => ({ 
            ...prev, 
            enabled: false
          }));
        }
      };

      // Check initial permission
      handlePermissionChange();

      // Set up permission change listener for supported browsers
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' })
          .then(permissionStatus => {
            permissionStatus.onchange = handlePermissionChange;
          })
          .catch(error => {
            console.error('Failed to query notification permissions:', error);
          });
      }
    }, []);

    /**
     * Add periodic check for due tasks when notifications are enabled
     */
    useEffect(() => {
      if (!preferences.enabled || !preferences.dueDateReminders.enabled) {
        return;
      }

      // Check immediately on mount or preferences change
      checkAndNotifyDueTasks(window.__TODOS__ || []);

      // Set up periodic check every minute
      const interval = setInterval(() => {
        checkAndNotifyDueTasks(window.__TODOS__ || []);
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, [preferences.enabled, preferences.dueDateReminders.enabled, checkAndNotifyDueTasks]);

    /**
     * Request notification permissions from the browser
     * @returns Promise<boolean> Whether permission was granted
     */
    const requestPermission = async () => {
      if (!('Notification' in window)) {
        return false;
      }

      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setHasPermission(granted);
        return granted;
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    };

    /**
     * Updates notification preferences while maintaining nested structure
     */
    const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
      setPreferences(prev => {
        const updated = { ...prev };
        
        // Handle nested dueDateReminders
        if (newPrefs.dueDateReminders) {
          updated.dueDateReminders = {
            ...prev.dueDateReminders,
            ...newPrefs.dueDateReminders
          };
        }
        
        // Handle other preferences
        Object.keys(newPrefs).forEach(key => {
          if (key !== 'dueDateReminders') {
            const k = key as keyof Omit<NotificationPreferences, 'dueDateReminders'>;
            (updated[k] as NotificationPreferences[typeof k]) = (newPrefs[k] as NotificationPreferences[typeof k]);
          }
        });
        
        return updated;
      });
    }, []);

    /**
     * Shows a toast notification
     * @param message - The notification message
     * @param type - The type of notification
     */
    const showToast = useCallback((
      message: string,
      type: 'info' | 'warning' | 'error' | 'success'
    ) => {
      toast(message, {
        type,
        position: "top-right",
        autoClose: type === 'error' ? 5000 : 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      });
    }, []);

    return (
      <NotificationContext.Provider
        value={{
          preferences,
          updatePreferences,
          showNotification,
          checkAndNotifyDueTasks,
          hasPermission,
          requestPermission,
          showToast
        }}
      >
        {children}
        <ToastContainer
          containerId="todo-notifications"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={4}
        />
      </NotificationContext.Provider>
    );
  },
  useNotifications
};

export default NotificationComponents; 