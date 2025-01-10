import { useState, useEffect } from 'react';
import { collegeService } from '../api/collegeService';
import type { College, CollegeFilters } from '../types/college.types';

export const useColleges = (filters?: CollegeFilters) => {
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                setLoading(true);
                const data = await collegeService.getAll(filters);
                setColleges(data);
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch colleges');
                setColleges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchColleges();
    }, [filters]);

    return { colleges, loading, error };
};