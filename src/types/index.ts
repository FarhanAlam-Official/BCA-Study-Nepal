export interface College {
    id: string;
    name: string;
    location: string;
    contact: string;
    affiliation: string;
    rating: number;
    image: string;
  }
  
  export interface Subject {
    id: string;
    name: string;
    semester: number;
    code: string;
    creditHours: number;
  }
  
  export interface Note {
    id: string;
    title: string;
    subject: string;
    semester: number;
    uploadDate: string;
    fileUrl: string;
  }