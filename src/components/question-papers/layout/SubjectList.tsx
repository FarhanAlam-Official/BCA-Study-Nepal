import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../../../types/question-papers/question-papers.types';
import SubjectCard from '../ui/SubjectCard';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { Book } from 'lucide-react';
import { questionPaperService } from '../../../api/question-papers/question-papers.api';
import { QuestionPaper } from '../../../types/question-papers/question-papers.types';
import { useNavigate } from 'react-router-dom';
import { showError } from '../../../utils/notifications';

interface SubjectListProps {
  programId: number;
  semester: number;
  isVisible: boolean;
  programName: string;
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
  programName,
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
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load subjects. Please try again later.';
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
      className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center space-y-3 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
          {programName} - Semester {semester}
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'} Available
        </p>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-[1400px] mx-auto"
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
                onDownload={(paper: QuestionPaper) => {
                  if (paper.status === 'VERIFIED' && paper.file) {
                    window.open(paper.file, '_blank');
                  }
                }}
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