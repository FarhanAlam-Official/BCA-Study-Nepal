import React, { useState } from 'react';
import { TodoData, Todo } from './types';
import { 
  CalendarIcon, 
  TagIcon, 
  PencilIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import TodoComponents from './TodoContext';

/**
 * Interface for HTML5 datetime input showPicker method
 * This is needed because TypeScript doesn't include this experimental feature
 */
interface DateTimeInput {
  showPicker: () => void;
}

/**
 * Shows the native date picker for the input element
 * @param input - The HTML input element to show the picker for
 */
const showDatePicker = (input: HTMLInputElement) => {
  if ('showPicker' in input) {
    (input as unknown as DateTimeInput).showPicker();
  }
};

/**
 * Animation variants for the form container
 */
const formVariants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    } 
  }
};

/**
 * Animation variants for form inputs
 */
const inputVariants = {
  focus: { 
    scale: 1.01,
    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
    transition: { duration: 0.2 } 
  },
  blur: { 
    scale: 1,
    boxShadow: "0 0 0 0px rgba(99, 102, 241, 0)",
    transition: { duration: 0.2 } 
  },
  hover: {
    y: -2,
    transition: { duration: 0.2 }
  }
};

/**
 * Props for the TodoForm component
 */
interface TodoFormProps {
  /** Callback function to handle form submission */
  onSubmit: (data: TodoData) => void;
  /** Initial data for editing mode */
  initialData?: Todo;
  /** Whether the form is in editing mode */
  isEditing?: boolean;
}

/**
 * Form data interface for managing todo item fields
 */
interface TodoFormData {
  /** Title of the todo item */
  title: string;
  /** Optional description */
  description: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high';
  /** Due date in YYYY-MM-DD format */
  dueDate: string;
  /** Due time in HH:mm format */
  dueTime: string;
  /** Optional category */
  category: string;
  /** List of subtask titles */
  subtasks: string[];
}

const MAX_TODOS = 15; // Maximum number of todos allowed per user

/**
 * Floating decorative elements component
 * Adds animated background elements to the form
 */
