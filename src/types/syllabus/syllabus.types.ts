/**
 * Type definitions for the Syllabus module
 * Contains interfaces for managing academic programs, subjects, and their syllabi,
 * providing a structured way to handle curriculum documentation.
 */

/**
 * Represents a program in the syllabus context
 * Used as the top-level organization unit for curriculum management
 */
export interface SyllabusProgram {
    /** Unique identifier for the program */
    id: number;
    /** Short name of the program (e.g., "BCA") */
    name: string;
    /** Complete name of the program (e.g., "Bachelor of Computer Applications") */
    full_name: string;
    /** Optional detailed description of the program and its objectives */
    description?: string;
    /** Duration of the program in years */
    duration_years: number;
    /** Whether the program is currently active */
    is_active: boolean;
}

/**
 * Represents a subject in the syllabus context
 * Contains basic subject information and its relationship to a program
 */
export interface SyllabusSubject {
    /** Unique identifier for the subject */
    id: number;
    /** Full name of the subject */
    name: string;
    /** Subject code used for academic reference */
    code: string;
    /** Reference to the program this subject belongs to */
    program: number;
    /** Semester number in which this subject is taught */
    semester: number;
    /** Optional detailed description of the subject content */
    description?: string;
}

/**
 * Represents a syllabus document
 * Contains metadata about the syllabus file and its usage statistics
 */
export interface Syllabus {
    /** Unique identifier for the syllabus */
    id: number;
    /** Reference to the subject this syllabus belongs to */
    subject: number;
    /** Name of the subject for display purposes */
    subject_name: string;
    /** Name of the program for display purposes */
    program_name: string;
    /** Original file name/path */
    file: string;
    /** Public URL to access the syllabus file */
    file_url: string;
    /** Version identifier of the syllabus */
    version: string;
    /** Whether this is the current active version */
    is_current: boolean;
    /** Whether this syllabus version is active */
    is_active: boolean;
    /** Detailed description of the syllabus content or changes */
    description: string;
    /** Reference to the user who uploaded this syllabus */
    uploaded_by: number;
    /** Display name of the uploader */
    uploaded_by_name: string;
    /** ISO timestamp of when the syllabus was uploaded */
    upload_date: string;
    /** ISO timestamp of the last update */
    last_updated: string;
    /** Number of times the syllabus has been viewed */
    view_count: number;
    /** Number of times the syllabus has been downloaded */
    download_count: number;
}

/**
 * Response type for subject syllabus data
 * Combines subject information with its associated syllabi
 */
export interface SubjectSyllabusResponse {
    /** Subject details */
    subject: SyllabusSubject;
    /** List of syllabus versions for this subject */
    syllabus: Syllabus[];
} 