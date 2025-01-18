export interface Program {
    id: number;
    name: string;
    slug: string;
    description: string;
    duration_years: number;
    is_active: boolean;
  }
  
  export interface Subject {
    id: number;
    code: string;
    name: string;
    questionPapers?: Array<{
      id: number;
      status: string;
      file?: string;
    }>;
    program: number;  // Program ID
    semester: number;
    credit_hours: number;
    is_active: boolean;
  }
  
  export interface QuestionPaper {
    id: string;
    subject: Subject;
    year: number;
    semester: number;
    file: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    view_count: number;
    download_count: number;
    created_at: string;
  }

interface SemesterData {
  semester: number;
  subjects: Subject[];
}

export interface ProgramSubjectsResponse {
  program: Program;
  semesters: SemesterData[];
}