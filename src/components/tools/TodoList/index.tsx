import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, ArrowsUpDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { Todo, SortOption, TodoData } from './types';
import TodoComponents from './TodoContext';
import NotificationComponents from './NotificationContext';
import NotificationButton from './NotificationButton';

/**
 * Animation variants for the container
 */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Animation variants for individual items
 */
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

/**
 * Main content component for the todo list
 */
const TodoListContent: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo } = TodoComponents.useTodos();
  const { checkAndNotifyDueTasks } = NotificationComponents.useNotifications();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<{
    status: 'all' | 'active' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
    category: string;
  }>({
    status: 'all',
    priority: 'all',
    category: '',
  });

  const [sort, setSort] = useState<SortOption>({
    field: 'createdAt',
    direction: 'desc',
  });

  /**
   * Handles adding a new todo
   */
  const handleAddTodo = (formData: TodoData) => {
    addTodo({
      title: formData.title,
      description: formData.description || '',
      priority: formData.priority,
      dueDate: formData.dueDate,
      category: formData.category || '',
      isCompleted: false
    });
  };

  /**
   * Handles updating an existing todo
   */
  const handleUpdateTodo = (formData: TodoData) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        category: formData.category,
        isCompleted: formData.isCompleted ?? false
      });
      setEditingTodo(null);
    }
  };

  /**
   * Handles toggling a todo's completion status
   */
  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toggleTodo(id);
    }
  };

  /**
   * Handles deleting a todo
   */
  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  /**
   * Memoized sorted and filtered todos
   */
  const sortedAndFilteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) {
      return [];
    }

    const result = todos.filter(todo => {
      const statusMatch =
        filter.status === 'all' ||
        (filter.status === 'active' && !todo.isCompleted) ||
        (filter.status === 'completed' && todo.isCompleted);

      const priorityMatch =
        filter.priority === 'all' || todo.priority === filter.priority;

      const categoryMatch =
        !filter.category || todo.category?.toLowerCase().includes(filter.category.toLowerCase());

      return statusMatch && priorityMatch && categoryMatch;
    });

    return result.sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      
      switch (sort.field) {
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          try {
            const aDate = new Date(a.dueDate);
            const bDate = new Date(b.dueDate);
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
              return 0;
            }
            return direction * (aDate.getTime() - bDate.getTime());
          } catch {
            // Invalid date format, return 0 for equal sorting
            return 0;
          }
        }
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        }
        case 'lastModified': {
          const aTime = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const bTime = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return direction * (aTime - bTime);
        }
        default: {  // createdAt
          const aCreatedTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bCreatedTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return direction * (aCreatedTime - bCreatedTime);
        }
      }
    });
  }, [todos, filter, sort]);

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(todos.map(todo => todo.category).filter(Boolean)));

  // Set up notification checking
  useEffect(() => {
    checkAndNotifyDueTasks(todos);

    const handleNotificationCheck = () => {
      checkAndNotifyDueTasks(todos);
    };

    window.addEventListener('check-todo-notifications', handleNotificationCheck);
    
    return () => {
      window.removeEventListener('check-todo-notifications', handleNotificationCheck);
    };
  }, [todos, checkAndNotifyDueTasks]);

  useEffect(() => {
    window.__TODOS__ = todos;
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <NotificationButton />
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <SparklesIcon className="h-12 w-12 text-indigo-600 animate-pulse" />
                <div className="absolute inset-0 bg-indigo-400/30 blur-3xl rounded-full scale-150" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Todo List
            </h1>
            <p className="mt-2 text-gray-600">Stay organized and boost your productivity</p>
          </motion.div>

          {editingTodo ? (
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-white/50 backdrop-blur-lg rounded-2xl -m-6" />
              <div className="relative space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Edit Task
                  </h2>
                </div>
                <TodoForm
                  onSubmit={handleUpdateTodo}
                  initialData={editingTodo}
                  isEditing={true}
                />
                <div className="flex justify-center">
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="flex items-center gap-2 px-6 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel Editing</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <TodoForm onSubmit={handleAddTodo} />
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:border-indigo-100 transition-all duration-300"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-600">Filter:</span>
              </div>

              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as typeof filter.status }))}
                className="px-3 py-1.5 text-gray-700 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filter.priority}
                onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as typeof filter.priority }))}
                className="px-3 py-1.5 text-gray-700 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-1.5 text-gray-700 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <ArrowsUpDownIcon className="w-5 h-5 text-indigo-400" />
                <select
                  value={`${sort.field}-${sort.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSort({
                      field: field as SortOption['field'],
                      direction: direction as SortOption['direction'],
                    });
                  }}
                  className="px-3 py-1.5 text-gray-700 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="dueDate-asc">Due Date (Earliest)</option>
                  <option value="dueDate-desc">Due Date (Latest)</option>
                  <option value="priority-desc">Priority (High to Low)</option>
                  <option value="priority-asc">Priority (Low to High)</option>
                  <option value="lastModified-desc">Last Modified</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {sortedAndFilteredTodos.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <div className="flex justify-center mb-4">
                      <SparklesIcon className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500">
                      No tasks found. Add some tasks to get started!
                    </p>
                  </motion.div>
                ) : (
                  sortedAndFilteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={setEditingTodo}
                    />
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const TodoList = () => {
  return <TodoListContent />;
};

export default TodoList;