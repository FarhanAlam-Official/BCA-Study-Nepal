import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Props interface for the FormError component
 * @interface FormErrorProps
 * @property {string | null} message - The error message to display. Component won't render if null
 * @property {string} [className] - Optional CSS classes to apply to the container
 * @property {string} [id] - Optional HTML id attribute for the container
 */
interface FormErrorProps {
  message: string | null;
  className?: string;
  id?: string;
}

/**
 * A component for displaying form-related error messages in a consistent style
 * 
 * @component
 * @example
 * ```tsx
 * <FormError 
 *   message="Invalid email address"
 *   className="mt-2"
 *   id="email-error"
 * />
 * ```
 * 
 * Features:
 * - Renders nothing when message is null
 * - Displays error message with an alert circle icon
 * - Consistent styling with red background and text
 * - Accessible with role="alert"
 */
const FormError: React.FC<FormErrorProps> = ({ message, className = '', id }) => {
  if (!message) return null;
  
  return (
    <div 
      className={`flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-md text-sm ${className}`}
      id={id}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormError; 