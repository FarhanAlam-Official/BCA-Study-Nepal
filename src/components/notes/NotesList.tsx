import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../services/hooks/useData";
import { noteService } from "../../services/api/noteService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorDisplay from "../common/ErrorDisplay";
import { Note } from "../../services/types";
import SemesterGrid from "../common/SemesterGrid";
// import NotesGrid from "./NotesGrid";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

const NotesList: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<string | number | null>(null);
  const [isVerified, setIsVerified] = useState<"all" | "true" | "false">("all");
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSemester !== null) params.append("semester", `${selectedSemester}`);
      if (isVerified !== "all") params.append("is_verified", isVerified);

      const response = await noteService.getAll(params);
      return response.results || [];
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw error;
    }
  }, [selectedSemester, isVerified]);

  const { data: notes, loading, error, refetch } = useData<Note[]>({
    fetchFn: fetchNotes,
    dependencies: [selectedSemester, isVerified]
  });

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <ErrorDisplay message={error} onRetry={refetch} />;

  const groupedNotes = notes?.reduce((acc: { [key: string]: Note[] }, note) => {
    const semesterKey = note.semester.toString();
    if (!acc[semesterKey]) acc[semesterKey] = [];
    acc[semesterKey].push(note);
    return acc;
  }, {}) || {};

  const formatSemesterData = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      count: groupedNotes[(i + 1).toString()]?.length || 0
    }));
  };

  const handleSemesterSelect = (semester: string | number) => {
    setSelectedSemester(semester);
  };

  const handleNoteClick = (note: Note) => {
    navigate(`/viewer/${encodeURIComponent(note.file)}/${encodeURIComponent(note.subject)}`, {
      state: { title: note.title }
    });
  };

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-4">
          {selectedSemester !== null && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSemester(null)}
              className="p-2 rounded-lg hover:bg-white/50 active:bg-white/70 transition-colors duration-150"
            >
              <ChevronLeft className="w-5 h-5 text-indigo-600" />
            </motion.button>
          )}
          <motion.h1 
            layout
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient"
          >
            {selectedSemester ? `Semester ${selectedSemester} Notes` : 'Study Notes'}
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
          {selectedSemester !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 text-sm pl-2"
            >
              <button
                onClick={() => setSelectedSemester(null)}
                className="text-indigo-600 hover:text-purple-600 transition-colors font-medium"
              >
                Notes
              </button>
              <ChevronRight className="w-4 h-4 text-purple-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 font-medium">
                Semester {selectedSemester}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-6"
      >
        <select
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base 
                   focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 
                   sm:text-sm hover:border-purple-400 transition-colors"
          value={isVerified}
          onChange={(e) => setIsVerified(e.target.value as "all" | "true" | "false")}
        >
          <option value="all">All Verification Status</option>
          <option value="true">Verified</option>
          <option value="false">Not Verified</option>
        </select>
      </motion.div>

      {/* Content Cards */}
      <AnimatePresence mode="wait">
        {selectedSemester ? (
          <motion.div
            key="notes"
            {...pageTransition}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6
                     hover:shadow-md transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(groupedNotes[String(selectedSemester)] || []).map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.01 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleNoteClick(note)}
                  className="bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 
                           rounded-xl border border-transparent hover:border-indigo-100 shadow-lg hover:shadow-indigo-500/10
                           transition-all duration-300 overflow-hidden group h-[240px] cursor-pointer"
                >
                  {/* Note Header */}
                  <div className="p-5 border-b border-gray-100/80">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 
                                   transition-colors line-clamp-2 flex-1">
                        {note.title}
                      </h3>
                      <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full 
                                   text-xs font-medium whitespace-nowrap
                                   ${note.is_verified 
                                     ? 'bg-green-100/70 text-green-700' 
                                     : 'bg-yellow-100/70 text-yellow-700'}`}>
                        {note.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {note.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(note.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 group-hover:text-gray-700">
                      {note.description || 'No description available'}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full
                                     bg-indigo-100/50 text-indigo-600 font-medium group-hover:bg-indigo-100">
                          {note.semester}
                        </span>
                        <span className="text-gray-500 group-hover:text-indigo-600">
                          Semester
                        </span>
                      </div>
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="semesters"
            {...pageTransition}
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-6
                     hover:shadow-md transition-shadow duration-200"
          >
            <SemesterGrid
              variant="notes"
              selectedSemester={selectedSemester}
              onSemesterSelect={handleSemesterSelect}
              data={formatSemesterData()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesList;