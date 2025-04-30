import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';
import type { Course, GradeScaleItem } from '../../components/tools/GPACalculator/types';

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
          // If marks is empty or not a number, reset grade and points
          if (!marks || isNaN(parseFloat(marks))) {
            return { ...course, marks, grade: '-', gradePoints: 0 };
          }
          const numericMarks = parseFloat(marks);
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

  const tuGradeScale: GradeScaleItem[] = [
    { grade: 'A', range: '90-100', points: '4.0', remarks: 'Distinction' },
    { grade: 'A-', range: '80-89.9', points: '3.7', remarks: 'Very Good' },
    { grade: 'B+', range: '70-79.9', points: '3.3', remarks: 'First Division' },
    { grade: 'B', range: '60-69.9', points: '3.0', remarks: 'Second Division' },
    { grade: 'B-', range: '50-59.9', points: '2.7', remarks: 'Pass' },
    { grade: 'F', range: 'Below 50', points: '0', remarks: 'Fail' },
  ];

  const puGradeScale: GradeScaleItem[] = [
    { grade: 'A', range: '90-100', points: '4.0' },
    { grade: 'A-', range: '85-89', points: '3.7' },
    { grade: 'B+', range: '80-84', points: '3.3' },
    { grade: 'B', range: '75-79', points: '3.0' },
    { grade: 'B-', range: '70-74', points: '2.7' },
    { grade: 'C+', range: '65-69', points: '2.3' },
    { grade: 'C', range: '60-64', points: '2.0' },
    { grade: 'C-', range: '55-59', points: '1.7' },
    { grade: 'D+', range: '50-54', points: '1.3' },
    { grade: 'D', range: '45-49', points: '1.0' },
    { grade: 'F', range: 'Below 45', points: '0.0' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Floating Elements */}
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
        <div className="h-28 w-28 text-indigo-600/20">
          <GraduationCap size="100%" />
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
          <BookOpen size="100%" />
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
        <div className="h-[90px] w-[90px] text-indigo-600/20">
          <Trophy size="100%" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-2 animate-fade-in">
              {isTU ? 'TU' : 'PU'} GPA Calculator
            </h1>
            <p className="text-gray-600">Calculate your semester GPA easily</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className={`text-sm transition-all duration-200 ${!isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>PU</span>
              <Switch
                checked={isTU}
                onChange={setIsTU}
                className={`${
                  isTU ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
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
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-indigo-50 hover:shadow-xl transition-all duration-300">
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
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={courses.length === 1}
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
              className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Course</span>
            </button>

            {/* GPA Result */}
            <div className="mt-8 text-center">
              <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                <p className="text-white font-medium">Your GPA</p>
                <p className="text-3xl font-bold text-white">{calculateGPA()}</p>
              </div>
            </div>

            {/* Grading Scale */}
            <div className="mt-8 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                {isTU ? 'TU' : 'PU'} Grading Scale
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(isTU ? tuGradeScale : puGradeScale).map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-200"
                  >
                    <div className="font-semibold text-indigo-600">{item.grade}</div>
                    <div className="text-sm text-gray-600">{item.range}%</div>
                    <div className="text-sm font-medium text-indigo-700">{item.points} points</div>
                    {item.remarks && <div className="text-xs text-gray-500 mt-1">{item.remarks}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator; 