import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight } from 'lucide-react';
import { SyllabusSubject } from '../../types/syllabus/syllabus.types';

interface SyllabusSubjectCardProps {
  subject: SyllabusSubject;
  onClick?: (subject: SyllabusSubject) => void;
}

const SyllabusSubjectCard: React.FC<SyllabusSubjectCardProps> = ({ 
  subject, 
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(subject);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (onClick) {
        onClick(subject);
      }
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-[260px] bg-white hover:bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30
                 rounded-lg border border-indigo-100/50 hover:border-indigo-200 shadow-sm hover:shadow-md
                 transition-all duration-300 overflow-hidden group cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View syllabus for ${subject.name}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />

      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Book className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {subject.code}
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-2">
            {subject.name}
          </h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-3">
            {subject.description || 'View available syllabus versions for this subject'}
          </p>
        </div>
        
        <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
          View Syllabus
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default SyllabusSubjectCard; 