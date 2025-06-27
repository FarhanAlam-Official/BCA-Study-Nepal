// src/components/notes/NotesGrid.tsx
import React from 'react';
import { BookOpen } from 'lucide-react';
import DataCard from '../common/DataCard';
import { Note } from '../../services/types';
import { noteService } from '../../services/api/noteService';

interface NotesGridProps {
  notes: Note[];
  semester: string;
  onNoteClick: (note: Note) => void;
}

const NotesGrid: React.FC<NotesGridProps> = ({ notes, semester, onNoteClick }) => {
  const handleDownload = async (note: Note) => {
    try {
      await noteService.download(note.file);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download the file. Please try again later.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        {semester === 'all' ? 'All Notes' : `Notes for Semester ${semester}`}
      </h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <DataCard
            key={note.id}
            title={note.title}
            subtitle={note.subject}
            description={note.description}
            icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
            metadata={[
              {
                label: "Uploaded",
                value: new Date(note.upload_date).toLocaleDateString(),
              },
            ]}
            tags={note.is_verified ? ["Verified"] : ["Not Verified"]}
            onDownload={() => handleDownload(note)}
            onClick={() => onNoteClick(note)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesGrid;
