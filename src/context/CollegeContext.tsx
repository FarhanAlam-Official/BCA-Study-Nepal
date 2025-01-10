import React, { useState, useCallback } from 'react';
import { College, CollegeFilters } from '../services/types/college.types';
import { collegeService } from '../services/api/collegeService';
import { CollegeContext } from './CollegeContext/context';

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CollegeFilters>({});

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      const response = await collegeService.getAll();
      const collegesWithDates = response.map(college => ({
        ...college,
        id: college.id.toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as College[];
      setColleges(collegesWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch colleges');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CollegeContext.Provider value={{ 
      colleges, loading, error, filters, setFilters, fetchColleges 
    }}>
      {children}
    </CollegeContext.Provider>
  );
};