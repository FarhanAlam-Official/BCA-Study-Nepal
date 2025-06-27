/**
 * Type definitions for the Notes module
 * Contains interfaces and types for managing academic notes and study materials
 */

/**
 * Valid semester numbers in the system
 * Restricted to values 1-8 to match standard academic program structure
 */
export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Represents an academic program that contains notes
 * Used for organizing notes by program/course
 */
export interface NotesProgram {
  /** Unique identifier for the program */
  id: number;
  /** Short name of the program (e.g., "BCA") */
  name: string;
  /** Full name of the program (e.g., "Bachelor of Computer Applications") */
  full_name: string;
  /** Optional detailed description of the program */
  description?: string;
  /** Total number of notes available in this program */
  notes_count: number;
  /** Duration of the program in years */
  duration_years?: number;
}

/**
 * Represents a subject within a semester
 * Contains basic subject information and notes count
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
 * Used for organizing subjects by semester
 */
export interface SemesterData {
  /** Semester number (1-8) */
  semester: number;
  /** List of subjects taught in this semester */
  subjects: SubjectData[];
}

/**
 * Represents a single note/study material in the system
 * Core data structure for the Notes module
 */
export interface Note {
  /** Unique identifier for the note */
  id: number;
  /** Title of the note */
  title: string;
  /** ID of the subject this note belongs to */
  subject: number;
  /** Name of the subject for display purposes */
  subject_name: string;
  /** Program this note belongs to */
  program: NotesProgram;
  /** Name of the program for display purposes */
  program_name: string;
  /** Semester number this note is associated with */
  semester: Semester;
  /** Detailed description of the note's content */
  description: string;
  /** Original file name/path */
  file: string;
  /** Public URL to access the file */
  file_url: string;
  /** ISO timestamp of when the note was uploaded */
  upload_date: string;
  /** User who uploaded the note */
  uploaded_by: {
    id: number;
    username: string;
  };
  /** Display name of the uploader */
  uploaded_by_name: string;
  /** Whether the note has been verified by moderators */
  is_verified: boolean;
}

/**
 * API response format for paginated notes data
 * Used for listing notes with pagination support
 */
export interface NotesResponse {
  /** Array of notes for the current page */
  results: Note[];
  /** Total number of notes matching the query */
  count: number;
  /** URL for the next page of results, null if on last page */
  next: string | null;
  /** URL for the previous page of results, null if on first page */
  previous: string | null;
}

/**
 * Available filters for querying notes
 * Used to refine note listings based on user preferences
 */
export interface NoteFilters {
  /** Filter by semester number */
  semester?: Semester;
  /** Filter by subject ID or code */
  subject?: string;
  /** Filter by program ID */
  program_id?: number;
  /** Filter by verification status */
  verified?: boolean;
  /** Search term to filter notes by title or description */
  search?: string;
}

/**
 * Data required to create a new note
 * Used when uploading new study materials
 */
export interface CreateNoteData {
  /** Title of the new note */
  title: string;
  /** Subject ID or code the note belongs to */
  subject: string;
  /** Optional program ID if not inferred from context */
  program_id?: number;
  /** Semester number the note belongs to */
  semester: Semester;
  /** Optional detailed description of the note's content */
  description?: string;
  /** The actual note file to be uploaded */
  file: File;
} 