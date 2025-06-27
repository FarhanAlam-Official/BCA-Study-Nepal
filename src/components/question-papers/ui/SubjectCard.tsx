import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Subject } from '../../../types/question-papers/question-papers.types';

/**
 * Props for the SubjectCard component
 */
interface SubjectCardProps {
  subject: Subject;
  onClick?: (subject: Subject) => void;
}

/**
 * SubjectCard Component
 * Displays a card with subject information including name, code, credit hours,
 * and question paper statistics. Features hover animations and interactive elements.
 */
const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onClick
}) => {
  /**
   * Handles click events on the card
   */
  const handleClick = () => {
    if (onClick) {
      onClick(subject);
    }
  };

  /**
   * Handles keyboard events for accessibility
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (onClick) {
        onClick(subject);
      }
    }
  };

  // Calculate verified papers count
  const verifiedPapers = subject.question_papers.filter(p => p.status === 'VERIFIED').length;
  const totalPapers = subject.question_papers.length;

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
                transition-all duration-300 cursor-pointer overflow-hidden p-6 h-[220px] flex flex-col"
      role="button"
      tabIndex={0}
      aria-label={`View question papers for ${subject.name}`}
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
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header Section */}
        <div>
          {/* First Line: Title and Code */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-indigo-50/80 rounded-lg group-hover:bg-indigo-100/80 transition-colors shrink-0">
                <Book className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                {subject.name}
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100/70 text-indigo-700 
                          group-hover:bg-indigo-100 transition-colors duration-300 shrink-0">
              {subject.code}
            </div>
          </div>

          {/* Second Line: Verified Badge */}
          {verifiedPapers > 0 && (
            <div className="flex justify-end -mt-1 mb-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100/70 text-green-700 
                            group-hover:bg-green-100 transition-colors duration-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{verifiedPapers} Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors mt-2 line-clamp-3">
            Click to access all available question papers for this subject.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100/70 text-indigo-700 
                       group-hover:bg-indigo-100 transition-colors duration-300 min-w-[80px] text-center">
            {totalPapers} Papers
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/50 
                         group-hover:bg-indigo-100/50 transition-all">
            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
              View Papers
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-600 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard; 