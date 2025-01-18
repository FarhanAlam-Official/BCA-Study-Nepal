import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionPaper } from '../../services/types/questionpapers.types';
import { questionPaperService } from '../../services/api/questionPaperService';
import { FileText, Download, Eye } from 'lucide-react';
import PDFViewer from '../common/PDFViewer';

const SubjectPapersPage = () => {
  const { subjectId, subjectName } = useParams();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await questionPaperService.getSubjectPapers(Number(subjectId));
        setPapers(response);
      } catch (err) {
        setError('Failed to load question papers');
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchPapers();
    }
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
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500">{error}</p>
    </div>
  );

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
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">
          {decodeURIComponent(String(subjectName))}
        </h1>
        <p className="text-gray-600 text-lg">Question Papers Archive</p>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
          <FileText className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-6 text-xl font-semibold text-gray-900">No Question Papers</h3>
          <p className="mt-2 text-gray-500">No question papers are available for this subject yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 
                hover:shadow-lg hover:border-indigo-100 transition-all duration-300 
                transform hover:-translate-y-1"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {paper.year}
                    </h3>
                    <p className="text-base text-gray-600">
                      {`${paper.semester}${['st', 'nd', 'rd'][paper.semester - 1] || 'th'} Semester`}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    paper.status === 'VERIFIED' 
                      ? 'bg-green-100 text-green-800 group-hover:bg-green-200'
                      : paper.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                      : 'bg-red-100 text-red-800 group-hover:bg-red-200'
                  }`}>
                    {paper.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                      <Eye className="w-4 h-4" />
                      {paper.view_count}
                    </span>
                    <span className="flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                      <Download className="w-4 h-4" />
                      {paper.download_count}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handleView(paper, e)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                        text-white bg-indigo-600 hover:bg-indigo-700 
                        transform transition-all duration-200 hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(paper)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                        text-gray-700 bg-white border border-gray-300 
                        hover:bg-gray-50 hover:border-indigo-300
                        transform transition-all duration-200 hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPapersPage; 