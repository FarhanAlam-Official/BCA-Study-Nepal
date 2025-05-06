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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/50 
                hover:border-indigo-300/80 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10
                transition-all duration-300 cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label={`View syllabus for ${subject.name}`}
    >
      {/* Card Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 
                    rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 
                    rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />

      {/* Card Content */}
      <div className="relative p-6 flex flex-col h-full">
        <div className="flex-1">
          {/* Subject Code Badge */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100/70 text-indigo-700 
                          group-hover:bg-indigo-100 transition-colors duration-300">
              {subject.code}
            </div>
          </div>

          {/* Title and Icon */}
          <div className="flex items-start gap-4 mb-3 pr-24">
            <div className="p-2 bg-indigo-50/80 rounded-lg group-hover:bg-indigo-100/80 transition-colors">
              <Book className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors min-h-[3.5rem] line-clamp-2">
              {subject.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 min-h-[2.5rem] line-clamp-2 group-hover:text-gray-600 transition-colors mb-4">
            {subject.description || 'View available syllabus versions for this subject'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            View Syllabus
          </span>
          <div className="p-2 rounded-full bg-indigo-50/50 group-hover:bg-indigo-100/50 transition-all">
            <ArrowRight className="w-4 h-4 text-indigo-600 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SyllabusSubjectCard; 
