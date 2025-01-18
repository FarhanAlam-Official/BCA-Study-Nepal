import api from '../config/axios';
import { Program, ProgramSubjectsResponse } from '../types/questionpapers.types';
// import axios from 'axios';
import { QuestionPaper } from '../types/questionpapers.types';
import axios from '../config/axios';

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
  },

  getSubjectPapers: async (subjectId: number): Promise<QuestionPaper[]> => {
    try {
      const response = await axios.get(`/question-papers/by_subject/`, {
        params: {
          subject_id: subjectId
        }
      });
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch papers for subject ${subjectId}:`, error);
      return [];
    }
  },
};