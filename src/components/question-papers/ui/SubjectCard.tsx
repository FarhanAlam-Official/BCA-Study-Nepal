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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-indigo-200 transition-all duration-200"
    >
      {/* Subject Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
            <p className="text-sm text-gray-500">Code: {subject.code}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
            {subject.credit_hours} Credit Hours
          </span>
        </div>
      </div>

      {/* Question Papers List */}
      <div className="divide-y divide-gray-100">
        {subjectPapers.map((paper) => (
          <div 
            key={paper.id} 
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Year {paper.year}
                  </p>
                  <p className="text-xs text-gray-500">
                    Added {new Date(paper.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{paper.view_count}</span>
                </div>
                {paper.status === 'VERIFIED' && paper.drive_file_url && (
                  <button
                    onClick={() => onDownload?.(paper)}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                    <span className="sr-only">Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-2">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${paper.status === 'VERIFIED' ? 'bg-green-50 text-green-700' : 
                  paper.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'}
              `}>
                {paper.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subjectPapers.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          No question papers available yet
        </div>
      )}
    </motion.div>
  );
};

export default SubjectCard; 