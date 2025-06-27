import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { SyllabusProgram, SyllabusSubject } from '../../types/syllabus/syllabus.types';
import SyllabusProgramList from '../../components/syllabus/SyllabusProgramList';
import SemesterGrid from '../../components/common/SemesterGrid';
import SyllabusSubjectList from '../../components/syllabus/SyllabusSubjectList';
import { syllabusService } from '../../api/syllabus/syllabus.api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { showError } from '../../utils/notifications';

/**
 * ViewState Type Definition
 * Represents the navigation states in the syllabus interface:
 * - PROGRAMS: Display list of available academic programs
 * - SEMESTERS: Show available semesters for selected program
 * - SUBJECTS: Display subjects for selected semester
 */
type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

/**
 * Page Transition Animation Configuration
 * Defines smooth animations for transitioning between views
 * Uses scale and opacity for a subtle and professional effect
 */
const pageTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.2 }
};

/**
 * SyllabusList Component
 * Main component for browsing and accessing program syllabi through a hierarchical navigation:
 * Programs → Semesters → Subjects
 * 
 * Features:
 * - URL-based state management for shareable/bookmarkable pages
 * - Animated transitions between views
 * - Breadcrumb navigation for easy backtracking
 * - Browser history integration
 * - Error handling with user notifications
 * - Subject count tracking per semester
 */
const SyllabusList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
    
    /**
     * Core State Management
     * Tracks selected program, semester, and subject counts
     * Used to manage navigation flow and display appropriate content
     */
    const [selectedProgram, setSelectedProgram] = useState<SyllabusProgram | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});

    /**
     * Subject Count Fetcher
     * Retrieves and updates the number of subjects available for each semester
     * in the currently selected program
     */
    const fetchSubjectCounts = useCallback(async () => {
        if (!selectedProgram) return;

        try {
            const response = await syllabusService.getByProgram(selectedProgram.id);
            const counts: Record<number, number> = {};
            response.semesters.forEach((sem: { semester: number; subjects: SyllabusSubject[] }) => {
                counts[sem.semester] = sem.subjects.length;
            });
            setSubjectCounts(counts);
        } catch {
            showError('Failed to load subject counts. Please try again.');
        }
    }, [selectedProgram]);

    /**
     * URL State Synchronization
     * Initializes component state based on URL parameters
     * Enables direct navigation to specific views via URL
     */
    useEffect(() => {
        const programId = searchParams.get('program');
        const semester = searchParams.get('semester');
        const view = searchParams.get('view') as ViewState;

        if (programId) {
            syllabusService.getPrograms()
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
     * URL Update Effect
     * Keeps URL parameters synchronized with component state
     * Enables bookmarking and sharing of specific views
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

    // Fetch subject counts whenever selected program changes
    useEffect(() => {
        fetchSubjectCounts();
    }, [fetchSubjectCounts]);

    /**
     * Program Selection Handler
     * Updates state and fetches subject counts when a program is selected
     * Manages transition to semester view
     */
    const handleProgramSelect = async (program: SyllabusProgram) => {
        try {
            setSelectedProgram(program);
            const response = await syllabusService.getByProgram(program.id);
            const counts: Record<number, number> = {};
            response.semesters.forEach((sem: { semester: number; subjects: SyllabusSubject[] }) => {
                counts[sem.semester] = sem.subjects.length;
            });
            setSubjectCounts(counts);
            setViewState('SEMESTERS');
        } catch {
            showError('Failed to load program details. Please try again.');
        }
    };

    /**
     * Semester Selection Handler
     * Updates state and navigates to subjects view
     * Converts semester to number type for consistency
     */
    const handleSemesterSelect = (semester: string | number) => {
        setSelectedSemester(Number(semester));
        setViewState('SUBJECTS');
    };

    /**
     * Breadcrumb Navigation Handler
     * Manages state reset and navigation when using breadcrumb links
     * Ensures proper cleanup of irrelevant states during navigation
     */
    const handleBreadcrumbClick = (view: ViewState) => {
        switch (view) {
            case 'PROGRAMS':
                setViewState('PROGRAMS');
                setSelectedProgram(null);
                setSelectedSemester(null);
                setSubjectCounts({});
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
     * Browser Navigation Handler
     * Manages state transitions for browser back/forward navigation
     * Provides intuitive navigation flow through the hierarchy
     */
    useEffect(() => {
        const handlePopState = () => {
            if (viewState === 'SUBJECTS') {
                setViewState('SEMESTERS');
                setSelectedSemester(null);
            } else if (viewState === 'SEMESTERS') {
                setViewState('PROGRAMS');
                setSelectedProgram(null);
                setSubjectCounts({});
            } else {
                navigate(-1); // Exit to previous page if on programs view
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate, setSelectedProgram, setSelectedSemester, setSubjectCounts, setViewState, viewState]);

    /**
     * Dynamic Header Text Generator
     * Returns appropriate heading text based on current view state
     */
    const getHeaderText = () => {
        switch (viewState) {
            case 'PROGRAMS':
                return 'Syllabus';
            case 'SEMESTERS':
                return selectedProgram?.name;
            case 'SUBJECTS':
                return `Semester ${selectedSemester} Subjects`;
            default:
                return '';
        }
    };

    /**
     * Semester Data Formatter
     * Transforms raw subject counts into structured data for SemesterGrid component
     * Creates an array of semester objects with their respective subject counts
     */
    const formatSemesterData = (subjectCounts: Record<number, number>) => {
        return Array.from({ length: 8 }, (_, i) => i + 1).map(semester => ({
            semester,
            count: subjectCounts[semester] || 0
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white px-6 py-8">
            <div className="max-w-7xl mx-auto relative">
                {/* Dynamic Page Title */}
                <motion.h1 
                    className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {getHeaderText()}
                </motion.h1>

                {/* Interactive Breadcrumb Navigation */}
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

                {/* Main Content Area with View Transitions */}
                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {viewState === 'PROGRAMS' && (
                            <motion.div
                                key="programs"
                                {...pageTransition}
                            >
                                <SyllabusProgramList onProgramSelect={handleProgramSelect} />
                            </motion.div>
                        )}

                        {viewState === 'SEMESTERS' && selectedProgram && (
                            <motion.div
                                key="semesters"
                                {...pageTransition}
                            >
                                <SemesterGrid
                                    variant="syllabus"
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
                                <SyllabusSubjectList
                                    programId={selectedProgram.id}
                                    semester={selectedSemester}
                                    isVisible={true}
                                    programName={selectedProgram.name}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Decorative elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="fixed right-[15%] top-[20%] -z-10 opacity-50"
                >
                    <div className="h-32 w-32 text-indigo-600/20">
                        <BookOpen size="100%" />
                    </div>
                </motion.div>

                <motion.div 
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="fixed left-[20%] bottom-[20%] -z-10 opacity-50"
                >
                    <div className="h-40 w-40 text-indigo-600/20">
                        <GraduationCap size="100%" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SyllabusList; 