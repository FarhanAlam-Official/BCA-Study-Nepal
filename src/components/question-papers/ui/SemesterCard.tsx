import React from 'react';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';

interface SemesterCardProps {
  semester: number;
  subjectCount: number;
  isSelected: boolean;
  onSelect: () => void;
}

const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  subjectCount,
  isSelected,
  onSelect,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full p-6 rounded-xl border ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50' 
          : 'border-gray-200 bg-white hover:border-indigo-200'
      } transition-colors duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Book className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900">
            Semester {semester}
          </h3>
          <p className="text-sm text-gray-500">
            {subjectCount} {subjectCount === 1 ? 'Subject' : 'Subjects'}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export default SemesterCard; 