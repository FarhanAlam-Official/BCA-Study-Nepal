/**
 * Represents a single course entry in the GPA calculator
 * @property {number} id - Unique identifier for the course
 * @property {string} name - Name of the course
 * @property {string} marks - Obtained marks in the course (stored as string for input handling)
 * @property {number} credits - Credit hours assigned to the course
 * @property {string} grade - Letter grade calculated based on marks
 * @property {number} gradePoints - Grade points calculated based on the grading system
 */
export interface Course {
  id: number;
  name: string;
  marks: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

/**
 * Represents a grade scale item in the grading system
 * @property {string} grade - Letter grade (e.g., 'A', 'B+', etc.)
 * @property {string} range - Mark range for this grade (e.g., '90-100')
 * @property {string} points - Grade points for this grade
 * @property {string} [remarks] - Optional remarks or description for the grade
 */
export interface GradeScaleItem {
  grade: string;
  range: string;
  points: string;
  remarks?: string;
}

/**
 * University type representing supported universities
 * TU - Tribhuvan University
 * PU - Pokhara University
 */
export type University = 'TU' | 'PU'; 