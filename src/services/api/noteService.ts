import api from '../config/axios';
import { Note } from '../types';

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/notes/');
    return response.data;
  },
  
  getBySemester: async (semester: number): Promise<Note[]> => {
    const response = await api.get(`/notes/by_semester/?semester=${semester}`);
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