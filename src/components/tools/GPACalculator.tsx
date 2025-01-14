import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

interface Course {
  id: number;
  name: string;
  marks: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

type GradeScale = {
  grade: string;
  range: string;
  points: string;
  remarks?: string;
};

const GPACalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', marks: '', credits: 0, grade: '-', gradePoints: 0 },
  ]);
  const [isTU, setIsTU] = useState(false);

  // TU Grading System
  const calculateTUGrade = (marks: number): { grade: string; points: number } => {
    if (marks >= 90) return { grade: 'A', points: 4.0 };
    if (marks >= 80) return { grade: 'A-', points: 3.7 };
    if (marks >= 70) return { grade: 'B+', points: 3.3 };
    if (marks >= 60) return { grade: 'B', points: 3.0 };
    if (marks >= 50) return { grade: 'B-', points: 2.7 };
    return { grade: 'F', points: 0 };
  };

  // PU Grading System
  const calculatePUGrade = (marks: number): { grade: string; points: number } => {
    if (marks >= 90) return { grade: 'A', points: 4.0 };
    if (marks >= 85) return { grade: 'A-', points: 3.7 };
    if (marks >= 80) return { grade: 'B+', points: 3.3 };
    if (marks >= 75) return { grade: 'B', points: 3.0 };
    if (marks >= 70) return { grade: 'B-', points: 2.7 };
    if (marks >= 65) return { grade: 'C+', points: 2.3 };
    if (marks >= 60) return { grade: 'C', points: 2.0 };
    if (marks >= 55) return { grade: 'C-', points: 1.7 };
    if (marks >= 50) return { grade: 'D+', points: 1.3 };
    if (marks >= 45) return { grade: 'D', points: 1.0 };
    return { grade: 'F', points: 0.0 };
  };

  const handleMarksChange = (id: number, marks: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === id) {
          const numericMarks = parseFloat(marks) || 0;
          const { grade, points } = isTU ? calculateTUGrade(numericMarks) : calculatePUGrade(numericMarks);
          return { ...course, marks, grade, gradePoints: points };
        }
        return course;
      })
    );
  };

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: '', marks: '', credits: 0, grade: '-', gradePoints: 0 }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      totalCredits += course.credits;
      totalGradePoints += course.credits * course.gradePoints;
    });

    return totalCredits === 0 ? 0 : (totalGradePoints / totalCredits).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900 mb-2 animate-fade-in">
          {isTU ? 'TU' : 'PU'} GPA Calculator
        </h1>
        <p className="text-gray-600">Calculate your semester GPA easily</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className={`text-sm transition-all duration-200 ${!isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>PU</span>
          <Switch
            checked={isTU}
            onChange={setIsTU}
            className={`${
              isTU ? 'bg-indigo-600' : 'bg-indigo-500'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle university</span>
            <span
              className={`${
                isTU ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
            />
          </Switch>
          <span className={`text-sm transition-all duration-200 ${isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>TU</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 mb-4 font-semibold text-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-4 rounded-lg">
          <div className="col-span-12 sm:col-span-4">Course Name</div>
          <div className="col-span-4 sm:col-span-2">Marks</div>
          <div className="col-span-4 sm:col-span-2">Credits</div>
          <div className="col-span-2 sm:col-span-2">Grade</div>
          <div className="col-span-2 sm:col-span-2">Actions</div>
        </div>

        {/* Course Rows */}
        <div className="space-y-3">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-indigo-50/50 transition-all duration-200"
            >
              <input
                className="col-span-12 sm:col-span-4 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300"
                type="text"
                value={course.name}
                onChange={(e) => setCourses(prevCourses =>
                  prevCourses.map(c =>
                    c.id === course.id ? { ...c, name: e.target.value } : c
                  )
                )}
                placeholder="Enter course name"
              />
              <input
                className="col-span-4 sm:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300"
                type="number"
                value={course.marks}
                onChange={(e) => handleMarksChange(course.id, e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
              <input
                className="col-span-4 sm:col-span-2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 hover:border-indigo-300"
                type="number"
                value={course.credits || ''}
                onChange={(e) => setCourses(prevCourses =>
                  prevCourses.map(c =>
                    c.id === course.id ? { ...c, credits: parseInt(e.target.value) || 0 } : c
                  )
                )}
                placeholder="Credits"
                min="0"
              />
              <div className={`col-span-2 sm:col-span-2 p-2 rounded-lg text-center font-medium transition-all duration-200
                ${course.grade === 'F' ? 'bg-red-100 text-red-800' : 
                  course.grade === '-' ? 'bg-gray-100' : 'bg-green-100 text-green-800'}`}>
                {course.grade}
              </div>
              <div className="col-span-2 sm:col-span-2 flex justify-center">
                <button
                  onClick={() => removeCourse(course.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Remove course"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Course Button */}
        <button
          onClick={addCourse}
          className="flex items-center gap-2 mx-auto mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-all duration-200 hover:shadow-lg group"
        >
          <PlusIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          Add Course
        </button>

        {/* GPA Display */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white text-center">
            Semester GPA: <span className="text-3xl ml-2 font-extrabold">{calculateGPA()}</span>
          </h2>
        </div>

        {/* Grading Scale */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            {isTU ? 'TU' : 'PU'} Grading Scale
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(isTU ? [
              { grade: 'A', range: '90-100', points: '4.0', remarks: 'Distinction' },
              { grade: 'A-', range: '80-89.9', points: '3.7', remarks: 'Very Good' },
              { grade: 'B+', range: '70-79.9', points: '3.3', remarks: 'First Division' },
              { grade: 'B', range: '60-69.9', points: '3.0', remarks: 'Second Division' },
              { grade: 'B-', range: '50-59.9', points: '2.7', remarks: 'Pass' },
              { grade: 'F', range: 'Below 50', points: '0', remarks: 'Fail' },
            ] : [
              { grade: 'A', range: '90-100', points: '4.0' },
              { grade: 'A-', range: '85-89', points: '3.7' },
              { grade: 'A', range: '75-84', points: '8' },
              { grade: 'B+', range: '65-74', points: '7' },
              { grade: 'B', range: '55-64', points: '6' },
              { grade: 'C', range: '45-54', points: '5' },
              { grade: 'D', range: '35-44', points: '4' },
              { grade: 'F', range: 'Below 35', points: '0' },
            ] as GradeScale[]).map((item, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-200"
              >
                <div className="font-semibold text-indigo-600">{item.grade}</div>
                <div className="text-sm text-gray-600">{item.range}%</div>
                <div className="text-sm font-medium text-indigo-700">{item.points} points</div>
                {isTU && <div className="text-xs text-gray-500 mt-1">{item.remarks}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator; 