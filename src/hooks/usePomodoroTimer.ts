import { useContext } from 'react';
import PomodoroContext, { PomodoroContextType } from '../context/PomodoroContext';

export const usePomodoroTimer = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroTimer must be used within a PomodoroProvider');
  }
  return context;
}; 