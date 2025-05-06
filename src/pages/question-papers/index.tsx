import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, GraduationCap, FileText } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Program, Subject } from '../../types/question-papers/question-papers.types';
import ProgramList from '../../components/question-papers/layout/ProgramList';
import SemesterGrid from '../../components/common/SemesterGrid';
import SubjectList from '../../components/question-papers/layout/SubjectList';
import { questionPaperService } from '../../api/question-papers/question-papers.api';
import { useSearchParams } from 'react-router-dom';
import { showError } from '../../utils/notifications';
import ErrorDisplay from '../../components/common/ErrorDisplay';

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
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { 
    type: "spring",
    stiffness: 100,
    damping: 15,
    duration: 0.3 
  }
};

/**
 * Floating decoration elements component
 */
const FloatingElements = () => (
  <>
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
      className="absolute right-[15%] top-[15%] opacity-10"
    >
      <FileText className="h-28 w-28 text-indigo-600" />
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
      className="absolute left-[20%] top-[25%] opacity-15"
    >
      <GraduationCap className="h-28 w-28 text-purple-600" />
    </motion.div>
  </>
);

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
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches the number of subjects for each semester in the selected program
     * Updates the subjectCounts state and handles errors with notifications
     */
    const fetchSubjectCounts = useCallback(async () => {
        if (!selectedProgram) return;

        try {
            const response = await questionPaperService.getByProgram(selectedProgram.id);
            const counts: Record<number, number> = {};
            response.semesters.forEach((sem: { semester: number; subjects: Subject[] }) => {
                counts[sem.semester] = sem.subjects.length;
            });
            setSubjectCounts(counts);
            setError(null);
        } catch {
            setError('Failed to load subject counts');
            showError('Failed to load subject counts. Please try again.');
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
                    showError('Failed to load program details. Please try again.');
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
    const handleProgramSelect = async (program: Program) => {
        try {
            setSelectedProgram(program);
            const response = await questionPaperService.getByProgram(program.id);
            const counts: Record<number, number> = {};
            response.semesters.forEach((sem: { semester: number; subjects: Subject[] }) => {
                counts[sem.semester] = sem.subjects.length;
            });
            setSubjectCounts(counts);
            setViewState('SEMESTERS');
        } catch {
            showError('Failed to load program details. Please try again.');
        }
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
     * Handles breadcrumb navigation
     * Allows direct navigation to previous views
     */
    const handleBreadcrumbClick = (view: ViewState) => {
        switch (view) {
            case 'PROGRAMS':
                setSelectedSemester(null);
                setSelectedProgram(null);
                setSubjectCounts({});
                setViewState('PROGRAMS');
                break;
            case 'SEMESTERS':
                if (selectedProgram) {
                    setSelectedSemester(null);
                    setViewState('SEMESTERS');
                    // Only fetch if we don't have the counts
                    if (Object.keys(subjectCounts).length === 0) {
                        fetchSubjectCounts();
                    }
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
                return selectedProgram?.name;
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white px-6 py-8 relative overflow-hidden">
            <FloatingElements />
            <div className="max-w-7xl mx-auto relative">
                {/* Page title */}
                <motion.h1 
                    className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {getHeaderText()}
                </motion.h1>

                {/* Breadcrumb navigation */}
                <nav className="flex items-center space-x-2 mb-8 text-sm">
                    <button
                        onClick={() => handleBreadcrumbClick('PROGRAMS')}
                        className={`hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-colors ${
                            viewState === 'PROGRAMS' 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium' 
                            : 'text-gray-600'
                        }`}
                    >
                        Programs
                    </button>
                    {selectedProgram && (
                        <>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button
                                onClick={() => handleBreadcrumbClick('SEMESTERS')}
                                className={`hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-colors ${
                                    viewState === 'SEMESTERS' 
                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium' 
                                    : 'text-gray-600'
                                }`}
                            >
                                {selectedProgram.name}
                            </button>
                        </>
                    )}
                    {selectedSemester && (
                        <>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium">
                                Semester {selectedSemester}
                            </span>
                        </>
                    )}
                </nav>

                {/* Main content area */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {viewState === 'PROGRAMS' && (
                            <motion.div
                                key="programs"
                                {...pageTransition}
                            >
                                <ProgramList onProgramSelect={handleProgramSelect} />
                            </motion.div>
                        )}

                        {viewState === 'SEMESTERS' && selectedProgram && (
                            <motion.div
                                key="semesters"
                                {...pageTransition}
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
                            >
                                <SubjectList
                                    programId={selectedProgram.id}
                                    semester={selectedSemester}
                                    isVisible={true}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default QuestionPaperList;