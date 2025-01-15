import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import { Subject, QuestionPaper } from '../../../services/types/questionpapers.types';

interface SubjectCardProps {
  subject: Subject;
  questionPapers: QuestionPaper[];
  onDownload?: (paper: QuestionPaper) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  questionPapers,
  onDownload 
}) => {
  const subjectPapers = questionPapers.filter(paper => paper.subject.id === subject.id);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 
                 rounded-xl border border-transparent hover:border-indigo-100 shadow-lg hover:shadow-indigo-500/10
                 transition-all duration-300 overflow-hidden group h-full"
    >
      {/* Subject Header */}
      <div className="p-5 border-b border-gray-100/80">
        <div className="flex items-start gap-3 min-h-[4rem]">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Code: {subject.code}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap bg-indigo-100/70 text-indigo-700 group-hover:bg-indigo-200/80">
              {subject.credit_hours} Credits
            </span>
          </div>
        </div>
      </div>

      {/* Question Papers List */}
      <div className="divide-y divide-gray-100/80">
        {subjectPapers.map((paper) => (
          <div 
            key={paper.id} 
            className="p-4 hover:bg-indigo-50/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Year {paper.year}
                  </p>
                  <p className="text-xs text-gray-500">
                    Added {new Date(paper.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{paper.view_count}</span>
                </div>
                {paper.status === 'VERIFIED' && paper.drive_file_url && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDownload?.(paper)}
                    className="p-2 rounded-lg hover:bg-indigo-100/80 text-indigo-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sr-only">Download</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-2">
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${paper.status === 'VERIFIED' 
                  ? 'bg-green-100/70 text-green-700' 
                  : paper.status === 'PENDING' 
                  ? 'bg-yellow-100/70 text-yellow-700'
                  : 'bg-red-100/70 text-red-700'}
              `}>
                {paper.status}
              </span>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {subjectPapers.length === 0 && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100/50 text-indigo-600 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-gray-500 font-medium">
              No question papers available yet
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubjectCard; 