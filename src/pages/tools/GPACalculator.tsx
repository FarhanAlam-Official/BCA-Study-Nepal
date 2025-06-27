/**
 * GPA Calculator Page Component
 * 
 * A container component that renders the GPA Calculator tool.
 * Provides a full-height container for the calculator component
 * with proper layout management.
 * 
 * Features:
 * - Responsive full-height layout
 * - Clean integration with the GPA Calculator component
 * - Minimal wrapper to maintain separation of concerns
 */
import React from 'react';
import GPACalculator from '../../components/tools/GPACalculator';

const GPACalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <GPACalculator />
    </div>
  );
};

export default GPACalculatorPage; 