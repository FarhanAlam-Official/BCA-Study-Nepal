/**
 * GPA Calculator Module
 * 
 * This barrel file exports all components and utilities needed for the GPA Calculator feature.
 * - Main Component: GPACalculator
 * - Sub-components: CourseList and UniversityToggle
 * - Types: Course, GradeScaleItem, and University types
 * - Utilities: Grade calculation functions and grade scales
 */

export { default } from './GPACalculator';
export { default as CourseList } from './CourseList';
export { default as UniversityToggle } from './UniversityToggle';
export * from './types';
export * from './gradeUtils'; 