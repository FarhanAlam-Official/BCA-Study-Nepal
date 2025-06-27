/**
 * Base notification context module
 * Provides the foundation for the notification system
 * @module notificationContext.base
 */

import { createContext } from 'react';
import { NotificationContextType } from './notificationTypes';

/**
 * Base notification context with undefined default value
 * Must be provided by NotificationProvider component
 * @see NotificationContextType
 */
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined); 