import React, { useState, useEffect } from 'react';
import { BookOpen, Download, AlertCircle } from 'lucide-react';
import { noteService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

interface Note {
  id: string;
  title: string;
  subject: string;
  semester: number;
  file: string;
  description: string;
  upload_date: string;
  is_verified: boolean;
}

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchNotes();
  }, [selectedSemester]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = selectedSemester === 'all' 
        ? await noteService.getAll()
        : await noteService.getBySemester(Number(selectedSemester));
      setNotes(response.data);
    } catch (err) {
      setError('Failed to load notes. Please try again later.');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (note: Note) => {
    try {
      await noteService.download(note.file);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download the file. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Notes</h3>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchNotes}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
        <select
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedSemester === 'all'
              ? 'No notes are available at the moment.'
              : `No notes available for Semester ${selectedSemester}.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-500">
                      {note.subject} • Semester {note.semester}
                    </p>
                  </div>
                </div>
                
                {note.description && (
                  <p className="mt-3 text-sm text-gray-600">{note.description}</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Uploaded: {new Date(note.upload_date).toLocaleDateString()}
                  </span>
                  {note.is_verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleDownload(note)}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesList;