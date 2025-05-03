import api from '../../api/core/api.core';
import { Note } from '../types';

interface NotesResponse {
  results: Note[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const noteService = {
  getAll: async (params?: URLSearchParams): Promise<NotesResponse> => {
    const response = await api.get(`/notes/${params ? `?${params.toString()}` : ''}`);
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