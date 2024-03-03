import React, { useState } from 'react';
import PomodoroTimer from '../../components/tools/PomodoroTimer';
import TaskList from '../../components/tools/TaskList';
import { motion } from 'framer-motion';
import { Clock, CheckSquare, ListTodo, Calendar, Coffee, BookOpen, Edit3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
}

// FloatingIcon component for animated icons
const FloatingIcon: React.FC<{
  Icon: React.ElementType;
  className: string;
  animate: any;
  transition: any;
}> = ({ Icon, className, animate, transition }) => {
  return (
    <motion.div
      className={className}
      animate={animate}
      transition={transition}
    >
      <Icon className="w-full h-full text-indigo-300/40" />
    </motion.div>
  );
};

const Pomodoro: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Floating Icons */}
      <FloatingIcon
        Icon={Clock}
        className="absolute h-28 w-28 right-[20%] top-[5%]"
        animate={{ 
          y: [0, -40, 0],
          x: [0, 30, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      <FloatingIcon
        Icon={BookOpen}
        className="absolute h-[112px] w-[112px] left-[25%] top-[5%]"
        animate={{ 
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <FloatingIcon
        Icon={CheckSquare}
        className="absolute h-[90px] w-[90px] right-[25%] bottom-[15%]"
        animate={{ 
          y: [0, -30, 0],
          x: [0, -25, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <FloatingIcon
        Icon={ListTodo}
        className="absolute h-20 w-20 left-[25%] bottom-[15%]"
        animate={{ 
          y: [0, 35, 0],
          x: [0, 25, 0],
          rotate: [0, -8, 8, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />

      <FloatingIcon
        Icon={Coffee}
        className="absolute h-24 w-24 right-[3%] top-[45%]"
        animate={{ 
          y: [0, -35, 0],
          x: [0, 20, 0],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <FloatingIcon
        Icon={Edit3}
        className="absolute h-20 w-20 left-[3%] top-[50%]"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pomodoro Timer</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6">
          <PomodoroTimer />
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex-grow">
          <TaskList currentTask={currentTask} onTaskSelect={setCurrentTask} />
        </div>
      </div>
    </div>
  );
};

export default Pomodoro; 