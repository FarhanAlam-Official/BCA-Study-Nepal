import api from '../config/axios';
import { Program, ProgramSubjectsResponse } from '../types/questionpapers.types';

export const questionPaperService = {
  getPrograms: async (): Promise<Program[]> => {
    try {
      const response = await api.get('/programs/');
      return response.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  },

  getByProgram: async (programId: number): Promise<ProgramSubjectsResponse> => {
    try {
      const response = await api.get(`/programs/${programId}/subjects/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }
};