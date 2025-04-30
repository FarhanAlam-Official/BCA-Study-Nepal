export interface Course {
  id: number;
  name: string;
  marks: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

export interface GradeScaleItem {
  grade: string;
  range: string;
  points: string;
  remarks?: string;
}

export type University = 'TU' | 'PU'; 