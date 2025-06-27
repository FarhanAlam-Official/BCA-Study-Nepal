/**
 * Type definitions for the Question Papers module
 * Contains interfaces for managing academic programs, subjects, and their associated question papers
 */

/**
 * Represents an academic program (e.g., BCA, BBA)
 * Used as the top-level organization unit for question papers
 */
export interface Program {
  /** Unique identifier for the program */
  id: number;
  /** Short name of the program (e.g., "BCA") */
  name: string;
  /** URL-friendly version of the program name */
  slug: string;
  /** Detailed description of the program */
  description: string;
  /** Duration of the program in years */
  duration_years: number;
  /** Whether the program is currently active */
  is_active: boolean;
}

/**
 * Represents an academic subject within a program
 * Contains subject information and its associated question papers
 */
export interface Subject {
  /** Unique identifier for the subject */
  id: number;
  /** Full name of the subject */
  name: string;
  /** Subject code (e.g., "CSC101") */
  code: string;
  /** Reference to the program this subject belongs to */
  program: number;
  /** Semester number this subject is taught in */
  semester: number;
  /** Number of credit hours assigned to this subject */
  credit_hours: number;
  /** Whether the subject is currently active */
  is_active: boolean;
  /** List of question papers available for this subject */
  question_papers: QuestionPaper[];
}

/**
 * Represents a question paper document
 * Contains metadata about the paper and its verification status
 */
export interface QuestionPaper {
  /** Unique identifier for the question paper (UUID) */
  id: string;
  /** Academic year the paper is from */
  year: number;
  /** Semester number the paper is for */
  semester: number;
  /** URL to access the question paper file */
  file: string;
  /** Verification status of the paper */
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  /** Number of times the paper has been viewed */
  view_count: number;
  /** Number of times the paper has been downloaded */
  download_count: number;
}

/**
 * Groups subjects by semester for organized display
 * Used for presenting subjects in a semester-wise structure
 */
export interface SemesterData {
  /** Semester number */
  semester: number;
  /** List of subjects taught in this semester */
  subjects: Subject[];
}

/**
 * Response structure for program subjects API
 * Contains complete program details with subjects organized by semester
 */
export interface ProgramSubjectsResponse {
  /** Details of the academic program */
  program: Program;
  /** List of semesters with their subjects */
  semesters: SemesterData[];
}