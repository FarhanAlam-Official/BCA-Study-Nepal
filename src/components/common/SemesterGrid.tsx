import React from 'react';
import { motion } from 'framer-motion';
import SemesterCard from './SemesterCard';

interface SemesterGridProps {
  variant: 'notes' | 'questionPaper';
  selectedSemester: string | number | null;
  onSemesterSelect: (semester: string | number) => void;
  data: {
    semester: string | number;
    count: number;
  }[];
  className?: string;
}

const SemesterGrid: React.FC<SemesterGridProps> = ({
  variant,
  selectedSemester,
  onSemesterSelect,
  data,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div 
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}
      >
        {data.map(({ semester, count }) => (
          <SemesterCard
            key={semester}
            semester={semester}
            count={count}
            isSelected={selectedSemester === semester}
            onSelect={() => onSemesterSelect(semester)}
            variant={variant}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SemesterGrid;