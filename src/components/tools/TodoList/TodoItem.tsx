import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from './types';
import {
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
  CalendarIcon,
  TagIcon,
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import TodoComponents from './TodoContext';
import NotificationComponents from './NotificationContext';

/**
 * Props interface for the TodoItem component
 * @interface TodoItemProps
 */
interface TodoItemProps {
  /** The todo item data to be displayed */
  todo: Todo;
  /** Callback function to toggle todo completion status */
  onToggle: (id: string) => void;
  /** Callback function to delete a todo */
  onDelete: (id: string) => void;
  /** Callback function to edit a todo */
  onEdit: (todo: Todo) => void;
}

/**
 * Color mappings for different priority levels
 * Uses Tailwind CSS classes for consistent styling
 */
const priorityColors = {
  low: 'bg-green-100 text-green-800 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  high: 'bg-red-100 text-red-800 border border-red-200',
} as const;

/**
 * Framer Motion animation variants for list items
 * Handles entry, exit, and visibility states
 */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Animation variants for the modal backdrop
 * Controls the fade effect of the background overlay
 */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Animation variants for the confirmation dialog
 * Provides spring animation for natural movement
 */
const dialogVariants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 10,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Animation variants for interactive buttons
 * Provides feedback for hover and tap states
 */
const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * TodoItem Component
 * A comprehensive todo item component that displays a single todo with all its
 * functionality including completion status, priority, due date, subtasks, and comments.
 *
 * @component
 * @param {TodoItemProps} props - The props for the TodoItem component
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const { addSubtask, toggleSubtask, deleteSubtask, addComment, deleteComment } = TodoComponents.useTodos();
  const { showNotification } = NotificationComponents.useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Formats a date string into a readable format with error handling
   * @param {string} dateString - The ISO date string to format
   * @returns {{ date: string, time: string }} Formatted date and time
   */
  const formatDueDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return { date: 'Invalid date', time: '' };
      }
      return {
        date: format(date, 'MMM d, yyyy'),
        time: format(date, 'h:mm a')
      };
    } catch {
      return { date: 'Invalid date', time: '' };
    }
  };

  /**
   * Handles the toggling of todo completion status
   * Shows error notification if the operation fails
   */
  const handleToggle = async () => {
    try {
      await onToggle(todo.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      showNotification(errorMessage, 'error');
    }
  };

  /**
   * Opens the delete confirmation dialog
   */
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * Handles the deletion of a todo after confirmation
   * Shows error notification if the operation fails
   */
  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      showNotification(errorMessage, 'error');
    }
  };

  /**
   * Handles the addition of a new subtask
   * Shows error notification if the operation fails
   * @param {React.FormEvent} e - The form submission event
   */
  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !newSubtask.trim()) return;

    try {
      setIsSubmitting(true);
      await addSubtask(todo.id, newSubtask.trim());
      setNewSubtask('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add subtask';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles the addition of a new comment
   * Shows error notification if the operation fails
   * @param {React.FormEvent} e - The form submission event
   */
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(todo.id, newComment.trim());
      setNewComment('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles toggling a subtask's completion status
   * Shows error notification if the operation fails
   * @param {string} subtaskId - The ID of the subtask to toggle
   */
  const handleToggleSubtask = async (subtaskId: string) => {
    try {
      await toggleSubtask(todo.id, subtaskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subtask status';
      showNotification(errorMessage, 'error');
    }
  };

  /**
   * Handles the deletion of a subtask
   * Shows error notification if the operation fails
   * @param {string} subtaskId - The ID of the subtask to delete
   */
  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await deleteSubtask(todo.id, subtaskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete subtask';
      showNotification(errorMessage, 'error');
    }
  };

  /**
   * Handles the deletion of a comment
   * Shows error notification if the operation fails
   * @param {string} commentId - The ID of the comment to delete
   */
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(todo.id, commentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      showNotification(errorMessage, 'error');
    }
  };

  // Format the due date if it exists
  const { date: dueDate, time: dueTime } = todo.dueDate ? formatDueDate(todo.dueDate) : { date: '', time: '' };

  return (
    <>
      <motion.div
        layout
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`group p-4 rounded-xl shadow-sm border transition-all duration-300 ${
          todo.isCompleted 
            ? 'bg-green-50/90 border-green-200 shadow-green-100 hover:shadow-green-200/50' 
            : 'bg-white border-gray-100 hover:border-indigo-100 hover:shadow-lg'
        }`}
      >
        <div className="flex items-start gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            className={`mt-1 rounded-full p-1.5 transition-all duration-300 ${
              todo.isCompleted
                ? 'text-green-600 bg-green-100/80 hover:bg-green-200/90'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <CheckCircleIcon 
              className={`w-6 h-6 transition-all duration-300 ${
                todo.isCompleted 
                  ? 'text-green-600 stroke-[1.5]'
                  : 'text-gray-400 hover:text-indigo-600'
              }`} 
            />
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-x-4">
              <div>
                <h3 className={`text-base font-medium transition-all duration-300 ${
                  todo.isCompleted ? 'text-green-800/70 line-through' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-sm transition-all duration-300 ${
                    todo.isCompleted ? 'text-green-700/50' : 'text-gray-600'
                  }`}>
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEdit(todo)}
                  disabled={todo.isCompleted}
                  className={`p-1.5 rounded-full transition-colors duration-300 ${
                    todo.isCompleted 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={todo.isCompleted ? "Completed tasks cannot be edited" : "Edit task"}
                >
                  <PencilIcon className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openDeleteConfirm}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-300"
                >
                  <TrashIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                  todo.isCompleted 
                    ? 'bg-green-100/70 text-green-800 border border-green-200' 
                    : priorityColors[todo.priority]
                }`}
              >
                {todo.isCompleted ? 'Completed' : todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </motion.span>

              {todo.dueDate && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center px-2.5 py-1 rounded-full ${
                    todo.isCompleted 
                      ? 'text-green-700/70 bg-green-50/50' 
                      : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>
                    {dueDate}
                    {' '}
                    <span className="text-gray-400">
                      at {dueTime}
                    </span>
                  </span>
                </motion.div>
              )}

              {todo.category && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center px-2.5 py-1 rounded-full ${
                    todo.isCompleted 
                      ? 'text-green-700/70 bg-green-50/50' 
                      : 'text-gray-500 bg-gray-50'
                  }`}
                >
                  <TagIcon className="w-4 h-4 mr-1" />
                  <span>{todo.category}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`ml-auto flex items-center gap-1 transition-colors duration-300 ${
                  todo.isCompleted 
                    ? 'text-green-700/70 hover:text-green-800' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <span className="text-sm">
                  {(todo.subtasks?.length || 0) > 0 && `${(todo.subtasks || []).filter(st => st.isCompleted).length}/${todo.subtasks.length}`}
                  {(todo.comments?.length || 0) > 0 && ` • ${todo.comments.length} ${todo.comments.length === 1 ? 'comment' : 'comments'}`}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {/* Subtasks Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Subtasks</h4>
                    <form onSubmit={handleAddSubtask} className="flex gap-2">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add a subtask..."
                        className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-300"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </motion.button>
                    </form>
                    <div className="space-y-2">
                      {todo.subtasks.map((subtask) => (
                        <motion.div
                          key={subtask.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 group/subtask"
                        >
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleSubtask(subtask.id)}
                            className={`rounded-full p-1 transition-colors duration-300 ${
                              subtask.isCompleted
                                ? 'text-green-500 bg-green-100 hover:bg-green-200'
                                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </motion.button>
                          <span className={`text-sm transition-all duration-300 ${subtask.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {subtask.title}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            className="ml-auto p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 opacity-0 group-hover/subtask:opacity-100 transition-all duration-300"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900">Comments</h4>
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors duration-300"
                      >
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                      </motion.button>
                    </form>
                    <div className="space-y-3">
                      {todo.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-start gap-2 text-sm group/comment bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="font-medium text-indigo-600">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{comment.content}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 opacity-0 group-hover/comment:opacity-100 transition-all duration-300"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-red-50 text-red-500">
                  <ExclamationTriangleIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="mt-4 text-gray-600 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                Are you sure you want to delete <span className="font-medium text-gray-900">"{todo.title}"</span>?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="group px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors duration-200"
                >
                  <span className="inline-flex items-center gap-2">
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </span>
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleDelete}
                  className="group px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200"
                >
                  <span className="inline-flex items-center gap-2">
                    <TrashIcon className="w-4 h-4" />
                    Delete Task
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TodoItem; 