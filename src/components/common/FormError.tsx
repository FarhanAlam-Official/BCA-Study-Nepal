import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string | null;
  className?: string;
  id?: string;
}

/**
 * A component for displaying form-related error messages
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