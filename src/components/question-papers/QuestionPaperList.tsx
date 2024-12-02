import React, { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { useData } from '../../services/hooks/useData';
import { questionPaperService } from '../../services/api/questionPaperService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import DataCard from '../common/DataCard';
import { QuestionPaper } from '../../services/types';

const QuestionPaperList: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const fetchPapers = useCallback(() => {
    return selectedYear === 'all'
      ? questionPaperService.getAll()
      : questionPaperService.getByYear(Number(selectedYear));
  }, [selectedYear]);

  const { data: papers, loading, error, refetch } = useData<QuestionPaper[]>({
    fetchFn: fetchPapers,
    dependencies: [selectedYear]
  });

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
    return <ErrorDisplay message={error} onRetry={refetch} />;
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

      {!papers?.length ? (
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
            <DataCard
              key={paper.id}
              title={paper.subject}
              subtitle={`Year ${paper.year} • Semester ${paper.semester}`}
              icon={<FileText className="h-6 w-6 text-indigo-600" />}
              metadata={[
                {
                  label: 'Uploaded',
                  value: new Date(paper.upload_date).toLocaleDateString(),
                },
              ]}
              onDownload={() => handleDownload(paper)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionPaperList;