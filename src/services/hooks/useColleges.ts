import { useContext } from 'react';
import { CollegeContext } from '../../context/CollegeContext/context';
import type { CollegeContextType } from '../types/college.types';

export const useColleges = (): CollegeContextType => {
    const context = useContext(CollegeContext);
    if (!context) {
        throw new Error('useColleges must be used within a CollegeProvider');
    }
    return context;
};