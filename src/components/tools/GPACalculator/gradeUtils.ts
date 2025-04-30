import { GradeScaleItem } from './types';

export const calculateTUGrade = (marks: number): { grade: string; points: number } => {
  if (marks >= 90) return { grade: 'A', points: 4.0 };
  if (marks >= 80) return { grade: 'A-', points: 3.7 };
  if (marks >= 70) return { grade: 'B+', points: 3.3 };
  if (marks >= 60) return { grade: 'B', points: 3.0 };
  if (marks >= 50) return { grade: 'B-', points: 2.7 };
  return { grade: 'F', points: 0 };
};

export const calculatePUGrade = (marks: number): { grade: string; points: number } => {
  if (marks >= 90) return { grade: 'A', points: 4.0 };
  if (marks >= 85) return { grade: 'A-', points: 3.7 };
  if (marks >= 80) return { grade: 'B+', points: 3.3 };
  if (marks >= 75) return { grade: 'B', points: 3.0 };
  if (marks >= 70) return { grade: 'B-', points: 2.7 };
  if (marks >= 65) return { grade: 'C+', points: 2.3 };
  if (marks >= 60) return { grade: 'C', points: 2.0 };
  if (marks >= 55) return { grade: 'C-', points: 1.7 };
  if (marks >= 50) return { grade: 'D+', points: 1.3 };
  if (marks >= 45) return { grade: 'D', points: 1.0 };
  return { grade: 'F', points: 0.0 };
};

export const tuGradeScale: GradeScaleItem[] = [
  { grade: 'A', range: '90-100', points: '4.0', remarks: 'Distinction' },
  { grade: 'A-', range: '80-89.9', points: '3.7', remarks: 'Very Good' },
  { grade: 'B+', range: '70-79.9', points: '3.3', remarks: 'First Division' },
  { grade: 'B', range: '60-69.9', points: '3.0', remarks: 'Second Division' },
  { grade: 'B-', range: '50-59.9', points: '2.7', remarks: 'Pass' },
  { grade: 'F', range: 'Below 50', points: '0', remarks: 'Fail' },
];

export const puGradeScale: GradeScaleItem[] = [
  { grade: 'A', range: '90-100', points: '4.0' },
  { grade: 'A-', range: '85-89', points: '3.7' },
  { grade: 'B+', range: '80-84', points: '3.3' },
  { grade: 'B', range: '75-79', points: '3.0' },
  { grade: 'B-', range: '70-74', points: '2.7' },
  { grade: 'C+', range: '65-69', points: '2.3' },
  { grade: 'C', range: '60-64', points: '2.0' },
  { grade: 'F', range: 'Below 60', points: '0' }
]; 