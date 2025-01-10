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
      // Check if response is an array
      const collegesData = Array.isArray(response) ? response : [response];
      setColleges(collegesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch colleges');
      console.error('Fetch error:', err);
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