import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestionPaper } from '../../services/types/questionpapers.types';
import { questionPaperService } from '../../services/api/questionPaperService';
import { FileText, Download, Eye, ArrowLeft, Calendar, BookOpen, GraduationCap, Book } from 'lucide-react';
import PDFViewer from '../common/PDFViewer';

const SubjectPapersPage = () => {
  const { subjectId, subjectName } = useParams();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchPapers = async () => {
      if (!subjectId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await questionPaperService.getBySubject(Number(subjectId));
        setPapers(response);
      } catch (err) {
        setError('Failed to load question papers. Please try again later.');
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [subjectId]);

  const handleView = (paper: QuestionPaper, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPaper(paper);
  };

  const handleDownload = async (paper: QuestionPaper) => {
    if (paper.file) {
      try {
        const response = await fetch(paper.file);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${paper.subject.code}_${paper.year}_SEM${paper.semester}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        console.error('Error downloading file:', err);
        setError('Failed to download the file. Please try again later.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-white px-4">
        <div className="max-w-2xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl p-8 text-center shadow-lg"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Papers</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 shadow-md hover:shadow-xl"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (selectedPaper) {
    return (
      <PDFViewer 
        pdfUrl={selectedPaper.file}
        title="Question Paper"
        mainHeading={selectedPaper.subject.name}
        subHeading={`Year ${selectedPaper.year} - Semester ${selectedPaper.semester}`}
        onBack={() => setSelectedPaper(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-indigo-50/20 to-blue-50/20 pointer-events-none"></div>
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute right-[15%] top-[15%]"
      >
        <div className="h-28 w-28 text-purple-600/10">
          <Book size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute left-[20%] top-[25%]"
      >
        <div className="h-[112px] w-[112px] text-purple-600/15">
          <GraduationCap size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -20, 0],
          x: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute right-[25%] bottom-[20%]"
      >
        <div className="h-[90px] w-[90px] text-purple-600/10">
          <FileText size="100%" />
        </div>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-6 max-w-7xl relative z-10"
      >
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        <motion.div 
          variants={itemVariants}
          className="mb-8 text-center space-y-3"
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
            {decodeURIComponent(String(subjectName))}
          </h1>
          <p className="text-indigo-600 text-xl font-medium">
            {papers.length} {papers.length === 1 ? 'Paper' : 'Papers'} Available
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-purple-100/50"
        >
          {papers.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center py-16 bg-white/40 backdrop-blur-xl rounded-2xl border border-purple-100/50">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-50/80 mb-6">
                  <FileText className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Question Papers</h3>
                <p className="text-gray-500 text-lg">No question papers are available for this subject yet.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {papers.map((paper) => (
                <motion.div
                  key={paper.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-transparent 
                    hover:shadow-xl hover:border-indigo-100 hover:shadow-indigo-500/10 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90
                    transition-all duration-300"
                >
                  <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                          <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {paper.year}
                          </h3>
                        </div>
                        <p className="text-base text-indigo-600 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                          {`${paper.semester}${['st', 'nd', 'rd'][paper.semester - 1] || 'th'} Semester`}
                        </p>
                      </div>
                      <span className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        paper.status === 'VERIFIED' 
                          ? 'bg-green-100/70 text-green-800 group-hover:bg-green-200/80 group-hover:shadow-lg group-hover:shadow-green-100/50'
                          : paper.status === 'PENDING'
                          ? 'bg-yellow-100/70 text-yellow-800 group-hover:bg-yellow-200/80 group-hover:shadow-lg group-hover:shadow-yellow-100/50'
                          : 'bg-red-100/70 text-red-800 group-hover:bg-red-200/80 group-hover:shadow-lg group-hover:shadow-red-100/50'
                      }`}>
                        {paper.status}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100/80 flex justify-between items-center">
                      <div className="space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleView(paper, e)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50/80 
                            hover:bg-indigo-100 rounded-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(paper)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50/80 
                            hover:bg-indigo-100 rounded-lg transition-all duration-200"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </motion.button>
                      </div>
                      <div className="flex items-center text-sm text-indigo-600">
                        <Eye className="h-4 w-4 mr-1 text-indigo-500" />
                        {paper.view_count}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SubjectPapersPage; 