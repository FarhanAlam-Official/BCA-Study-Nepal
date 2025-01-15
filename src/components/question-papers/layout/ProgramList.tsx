import React from 'react';
import { motion } from 'framer-motion';
import ProgramCard from '../ui/ProgramCard';
import { Program } from '../../../services/types/questionpapers.types';
import { questionPaperService } from '../../../services/api/questionPaperService';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';

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
      const data = await questionPaperService.getPrograms();
      setPrograms(data);
    } catch (error) {
      console.error('Failed to load programs:', error);
      setError('Failed to load programs');
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