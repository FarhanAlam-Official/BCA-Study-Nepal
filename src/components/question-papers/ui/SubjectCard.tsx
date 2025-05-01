import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { Subject, QuestionPaper } from '../../../types/question-papers/question-papers.types';

/**
 * Props for the SubjectCard component
 */
interface SubjectCardProps {
  subject: Subject;
  onClick?: (subject: Subject) => void;
  onDownload?: (paper: QuestionPaper) => void;
}

/**
 * SubjectCard Component
 * Displays a card with subject information including name, code, credit hours,
 * and question paper statistics. Features hover animations and interactive elements.
 */
const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onClick,
  onDownload
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

  // Calculate paper statistics
  const paperCount = subject.question_papers.length;
  const verifiedPaperCount = subject.question_papers.filter(p => p.status === 'VERIFIED').length;

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
      aria-label={`View question papers for ${subject.name}`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />

      {/* Card Content */}
      <div className="relative h-full p-6 flex flex-col">
        {/* Header Section */}
        <div className="flex-none mb-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-indigo-100/50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300">
              <Book className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="inline-flex px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100/50 group-hover:bg-indigo-100 rounded-full transition-colors duration-300">
              {subject.credit_hours} Credits
            </span>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[48px]">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-500">
              Code: <span className="font-medium">{subject.code}</span>
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            {/* Total Papers Count */}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {paperCount} {paperCount === 1 ? 'Paper' : 'Papers'}
              </p>
            </div>

            {/* Verified Papers Count */}
            <div className="flex items-center gap-1.5 bg-green-50/50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className={`w-4 h-4 ${verifiedPaperCount > 0 ? 'text-green-500' : 'text-gray-300'}`} />
              <span className={`text-xs font-medium ${verifiedPaperCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                {verifiedPaperCount} Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button - Only show for verified papers */}
            {verifiedPaperCount > 0 && onDownload && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking download
                  const verifiedPaper = subject.question_papers.find(p => p.status === 'VERIFIED');
                  if (verifiedPaper) {
                    onDownload(verifiedPaper);
                  }
                }}
                className="p-2 rounded-full bg-green-100/50 hover:bg-green-100 transition-colors duration-300"
                aria-label="Download verified question paper"
              >
                <Download className="w-4 h-4 text-green-600" />
              </motion.button>
            )}

            {/* Arrow Icon */}
            <motion.div
              whileHover={{ x: 3 }}
              className="p-2 rounded-full bg-indigo-100/50 group-hover:bg-indigo-100 transition-colors duration-300"
            >
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard; 