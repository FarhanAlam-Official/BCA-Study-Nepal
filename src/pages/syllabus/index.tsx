import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';
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
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
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

    // Handle navigation back
    const handleBack = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header and Navigation */}
                <div className="mb-8">
                    {/* Back button */}
                    <motion.button
                        onClick={handleBack}
                        className="mb-6 inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        <span>Back</span>
                    </motion.button>

                    {/* Breadcrumb navigation */}
                    <nav className="flex items-center space-x-2 mb-4">
                        <button
                            onClick={() => handleBreadcrumbClick('PROGRAMS')}
                            className={`hover:text-indigo-600 ${viewState === 'PROGRAMS' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                        >
                            Programs
                        </button>
                        {selectedProgram && (
                            <>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                <button
                                    onClick={() => handleBreadcrumbClick('SEMESTERS')}
                                    className={`hover:text-indigo-600 ${viewState === 'SEMESTERS' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}
                                >
                                    {selectedProgram.name}
                                </button>
                            </>
                        )}
                        {selectedSemester && (
                            <>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                <span className="text-indigo-600 font-medium">
                                    Semester {selectedSemester}
                                </span>
                            </>
                        )}
                    </nav>

                    {/* Page title */}
                    <h1 className="text-4xl font-bold text-gray-900">
                        {getHeaderText()}
                    </h1>
                </div>

                {/* Main content area */}
                <AnimatePresence mode="wait">
                    {viewState === 'PROGRAMS' && (
                        <motion.div
                            key="programs"
                            {...pageTransition}
                            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6"
                        >
                            <SyllabusProgramList onProgramSelect={handleProgramSelect} />
                        </motion.div>
                    )}

                    {viewState === 'SEMESTERS' && selectedProgram && (
                        <motion.div
                            key="semesters"
                            {...pageTransition}
                            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6"
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
                className="fixed right-[15%] top-[20%] z-0"
            >
                <div className="h-32 w-32 text-purple-600/10">
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
                className="fixed left-[20%] bottom-[20%] z-0"
            >
                <div className="h-40 w-40 text-purple-600/10">
                    <GraduationCap size="100%" />
                </div>
            </motion.div>
        </div>
    );
};

export default SyllabusList; 