import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../services/hooks/useData";
import { noteService } from "../../services/api/noteService";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorDisplay from "../common/ErrorDisplay";
import { Note } from "../../services/types";
import SemesterGrid from "./SemesterGrid";
import NotesGrid from "./NotesGrid";

const NotesList: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [isVerified, setIsVerified] = useState<"all" | "true" | "false">("all");
  const [currentSemester, setCurrentSemester] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSemester !== "all") params.append("semester", `${selectedSemester}`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Study Notes</h2>
        <div className="flex gap-4">
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={isVerified}
            onChange={(e) => setIsVerified(e.target.value as "all" | "true" | "false")}
          >
            <option value="all">All Verification Status</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
      </div>

      {currentSemester ? (
        <>
          <button
            className="text-blue-500 underline mb-4"
            onClick={() => setCurrentSemester(null)}
          >
            Back to Semesters
          </button>
          <NotesGrid 
            notes={groupedNotes[currentSemester] || []}
            semester={currentSemester}
            onNoteClick={(note) => {
              console.log('Note being passed:', note);
              navigate(`/viewer/${encodeURIComponent(note.file)}/${encodeURIComponent(note.subject)}`, {
                state: { 
                  title: note.title 
                }
              });
            }}
          />
        </>
      ) : (
        <SemesterGrid 
          notes={notes || []}
          groupedNotes={groupedNotes}
          onSemesterClick={setCurrentSemester}
        />
      )}
    </div>
  );
};

export default NotesList;