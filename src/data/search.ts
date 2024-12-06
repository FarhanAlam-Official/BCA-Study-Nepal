import { BookOpen, GraduationCap, School, BriefcaseIcon, FileText } from 'lucide-react';

export const searchData = [
  {
    id: '1',
    title: 'Introduction to Programming',
    category: 'Notes',
    url: '/notes',
    icon: BookOpen
  },
  {
    id: '2',
    title: 'Software Engineering Career Path',
    category: 'Career',
    url: '/career#software-engineering',
    icon: BriefcaseIcon
  },
  {
    id: '3',
    title: 'NCIT College',
    category: 'Colleges',
    url: '/colleges',
    icon: School
  },
  {
    id: '4',
    title: 'BCA Syllabus',
    category: 'Syllabus',
    url: '/syllabus',
    icon: GraduationCap
  },
  {
    id: '5',
    title: '2023 Question Papers',
    category: 'Resources',
    url: '/question-papers',
    icon: FileText
  }
];