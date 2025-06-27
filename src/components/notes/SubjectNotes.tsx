/**
 * Component for displaying notes related to a specific subject.
 * Shows a grid of note cards with details like title, description, verification status,
 * and upload date. Supports note viewing and navigation.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Calendar, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { notes } from '../../api/core/api.core';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { showError } from '../../utils/notifications';

/**
 * Interface representing a note's data structure
 */
interface Note {
  id: number;
  title: string;
  description: string;
  file_url: string;
  upload_date: string;
  is_verified: boolean;
  uploaded_by_name: string;
}

const SubjectNotes: React.FC = () => {
  // Get subject ID and name from URL parameters
  const { subjectId, subjectName } = useParams();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectNotes, setSubjectNotes] = useState<Note[]>([]);

  // Fetch notes when subject ID changes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!subjectId) {
          const errorMsg = 'Subject ID is required';
          setError(errorMsg);
          showError(errorMsg);
          return;
        }

        const response = await notes.getBySubject(Number(subjectId));
        
        if (response.data) {
          setSubjectNotes(response.data);
        } else {
          const errorMsg = 'Failed to load notes data';
          setError(errorMsg);
          showError(errorMsg);
        }
      } catch {
        const errorMsg = 'Failed to load notes. Please try again later.';
        setError(errorMsg);
        showError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subjectId]);

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  /**
   * Navigate to the note viewer when a note is clicked
   */
  const handleNoteClick = (note: Note) => {
    navigate(`/viewer/${encodeURIComponent(note.file_url)}/${encodeURIComponent(subjectName || '')}`, {
      state: { noteName: note.title }
    });
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-12">
          {/* Subject Name Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text px-6 py-2 leading-relaxed">
              {decodeURIComponent(subjectName || '')}
            </h1>
          </div>

          {/* Navigation Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Notes Grid with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subjectNotes.length > 0 ? (
            subjectNotes.map((note) => (
              <motion.div
                key={note.id}
                variants={itemVariants}
                onClick={() => handleNoteClick(note)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 
                         hover:border-indigo-300/80 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10
                         transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Card Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Decorative Blur Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 
                              rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 
                              rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />
                
                {/* Card Content */}
                <div className="relative p-6 flex flex-col h-full">
                  {/* Status Badge and Upload Date */}
                  <div className="absolute top-4 right-4 flex flex-col items-end">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2
                                  transition-colors duration-300 mb-2 ${
                                    note.is_verified 
                                    ? 'bg-green-100/70 text-green-700 group-hover:bg-green-100' 
                                    : 'bg-yellow-100/70 text-yellow-700 group-hover:bg-yellow-100'
                                  }`}>
                      {note.is_verified ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(note.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Note Details */}
                  <div className="flex-1">
                    {/* Title and Author */}
                    <div className="flex items-start gap-4 mb-3 pr-24">
                      <div className="p-3 bg-indigo-100/50 rounded-lg group-hover:bg-indigo-100 
                                    transition-colors duration-300 shrink-0">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 
                                     transition-colors duration-300 mb-1 line-clamp-2">
                          {note.title}
                        </h3>
                        <span className="text-sm text-gray-500 block truncate">
                          By {note.uploaded_by_name}
                        </span>
                      </div>
                    </div>

                    {/* Note Description */}
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 mt-4">
                      {note.description}
                    </p>
                  </div>
                  
                  {/* View Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full group bg-indigo-50/50 hover:bg-indigo-100 text-indigo-600 
                                     rounded-xl py-3 px-4 flex items-center justify-center gap-2
                                     transition-all duration-300 hover:shadow-md">
                      <span className="font-medium">View Note</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-indigo-100/70 rounded-full mb-4">
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Notes Available
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                There are no notes available for this subject yet. Check back later or explore other subjects.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SubjectNotes; 