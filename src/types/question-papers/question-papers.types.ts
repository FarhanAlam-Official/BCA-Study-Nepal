/**
 * Type definitions for the Question Papers module
 * Contains interfaces for programs, subjects, and question papers
 */

/**
 * Represents an academic program (e.g., BCA, BBA)
 * Maps to the Program model in the backend
 */
export interface Program {
    id: number;
    name: string;
    slug: string;
    description: string;
    duration_years: number;
    is_active: boolean;
  }
  
  /**
   * Represents an academic subject within a program
   * Contains basic subject information and its associated question papers
   */
  export interface Subject {
    id: number;
    name: string;
    code: string;
    program: number;  // References Program.id
    semester: number;
    credit_hours: number;
    is_active: boolean;
    question_papers: QuestionPaper[];
  }
  
  /**
   * Represents a question paper document
   * Contains metadata about the paper and its verification status
   */
  export interface QuestionPaper {
    id: string;  // UUID from backend
    year: number;
    semester: number;
    file: string;  // URL to the paper file
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    view_count: number;
    download_count: number;
  }

/**
 * Groups subjects by semester
 * Used for organizing subjects in the UI
 */
export interface SemesterData {
  semester: number;
  subjects: Subject[];
}

/**
 * Response structure for program subjects API
 * Contains program details and its subjects organized by semester
 */
export interface ProgramSubjectsResponse {
  program: Program;
  semesters: SemesterData[];
}