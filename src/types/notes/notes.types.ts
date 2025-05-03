export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Note {
  id: number;
  title: string;
  subject: string;
  subject_name?: string;
  semester: Semester;
  description: string;
  file: string;
  file_url?: string;
  upload_date: string;
  is_verified: boolean;
  uploaded_by: {
    id: number;
    username: string;
  };
  uploaded_by_name?: string;
}

export interface NotesResponse {
  results: Note[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface NoteFilters {
  semester?: Semester;
  subject?: string;
  verified?: boolean;
  search?: string;
}

export interface CreateNoteData {
  title: string;
  subject: string;
  semester: Semester;
  description?: string;
  file: File;
} 