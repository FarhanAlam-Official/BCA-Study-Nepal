/**
 * CourseList Component
 * Manages a list of courses for GPA calculation, allowing users to add, remove,
 * and modify course details including name, credits, and marks.
 */
import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Course } from './types';
import { calculateTUGrade, calculatePUGrade } from './gradeUtils';

/**
 * Props interface for the CourseList component
 * @property {Course[]} courses - Array of course objects
 * @property {boolean} isTU - Flag indicating if TU grading system is selected
 * @property {function} onCoursesChange - Callback function when courses are modified
 */
interface CourseListProps {
  courses: Course[];
  isTU: boolean;
  onCoursesChange: (courses: Course[]) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, isTU, onCoursesChange }) => {
  /**
   * Handles changes to course marks and updates grade/points accordingly
   * @param id - Course ID
   * @param marks - New marks value
   */
  const handleMarksChange = (id: number, marks: string) => {
    onCoursesChange(
      courses.map(course => {
        if (course.id === id) {
          const numericMarks = parseFloat(marks) || 0;
          const { grade, points } = isTU ? calculateTUGrade(numericMarks) : calculatePUGrade(numericMarks);
          return { ...course, marks, grade, gradePoints: points };
        }
        return course;
      })
    );
  };

  /**
   * Handles changes to course credit hours
   * @param id - Course ID
   * @param credits - New credits value
   */
  const handleCreditsChange = (id: number, credits: string) => {
    onCoursesChange(
      courses.map(course => {
        if (course.id === id) {
          return { ...course, credits: parseInt(credits) || 0 };
        }
        return course;
      })
    );
  };

  /**
   * Handles changes to course name
   * @param id - Course ID
   * @param name - New course name
   */
  const handleNameChange = (id: number, name: string) => {
    onCoursesChange(
      courses.map(course => {
        if (course.id === id) {
          return { ...course, name };
        }
        return course;
      })
    );
  };

  /**
   * Adds a new empty course to the list
   */
  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    onCoursesChange([
      ...courses,
      { id: newId, name: '', marks: '', credits: 0, grade: '-', gradePoints: 0 }
    ]);
  };

  /**
   * Removes a course from the list if there's more than one course
   * @param id - ID of the course to remove
   */
  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      onCoursesChange(courses.filter(course => course.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-4 mb-4 font-semibold text-gray-700 bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-4 rounded-lg">
        <div className="col-span-12 sm:col-span-4">Course Name</div>
        <div className="col-span-6 sm:col-span-2">Credits</div>
        <div className="col-span-6 sm:col-span-2">Marks</div>
        <div className="col-span-6 sm:col-span-2">Grade</div>
        <div className="col-span-6 sm:col-span-2">Actions</div>
      </div>

      {/* Course Rows */}
      {courses.map((course) => (
        <div key={course.id} className="grid grid-cols-12 gap-4 items-center">
          {/* Course Name Input */}
          <div className="col-span-12 sm:col-span-4">
            <input
              type="text"
              value={course.name}
              onChange={(e) => handleNameChange(course.id, e.target.value)}
              className="w-full rounded-lg border-gray-200 p-2 text-sm shadow-sm"
              placeholder="Enter course name"
            />
          </div>

          {/* Credits Input */}
          <div className="col-span-6 sm:col-span-2">
            <input
              type="number"
              value={course.credits || ''}
              onChange={(e) => handleCreditsChange(course.id, e.target.value)}
              className="w-full rounded-lg border-gray-200 p-2 text-sm shadow-sm"
              placeholder="Credits"
              min="0"
            />
          </div>

          {/* Marks Input */}
          <div className="col-span-6 sm:col-span-2">
            <input
              type="number"
              value={course.marks || ''}
              onChange={(e) => handleMarksChange(course.id, e.target.value)}
              className="w-full rounded-lg border-gray-200 p-2 text-sm shadow-sm"
              placeholder="Marks"
              min="0"
              max="100"
            />
          </div>

          {/* Grade Display */}
          <div className="col-span-6 sm:col-span-2">
            <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg">
              {course.grade}
            </span>
          </div>

          {/* Remove Course Button */}
          <div className="col-span-6 sm:col-span-2">
            <button
              onClick={() => removeCourse(course.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
              disabled={courses.length === 1}
              aria-label="Remove course"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Add Course Button */}
      <button
        onClick={addCourse}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        aria-label="Add new course"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Add Course</span>
      </button>
    </div>
  );
};

export default CourseList; 