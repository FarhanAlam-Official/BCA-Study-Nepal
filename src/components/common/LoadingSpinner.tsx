import React from 'react';

/**
 * Props interface for the LoadingSpinner component
 * @interface LoadingSpinnerProps
 * @property {'small' | 'medium' | 'large'} [size='medium'] - The size variant of the spinner
 */
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

/**
 * A reusable loading spinner component that provides visual feedback during loading states
 * 
 * @component
 * @example
 * ```tsx
 * // Default medium size
 * <LoadingSpinner />
 * 
 * // Small size for inline loading
 * <LoadingSpinner size="small" />
 * 
 * // Large size for full-page loading
 * <LoadingSpinner size="large" />
 * ```
 * 
 * Features:
 * - Three size variants: small (16px), medium (32px), and large (48px)
 * - Smooth animation using Tailwind's animate-spin
 * - Consistent indigo brand color
 * - Centered layout by default
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;