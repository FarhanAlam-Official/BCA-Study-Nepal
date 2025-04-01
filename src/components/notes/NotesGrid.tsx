// src/components/notes/NotesGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Note } from '../../services/types';

interface NotesGridProps {
  notes: Note[];
  semester: string;
  onNoteClick: (note: Note) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const NotesGrid: React.FC<NotesGridProps> = ({ notes, semester, onNoteClick }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div 
        variants={itemVariants}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-black-500 to-indigo-600">
          Semester {semester} Notes
        </h2>
        <p className="text-gray-600">
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'} Available
        </p>
      </motion.div>

      {/* Notes Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {notes.map((note) => (
          <motion.div
            key={note.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            onClick={() => onNoteClick(note)}
            className="bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 
                     rounded-xl border border-transparent hover:border-indigo-100 shadow-lg hover:shadow-indigo-500/10
                     transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            <div className="p-5 border-b border-gray-100/80">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    {note.subject}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`
                    inline-flex px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap
                    ${note.is_verified 
                      ? 'bg-green-100/70 text-green-700' 
                      : 'bg-yellow-100/70 text-yellow-700'}
                  `}>
                    {note.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Added {new Date(note.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {note.file && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(note.file, '_blank');
                      }}
                      className="p-2 rounded-lg hover:bg-indigo-100/80 text-indigo-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                      <span className="sr-only">Download</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NotesGrid;
