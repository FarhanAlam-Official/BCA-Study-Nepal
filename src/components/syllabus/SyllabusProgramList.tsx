/**
 * @file SyllabusProgramList.tsx
 * @description A component that displays a grid of available academic programs with their details.
 * Features smooth animations, error handling, and loading states.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SyllabusProgram } from '../../types/syllabus/syllabus.types';
import { syllabusService } from '../../api/syllabus/syllabus.api';
import { GraduationCap, Clock, Users } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { showError } from '../../utils/notifications';

/**
 * Props interface for the SyllabusProgramList component
 * @interface SyllabusProgramListProps
 */
interface SyllabusProgramListProps {
  /** Callback function triggered when a program is selected */
  onProgramSelect: (program: SyllabusProgram) => void;
}

/**
 * Interface for error state management
 * @interface ErrorState
 */
interface ErrorState {
  /** Main error message */
  message: string;
  /** Additional error details */
  details?: string;
  /** Error severity level */
  severity?: 'error' | 'warning' | 'info';
}

/**
 * SyllabusProgramList Component
 * Displays a grid of available programs for syllabus selection with enhanced error handling
 * and smooth animations for better user experience.
 */
const SyllabusProgramList: React.FC<SyllabusProgramListProps> = ({ onProgramSelect }) => {
  const [programs, setPrograms] = useState<SyllabusProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await syllabusService.getPrograms();
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setError({
            message: 'No syllabus programs available',
            details: 'Our team is currently working on adding syllabus programs. Please check back later.',
            severity: 'info'
          });
        } else {
          setPrograms(data);
        }
      } else {
        setError({
          message: 'Invalid response format from server',
          details: 'The server response was not in the expected format. This might be a temporary issue.',
          severity: 'error'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError({
        message: 'Failed to load syllabus programs',
        details: `We encountered an error while loading the programs. ${errorMessage}. Please try again or contact support if the issue persists.`,
        severity: 'error'
      });
      showError('Failed to load syllabus programs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

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

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <ErrorDisplay 
        message={error.message}
        details={error.details}
        severity={error.severity}
        onRetry={fetchPrograms}
        onDismiss={() => setError(null)}
        autoDismiss={error.severity === 'info'}
        autoDismissDuration={6000}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {programs.map((program) => (
        <motion.button
          key={program.id}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.03,
            y: -4,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onProgramSelect(program)}
          className="group relative overflow-hidden bg-white h-[280px] rounded-2xl shadow-sm 
                    border border-gray-100 hover:border-indigo-200 hover:shadow-lg
                    transition-all duration-300 ease-out text-left"
          type="button"
          aria-label={`Select ${program.name} program`}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-all duration-300" 
               aria-hidden="true"
          />
          
          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Header with logo and program name */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors"
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <GraduationCap className="w-7 h-7 text-indigo-600" aria-hidden="true" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {program.name}
                </h3>
                <h4 className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                  {program.full_name}
                </h4>
              </div>
            </div>

            {/* Program details */}
            <div className="flex-1 flex flex-col">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-auto group-hover:text-gray-700 transition-colors">
                {program.description || `Explore the comprehensive syllabus for ${program.full_name}`}
              </p>
              
              {/* Program stats with enhanced animations */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <motion.div 
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Clock className="w-4 h-4 group-hover:text-indigo-600 transition-colors" aria-hidden="true" />
                  <span className="text-sm group-hover:text-gray-700 transition-colors">
                    {program.duration_years} Years
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-gray-600"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="w-4 h-4 group-hover:text-indigo-600 transition-colors" aria-hidden="true" />
                  <span className="text-sm group-hover:text-gray-700 transition-colors">
                    {program.duration_years * 2} Semesters
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.button>
      ))}

      {programs.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="col-span-full text-center py-12"
          role="status"
        >
          <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Programs Available
          </h3>
          <p className="text-gray-500">
            We're currently working on adding programs. Please check back later.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SyllabusProgramList; 