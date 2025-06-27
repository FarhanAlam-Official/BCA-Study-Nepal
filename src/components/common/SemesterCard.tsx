import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight, FileText, BookOpen } from 'lucide-react';

/**
 * Props interface for the SemesterCard component
 * @interface SemesterCardProps
 * @property {string | number} semester - Semester identifier (can be number or 'all')
 * @property {number} count - Number of items available for this semester
 * @property {boolean} [isSelected] - Whether this card is currently selected
 * @property {() => void} onSelect - Callback when card is selected
 * @property {'notes' | 'questionPaper' | 'syllabus'} variant - Type of content being displayed
 */
interface SemesterCardProps {
  semester: string | number;
  count: number;
  isSelected?: boolean;
  onSelect: () => void;
  variant: 'notes' | 'questionPaper' | 'syllabus';
}

/**
 * Helper function to get the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} num - The number to get the suffix for
 * @returns {string} The ordinal suffix
 */
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

/**
 * SemesterCard Component
 * 
 * A visually rich card component for displaying semester-wise content information.
 * Features interactive hover states, animations, and dynamic content based on variant type.
 * 
 * Visual Features:
 * - Gradient backgrounds on hover and selection
 * - Scale animation on hover and click
 * - Icon based on content type
 * - Responsive layout with proper spacing
 * - Animated entrance effect
 * 
 * Content Features:
 * - Dynamic icon based on variant (notes/syllabus/question papers)
 * - Ordinal number display for semester numbers
 * - Item count with proper pluralization
 * - "All Semesters" special case handling
 * 
 * @component
 * @example
 * ```tsx
 * <SemesterCard
 *   semester={1}
 *   count={5}
 *   isSelected={false}
 *   onSelect={() => handleSelect(1)}
 *   variant="notes"
 * />
 * ```
 */
const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  count,
  isSelected = false,
  onSelect,
  variant
}) => {
  // Determine if this is the "All Semesters" special case
  const isAll = semester === 'all';
  
  // Select appropriate icon and label based on content variant
  const Icon = variant === 'notes' ? BookOpen : variant === 'syllabus' ? Book : FileText;
  const itemLabel = variant === 'notes' ? 'Notes' : variant === 'syllabus' ? 'Syllabus' : 'Question Papers';
  
  /**
   * Generates the title display with proper ordinal suffix for semester numbers
   * @returns {React.ReactNode} Formatted title with optional ordinal suffix
   */
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
        group relative overflow-hidden rounded-xl cursor-pointer
        transition-all duration-300 ease-out group min-h-[250px]
        ${isSelected
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
          : 'bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 shadow-lg hover:shadow-indigo-500/10'
        }
      `}
    >
      <div className="relative h-full p-6 flex flex-col">
        {/* Icon Section */}
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

        {/* Content Section */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h3 className={`
            text-2xl font-bold
            ${isSelected ? 'text-white' : 'text-gray-900'}
          `}>
            {getTitle()}
          </h3>
          
          <div className="flex flex-col items-center space-y-2">
            {/* Content Type Label */}
            <div className={`
              flex items-center justify-center gap-2 text-sm font-medium
              ${isSelected ? 'text-white/90' : 'text-gray-600'}
            `}>
              <FileText className="w-4 h-4" />
              <span>{itemLabel}</span>
            </div>
            
            {/* Item Count Badge */}
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

        {/* Action Footer */}
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

      {/* Decorative Background Pattern */}
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