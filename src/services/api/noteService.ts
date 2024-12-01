import api from '../config/axios';
import { safeRequest, handleFileDownload } from '../utils/apiUtils';
import { Note } from '../types';

export const noteService = {
  getAll: () => safeRequest<Note[]>(() => api.get('/notes/')),
  getBySemester: (semester: number) => 
    safeRequest<Note[]>(() => api.get(`/notes/by_semester/?semester=${semester}`)),
  create: (data: FormData) => 
    safeRequest<Note>(() => api.post('/notes/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })),
  delete: (id: string) => safeRequest<void>(() => api.delete(`/notes/${id}/`)),
  download: (fileUrl: string) => handleFileDownload(fileUrl),
};