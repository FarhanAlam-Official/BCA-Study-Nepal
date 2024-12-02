import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useData } from '../../services/hooks/useData';
import { noteService } from '../../services/api/noteService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import DataCard from '../common/DataCard';
import { Note } from '../../services/types';

const NotesList: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  const { data: notes, loading, error, refetch } = useData<Note[]>({
    fetchFn: () =>
      selectedSemester === 'all'
        ? noteService.getAll()
        : noteService.getBySemester(Number(selectedSemester)),
    dependencies: [selectedSemester],
  });

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
    return <ErrorDisplay message={error} onRetry={refetch} />;
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

      {!notes?.length ? (
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
            <DataCard
              key={note.id}
              title={note.title}
              subtitle={`${note.subject} • Semester ${note.semester}`}
              description={note.description}
              icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
              metadata={[
                {
                  label: 'Uploaded',
                  value: new Date(note.upload_date).toLocaleDateString(),
                },
              ]}
              tags={note.is_verified ? ['Verified'] : []}
              onDownload={() => handleDownload(note)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;