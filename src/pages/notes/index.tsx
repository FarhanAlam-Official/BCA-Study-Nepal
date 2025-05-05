/**
 * Notes Page Component
 * 
 * A hierarchical navigation system for browsing educational notes organized by:
 * - Programs (e.g., BCA, BBA)
 * - Semesters (1-8)
 * - Subjects within each semester
 * 
 * Features:
 * - URL-based state persistence
 * - Animated transitions between views
 * - Breadcrumb navigation
 * - Responsive grid layouts
 * - Loading states and error handling
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { showError } from '../../utils/notifications';
import NoteProgramList from '../../components/notes/NoteProgramList';
import SemesterGrid from '../../components/common/SemesterGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { NotesProgram, SemesterData, SubjectData } from '../../types/notes/notes.types';
import { notes } from '../../api/core/api.core';

/**
 * Possible view states for the notes page navigation
 */
type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

/**
 * Animation configuration for page transitions between views
 */
const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.2 }
};

const Notes: React.FC = () => {
  // URL and navigation state
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
  const navigate = useNavigate();
  
  // Data management state
  const [selectedProgram, setSelectedProgram] = useState<NotesProgram | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Animation configuration for list items
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
   * Fetches the number of subjects available for each semester in the selected program
   */
  const fetchSubjectCounts = useCallback(async () => {
    if (!selectedProgram) return;

    try {
      const response = await notes.getProgramSubjects(selectedProgram.id);
      const counts: Record<number, number> = {};
      response.data.forEach((sem: SemesterData) => {
        counts[sem.semester] = sem.subjects.length;
      });
      setSubjectCounts(counts);
    } catch {
      showError('Failed to load subject counts. Please try again.');
    }
  }, [selectedProgram]);

  /**
   * Initializes component state from URL parameters
   * Handles deep linking and browser navigation
   */
  useEffect(() => {
    const programId = searchParams.get('program');
    const semester = searchParams.get('semester');
    const view = searchParams.get('view') as ViewState;

    if (programId) {
      notes.getPrograms()
        .then(response => {
          const program = response.data.find((p: NotesProgram) => p.id.toString() === programId);
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
   * Updates URL parameters when navigation state changes
   * Enables browser history and bookmarking
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

  /**
   * Fetches subjects for the selected semester when it changes
   */
  useEffect(() => {
    if (selectedProgram && selectedSemester) {
      setLoadingSubjects(true);
      notes.getProgramSubjects(selectedProgram.id, selectedSemester)
        .then(response => {
          const semesterData = response.data.find((sem: { semester: number }) => 
            sem.semester === selectedSemester
          );
          setSubjects(semesterData?.subjects || []);
        })
        .catch(() => {
          showError('Failed to load subjects. Please try again.');
        })
        .finally(() => {
          setLoadingSubjects(false);
        });
    }
  }, [selectedProgram, selectedSemester]);

  /**
   * Event Handlers
   */
  const handleProgramSelect = async (program: NotesProgram) => {
    try {
      setSelectedProgram(program);
      const response = await notes.getProgramSubjects(program.id);
      const counts: Record<number, number> = {};
      response.data.forEach((sem: SemesterData) => {
        counts[sem.semester] = sem.subjects.length;
      });
      setSubjectCounts(counts);
      setViewState('SEMESTERS');
    } catch {
      showError('Failed to load program details. Please try again.');
    }
  };

  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(Number(semester));
    setViewState('SUBJECTS');
  };

  /**
   * Handles navigation through breadcrumb clicks
   * Resets appropriate state based on the selected view
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
   * Returns the appropriate header text based on current view state
   */
  const getHeaderText = () => {
    switch (viewState) {
      case 'PROGRAMS':
        return 'Notes';
      case 'SEMESTERS':
        return selectedProgram?.name;
      case 'SUBJECTS':
        return `Semester ${selectedSemester} Notes`;
      default:
        return '';
    }
  };

  /**
   * Formats semester data for the grid component
   */
  const formatSemesterData = (subjectCounts: Record<number, number>) => {
    return Array.from({ length: 8 }, (_, i) => i + 1).map(semester => ({
      semester,
      count: subjectCounts[semester] || 0
    }));
  };

  /**
   * Navigates to the subject notes page when a subject is clicked
   */
  const handleSubjectClick = (subject: SubjectData) => {
    navigate(`/notes/subject/${subject.id}/${encodeURIComponent(subject.name)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white px-6 py-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Animated Page Title */}
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

        {/* Main Content Area with View State Management */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {/* Programs View */}
            {viewState === 'PROGRAMS' && (
              <motion.div key="programs" {...pageTransition}>
                <NoteProgramList onProgramSelect={handleProgramSelect} />
              </motion.div>
            )}

            {/* Semesters View */}
            {viewState === 'SEMESTERS' && selectedProgram && (
              <motion.div key="semesters" {...pageTransition}>
                <SemesterGrid
                  variant="notes"
                  selectedSemester={selectedSemester}
                  onSemesterSelect={handleSemesterSelect}
                  data={formatSemesterData(subjectCounts)}
                />
              </motion.div>
            )}

            {/* Subjects View */}
            {viewState === 'SUBJECTS' && selectedProgram && selectedSemester && (
              <motion.div key="subjects" {...pageTransition}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Loading State */}
                  {loadingSubjects ? (
                    <div className="col-span-full flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : subjects.length > 0 ? (
                    // Subject Cards Grid
                    subjects.map(subject => (
                      <motion.div
                        key={subject.id}
                        variants={itemVariants}
                        onClick={() => handleSubjectClick(subject)}
                        className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 
                                 hover:border-indigo-300/80 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10
                                 transition-all duration-300 cursor-pointer overflow-hidden"
                      >
                        {/* Card Visual Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 
                                      rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 
                                      rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />
                        
                        {/* Card Content */}
                        <div className="relative p-6 flex flex-col h-full">
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-100/50 rounded-lg group-hover:bg-indigo-100 
                                          transition-colors duration-300">
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100/50 
                                          group-hover:bg-indigo-100 rounded-full transition-colors duration-300">
                              Code: {subject.code}
                            </div>
                          </div>
                          
                          {/* Subject Title */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 
                                         transition-colors duration-300 mb-2 line-clamp-2">
                              {subject.name}
                            </h3>
                          </div>
                          
                          {/* Card Footer */}
                          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-sm font-semibold text-indigo-600">
                              {subject.notes_count} {subject.notes_count === 1 ? 'Note' : 'Notes'}
                            </span>
                            <div className="flex items-center text-indigo-600 group-hover:text-indigo-700">
                              <span className="text-sm font-medium mr-2">View Notes</span>
                              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    // Empty State
                    <div className="col-span-full text-center py-12">
                      <div className="p-3 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Notes Available
                      </h3>
                      <p className="text-gray-500">
                        There are no notes available for this semester yet.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Decorative Element */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-[15%] top-[15%]"
        >
          <div className="h-28 w-28 text-purple-600/10">
            <BookOpen size="100%" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notes;