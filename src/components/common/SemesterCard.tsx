import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight, FileText, BookOpen } from 'lucide-react';

interface SemesterCardProps {
  semester: string | number;
  count: number;
  isSelected?: boolean;
  onSelect: () => void;
  variant: 'notes' | 'questionPaper' | 'syllabus';
}

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  count,
  isSelected = false,
  onSelect,
  variant
}) => {
  const isAll = semester === 'all';
  const Icon = variant === 'notes' ? BookOpen : variant === 'syllabus' ? Book : FileText;
  const itemLabel = variant === 'notes' ? 'Notes' : variant === 'syllabus' ? 'Syllabus' : 'Question Papers';
  
  const getTitle = () => {
    if (isAll) return 'All Semesters';
    return (
      <>
        {semester}
        {typeof semester === 'number' && (
          <sup className="text-lg font-medium">{getOrdinalSuffix(semester)}</sup>
        )}
        {' Semester'}
      </>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`
        group relative overflow-hidden rounded-xl aspect-square cursor-pointer
        transition-all duration-300 ease-out group min-h-[270px]
        ${isSelected
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
          : 'bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 shadow-lg hover:shadow-indigo-500/10'
        }
      `}
    >
      <div className="h-full flex flex-col p-5">
        {/* Top Section */}
        <div className="mb-6">
          <div className={`
            p-3 rounded-xl w-fit
            transition-all duration-300
            ${isSelected 
              ? 'bg-white/20 text-white' 
              : 'bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100'
            }
          `}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h3 className={`
            text-2xl font-bold
            ${isSelected ? 'text-white' : 'text-gray-900'}
          `}>
            {getTitle()}
          </h3>
          
          <div className="flex flex-col items-center space-y-2">
            <div className={`
              flex items-center justify-center gap-2 text-sm font-medium
              ${isSelected ? 'text-white/90' : 'text-gray-600'}
            `}>
              <FileText className="w-4 h-4" />
              <span>{itemLabel}</span>
            </div>
            
            <div className={`
              px-4 py-1.5 rounded-full text-sm font-semibold
              transition-all duration-300
              ${isSelected 
                ? 'bg-white/20 text-white' 
                : 'bg-indigo-200/70 text-indigo-700 group-hover:bg-indigo-200'
              }
            `}>
              {count} {count === 1 ? itemLabel.slice(0, -1) : itemLabel}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          <motion.div 
            className={`
              flex items-center justify-between px-4 py-2.5 rounded-lg
              transition-all duration-300
              ${isSelected 
                ? 'bg-white/10' 
                : 'bg-indigo-50/70 group-hover:bg-indigo-100/80'
              }
            `}
          >
            <span className={`
              text-sm font-medium
              ${isSelected ? 'text-white' : 'text-indigo-600'}
            `}>
              View Details
            </span>
            <ArrowRight className={`
              w-4 h-4 transition-transform duration-300
              ${isSelected ? 'text-white translate-x-1' : 'text-indigo-600 group-hover:translate-x-1'}
            `} />
          </motion.div>
        </div>
      </div>

      {/* Pattern overlay */}
      <div className={`
        absolute inset-0 opacity-10
        pointer-events-none
        ${isSelected 
          ? 'bg-gradient-to-br from-white/10 to-transparent' 
          : 'bg-gradient-to-br from-indigo-50 to-transparent group-hover:opacity-20'
        }
      `} />
    </motion.div>
  );
};

export default SemesterCard; 