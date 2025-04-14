import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, SubTask, Comment } from './types';
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
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';
import TodoComponents from './TodoContext';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  high: 'bg-red-100 text-red-800 border border-red-200',
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const { addSubtask, toggleSubtask, deleteSubtask, addComment, deleteComment } = TodoComponents.useTodos();

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      const subtask: Omit<SubTask, 'id'> = {
        title: newSubtask.trim(),
        isCompleted: false,
        createdAt: new Date()
      };
      addSubtask(todo.id, subtask);
      setNewSubtask('');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Omit<Comment, 'id'> = {
        content: newComment.trim(),
        createdAt: new Date(),
        userId: 'anonymous',
        userName: 'Anonymous'
      };
      addComment(todo.id, comment);
      setNewComment('');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`group p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${
        todo.isCompleted 
          ? 'bg-green-50/50 border-green-100 hover:border-green-200 hover:bg-green-50/80' 
          : 'hover:border-indigo-100'
      }`}
    >
      <div className="flex items-start gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`mt-1 rounded-full p-1.5 transition-all duration-300 ${
            todo.isCompleted
              ? 'text-green-600 bg-green-100 hover:bg-green-200 hover:text-green-700'
              : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <CheckCircleIcon className="w-5 h-5" />
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
                onClick={() => onDelete(todo.id)}
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
                  {format(todo.dueDate, 'MMM d, yyyy')}
                  {' '}
                  <span className="text-gray-400">
                    at {format(todo.dueDate, 'h:mm a')}
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
                          onClick={() => toggleSubtask(todo.id, subtask.id)}
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
                          onClick={() => deleteSubtask(todo.id, subtask.id)}
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
                          onClick={() => deleteComment(todo.id, comment.id)}
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
  );
};

export default TodoItem; 