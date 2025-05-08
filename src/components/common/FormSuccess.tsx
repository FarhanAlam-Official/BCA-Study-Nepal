import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Props interface for the FormSuccess component
 * @interface FormSuccessProps
 * @property {string | null} message - The success message to display. Component won't render if null
 * @property {string} [className] - Optional CSS classes to apply to the container
 */
interface FormSuccessProps {
  message: string | null;
  className?: string;
}

/**
 * A component for displaying form-related success messages in a consistent style
 * 
 * @component
 * @example
 * ```tsx
 * <FormSuccess 
 *   message="Your changes have been saved successfully"
 *   className="mt-2"
 * />
 * ```
 * 
 * Features:
 * - Renders nothing when message is null
 * - Displays success message with a check circle icon
 * - Consistent styling with green background and text
 * - Matches the styling pattern of FormError for consistency
 */
const FormSuccess: React.FC<FormSuccessProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-start gap-2 text-green-600 bg-green-50 p-2 rounded-md text-sm ${className}`}>
      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormSuccess; 