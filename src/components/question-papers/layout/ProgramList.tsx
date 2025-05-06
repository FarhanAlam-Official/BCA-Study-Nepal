import React from 'react';
import { motion } from 'framer-motion';
import ProgramCard from '../ui/ProgramCard';
import { Program } from '../../../types/question-papers/question-papers.types';
import { questionPaperService } from '../../../api/question-papers/question-papers.api';
import LoadingSpinner from '../../common/LoadingSpinner';
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
  // Memoize programs data to prevent unnecessary re-renders
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Load programs on component mount with caching
  React.useEffect(() => {
    const cachedPrograms = sessionStorage.getItem('questionPaperPrograms');
    const lastFetchTime = sessionStorage.getItem('questionPaperProgramsTimestamp');
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const shouldFetchFromAPI = () => {
      if (!cachedPrograms || !lastFetchTime) return true;
      const timeSinceLastFetch = Date.now() - Number(lastFetchTime);
      return timeSinceLastFetch > CACHE_DURATION;
    };

    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await questionPaperService.getPrograms();
        if (Array.isArray(data)) {
          setPrograms(data);
          // Cache the results
          sessionStorage.setItem('questionPaperPrograms', JSON.stringify(data));
          sessionStorage.setItem('questionPaperProgramsTimestamp', Date.now().toString());
        } else {
          throw new Error('Received invalid data format from server');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to load programs. Please try again later.';
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldFetchFromAPI()) {
      fetchPrograms();
    } else {
      // Use cached data
      const parsedPrograms = cachedPrograms ? JSON.parse(cachedPrograms) : [];
      setPrograms(parsedPrograms);
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles program selection
   * Updates local state and notifies parent component
   * @param id - ID of the selected program
   */
  const handleSelect = React.useCallback((id: number) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      setSelectedProgram(id);
      onProgramSelect(program);
    }
  }, [programs, onProgramSelect]);

  // Loading state
  if (isLoading) return <LoadingSpinner />;

  // Error state with retry option
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <div className="rounded-full bg-red-100/50 p-4 mb-4">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
        <p className="text-gray-500 mb-4">Please try again or contact support if the problem persists.</p>
        <button
          onClick={() => {
            sessionStorage.removeItem('questionPaperPrograms');
            sessionStorage.removeItem('questionPaperProgramsTimestamp');
            window.location.reload();
          }}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md hover:shadow-xl"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  // Empty state
  if (!programs || programs.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 shadow-lg"
      >
        <div className="max-w-sm mx-auto space-y-4">
          <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            No Programs Available
          </h3>
          <p className="text-gray-500 text-lg">
            We're currently working on adding programs. Please check back later.
          </p>
        </div>
      </motion.div>
    );
  }

  // Program grid
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {programs.map((program) => (
        <motion.div
          key={program.id}
          variants={itemVariants}
          className="h-full"
        >
          <ProgramCard
            {...program}
            isSelected={selectedProgram === program.id}
            onSelect={handleSelect}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProgramList; 