import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Settings, Volume2, VolumeX, Clock, Brain, Coffee, HelpCircle } from 'lucide-react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import PomodoroSettings from './PomodoroSettings';
import InfoModal from './InfoModal';

const PomodoroTimer: React.FC = () => {
  const {
    mode,
    setMode,
    timeLeft,
    isRunning,
    toggleTimer,
    resetTimer,
    completedPomodoros,
    settings,
    setSettings,
    currentTask,
    setCurrentTask,
  } = usePomodoroTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <Clock size="100%" />
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
          <Brain size="100%" />
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
          <Coffee size="100%" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900 mb-2 animate-fade-in">
              Pomodoro Timer
            </h1>
            <p className="text-gray-600">Stay focused and productive with timed work sessions</p>
          </div>

          {/* Main Timer Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            {/* Help Button */}
            <div className="flex justify-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInfo(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Learn about the Pomodoro Technique"
              >
                <HelpCircle className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Task Input */}
            <div className="mb-12">
              <label htmlFor="task" className="block text-center mb-3 text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                CURRENT FOCUS
              </label>
              <input
                id="task"
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                placeholder="What are you working on?"
                className="w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 text-gray-900 border-2 border-indigo-100 rounded-xl px-6 py-4 placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-medium shadow-inner transition-all duration-300"
              />
            </div>

            {/* Timer Mode Selection */}
            <div className="flex justify-center space-x-4 mb-8">
              {(['pomodoro', 'shortBreak', 'longBreak'] as const).map((timerMode) => (
                <motion.button
                  key={timerMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMode(timerMode)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    mode === timerMode
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  {timerMode === 'pomodoro'
                    ? 'Pomodoro' 
                    : timerMode === 'shortBreak'
                      ? 'Short Break' 
                      : 'Long Break'}
                </motion.button>
              ))}
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 font-mono tracking-wider mb-8">
                {formatTime(timeLeft)}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className="bg-indigo-600 text-white px-16 py-6 rounded-2xl font-bold text-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-indigo-500"
                >
                  {isRunning ? 'Pause' : 'Start'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetTimer}
                  className="bg-gray-100 text-gray-700 p-6 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-lg"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(true)}
                  className="bg-gray-100 text-gray-700 p-6 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-lg"
                  title="Settings"
                >
                  <Settings className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                  className="bg-gray-100 text-gray-700 p-6 rounded-2xl hover:bg-gray-200 transition-all duration-300 shadow-lg"
                  title={settings.soundEnabled ? "Sound On" : "Sound Off"}
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-6 h-6" />
                  ) : (
                    <VolumeX className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="mt-8 flex justify-between items-center">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-xl">
                <span className="text-gray-600">Completed:</span>{' '}
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                  {completedPomodoros}
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-xl">
                <span className="text-gray-600">Long Break in:</span>{' '}
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                  {settings.longBreakInterval - (completedPomodoros % settings.longBreakInterval)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PomodoroSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default PomodoroTimer; 