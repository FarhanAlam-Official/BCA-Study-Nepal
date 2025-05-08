import React from 'react';
import { motion } from 'framer-motion';
import SemesterCard from './SemesterCard';

/**
 * Interface for the data structure representing semester information
 * @interface SemesterData
 * @property {string | number} semester - Semester identifier (can be number or 'all')
 * @property {number} count - Number of items (notes/papers/syllabus) for this semester
 */
interface SemesterData {
  semester: string | number;
  count: number;
}

/**
 * Props interface for the SemesterGrid component
 * @interface SemesterGridProps
 * @property {'notes' | 'questionPaper' | 'syllabus'} variant - Type of content being displayed
 * @property {string | number | null} selectedSemester - Currently selected semester
 * @property {(semester: string | number) => void} onSemesterSelect - Callback when a semester is selected
 * @property {SemesterData[]} data - Array of semester data to display
 * @property {string} [className] - Optional additional CSS classes
 */
interface SemesterGridProps {
  variant: 'notes' | 'questionPaper' | 'syllabus';
  selectedSemester: string | number | null;
  onSemesterSelect: (semester: string | number) => void;
  data: SemesterData[];
  className?: string;
}

/**
 * SemesterGrid Component
 * 
 * Displays a responsive grid of semester cards with animation effects.
 * Used for showing semester-wise content like notes, question papers, or syllabus.
 * 
 * Features:
 * - Responsive grid layout (2 columns on mobile, 3 on tablet, 4 on desktop)
 * - Animated entrance effects using Framer Motion
 * - Handles selection state for each semester card
 * - Flexible content type support through variant prop
 * 
 * @component
 * @example
 * ```tsx
 * <SemesterGrid
 *   variant="notes"
 *   selectedSemester="1"
 *   onSemesterSelect={(sem) => handleSemesterSelect(sem)}
 *   data={[
 *     { semester: 1, count: 5 },
 *     { semester: 2, count: 3 }
 *   ]}
 * />
 * ```
 */
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
      {/* Responsive grid layout with configurable columns */}
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