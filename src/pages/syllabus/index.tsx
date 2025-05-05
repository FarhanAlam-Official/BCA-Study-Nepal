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
 * Represents the current view state of the syllabus page
 */
type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

/**
 * Animation configuration for page transitions
 */
const pageTransition = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.2 }
};

/**
 * SyllabusList Component
 * Main component for the syllabus page that manages navigation between
 * programs, semesters, and subjects.
 */
const SyllabusList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
    
    // Data state
    const [selectedProgram, setSelectedProgram] = useState<SyllabusProgram | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
    const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});

    // Fetch subject counts for the selected program
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

    // Initialize state from URL parameters
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

    // Update URL parameters when state changes
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

    // Handle program selection
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

    // Handle semester selection
    const handleSemesterSelect = (semester: string | number) => {
        setSelectedSemester(Number(semester));
        setViewState('SUBJECTS');
    };

    // Handle breadcrumb navigation
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

    // Handle browser back button and gesture navigation
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
                navigate(-1); // Go back to previous page if on programs view
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate, setSelectedProgram, setSelectedSemester, setSubjectCounts, setViewState, viewState]);

    // Get header text based on current view
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

    // Format semester data for the grid
    const formatSemesterData = (subjectCounts: Record<number, number>) => {
        return Array.from({ length: 8 }, (_, i) => i + 1).map(semester => ({
            semester,
            count: subjectCounts[semester] || 0
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white px-6 py-8">
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