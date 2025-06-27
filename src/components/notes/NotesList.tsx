/**
 * Main component for displaying and managing the notes section of the application.
 * Provides a hierarchical navigation through programs, semesters, and individual notes.
 * Features include:
 * - Program selection
 * - Semester filtering
 * - Note viewing
 * - Session persistence
 * - Pagination
 */
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { notes } from '../../api/core/api.core';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import SemesterGrid from '../common/SemesterGrid';
import PDFViewer from '../common/PDFViewer';
import NoteProgramList from './NoteProgramList';
import { motion } from 'framer-motion';
import { Note, NotesProgram } from '../../types/notes/notes.types';
import { showError } from '../../utils/notifications';

const NotesList: React.FC = () => {
  // State management with session storage persistence
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore selected states from session storage
  const [selectedProgram, setSelectedProgram] = useState<NotesProgram | null>(() => {
    const saved = sessionStorage.getItem('selectedNoteProgram');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    const saved = sessionStorage.getItem('selectedNoteSemester');
    return saved ? Number(saved) : null;
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(() => {
    const saved = sessionStorage.getItem('selectedNote');
    return saved ? JSON.parse(saved) : null;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Persist selections to session storage
  useEffect(() => {
    if (selectedProgram) {
      sessionStorage.setItem('selectedNoteProgram', JSON.stringify(selectedProgram));
    } else {
      sessionStorage.removeItem('selectedNoteProgram');
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSemester) {
      sessionStorage.setItem('selectedNoteSemester', String(selectedSemester));
    } else {
      sessionStorage.removeItem('selectedNoteSemester');
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedNote) {
      sessionStorage.setItem('selectedNote', JSON.stringify(selectedNote));
    } else {
      sessionStorage.removeItem('selectedNote');
    }
  }, [selectedNote]);

  /**
   * Fetches notes data based on the selected program and current page.
   * Updates the notes data and pagination state.
   */
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await (selectedProgram 
        ? notes.getByProgram(selectedProgram.id, page)
        : notes.getAll(page));
      
      if (response.data?.results) {
        setNotesData(response.data.results);
        setHasMore(!!response.data.next);
      } else {
        const errorMsg = 'No notes data received from server';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch {
      const errorMsg = 'Failed to fetch notes. Please try again later.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [page, selectedProgram]);

  // Fetch notes when page or selected program changes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /**
   * Event Handlers for Selection Changes
   */
  const handleProgramSelect = (program: NotesProgram) => {
    setSelectedProgram(program);
    setSelectedSemester(null);
    setSelectedNote(null);
    setPage(1);
  };

  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(Number(semester));
    setSelectedNote(null);
    setPage(1);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
  };

  // Loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  // Filter notes based on selected program and semester
  const filteredNotes = notesData.filter(note => 
    (!selectedProgram || note.program.id === selectedProgram.id) &&
    (!selectedSemester || note.semester === selectedSemester)
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section with Breadcrumb Navigation */}
      <div className="bg-white">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Interactive Breadcrumb Trail */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setSelectedSemester(null);
                    setSelectedNote(null);
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Notes
                </button>
              </li>
              {selectedProgram && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <li>
                    <button
                      onClick={() => {
                        setSelectedSemester(null);
                        setSelectedNote(null);
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      {selectedProgram.name}
                    </button>
                  </li>
                </>
              )}
              {selectedSemester && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <li>
                    <span className="text-sm font-medium text-gray-500">
                      Semester {selectedSemester}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Dynamic Page Title and Description */}
          <div>
            <h1 className="text-3xl font-bold text-indigo-600">
              {selectedNote ? selectedNote.title :
               selectedSemester ? `Semester ${selectedSemester}` :
               selectedProgram ? selectedProgram.name :
               'Notes'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSemester ? `Browse all notes for semester ${selectedSemester}` :
               selectedProgram ? 'Select a semester to view notes' :
               'Select your program to get started'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section with Conditional Rendering */}
      <main className="py-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {selectedNote ? (
            // PDF Viewer for selected note
            <PDFViewer 
              pdfUrl={selectedNote.file_url} 
              title={selectedNote.title}
              showBackButton={false}
            />
          ) : selectedSemester ? (
            // Grid of notes for selected semester
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleNoteSelect(note)}
                  className="relative group bg-white rounded-lg shadow-sm border border-gray-200 
                           hover:shadow-md hover:border-indigo-200 transition-all duration-200 
                           cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 
                                 transition-colors line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{note.subject_name}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        note.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {note.is_verified ? "Verified" : "Unverified"}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 
                                            transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : selectedProgram ? (
            // Semester grid for selected program
            <SemesterGrid
              variant="notes"
              selectedSemester={selectedSemester}
              onSemesterSelect={handleSemesterSelect}
              data={Array.from({ length: 8 }, (_, i) => ({
                semester: i + 1,
                count: notesData.filter(note => 
                  note.program.id === selectedProgram.id && 
                  note.semester === i + 1
                ).length
              }))}
            />
          ) : (
            // Program selection list
            <NoteProgramList onProgramSelect={handleProgramSelect} />
          )}

          {/* Pagination Controls */}
          {selectedSemester && !selectedNote && hasMore && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesList;