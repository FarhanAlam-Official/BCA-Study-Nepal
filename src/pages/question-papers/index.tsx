import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, GraduationCap, Briefcase } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Program, SemesterData } from '../../types/question-papers/question-papers.types';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import ProgramList from '../../components/question-papers/layout/ProgramList';
import SemesterGrid from '../../components/common/SemesterGrid';
import SubjectList from '../../components/question-papers/layout/SubjectList';
import { questionPaperService } from '../../api/question-papers/question-papers.api';
import { useSearchParams } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/notifications';

/**
 * Represents the current view state of the question papers page
 * PROGRAMS: Shows list of available programs
 * SEMESTERS: Shows semesters for selected program
 * SUBJECTS: Shows subjects for selected semester
 */
type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

/**
 * Animation configuration for page transitions
 */
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

/**
 * QuestionPaperList Component
 * Main component for the question papers page that manages the navigation between
 * programs, semesters, and subjects. Features include:
 * - URL-based state management
 * - Animated transitions between views
 * - Breadcrumb navigation
 * - Error handling with user notifications
 * - Loading states
 */
const QuestionPaperList: React.FC = () => {
  // URL and navigation state
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
  
  // Data state
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the number of subjects for each semester in the selected program
   * Updates the subjectCounts state and handles errors with notifications
   */
  const fetchSubjectCounts = useCallback(async () => {
    if (!selectedProgram) return;

    try {
      const response = await questionPaperService.getByProgram(selectedProgram.id);
      
      if (!response?.semesters) {
        throw new Error('No semester data received from server');
      }

      // Calculate subject counts for each semester
      const counts = response.semesters.reduce((acc: Record<number, number>, sem: SemesterData) => {
        if (sem && typeof sem.semester === 'number' && Array.isArray(sem.subjects)) {
          acc[sem.semester] = sem.subjects.length;
        }
        return acc;
      }, {});

      setSubjectCounts(counts);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch semester data. Please try again later.';
      
      setError(errorMessage);
      showError(errorMessage);
      setSubjectCounts({});
    }
  }, [selectedProgram]);

  /**
   * Initializes component state from URL parameters
   * Handles program selection and semester navigation
   */
  useEffect(() => {
    const programId = searchParams.get('program');
    const semester = searchParams.get('semester');
    const view = searchParams.get('view') as ViewState;

    if (programId) {
      questionPaperService.getPrograms()
        .then(programs => {
          const program = programs.find(p => p.id.toString() === programId);
          if (program) {
            setSelectedProgram(program);
            if (semester) {
              setSelectedSemester(Number(semester));
              setViewState('SUBJECTS');
            } else {
              setViewState('SEMESTERS');
            }
          }
        })
        .catch(() => {
          const errorMessage = 'Failed to load program details. Please try again.';
          showError(errorMessage);
          setError(errorMessage);
        });
    } else if (view) {
      setViewState(view);
    }
  }, [searchParams]);

  /**
   * Updates URL parameters when state changes
   * Maintains navigation history and enables bookmarking
   */
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedProgram) {
      params.set('program', selectedProgram.id.toString());
      params.set('view', viewState);
      if (selectedSemester) {
        params.set('semester', selectedSemester.toString());
      }
    }
    setSearchParams(params, { replace: true });
  }, [viewState, selectedProgram, selectedSemester, setSearchParams]);

  // Fetch subject counts when program changes
  useEffect(() => {
    fetchSubjectCounts();
  }, [fetchSubjectCounts]);

  /**
   * Handles program selection
   * Updates state and navigates to semester view
   */
  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setViewState('SEMESTERS');
    showSuccess(`Selected ${program.name}`);
  };

  /**
   * Handles semester selection
   * Updates state and navigates to subjects view
   */
  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(Number(semester));
    setViewState('SUBJECTS');
  };

  /**
   * Handles navigation back through views
   * Clears appropriate state based on current view
   */
  const handleBack = () => {
    if (viewState === 'SUBJECTS') {
      setViewState('SEMESTERS');
      setSelectedSemester(null);
    } else if (viewState === 'SEMESTERS') {
      setViewState('PROGRAMS');
      setSelectedProgram(null);
    }
  };

  /**
   * Handles breadcrumb navigation
   * Allows direct navigation to previous views
   */
  const handleBreadcrumbClick = (view: ViewState) => {
    switch (view) {
      case 'PROGRAMS':
        setViewState('PROGRAMS');
        setSelectedProgram(null);
        setSelectedSemester(null);
        break;
      case 'SEMESTERS':
        if (selectedProgram) {
          setViewState('SEMESTERS');
          setSelectedSemester(null);
          fetchSubjectCounts();
        }
        break;
    }
  };

  /**
   * Gets the header text based on current view state
   */
  const getHeaderText = () => {
    switch (viewState) {
      case 'PROGRAMS':
        return 'Question Papers';
      case 'SEMESTERS':
        return selectedProgram?.name || 'Select Semester';
      case 'SUBJECTS':
        return `Semester ${selectedSemester} Subjects`;
      default:
        return '';
    }
  };

  /**
   * Formats semester data for the SemesterGrid component
   * Creates an array of semester objects with subject counts
   */
  const formatSemesterData = (subjectCounts: Record<number, number>) => {
    return Array.from({ length: 8 }, (_, i) => i + 1).map(semester => ({
      semester,
      count: subjectCounts[semester] || 0
    }));
  };

  /**
   * Renders the breadcrumb navigation
   * Shows current location in the navigation hierarchy
   */
  const renderBreadcrumbs = () => {
    return (
      <motion.div 
        className="flex items-center gap-2 text-sm pl-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={() => handleBreadcrumbClick('PROGRAMS')}
          className={`
            transition-colors font-medium
            ${viewState === 'PROGRAMS' 
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' 
              : 'text-indigo-600 hover:text-purple-600'
            }
          `}
        >
          Programs
        </button>
        {selectedProgram && (
          <>
            <span className="text-purple-600">
              <ChevronRight className="w-4 h-4" />
            </span>
            <button
              onClick={() => handleBreadcrumbClick('SEMESTERS')}
              className={`
                transition-colors font-medium
                ${viewState === 'SEMESTERS' 
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' 
                  : 'text-indigo-600 hover:text-purple-600'
                }
              `}
            >
              {selectedProgram.name}
            </button>
            {viewState === 'SUBJECTS' && selectedSemester && (
              <>
                <span className="text-purple-600">
                  <ChevronRight className="w-4 h-4" />
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 font-medium">
                  Semester {selectedSemester}
                </span>
              </>
            )}
          </>
        )}
      </motion.div>
    );
  };

  // Show error state if there's an error
  if (error) {
    return (
      <ErrorDisplay 
        message={error} 
        onRetry={() => {
          setError(null);
          if (selectedProgram) {
            fetchSubjectCounts();
          }
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute right-[15%] top-[15%]"
      >
        <div className="h-28 w-28 text-indigo-600/20">
          <Code size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute left-[20%] top-[25%]"
      >
        <div className="h-[112px] w-[112px] text-purple-600/15">
          <GraduationCap size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute right-[25%] bottom-[20%]"
      >
        <div className="h-[90px] w-[90px] text-indigo-600/20">
          <Briefcase size="100%" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              {viewState !== 'PROGRAMS' && (
                <motion.button
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-white/50 active:bg-white/70
                           transition-colors duration-150"
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5 text-indigo-600" />
                </motion.button>
              )}
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">
                {getHeaderText()}
              </h1>
            </div>
            
            {viewState !== 'PROGRAMS' && renderBreadcrumbs()}
          </div>
        </div>

        {/* Content Section with View Transitions */}
        <AnimatePresence mode="wait">
          {viewState === 'PROGRAMS' && (
            <motion.div
              key="programs"
              {...pageTransition}
              className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6"
            >
              <ProgramList onProgramSelect={handleProgramSelect} />
            </motion.div>
          )}

          {viewState === 'SEMESTERS' && selectedProgram && (
            <motion.div
              key="semesters"
              {...pageTransition}
              className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6"
            >
              <SemesterGrid
                variant="questionPaper"
                selectedSemester={selectedSemester}
                onSemesterSelect={handleSemesterSelect}
                data={formatSemesterData(subjectCounts)}
              />
            </motion.div>
          )}

          {viewState === 'SUBJECTS' && selectedProgram && selectedSemester && (
            <motion.div
              key="subjects"
              {...pageTransition}
              className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6"
            >
              <SubjectList
                programId={selectedProgram.id}
                semester={selectedSemester}
                isVisible={true}
                programName={selectedProgram.name}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionPaperList;