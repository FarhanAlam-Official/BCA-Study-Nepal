import api from '../config/axios';
import { QuestionPaper } from '../types';

export const questionPaperService = {
  getAll: async (): Promise<QuestionPaper[]> => {
    const response = await api.get('/question-papers/');
    return response.data;
  },
  
  getByYear: async (year: number): Promise<QuestionPaper[]> => {
    const response = await api.get(`/question-papers/by_year/?year=${year}`);
    return response.data;
  },
  
  download: async (fileUrl: string): Promise<void> => {
    try {
      const response = await api.get(fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileUrl.split('/').pop() || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
};