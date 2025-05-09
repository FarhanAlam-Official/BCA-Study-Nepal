/**
 * ErrorBoundary Component
 * 
 * A React error boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Features:
 * - Catches and handles runtime errors in child components
 * - Displays a user-friendly error message
 * - Provides a reload button for recovery
 * - Maintains error state management
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;  // Child components to be rendered and monitored for errors
}

interface State {
  hasError: boolean;    // Tracks whether an error has occurred
  error?: Error;        // Stores the error object if one occurs
}

class ErrorBoundary extends Component<Props, State> {
  // Initialize state with no errors
  public state: State = {
    hasError: false
  };

  /**
   * Static method called when an error is thrown in a child component
   * Updates the state to reflect that an error has occurred
   * 
   * @param error - The error that was thrown
   * @returns New state object with error information
   */
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error has been caught
   * Logs error details for debugging purposes
   * 
   * @param error - The error object
   * @param errorInfo - Additional information about the error
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Maintain this console.error as it's essential for debugging and monitoring
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    // Display fallback UI if an error has occurred
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // Render children normally when no error has occurred
    return this.props.children;
  }
}

export default ErrorBoundary;