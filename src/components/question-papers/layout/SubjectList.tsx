import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Subject } from '../../../services/types/questionpapers.types';
import SubjectCard from '../ui/SubjectCard';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorDisplay from '../../common/ErrorDisplay';
import { Book } from 'lucide-react';
import { questionPaperService } from '../../../services/api/questionPaperService';

interface SubjectListProps {
  programId: number;
  semester: number;
  isVisible: boolean;
  programName: string;
}

const SubjectList: React.FC<SubjectListProps> = ({
  programId,
  semester,
  isVisible,
  programName,
}) => {
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
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-black-500 to-indigo-600">
          {programName} - Semester {semester}
        </h2>
        <p className="text-gray-600">
          {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'} Available
        </p>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
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
                questionPapers={[]}
                onDownload={(paper) => window.open(paper.drive_file_url, '_blank')}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            variants={itemVariants}
            className="col-span-full text-center py-12 bg-white/80 rounded-xl border border-gray-100"
          >
            <div className="max-w-sm mx-auto space-y-4">
              <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No Subjects Found
              </h3>
              <p className="text-gray-500">
                There are no subjects available for this semester yet.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubjectList; 