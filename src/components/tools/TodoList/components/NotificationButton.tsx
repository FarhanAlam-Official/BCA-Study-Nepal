import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, BellSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import NotificationComponents from '../../../../context/NotificationContext';

/**
 * Interface for reminder option items
 */
interface ReminderOption {
  value: number;
  label: string;
}

/**
 * NotificationButton component provides a UI for managing notification preferences
 * Includes a button that shows notification status and a popup settings panel
 */
const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  const { 
    preferences, 
    updatePreferences, 
    hasPermission, 
    requestPermission 
  } = NotificationComponents.useNotifications();

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          buttonRef.current && 
          popupRef.current && 
          !buttonRef.current.contains(event.target as Node) && 
          !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Set initial popup position when opened
  const handleTogglePopup = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPopupPosition({
          top: rect.bottom,
          right: window.innerWidth - rect.right
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);  // Add scroll listener to update position
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

  /**
   * Handles toggling notifications on/off
   * Requests permission if needed when enabling notifications
   */
  const handleToggle = async () => {
    if (!preferences.enabled && !hasPermission) {
      setIsLoading(true);
      setError(null);
      try {
        const granted = await requestPermission();
        if (!granted) {
          setError('Please allow notifications in your browser settings to enable notifications.');
          return;
        }
      } catch {
        setError('Failed to request notification permissions.');
        return;
      } finally {
        setIsLoading(false);
      }
    }

    updatePreferences({ enabled: !preferences.enabled });
  };

  // Available reminder intervals for the dropdown
  const reminderOptions: ReminderOption[] = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
    { value: 1440, label: '1 day' }
  ];

  /**
   * Renders the notification settings popup content
   * @returns React element or null if popup is closed
   */
  const renderPortalContent = () => {
    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0" 
        style={{ pointerEvents: 'none', zIndex: 40 }}
      >
        <div 
          ref={popupRef}
          className="fixed w-80"
          style={{ 
            position: 'fixed',
            top: `${popupPosition.top}px`,
            right: `${popupPosition.right}px`,
            pointerEvents: 'auto',
            zIndex: 40,
            transform: 'translateY(8px)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-4"
          >
            <div className="space-y-4">
              {/* Main notification toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  <button
                    onClick={handleToggle}
                    disabled={isLoading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' :
                      preferences.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        preferences.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {error && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {preferences.enabled && (
                <div className="space-y-4">
                  {/* Due date reminder settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Due Date Reminders</p>
                        <p className="text-xs text-gray-500">Get notified about upcoming tasks</p>
                      </div>
                      <button
                        onClick={() => updatePreferences({
                          dueDateReminders: {
                            ...preferences.dueDateReminders,
                            enabled: !preferences.dueDateReminders.enabled
                          }
                        })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          preferences.dueDateReminders.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            preferences.dueDateReminders.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {preferences.dueDateReminders.enabled && (
                      <div className="pl-4 space-y-3">
                        {/* Reminder interval selector */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Notify before due</label>
                          <select
                            value={preferences.dueDateReminders.beforeDue}
                            onChange={(e) => updatePreferences({
                              dueDateReminders: {
                                ...preferences.dueDateReminders,
                                beforeDue: Number(e.target.value)
                              }
                            })}
                            className="w-full text-sm border rounded-md px-2 py-1.5"
                          >
                            {reminderOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Due now notifications toggle */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-600">When task is due</label>
                          <button
                            onClick={() => updatePreferences({
                              dueDateReminders: {
                                ...preferences.dueDateReminders,
                                whenDue: !preferences.dueDateReminders.whenDue
                              }
                            })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                              preferences.dueDateReminders.whenDue ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                                preferences.dueDateReminders.whenDue ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Overdue notifications toggle */}
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-600">When task is overdue</label>
                          <button
                            onClick={() => updatePreferences({
                              dueDateReminders: {
                                ...preferences.dueDateReminders,
                                whenOverdue: !preferences.dueDateReminders.whenOverdue
                              }
                            })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${
                              preferences.dueDateReminders.whenOverdue ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                                preferences.dueDateReminders.whenOverdue ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sound settings */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Sound</p>
                        <p className="text-xs text-gray-500">Play sound with notifications</p>
                      </div>
                      <button
                        onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          preferences.soundEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={buttonRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTogglePopup}
        disabled={isLoading}
        className={`p-2 rounded-full transition-colors duration-300 relative ${
          isLoading ? 'opacity-50 cursor-not-allowed' :
          preferences.enabled
            ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : preferences.enabled ? (
          <BellIcon className="w-6 h-6" />
        ) : (
          <BellSlashIcon className="w-6 h-6" />
        )}
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {renderPortalContent()}
        </AnimatePresence>,
        document.body
      )}
    </div>
  ) as React.ReactElement;
};

export default NotificationButton;