import React from 'react';
import { motion } from 'framer-motion';
import ProgramCard from '../ui/ProgramCard';
import { Program } from '../../../types/question-papers/question-papers.types';
import { questionPaperService } from '../../../api/question-papers/question-papers.api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { FileText } from 'lucide-react';
import { showError } from '../../../utils/notifications';

/**
 * Props for the ProgramList component
 */
interface ProgramListProps {
  onProgramSelect: (program: Program) => void;
}

/**
 * ProgramList Component
 * Displays a grid of available academic programs
 * Features loading states, error handling, and empty state
 * 
 * @param props - Component props
 * @param props.onProgramSelect - Callback when a program is selected
 */
const ProgramList: React.FC<ProgramListProps> = ({ onProgramSelect }) => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load programs on component mount
  React.useEffect(() => {
    fetchPrograms();
  }, []);

  /**
   * Fetches available programs from the API
   * Handles loading states and error scenarios
   */
  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionPaperService.getPrograms();
      if (Array.isArray(data)) {
        setPrograms(data);
      } else {
        const errorMessage = 'Received invalid data format from server';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load programs. Please try again later.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles program selection
   * Updates local state and notifies parent component
   * @param id - ID of the selected program
   */
  const handleSelect = (id: number) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      setSelectedProgram(id);
      onProgramSelect(program);
    }
  };

  // Loading state
  if (isLoading) return <LoadingSpinner />;

  // Error state with retry option
  if (error) return <ErrorDisplay message={error} onRetry={fetchPrograms} />;

  // Empty state
  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100/50 mb-6">
          <FileText className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Programs Available</h3>
        <p className="text-gray-500 mb-6">There are no programs available at the moment.</p>
        <button
          onClick={fetchPrograms}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 shadow-md hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Program grid
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {programs.map((program) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProgramCard
              {...program}
              isSelected={selectedProgram === program.id}
              onSelect={handleSelect}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProgramList; 