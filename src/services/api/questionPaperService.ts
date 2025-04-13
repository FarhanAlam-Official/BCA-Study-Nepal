import { Program, ProgramSubjectsResponse, QuestionPaper } from '../types/questionpapers.types';
import { questionPapers } from '../api';
// import axios from 'axios';

export const questionPaperService = {
  getPrograms: async (): Promise<Program[]> => {
    try {
      const response = await questionPapers.getPrograms();
      // Handle both array and paginated response formats
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  getByProgram: async (programId: number): Promise<ProgramSubjectsResponse> => {
    try {
      const response = await questionPapers.getByProgram(programId);
      return response.data;
    } catch (error) {
      console.error('Error fetching question papers:', error);
      throw error;
    }
  },

  getBySubject: async (subjectId: number, year?: number): Promise<QuestionPaper[]> => {
    try {
      const response = await questionPapers.getBySubject(subjectId, year);
      // Handle both array and paginated response formats
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
  },
};