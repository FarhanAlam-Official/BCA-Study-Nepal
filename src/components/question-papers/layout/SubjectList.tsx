import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../../../types/question-papers/question-papers.types';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { Book } from 'lucide-react';
import { questionPaperService } from '../../../api/question-papers/question-papers.api';
import { useNavigate } from 'react-router-dom';
import { showError } from '../../../utils/notifications';
import SubjectCard from '../ui/SubjectCard';

interface SubjectListProps {
  programId: number;
  semester: number;
  isVisible: boolean;
}

/**
 * SubjectList Component
 * Displays a grid of subject cards for a specific program and semester.
 * Handles loading states, errors, and navigation to subject details.
 */
const SubjectList: React.FC<SubjectListProps> = ({
  programId,
  semester,
  isVisible,
}) => {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Fetches subjects for the selected program and semester
   */
  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await questionPaperService.getByProgram(programId);
      const semesterSubjects = response.semesters
        .find(sem => sem.semester === semester)?.subjects || [];
      setSubjects(semesterSubjects);
      setError(null);
    } catch {
      const errorMessage = 'Failed to load subjects. Please try again later.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [programId, semester]);

  // Load subjects when component mounts or when program/semester changes
  React.useEffect(() => {
    if (programId) {
      fetchSubjects();
    }
  }, [programId, fetchSubjects]);

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
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

  /**
   * Handles navigation to subject details page
   */
  const handleSubjectClick = (subject: Subject) => {
    navigate(`/question-papers/${subject.id}/${encodeURIComponent(subject.name)}/papers`);
  };

  if (!isVisible) return null;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchSubjects} />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Subject count */}
      <motion.p 
        variants={itemVariants}
        className="text-center text-gray-600"
      >
        {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'} Available
      </motion.p>

      {/* Subjects Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
      >
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              className="h-full"
            >
              <SubjectCard 
                subject={subject} 
                onClick={handleSubjectClick}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="col-span-full text-center py-16 bg-white/80 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="max-w-sm mx-auto space-y-4">
              <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                No Subjects Available
              </h3>
              <p className="text-gray-500 text-lg">
                We're currently working on adding subjects for this semester. Please check back later.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubjectList; 