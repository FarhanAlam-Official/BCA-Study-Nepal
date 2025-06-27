import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  subject: string;
  semester: number;
  file?: string;
  upload_date: string;
  is_verified: boolean;
}

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/notes/${id}/`);
        if (!response.ok) throw new Error('Note not found');
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!note) return <div className="flex justify-center p-8">Note not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Subject</p>
            <p className="font-medium">{note.subject}</p>
          </div>
          <div>
            <p className="text-gray-600">Semester</p>
            <p className="font-medium">{note.semester}</p>
          </div>
          <div>
            <p className="text-gray-600">Upload Date</p>
            <p className="font-medium">{new Date(note.upload_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className={`font-medium ${note.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {note.is_verified ? 'Verified' : 'Pending Verification'}
            </p>
          </div>
        </div>
        
        {note.file && (
          <div className="mt-6">
            <a
              href={note.file}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Note
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 