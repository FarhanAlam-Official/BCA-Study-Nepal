import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  message: string | null;
  className?: string;
}

/**
 * A component for displaying form-related success messages
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