import React, { useState, useEffect } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { questionPaperService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

interface QuestionPaper {
  id: string;
  subject: string;
  year: number;
  semester: number;
  file: string;
  upload_date: string;
}

const QuestionPaperList: React.FC = () => {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchPapers();
  }, [selectedYear]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = selectedYear === 'all'
        ? await questionPaperService.getAll()
        : await questionPaperService.getByYear(Number(selectedYear));
      setPapers(response.data);
    } catch (err) {
      setError('Failed to load question papers. Please try again later.');
      console.error('Error fetching question papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (paper: QuestionPaper) => {
    try {
      await questionPaperService.download(paper.file);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download the file. Please try again later.');
    }
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 2019 },
    (_, i) => 2020 + i
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Question Papers</h3>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchPapers}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Question Papers</h2>
        <select
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No question papers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedYear === 'all'
              ? 'No question papers are available at the moment.'
              : `No question papers available for year ${selectedYear}.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{paper.subject}</h3>
                    <p className="text-sm text-gray-500">
                      Year {paper.year} • Semester {paper.semester}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Uploaded: {new Date(paper.upload_date).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(paper)}
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Paper
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionPaperList;