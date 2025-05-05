import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SyllabusProgram } from '../../types/syllabus/syllabus.types';
import { syllabusService } from '../../api/syllabus/syllabus.api';
import { GraduationCap } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { useAuth } from '../../hooks/useAuth';

interface SyllabusProgramListProps {
  onProgramSelect: (program: SyllabusProgram) => void;
}

/**
 * SyllabusProgramList Component
 * Displays a grid of available programs for syllabus selection
 */
const SyllabusProgramList: React.FC<SyllabusProgramListProps> = ({ onProgramSelect }) => {
  const [programs, setPrograms] = useState<SyllabusProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const data = await syllabusService.getPrograms();
        setPrograms(data);
        
        // If user has a program set, automatically select it
        if (user?.program && data.length > 0) {
          const userProgram = data.find(p => p.id === user.program);
          if (userProgram) {
            onProgramSelect(userProgram);
          }
        }
        
        setError(null);
      } catch (error) {
        setError('Failed to load programs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [onProgramSelect, user]);

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
  if (error) return <ErrorDisplay message={error} />;

  // If user has no program set or program selection failed, show the program list
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-gray-900">
          Select a Program
        </h2>
        <p className="text-gray-600">
          Choose a program to view its syllabus
        </p>
      </motion.div>

      {/* Programs Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {programs.map((program) => (
          <motion.button
            key={program.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onProgramSelect(program)}
            className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                     border ${program.id === user?.program ? 'border-indigo-500' : 'border-indigo-100/50'} 
                     hover:border-indigo-200 text-left group`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {program.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {program.description || `View syllabus for ${program.name}`}
                </p>
                <div className="mt-2 text-xs text-indigo-600 font-medium">
                  {program.code}
                </div>
                {program.id === user?.program && (
                  <div className="mt-2 text-xs text-indigo-600 font-medium">
                    Your Program
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Empty State */}
      {programs.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12"
        >
          <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
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