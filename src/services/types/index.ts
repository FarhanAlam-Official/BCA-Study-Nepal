export interface Note {
  id: string;
  title: string;
  subject: string;
  semester: number;
  description: string;
  file: string;
  upload_date: string;
  is_verified: boolean;
  uploaded_by: {
    id: string;
    username: string;
  };
}

export interface QuestionPaper {
  id: string;
  subject: string;
  year: number;
  semester: number;
  file: string;
  upload_date: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  contact: string;
  affiliation: string;
  rating: number;
  image: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  speaker?: string;
  registration: boolean;
}