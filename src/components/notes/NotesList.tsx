// src/components/notes/NotesList.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { notes } from '../../api/core/api.core';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import SemesterGrid from '../common/SemesterGrid';
import PDFViewer from '../common/PDFViewer';
import { motion } from 'framer-motion';

interface Note {
  id: number;
  title: string;
  subject: number;
  subject_name: string;
  semester: number;
  description: string;
  file: string;
  file_url: string;
  upload_date: string;
  uploaded_by: number;
  uploaded_by_name: string;
  is_verified: boolean;
}

const NotesList: React.FC = () => {
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(() => {
    const saved = sessionStorage.getItem('selectedSemester');
    return saved ? Number(saved) : null;
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(() => {
    const saved = sessionStorage.getItem('selectedNote');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (selectedSemester) {
      sessionStorage.setItem('selectedSemester', String(selectedSemester));
    } else {
      sessionStorage.removeItem('selectedSemester');
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedNote) {
      sessionStorage.setItem('selectedNote', JSON.stringify(selectedNote));
    } else {
      sessionStorage.removeItem('selectedNote');
    }
  }, [selectedNote]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notes.getAll(page);
      const data = response.data;
      
      if (data.results) {
        setNotesData(data.results);
        setHasMore(!!data.next);
      } else {
        setError('No notes data received from server');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(Number(semester));
    setSelectedNote(null);
    setPage(1);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchNotes} />;
  }

  const filteredNotes = notesData.filter(note => 
    !selectedSemester || note.semester === selectedSemester
  );
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {(selectedSemester || selectedNote) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 px-6 py-2 text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
          onClick={() => {
            if (selectedNote) {
              setSelectedNote(null);
            } else {
              setSelectedSemester(null);
            }
          }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {selectedNote ? 'Back to Notes' : 'Back to Semesters'}
        </motion.button>
      )}

      {selectedNote ? (
        <PDFViewer 
          pdfUrl={selectedNote.file_url} 
          title={selectedNote.title}
          showBackButton={false}
        />
      ) : selectedSemester ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Semester {selectedSemester} Notes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleNoteSelect(note)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{note.subject_name}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      note.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {note.is_verified ? "Verified" : "Unverified"}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Study Notes</h1>
          <SemesterGrid
            variant="notes"
            selectedSemester={selectedSemester}
            onSemesterSelect={handleSemesterSelect}
            data={Array.from({ length: 8 }, (_, i) => ({
              semester: i + 1,
              count: notesData.filter(note => note.semester === i + 1).length
            }))}
          />
        </div>
      )}

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
            className={`px-4 py-2 rounded-md ${
              !hasMore
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesList;