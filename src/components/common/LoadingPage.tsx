import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * A full-page loading component that displays a centered loading spinner with text
 * 
 * @component
 * @example
 * ```tsx
 * // Use when loading an entire page or during initial app load
 * <LoadingPage />
 * ```
 * 
 * Features:
 * - Full viewport height coverage
 * - Centered loading spinner and text
 * - Light gray background for visual distinction
 * - Uses large variant of LoadingSpinner component
 * - Accessible loading text for screen readers
 */
const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;