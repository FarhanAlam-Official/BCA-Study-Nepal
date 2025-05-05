/**
 * Valid semester numbers in the system
 */
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Represents an academic program that contains notes
 */
export interface NotesProgram {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  notes_count: number;
  duration_years?: number;
}

/**
 * Represents a subject within a semester
 */
export interface SubjectData {
  /** Unique identifier for the subject */
  id: number;
  /** Full name of the subject */
  name: string;
  /** Subject code (e.g., CSC101) */
  code: string;
  /** Number of notes available for this subject */
  notes_count: number;
}

/**
 * Represents semester data including its subjects
 */
export interface SemesterData {
  /** Semester number (1-8) */
  semester: number;
  /** List of subjects in the semester */
  subjects: SubjectData[];
}

/**
 * Represents a single note/study material in the system
 */
export interface Note {
  id: number;
  title: string;
  subject: number;
  subject_name: string;
  program: NotesProgram;
  program_name: string;
  semester: Semester;
  description: string;
  file: string;
  file_url: string;
  upload_date: string;
  uploaded_by: {
    id: number;
    username: string;
  };
  uploaded_by_name: string;
  is_verified: boolean;
}

/**
 * API response format for paginated notes data
 */
export interface NotesResponse {
  results: Note[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Available filters for querying notes
 */
export interface NoteFilters {
  semester?: Semester;
  subject?: string;
  program_id?: number;
  verified?: boolean;
  search?: string;
}

/**
 * Data required to create a new note
 */
export interface CreateNoteData {
  title: string;
  subject: string;
  program_id?: number;
  semester: Semester;
  description?: string;
  file: File;
} 