/**
 * Pomodoro Timer Page Component
 * 
 * Container component for the Pomodoro timer application that provides
 * a full-height layout for the timer interface.
 * 
 * Features:
 * - Responsive full-height container
 * - Clean integration with PomodoroTimer component
 * - Minimal wrapper to maintain separation of concerns
 * - Proper layout management for timer display
 */
import React from 'react';
import PomodoroTimer from '../../components/tools/Pomodoro/PomodoroTimer';

const PomodoroPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <PomodoroTimer />
    </div>
  );
};

export default PomodoroPage; 