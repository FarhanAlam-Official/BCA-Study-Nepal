import React, { useState } from 'react';
import { Plus, MoreVertical, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
}

interface TaskListProps {
  currentTask: Task | null;
  onTaskSelect: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ currentTask, onTaskSelect }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setEstimatedPomodoros(1);
    setIsAddingTask(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-white/5 rounded-lg"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What are you working on?"
              className="w-full bg-transparent text-white border-none outline-none mb-3 placeholder-white/50"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEstimatedPomodoros(Math.max(1, estimatedPomodoros - 1))}
                  className="text-white/80 hover:text-white"
                >
                  -
                </button>
                <span className="text-white flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {estimatedPomodoros}
                </span>
                <button
                  onClick={() => setEstimatedPomodoros(estimatedPomodoros + 1)}
                  className="text-white/80 hover:text-white"
                >
                  +
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="text-white/80 hover:text-white p-2"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAddTask}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg transition-colors ${
              currentTask?.id === task.id
                ? 'bg-white/20'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`p-1 rounded-full ${
                    task.isCompleted ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
                <span
                  className={`text-white ${
                    task.isCompleted ? 'line-through opacity-50' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">
                  {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-white/50 hover:text-white/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList; 