import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, ChevronRight } from 'lucide-react';

const questionPapers = [
  { id: '1', year: '2023', semester: '6th Semester', subject: 'Web Technology' },
  { id: '2', year: '2023', semester: '6th Semester', subject: 'Software Engineering' },
  { id: '3', year: '2022', semester: '5th Semester', subject: 'Database Management' },
  { id: '4', year: '2022', semester: '5th Semester', subject: 'Operating Systems' },
];

export default function QuestionPapers() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Resources</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Past Year Question Papers
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Access previous year question papers to enhance your exam preparation.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {questionPapers.map((paper) => (
              <div
                key={paper.id}
                className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{paper.year}</h3>
                    <p className="text-sm text-gray-500">{paper.semester}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{paper.subject}</p>
                  <button className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/question-papers"
              className="inline-flex items-center text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all question papers
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}