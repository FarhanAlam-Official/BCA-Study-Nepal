export interface College {
    id: string;
    name: string;
    location: string;
    affiliation: string;
  }
  
  export interface Note {
    id: string;
    title: string;
    uploadDate: Date;
    semester: number;
    fileUrl: string;
  }
  
  export interface QuestionPaper {
    id: string;
    title: string;
    year: number;
    downloadUrl: string;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
  }
  
  export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
  }
  