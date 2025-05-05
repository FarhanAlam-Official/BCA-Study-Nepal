/**
 * Syllabus API Service
 * Handles all API interactions related to syllabus
 */

import { SyllabusProgram, SyllabusSubject, Syllabus } from '../../types/syllabus/syllabus.types';
import { showError } from '../../utils/notifications';
import { api } from '../core/api.core';

const BASE_URL = '/api/syllabus';

export const syllabusService = {
    /**
     * Gets all available programs
     * @returns Promise<SyllabusProgram[]> List of programs
     */
    getPrograms: async (): Promise<SyllabusProgram[]> => {
        try {
            const response = await api.get(`${BASE_URL}/programs/`);
            return response.data;
        } catch (error) {
            showError('Failed to load programs. Please try again.');
            throw error;
        }
    },

    /**
     * Gets subjects for a specific program
     * @param programId - ID of the program to fetch subjects for
     * @returns Promise containing program and semester-grouped subjects
     */
    getByProgram: async (programId: number): Promise<{
        program: SyllabusProgram;
        semesters: { semester: number; subjects: SyllabusSubject[] }[];
    }> => {
        try {
            const response = await api.get(`${BASE_URL}/programs_subjects/`, {
                params: { program_id: programId }
            });
            return response.data;
        } catch (error) {
            showError('Failed to load subjects. Please try again.');
            throw error;
        }
    },

    /**
     * Fetches syllabus for a specific subject
     * @param subjectId - ID of the subject to fetch syllabus for
     * @returns Promise<Syllabus[]> List of syllabus versions
     */
    getBySubject: async (subjectId: number): Promise<Syllabus[]> => {
        try {
            const response = await api.get(`${BASE_URL}/by_subject/`, {
                params: { subject_id: subjectId }
            });
            return response.data;
        } catch (error) {
            showError('Failed to fetch syllabus. Please try again later.');
            throw error;
        }
    },

    /**
     * Increments the view count for a syllabus
     * @param syllabusId - ID of the syllabus to increment views for
     */
    incrementView: async (syllabusId: number): Promise<void> => {
        try {
            await api.post(`${BASE_URL}/${syllabusId}/increment_view/`);
        } catch (error) {
            console.error('Failed to increment view count:', error);
        }
    },

    /**
     * Gets the download URL for a syllabus
     * @param syllabusId - ID of the syllabus to download
     * @returns Promise<string> Download URL
     */
    getDownloadUrl: async (syllabusId: number): Promise<string> => {
        try {
            const response = await api.get(`${BASE_URL}/${syllabusId}/download/`);
            return response.data.url;
        } catch (error) {
            showError('Failed to get download URL. Please try again later.');
            throw error;
        }
    },

    /**
     * Gets subjects for a specific program and semester
     * @param programId - ID of the program
     * @param semester - Semester number
     * @returns Promise<SyllabusSubject[]> List of subjects
     */
    getSubjectsByProgramSemester: async (programId: number, semester: number): Promise<SyllabusSubject[]> => {
        try {
            const response = await api.get(`${BASE_URL}/subjects_by_program_semester/`, {
                params: { program_id: programId, semester }
            });
            return response.data;
        } catch (error) {
            showError('Failed to load subjects. Please try again.');
            throw error;
        }
    }
}; 