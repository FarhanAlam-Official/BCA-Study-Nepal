import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ProgramList from './layout/ProgramList';
import SemesterGrid from './layout/SemesterGrid';
import SubjectList from './layout/SubjectList';
import { Program } from '../../services/types/questionpapers.types';
import ErrorDisplay from '../common/ErrorDisplay';

type ViewState = 'PROGRAMS' | 'SEMESTERS' | 'SUBJECTS';

const QuestionPaperList: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('PROGRAMS');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program);
    setViewState('SEMESTERS');
  };

  const handleSemesterSelect = (semester: number) => {
    setSelectedSemester(semester);
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

  const getHeaderText = () => {
    switch (viewState) {
      case 'PROGRAMS':
        return 'Select Your Program';
      case 'SEMESTERS':
        return selectedProgram?.name || 'Select Semester';
      case 'SUBJECTS':
        return `Semester ${selectedSemester} Subjects`;
      default:
        return '';
    }
  };

  if (error) return <ErrorDisplay message={error} onRetry={() => setError(null)} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          {viewState !== 'PROGRAMS' && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {getHeaderText()}
          </h1>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewState === 'PROGRAMS' && (
            <ProgramList onProgramSelect={handleProgramSelect} />
          )}

          {viewState === 'SEMESTERS' && selectedProgram && (
            <SemesterGrid
              selectedProgram={selectedProgram}
              selectedSemester={selectedSemester}
              onSemesterSelect={handleSemesterSelect}
            />
          )}

          {viewState === 'SUBJECTS' && selectedSemester && selectedProgram && (
            <SubjectList
              programId={selectedProgram.id}
              semester={selectedSemester}
              isVisible={true}
              onBack={() => handleBack()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuestionPaperList;