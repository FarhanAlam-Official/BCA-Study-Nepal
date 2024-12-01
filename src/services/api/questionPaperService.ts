import api from '../config/axios';
import { safeRequest, handleFileDownload } from '../utils/apiUtils';
import { QuestionPaper } from '../types';

export const questionPaperService = {
  getAll: () => safeRequest<QuestionPaper[]>(() => api.get('/question-papers/')),
  getByYear: (year: number) => 
    safeRequest<QuestionPaper[]>(() => api.get(`/question-papers/by_year/?year=${year}`)),
  download: (fileUrl: string) => handleFileDownload(fileUrl),
};