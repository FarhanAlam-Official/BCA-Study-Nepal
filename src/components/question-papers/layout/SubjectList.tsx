import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../../../types/question-papers/question-papers.types';
import { Book } from 'lucide-react';
import { questionPaperService } from '../../../api/question-papers/question-papers.api';
import { useNavigate } from 'react-router-dom';
import { showError } from '../../../utils/notifications';
import SubjectCard from '../ui/SubjectCard';
import LoadingSpinner from '../../common/LoadingSpinner';

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
      setError(null);
      const response = await questionPaperService.getByProgram(programId);
      
      // Find the semester data and extract subjects
      const semesterData = response.semesters.find(sem => sem.semester === semester);
      if (semesterData && Array.isArray(semesterData.subjects)) {
        setSubjects(semesterData.subjects);
      } else {
        setSubjects([]);
      }
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
    if (isVisible && programId && semester) {
      fetchSubjects();
    }
  }, [programId, semester, isVisible, fetchSubjects]);

  // Animation variants
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 shadow-lg">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="p-3 bg-red-50 rounded-full w-fit mx-auto">
            <Book className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {error}
          </h3>
          <button
            onClick={fetchSubjects}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 shadow-lg">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto">
            <Book className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            No Subjects Available
          </h3>
          <p className="text-gray-500 text-lg">
            There are no subjects available for this semester yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {subjects.map((subject) => (
        <motion.div
          key={subject.id}
          variants={itemVariants}
          className="h-full"
        >
          <SubjectCard
            subject={subject}
            onClick={() => navigate(`/question-papers/${subject.id}/${encodeURIComponent(subject.name)}/papers`)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubjectList; 