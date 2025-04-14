import React, { useState } from 'react';
import { TodoFormData, Todo } from './types';
import { 
  CalendarIcon, 
  TagIcon, 
  PencilIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Define the showPicker interface
interface DateTimeInput {
  showPicker: () => void;
}

const showDatePicker = (input: HTMLInputElement) => {
  if ('showPicker' in input) {
    (input as unknown as DateTimeInput).showPicker();
  }
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    } 
  }
};

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

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Todo;
  isEditing?: boolean;
}

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

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<TodoFormData>(() => {
    let initialDueDate = new Date().toISOString().split('T')[0];
    let initialDueTime = '09:00';

    if (initialData?.dueDate) {
      const date = new Date(initialData.dueDate);
      initialDueDate = date.toISOString().split('T')[0];
      initialDueTime = date.toTimeString().slice(0, 5);
    }

    return {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'medium',
      dueDate: initialDueDate,
      dueTime: initialDueTime,
      category: initialData?.category || '',
      subtasks: initialData?.subtasks.map(st => st.title) || []
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    onSubmit({
      ...formData,
      dueDate: combinedDateTime.toISOString()
    });
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
      category: '',
      subtasks: []
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative px-20 py-10">
      <FloatingElements />
      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-100/50 hover:border-indigo-100/50 transition-all duration-300"
      >
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
                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-gray-400"
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
      </motion.form>
    </div>
  );
};

export default TodoForm; 