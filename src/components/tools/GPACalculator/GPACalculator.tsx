/**
 * GPA Calculator Component
 * 
 * Main component that encapsulates all GPA Calculator functionality including:
 * - University selection
 * - Course management
 * - GPA calculation
 * - Animated UI elements
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { CourseList, UniversityToggle } from './';
import type { Course } from './types';
import { tuGradeScale, puGradeScale } from './gradeUtils';

const GPACalculator: React.FC = () => {
  // State for courses and university selection
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', marks: '', credits: 0, grade: '-', gradePoints: 0 },
  ]);
  const [isTU, setIsTU] = useState(false);

  /**
   * Calculates the GPA based on current courses
   * @returns Calculated GPA with 2 decimal places
   */
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
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-2 animate-fade-in">
              {isTU ? 'TU' : 'PU'} GPA Calculator
            </h1>
            <p className="text-gray-600">Calculate your semester GPA easily</p>
            
            {/* University Toggle */}
            <UniversityToggle isTU={isTU} onChange={setIsTU} />
          </div>
          
          {/* Calculator Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-indigo-50 hover:shadow-xl transition-all duration-300">
            {/* Course List */}
            <CourseList
              courses={courses}
              isTU={isTU}
              onCoursesChange={setCourses}
            />

            {/* GPA Display */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your GPA</h3>
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {calculateGPA()}
                </p>
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