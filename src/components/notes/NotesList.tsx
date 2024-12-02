import React, { useState, useCallback, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useData } from '../../services/hooks/useData';
import { noteService } from '../../services/api/noteService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import DataCard from '../common/DataCard';
import { Note } from '../../services/types';

const NotesList: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [isVerified, setIsVerified] = useState<'all' | 'true' | 'false'>('all');
  const [semesterNotes, setSemesterNotes] = useState<{ [key: string]: Note[] }>({});
  const [currentSemester, setCurrentSemester] = useState<string | null>(null); // To track the selected semester

  const fetchNotes = useCallback(async () => {
    let query = '';

    if (selectedSemester !== 'all') {
      query += `semester=${selectedSemester}`;
    }

    if (isVerified !== 'all') {
      if (query) query += '&';
      query += `is_verified=${isVerified}`;
    }

    const apiUrl = `http://localhost:8000/api/notes/?${query}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const groupedNotes: { [key: string]: Note[] } = {};
    data.results.forEach((note: Note) => {
      const semesterKey = note.semester.toString();
      if (!groupedNotes[semesterKey]) {
        groupedNotes[semesterKey] = [];
      }
      groupedNotes[semesterKey].push(note);
    });

    setSemesterNotes(groupedNotes);
    return data.results || [];
  }, [selectedSemester, isVerified]);

  const { data: notes, loading, error, refetch } = useData<Note[]>({
    fetchFn: fetchNotes,
    dependencies: [selectedSemester, isVerified],
  });

  const handleDownload = async (note: Note) => {
    try {
      await noteService.download(note.file);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download the file. Please try again later.');
    }
  };

  const handleSemesterClick = (semester: string) => {
    setCurrentSemester(semester); // Set the current semester to show subject-specific notes
  };

  const handleBackClick = () => {
    setCurrentSemester(null); // Return to the semester cards view
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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

  const semesters = ['all', ...Array.from({ length: 8 }, (_, i) => (i + 1).toString())];

  return (
    <div className="space-y-6">
      {currentSemester ? (
        // Subject-specific cards for the selected semester
        <>
          <button
            className="text-blue-500 underline mb-4"
            onClick={handleBackClick}
          >
            Back to Semesters
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            Notes for Semester {currentSemester}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(semesterNotes[currentSemester] || []).map((note) => (
              <DataCard
                key={note.id}
                title={note.title}
                subtitle={note.subject}
                description={note.description}
                icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                metadata={[
                  {
                    label: 'Uploaded',
                    value: new Date(note.upload_date).toLocaleDateString(),
                  },
                ]}
                tags={note.is_verified ? ['Verified'] : ['Not Verified']}
                onDownload={() => handleDownload(note)}
              />
            ))}
          </div>
        </>
      ) : (
        // Semester cards view
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
            <div className="flex gap-4">
              <select
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={selectedSemester}
                onChange={(e) =>
                  setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={isVerified}
                onChange={(e) =>
                  setIsVerified(e.target.value as 'all' | 'true' | 'false')
                }
              >
                <option value="all">All Verification Status</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester) => {
              const semesterData = semester === 'all' ? notes : semesterNotes[semester] || [];

              return (
                <div
  key={semester}
  className="cursor-pointer"
  onClick={() => handleSemesterClick(semester)} // Handle click event
>
                <DataCard
                  key={semester}
                  title={semester === 'all' ? 'All Semesters' : `Semester ${semester}`}
                  subtitle={`${semester === 'all' ? 'All notes' : `Notes for Semester ${semester}`}`}
                  description={`View notes for ${semester === 'all' ? 'all semesters' : `Semester ${semester}`}`}
                  icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                  metadata={[
                    {
                      label: 'Notes Count',
                      value: semesterData?.length.toString() || '0',
                    },
                  ]}
                  tags={semesterData?.length === 0 ? ['No Notes'] : []}
                />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default NotesList;
