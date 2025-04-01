import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Book, CheckCircle, Clock } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface Note {
  id: number;
  title: string;
  subject: string;
  semester: number;
  file?: string;
  upload_date: string;
  is_verified: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

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

  if (loading) return <LoadingSpinner />;
  if (!note) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center min-h-[400px] text-gray-500"
    >
      Note not found
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6 mt-8"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
      >
        {note.title}
      </motion.h1>

      <motion.div
        variants={containerVariants}
        className="bg-white/90 backdrop-blur-sm rounded-2xl border border-transparent hover:border-indigo-100 
                  shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-xl">
            <div className="p-4 rounded-xl bg-indigo-100/70 text-indigo-600 shadow-sm mb-4">
              <Book className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Subject</p>
              <p className="font-semibold text-gray-900 text-lg">{note.subject}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-xl">
            <div className="p-4 rounded-xl bg-purple-100/70 text-purple-600 shadow-sm mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Semester</p>
              <p className="font-semibold text-gray-900 text-lg">{note.semester}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-xl">
            <div className="p-4 rounded-xl bg-indigo-100/70 text-indigo-600 shadow-sm mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Upload Date</p>
              <p className="font-semibold text-gray-900 text-lg">
                {new Date(note.upload_date).toLocaleDateString()}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center p-6 bg-gray-50/50 rounded-xl lg:col-start-2">
            <div className={`p-4 rounded-xl shadow-sm mb-4 ${note.is_verified ? 'bg-green-100/70 text-green-600' : 'bg-yellow-100/70 text-yellow-600'}`}>
              {note.is_verified ? <CheckCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
              <p className={`font-semibold text-lg ${note.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {note.is_verified ? 'Verified' : 'Pending Verification'}
              </p>
            </div>
          </motion.div>
        </div>
        
        {note.file && (
          <motion.div 
            variants={itemVariants}
            className="px-8 py-6 border-t border-gray-100/80 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-indigo-50/50 flex justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={note.file}
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl
                       hover:bg-indigo-700 transition-all duration-200 gap-3 font-medium shadow-lg
                       hover:shadow-indigo-500/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-5 h-5" />
              Download Note
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 