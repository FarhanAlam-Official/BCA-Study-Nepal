import React from 'react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Type definition for error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Props interface for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** The error message to display */
  message: string;
  /** Optional callback function for retry action */
  onRetry?: () => void;
  /** Optional callback function for dismiss action */
  onDismiss?: () => void;
  /** Optional error severity level */
  severity?: ErrorSeverity;
  /** Optional additional details about the error */
  details?: string;
  /** Optional custom retry button text */
  retryText?: string;
  /** Optional flag to auto-dismiss the error after a duration */
  autoDismiss?: boolean;
  /** Optional duration in milliseconds before auto-dismissing */
  autoDismissDuration?: number;
}

/**
 * Configuration for different severity levels
 */
const severityConfig = {
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    title: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    borderColor: 'border-yellow-200',
    bgColor: 'bg-yellow-50',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    title: 'Warning'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    title: 'Information'
  }
};

/**
 * ErrorDisplay Component
 * 
 * A flexible error display component that supports different severity levels,
 * animations, auto-dismiss, and multiple actions.
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message,
  onRetry,
  onDismiss,
  severity = 'error',
  details,
  retryText = 'Try Again',
  autoDismiss = false,
  autoDismissDuration = 5000
}) => {
  const config = severityConfig[severity];

  // Handle auto-dismiss
  React.useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismissDuration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDismissDuration, onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col items-center justify-center min-h-[200px] text-center px-6 py-4 rounded-lg border ${config.borderColor} ${config.bgColor}`}
        role="alert"
        aria-live="polite"
      >
        <config.icon className={`h-12 w-12 ${config.iconColor} mb-4`} aria-hidden="true" />
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-gray-700 mb-2 max-w-md">
          {message}
        </p>
        
        {details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <button
              onClick={() => {}}
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
              aria-expanded="true"
            >
              View Details
            </button>
            <p className="mt-2 text-sm text-gray-500 bg-white/50 p-3 rounded-md">
              {details}
            </p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-4">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${config.buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              type="button"
            >
              {retryText}
            </motion.button>
          )}
          
          {onDismiss && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDismiss}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              type="button"
            >
              Dismiss
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;