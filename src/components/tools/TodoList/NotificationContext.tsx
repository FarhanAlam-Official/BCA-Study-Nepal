import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Todo } from './types';
import {
  NotificationPreferences,
  defaultPreferences,
  STORAGE_KEYS
} from './notificationTypes';
import { toast, ToastContainer } from 'react-toastify';

interface NotificationContextType {
  preferences: NotificationPreferences;
  updatePreferences: (newPrefs: Partial<NotificationPreferences>) => void;
  showNotification: (message: string, type: 'info' | 'warning' | 'error' | 'success', isGlobal?: boolean) => void;
  checkAndNotifyDueTasks: (todos: Todo[]) => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationComponents = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
      } catch {
        return defaultPreferences;
      }
    });

    const [hasPermission, setHasPermission] = useState(false);
    const [lastNotificationTimes, setLastNotificationTimes] = useState<Record<string, number>>(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LAST_NOTIFICATIONS);
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    });

    // Persist preferences whenever they change
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save notification preferences:', error);
      }
    }, [preferences]);

    // Persist last notification times
    useEffect(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_NOTIFICATIONS, JSON.stringify(lastNotificationTimes));
      } catch (error) {
        console.error('Failed to save last notification times:', error);
      }
    }, [lastNotificationTimes]);

    const showNotification = useCallback((
      message: string, 
      type: 'info' | 'warning' | 'error' | 'success',
      isGlobal: boolean = false
    ) => {
      if (!preferences.enabled) {
        console.log('Notifications are disabled');
        return;
      }

      console.log('Showing notification:', { message, type, isGlobal });

      // Use toast with specific container based on notification type
      const containerId = isGlobal ? "global-notifications" : "todo-notifications";
      console.log('Using container:', containerId);

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

      // Show browser notification for important alerts
      if (type === 'warning' || type === 'error') {
        try {
          if (Notification.permission === 'granted') {
            new Notification('Todo Reminder', {
              body: message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: 'todo-notification',
              requireInteraction: true
            });
          }
        } catch (error) {
          console.error('Failed to show browser notification:', error);
        }
      }

      // Play sound if enabled
      if (preferences.soundEnabled) {
        try {
          const audio = new Audio('/assets/sounds/notification.mp3');
          audio.volume = 0.5;
          audio.play().catch(console.error);
        } catch (error) {
          console.error('Failed to play notification sound:', error);
        }
      }
    }, [preferences.enabled, preferences.soundEnabled]);

    const checkAndNotifyDueTasks = useCallback((todos: Todo[]) => {
      if (!preferences.enabled || !preferences.dueDateReminders.enabled) {
        console.log('Due date reminders are disabled');
        return;
      }

      const now = new Date();
      const currentTime = now.getTime();

      todos.forEach(todo => {
        if (todo.isCompleted || !todo.dueDate) return;

        const dueDate = new Date(todo.dueDate);
        const minutesUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60));
        const lastNotificationTime = lastNotificationTimes[todo.id] || 0;
        const timeSinceLastNotification = currentTime - lastNotificationTime;

        console.log('Checking todo:', { 
          title: todo.title, 
          minutesUntilDue, 
          timeSinceLastNotification,
          dueDate: dueDate.toLocaleTimeString(),
          now: now.toLocaleTimeString()
        });

        // Shorter cooldown periods for more frequent notifications
        const COOLDOWN = {
          BEFORE_DUE: 1 * 60 * 1000,     // 1 minute for upcoming reminders
          WHEN_DUE: 1 * 60 * 1000,       // 1 minute for due soon reminders
          OVERDUE: 5 * 60 * 1000         // 5 minutes for overdue reminders
        };

        let shouldNotify = false;
        let notificationType: 'info' | 'warning' | 'error' = 'info';
        let message = '';
        let requiredCooldown = COOLDOWN.BEFORE_DUE;

        // Check overdue tasks first
        if (preferences.dueDateReminders.whenOverdue && minutesUntilDue < 0) {
          shouldNotify = true;
          notificationType = 'error';
          const overdueDuration = Math.abs(minutesUntilDue);
          message = overdueDuration < 60
            ? `⚠️ OVERDUE: "${todo.title}" is overdue by ${overdueDuration} minutes!`
            : `⚠️ OVERDUE: "${todo.title}" is overdue by ${Math.floor(overdueDuration / 60)} hours and ${overdueDuration % 60} minutes!`;
          requiredCooldown = COOLDOWN.OVERDUE;
          console.log('Task is overdue:', { title: todo.title, overdueDuration });
        }
        // Check tasks due very soon (within 5 minutes)
        else if (preferences.dueDateReminders.whenDue && minutesUntilDue >= 0 && minutesUntilDue <= 5) {
          shouldNotify = true;
          notificationType = 'warning';
          message = minutesUntilDue === 0
            ? `⏰ DUE NOW: "${todo.title}" is due right now!`
            : `⏰ DUE SOON: "${todo.title}" is due in ${minutesUntilDue} minutes!`;
          requiredCooldown = COOLDOWN.WHEN_DUE;
          console.log('Task is due soon:', { title: todo.title, minutesUntilDue });
        }
        // Check upcoming tasks based on user preference
        else if (preferences.dueDateReminders.beforeDue && minutesUntilDue > 5 && minutesUntilDue <= preferences.dueDateReminders.beforeDue) {
          shouldNotify = true;
          notificationType = 'info';
          message = `🔔 UPCOMING: "${todo.title}" will be due in ${minutesUntilDue} minutes`;
          requiredCooldown = COOLDOWN.BEFORE_DUE;
          console.log('Task is upcoming:', { title: todo.title, minutesUntilDue });
        }

        if (shouldNotify && timeSinceLastNotification >= requiredCooldown) {
          console.log('Should notify:', { 
            message, 
            type: notificationType, 
            minutesUntilDue,
            timeSinceLastNotification,
            requiredCooldown,
            dueDate: dueDate.toLocaleTimeString(),
            now: now.toLocaleTimeString()
          });
          showNotification(message, notificationType, true);
          setLastNotificationTimes(prev => ({
            ...prev,
            [todo.id]: currentTime
          }));
        } else if (shouldNotify) {
          console.log('Skipping notification due to cooldown:', {
            title: todo.title,
            timeSinceLastNotification,
            requiredCooldown
          });
        }
      });
    }, [preferences, lastNotificationTimes, showNotification]);

    // Watch for permission changes
    useEffect(() => {
      if (!('Notification' in window)) return;

      const handlePermissionChange = () => {
        const granted = Notification.permission === 'granted';
        setHasPermission(granted);
        
        // If permissions are revoked, disable notifications
        if (!granted) {
          setPreferences(prev => ({ 
            ...prev, 
            enabled: false
          }));
        }
      };

      // Check initial permission
      handlePermissionChange();

      // Some browsers support the permissionchange event
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'notifications' }).then(permissionStatus => {
          permissionStatus.onchange = handlePermissionChange;
        });
      }
    }, []);

    // Add periodic check for due tasks
    useEffect(() => {
      if (!preferences.enabled || !preferences.dueDateReminders.enabled) {
        return;
      }

      // Check immediately
      checkAndNotifyDueTasks(window.__TODOS__ || []);

      // Then check every minute
      const interval = setInterval(() => {
        checkAndNotifyDueTasks(window.__TODOS__ || []);
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, [preferences.enabled, preferences.dueDateReminders.enabled, checkAndNotifyDueTasks]);

    const requestPermission = async () => {
      if (!('Notification' in window)) {
        return false;
      }

      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      return granted;
    };

    // Add back the updatePreferences function
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

    return (
      <NotificationContext.Provider
        value={{
          preferences,
          updatePreferences,
          showNotification,
          checkAndNotifyDueTasks,
          hasPermission,
          requestPermission
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
        />
      </NotificationContext.Provider>
    );
  },
  useNotifications
};

export default NotificationComponents; 