import React from 'react';
import { motion } from 'framer-motion';
import ProgramCard from '../ui/ProgramCard';
import { Program } from '../../../services/types/questionpapers.types';
import { questionPaperService } from '../../../services/api/questionPaperService';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { FileText } from 'lucide-react';

interface ProgramListProps {
  onProgramSelect: (program: Program) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({ onProgramSelect }) => {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await questionPaperService.getPrograms();
      // DRF might return either an array directly or a results property
      const programs = Array.isArray(data) ? data : data.results || [];
      setPrograms(programs);
    } catch (error) {
      console.error('Failed to load programs:', error);
      setError('Failed to load programs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (id: number) => {
    const program = programs.find(p => p.id === id);
    if (program) {
      setSelectedProgram(id);
      onProgramSelect(program);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchPrograms} />;

  if (!programs || programs.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
        <FileText className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-6 text-xl font-semibold text-gray-900">No Programs Available</h3>
        <p className="mt-2 text-gray-500">There are no programs available at the moment.</p>
        <button
          onClick={fetchPrograms}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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