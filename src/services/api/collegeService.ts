import { College } from '../types/college.types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockColleges: College[] = [
  {
    id: '1',
    name: 'Nepal College of Information Technology',
    location: 'Balkumari, Lalitpur',
    contact: '+977-1-5186226',
    affiliation: 'Pokhara University',
    rating: 4.5,
    image: 'https://example.com/ncit.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Add more mock colleges if needed
];

export const collegeService = {
  getAll: async (): Promise<College[]> => {
    await delay(1000); // 1 second delay
    return mockColleges;
  },
  
  getById: async (id: string): Promise<College> => {
    await delay(1000);
    const college = mockColleges.find(c => c.id === id);
    if (!college) throw new Error('College not found');
    return college;
  }
};