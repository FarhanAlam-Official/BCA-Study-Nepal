/**
 * TimerCompletionModal Component
 * 
 * A modal that appears when a timer (pomodoro or break) is completed.
 * Provides options to start the next timer, snooze, or finish the session.
 * Uses React Portal for proper modal rendering and accessibility.
 */
import React from 'react';
import { createPortal } from 'react-dom';
import { Plus, Minus, Play, Coffee, X } from 'lucide-react';

/**
 * Props interface for the TimerCompletionModal component
 * @property {boolean} isOpen - Controls the visibility of the modal
 * @property {'pomodoro' | 'shortBreak' | 'longBreak'} mode - Current timer mode
 * @property {() => void} onClose - Callback function to close the modal
 * @property {(minutes: number) => void} onSnooze - Callback function for snooze action
 * @property {() => void} onStartNext - Callback function to start the next timer
 * @property {() => void} onFinish - Callback function to end the session
 * @property {string} [currentTask] - Optional current task name being worked on
 */
interface TimerCompletionModalProps {
  isOpen: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  onClose: () => void;
  onSnooze: (minutes: number) => void;
  onStartNext: () => void;
  onFinish: () => void;
  currentTask?: string;
}

const TimerCompletionModal: React.FC<TimerCompletionModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSnooze,
  onStartNext,
  onFinish,
  currentTask
}) => {
  // State for snooze duration (1-15 minutes)
  const [snoozeMinutes, setSnoozeMinutes] = React.useState(1);

  // Early return if modal is not open
  if (!isOpen) return null;

  // Determine modal content based on timer mode
  const isBreak = mode === 'shortBreak' || mode === 'longBreak';
  const modalTitle = isBreak ? 'Break Complete!' : 'Pomodoro Complete!';
  const modalMessage = isBreak
    ? `Time to get back to work${currentTask ? ` on "${currentTask}"` : ''}!`
    : 'Time for a well-deserved break!';

  /**
   * Handles the snooze action
   * Calls onSnooze with current snooze duration and closes the modal
   */
  const handleSnooze = () => {
    onSnooze(snoozeMinutes);
    onClose();
  };

  /**
   * Handles starting the next timer
   * Calls onStartNext and closes the modal
   */
  const handleStartNext = () => {
    onStartNext();
    onClose();
  };

  /**
   * Handles finishing the session
   * Calls onFinish and closes the modal
   */
  const handleFinish = () => {
    onFinish();
    onClose();
  };

  // Get portal target for modal rendering
  const portalTarget = typeof document !== 'undefined' ? document.body : null;
  if (!portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with click handler to close */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Gradient Banner */}
        <div className={`h-2 ${isBreak ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'}`} />
        
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
            {isBreak ? (
              <Play className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Coffee className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>

          {/* Title and Message */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {modalTitle}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            {modalMessage}
          </p>

          {/* Snooze Duration Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setSnoozeMinutes(Math.max(1, snoozeMinutes - 1))}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Decrease snooze time"
            >
              <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="w-20 text-center">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">{snoozeMinutes}</span>
              <span className="text-gray-600 dark:text-gray-300 ml-1">min</span>
            </div>
            <button
              onClick={() => setSnoozeMinutes(Math.min(15, snoozeMinutes + 1))}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Increase snooze time"
            >
              <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleStartNext}
              className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                isBreak 
                  ? 'bg-indigo-500 hover:bg-indigo-600' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isBreak ? 'Start Working' : 'Start Break'}
            </button>
            <button
              onClick={handleSnooze}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-white font-medium transition-colors"
            >
              Snooze
            </button>
            <button
              onClick={handleFinish}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Finish Session
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalTarget
  );
};

export default TimerCompletionModal; 