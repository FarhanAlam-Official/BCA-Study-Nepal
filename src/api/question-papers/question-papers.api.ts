/**
 * Question Papers API Service
 * Handles all API interactions related to question papers, programs, and subjects
 */

import { Program, QuestionPaper, ProgramSubjectsResponse, Subject } from '../../types/question-papers/question-papers.types';
import axios from 'axios';
import { showError } from '../../utils/notifications';

const BASE_URL = '/api/question-papers';

interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

interface DataResponse<T> {
  data: T[];
}

type ApiResponse<T> = T[] | PaginatedResponse<T> | DataResponse<T>;

export const questionPapers = {
  getPrograms: async () => {
    return axios.get<ApiResponse<Program>>(`${BASE_URL}/programs`);
  },

  getByProgram: async (programId: number) => {
    return axios.get<ProgramSubjectsResponse>(`${BASE_URL}/programs/${programId}/subjects`);
  },

  getBySubject: async (subjectId: number) => {
    const url = `${BASE_URL}/subjects/${subjectId}`;
    return axios.get<Subject>(url);
  }
};

export const questionPaperService = {
  /**
   * Fetches all available programs
   * @returns Promise<Program[]> List of programs
   */
  getPrograms: async (): Promise<Program[]> => {
    try {
      const response = await questionPapers.getPrograms();
      // Handle both array and paginated response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else if ('results' in response.data) {
        return response.data.results;
      } else if ('data' in response.data) {
        return response.data.data;
      }
      showError('Unexpected response format from server');
      return [];
    } catch (error) {
      showError('Failed to fetch programs. Please try again later.');
      throw error;
    }
  },

  /**
   * Fetches subjects and their question papers for a specific program
   * @param programId - ID of the program to fetch subjects for
   * @returns Promise<ProgramSubjectsResponse> Program details with semester and subject data
   */
  getByProgram: async (programId: number): Promise<ProgramSubjectsResponse> => {
    try {
      const response = await questionPapers.getByProgram(programId);
      // Ensure the response has the expected structure
      if (response.data && response.data.program && Array.isArray(response.data.semesters)) {
        return response.data;
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      showError('Failed to fetch question papers. Please try again later.');
      throw error;
    }
  },

  /**
   * Fetches question papers for a specific subject
   * @param subjectId - ID of the subject to fetch papers for
   * @param year - Optional year to filter papers by
   * @returns Promise<QuestionPaper[]> List of question papers
   */
  getBySubject: async (subjectId: number, year?: number): Promise<QuestionPaper[]> => {
    try {
      const response = await questionPapers.getBySubject(subjectId);
      const subject = response.data;
      
      if (!subject.question_papers || !Array.isArray(subject.question_papers)) {
        return [];
      }

      // Filter papers by year if specified
      return subject.question_papers
        .filter(paper => paper.file && (!year || paper.year === year));
    } catch (error) {
      showError('Failed to fetch papers for this subject. Please try again later.');
      throw error;
    }
  },
};