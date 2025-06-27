/**
 * Custom hook for accessing the Pomodoro timer context throughout the application.
 * This hook provides access to timer state and control methods from the PomodoroContext.
 */

import { useContext } from 'react';
import PomodoroContext, { PomodoroContextType } from '../context/PomodoroContext';

/**
 * Hook to access Pomodoro timer context
 * @returns {PomodoroContextType} The Pomodoro context containing timer state and control methods
 * @throws {Error} If used outside of PomodoroProvider context
 */
export const usePomodoroTimer = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroTimer must be used within a PomodoroProvider');
  }
  return context;
}; 