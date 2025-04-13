import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, GraduationCap, Briefcase } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Program } from '../../services/types/questionpapers.types';
import ErrorDisplay from '../common/ErrorDisplay';
import ProgramList from './layout/ProgramList';
import SemesterGrid from '../common/SemesterGrid';
import SubjectList from './layout/SubjectList';
import { questionPaperService } from '../../services/api/questionPaperService';
import { useSearchParams } from 'react-router-dom';

type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

const QuestionPaperList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subjectCounts, setSubjectCounts] = useState<Record<number, number>>({});

  const fetchSubjectCounts = useCallback(async () => {
    if (selectedProgram) {
      try {
        const response = await questionPaperService.getByProgram(selectedProgram.id);
        const counts = response.semesters.reduce((acc, sem) => {
          acc[sem.semester] = sem.subjects.length;
          return acc;
        }, {} as Record<number, number>);
        setSubjectCounts(counts);
      } catch (error) {
        console.error('Error fetching subject counts:', error);
        setError('Failed to fetch semester data');
      }
    }
  }, [selectedProgram]);

  // Load state from URL parameters on component mount
  useEffect(() => {
    const programId = searchParams.get('program');
    const semester = searchParams.get('semester');
    const view = searchParams.get('view') as ViewState;

    if (programId) {
      // Fetch program details and set state
      questionPaperService.getPrograms().then(programs => {
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

  useEffect(() => {
    fetchSubjectCounts();
  }, [fetchSubjectCounts]);

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setViewState('SEMESTERS');
  };

  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(Number(semester));
    setViewState('SUBJECTS');
  };

  const handleBack = () => {
    if (viewState === 'SUBJECTS') {
      setViewState('SEMESTERS');
      setSelectedSemester(null);
    } else if (viewState === 'SEMESTERS') {
      setViewState('PROGRAMS');
      setSelectedProgram(null);
    }
  };

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
      default:
        break;
    }
  };

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

  const formatSemesterData = (subjectCounts: Record<number, number>) => {
    return Array.from({ length: 8 }, (_, i) => i + 1).map(semester => ({
      semester,
      count: subjectCounts[semester] || 0
    }));
  };

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

  if (error) return <ErrorDisplay message={error} onRetry={() => setError(null)} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Floating Elements */}
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

        {/* Content Cards */}
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