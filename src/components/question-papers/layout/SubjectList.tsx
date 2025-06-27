import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../../../services/types/questionpapers.types';
import { Book, ChevronRight, GraduationCap } from 'lucide-react';
import { questionPaperService } from '../../../services/api/questionPaperService';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';

interface SubjectListProps {
  programId: number;
  semester: number;
  isVisible: boolean;
  onBack: () => void;
}

const SubjectList: React.FC<SubjectListProps> = ({ programId, semester, isVisible, onBack }) => {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await questionPaperService.getByProgram(programId);
      const semesterSubjects = response.semesters
        .find(sem => sem.semester === semester)?.subjects || [];
      setSubjects(semesterSubjects);
      setError(null);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setError('Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  }, [programId, semester]);

  React.useEffect(() => {
    if (programId) {
      fetchSubjects();
    }
  }, [programId, fetchSubjects]);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  if (!isVisible) return null;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchSubjects} />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div 
        className="flex items-center gap-4"
        variants={itemVariants}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 transform rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Semester {semester} Subjects
          </h2>
        </div>
      </motion.div>

      <motion.div 
        className="grid gap-4"
        variants={containerVariants}
      >
        {subjects.length === 0 ? (
          <motion.p 
            variants={itemVariants}
            className="text-center text-gray-500 py-8"
          >
            No subjects found for this semester.
          </motion.p>
        ) : (
          subjects.map((subject: Subject) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover="hover"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
                  <Book className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">{subject.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Code: {subject.code}</span>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {subject.credit_hours} Credits
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubjectList; 