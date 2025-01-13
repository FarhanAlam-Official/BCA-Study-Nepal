import React from 'react';
import { motion } from 'framer-motion';
import { Program } from '../../../services/types/questionpapers.types';
import { BookOpen } from 'lucide-react';

interface ProgramCardProps extends Omit<Program, 'slug' | 'is_active'> {
    isSelected: boolean;
    onSelect: (id: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
    id,
    name,
    description,
    duration_years,
    isSelected,
    onSelect,
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(id)}
            className={`
        relative overflow-hidden rounded-xl p-8 cursor-pointer min-h-[220px]
        transition-all duration-300 ease-in-out
        ${isSelected
                    ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-500 shadow-lg'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
                }
      `}
        >
            <div className="flex gap-4 h-full">
                <div className={`
          flex-shrink-0 w-14 h-14 rounded-lg 
          flex items-center justify-center
          ${isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'}
          transition-colors duration-300
        `}>
                    <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                    <motion.h3
                        className={`
              text-xl font-semibold mb-2
              ${isSelected ? 'text-indigo-700' : 'text-gray-900'}
            `}
                    >
                        {name}
                    </motion.h3>
                    <motion.p
                        className={`
              text-sm line-clamp-3 mb-4
              ${isSelected ? 'text-indigo-600' : 'text-gray-500'}
            `}
                    >
                        {description}
                    </motion.p>
                    <div className="mt-auto flex items-center gap-2 text-sm">
                        <span className={`
              px-3 py-1 rounded-full
              ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}
            `}>
                            {duration_years} Years
                        </span>
                        <span className={`
              text-xs
              ${isSelected ? 'text-indigo-500' : 'text-gray-400'}
            `}>
                            • Click to view subjects
                        </span>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isSelected ? 90 : 0 }}
                    className={`
            flex-shrink-0 self-center
            ${isSelected ? 'text-indigo-500' : 'text-gray-400'}
          `}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProgramCard; 