const FloatingElements = () => (
  <>
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        x: [0, 15, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      className="absolute -right-16 top-10 z-0 hidden lg:block"
    >
      <div className="h-24 w-24 text-indigo-600/20">
        <ClipboardDocumentListIcon />
      </div>
    </motion.div>

    <motion.div
      animate={{ 
        y: [0, 20, 0],
        x: [0, -15, 0],
        rotate: [0, -10, 10, 0]
      }}
      transition={{ 
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
      className="absolute -left-16 top-1/2 -translate-y-1/2 z-0 hidden lg:block"
    >
      <div className="h-24 w-24 text-purple-600/20">
        <CheckCircleIcon />
      </div>
    </motion.div>

    <motion.div
      animate={{ 
        y: [0, -15, 0],
        x: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
      className="absolute -right-14 bottom-10 z-0 hidden lg:block"
    >
      <div className="h-20 w-20 text-indigo-600/20">
        <ClockIcon />
      </div>
    </motion.div>

    {/* Mobile floating elements */}
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" 
      }}
      className="absolute -top-10 right-10 z-0 lg:hidden"
    >
      <div className="h-16 w-16 text-indigo-600/20">
        <ClipboardDocumentListIcon />
      </div>
    </motion.div>

    <motion.div
      animate={{ 
        y: [0, 10, 0],
        rotate: [0, -5, 5, 0]
      }}
      transition={{ 
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
      className="absolute -bottom-10 left-10 z-0 lg:hidden"
    >
      <div className="h-16 w-16 text-purple-600/20">
        <CheckCircleIcon />
      </div>
    </motion.div>
  </>
);

/**
 * TodoForm Component
 * Handles creation and editing of todo items with a rich UI
 */
export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const { todos } = TodoComponents.useTodos();
  const activeTodosCount = todos.filter(t => !t.isCompleted).length;
  const remainingTodos = MAX_TODOS - activeTodosCount;
  const isLimitReached = remainingTodos <= 0;

  // Initialize form data with defaults or existing todo data
  const [formData, setFormData] = useState<TodoFormData>(() => {
    const today = new Date();
    let initialDueDate = today.toISOString().split('T')[0];
    let initialDueTime = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    if (initialData?.dueDate) {
      try {
        const date = new Date(initialData.dueDate);
        if (!isNaN(date.getTime())) {
          initialDueDate = date.toISOString().split('T')[0];
          initialDueTime = date.toTimeString().slice(0, 5);
        }
      } catch (error) {
        // Fallback to default values if date parsing fails
        if (error instanceof Error) {
          console.warn('Failed to parse initial due date:', error.message);
        }
      }
    }

    return {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      dueDate: initialDueDate,
      dueTime: initialDueTime,
      category: initialData?.category || '',
      subtasks: initialData?.subtasks?.map(st => st.title) || []
    };
  });

  /**
   * Handles form submission
   * Validates and processes form data before submission
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return; // Silent return as the required attribute handles UI feedback
    }

    try {
      // Create ISO datetime string
      const dateStr = `${formData.dueDate}T${formData.dueTime}:00`;
      const localDate = new Date(dateStr);
      
      if (isNaN(localDate.getTime())) {
        throw new Error('Invalid date/time format');
      }
      
      const utcString = localDate.toISOString();
      
      const todoData: TodoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: utcString,
        category: formData.category.trim(),
        isCompleted: initialData?.isCompleted || false
      };
      
      onSubmit(todoData);

      // Reset form if not in editing mode
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: new Date().toISOString().split('T')[0],
          dueTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          category: '',
          subtasks: []
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Error processing form data:', error.message);
      }
    }
  };

  /**
   * Handles changes to form fields
   * @param e - Change event from form inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="relative"
      id="todo-form"
    >
      <FloatingElements />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 hover:border-indigo-100/50 p-8 transition-all duration-300"
      >
        {!isEditing && (
          <div className={`mb-4 text-sm font-medium ${isLimitReached ? 'text-red-600' : 'text-gray-600'}`}>
            {isLimitReached ? (
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>You have reached the maximum limit of 15 active todos. Please complete or delete existing todos before adding new ones.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5" />
                <span>You can create {remainingTodos} more {remainingTodos === 1 ? 'todo' : 'todos'}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {/* Title Input */}
          <div className="group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Task Title
            </label>
            <div className="relative">
              <PencilIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 transition-colors group-hover:text-indigo-500" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                whileHover="hover"
                initial="blur"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What needs to be done?"
                required
                disabled={!isEditing && isLimitReached}
                className={`w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400 ${
                  !isEditing && isLimitReached ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="group">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Description
            </label>
            <div className="relative">
              <PencilIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-400 transition-colors group-hover:text-indigo-500" />
              <motion.textarea
                variants={inputVariants}
                whileFocus="focus"
                whileHover="hover"
                initial="blur"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add more details about your task..."
                required
                rows={3}
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Priority Select */}
            <div className="md:col-span-5 group">
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
                Priority Level
              </label>
              <div className="relative">
                <ExclamationTriangleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 transition-colors group-hover:text-indigo-600 pointer-events-none z-10" />
                <motion.select
                  variants={inputVariants}
                  whileFocus="focus"
                  whileHover="hover"
                  initial="blur"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer relative"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </motion.select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Due Date and Time Inputs */}
            <div className="md:col-span-7 space-y-0">
              <label className="block text-sm font-semibold text-gray-800 mb-2 ml-1">
                Due Date & Time
              </label>
              <div className="grid grid-cols-8 gap-3">
                <div className="col-span-4 group">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      const dateInput = document.getElementById('dueDate');
                      if (dateInput instanceof HTMLInputElement) {
                        showDatePicker(dateInput);
                      }
                    }}
                  >
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 transition-colors group-hover:text-indigo-600 pointer-events-none z-10" />
                    <motion.input
                      variants={inputVariants}
                      whileFocus="focus"
                      whileHover="hover"
                      initial="blur"
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer relative"
                    />
                  </div>
                </div>

                <div className="col-span-4 group">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      const timeInput = document.getElementById('dueTime');
                      if (timeInput instanceof HTMLInputElement) {
                        showDatePicker(timeInput);
                      }
                    }}
                  >
                    <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 transition-colors group-hover:text-indigo-600 pointer-events-none z-10" />
                    <motion.input
                      variants={inputVariants}
                      whileFocus="focus"
                      whileHover="hover"
                      initial="blur"
                      type="time"
                      id="dueTime"
                      name="dueTime"
                      value={formData.dueTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer relative"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Input */}
          <div className="group">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Category
            </label>
            <div className="relative">
              <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400 transition-colors group-hover:text-indigo-500" />
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                whileHover="hover"
                initial="blur"
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Work, Personal, Shopping"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{isEditing ? 'Update Task' : 'Add Task'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TodoForm; 