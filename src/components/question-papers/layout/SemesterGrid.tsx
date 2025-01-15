import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SemesterCard from '../ui/SemesterCard';
import { questionPaperService } from '../../../services/api/questionPaperService';
import { Program } from '../../../services/types/questionpapers.types';

interface SemesterGridProps {
  selectedProgram: Program;
  selectedSemester: number | null;
  onSemesterSelect: (semester: number) => void;
}

const SemesterGrid: React.FC<SemesterGridProps> = ({
  selectedProgram,
  selectedSemester,
  onSemesterSelect,
}) => {
  const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchSubjectCounts = async () => {
      try {
        const response = await questionPaperService.getByProgram(selectedProgram.id);
        const counts = response.semesters.reduce((acc, sem) => {
          acc[sem.semester] = sem.subjects.length;
          return acc;
        }, {} as Record<number, number>);
        setSubjectCounts(counts);
      } catch (error) {
        console.error('Error fetching subject counts:', error);
      }
    };

    fetchSubjectCounts();
  }, [selectedProgram.id]);

  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {semesters.map((semester) => (
          <SemesterCard
            key={semester}
            semester={semester}
            subjectCount={subjectCounts[semester] || 0}
            isSelected={selectedSemester === semester}
            onSelect={() => onSemesterSelect(semester)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SemesterGrid; 