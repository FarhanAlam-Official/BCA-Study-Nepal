import { createContext } from 'react';
import { NotificationContextType } from './notificationTypes';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined); 