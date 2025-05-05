/**
 * Type definitions for the Syllabus module
 */


/**
 * Represents a program in the syllabus context
 */
export interface SyllabusProgram {
    id: number;
    name: string;
    code: string;
    description?: string;
}

/**
 * Represents a subject in the syllabus context
 */
export interface SyllabusSubject {
    id: number;
    name: string;
    code: string;
    program: number;
    semester: number;
    description?: string;
}

/**
 * Represents a syllabus document
 */
export interface Syllabus {
    id: number;
    subject: number;
    subject_name: string;
    program_name: string;
    file: string;
    file_url: string;
    version: string;
    is_current: boolean;
    is_active: boolean;
    description: string;
    uploaded_by: number;
    uploaded_by_name: string;
    upload_date: string;
    last_updated: string;
    view_count: number;
    download_count: number;
}

/**
 * Response type for subject syllabus data
 */
export interface SubjectSyllabusResponse {
    subject: SyllabusSubject;
    syllabus: Syllabus[];
} 