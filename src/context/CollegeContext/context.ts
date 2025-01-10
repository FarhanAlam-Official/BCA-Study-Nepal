import { createContext } from 'react';
import type { CollegeContextType } from '../../services/types/college.types';

export const CollegeContext = createContext<CollegeContextType | undefined>(undefined); 