import React, { useState } from "react";
import { motion } from "framer-motion";
import {RotateCcw,Settings,Volume2,VolumeX,Clock,Brain,Coffee,HelpCircle,Sparkles} from "lucide-react";
import { usePomodoroTimer } from "../../../hooks/usePomodoroTimer";
import PomodoroSettings from "./PomodoroSettings";
import InfoModal from "./InfoModal";

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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white relative overflow-hidden">
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[15%]"
      >
        <div className="h-28 w-28 text-indigo-600/20">
          <Clock size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -40, 40, -30, 0],
          x: [0, 30, -30, 20, 0],
          rotate: [0, 20, -20, 15, 0],
          scale: [1, 1.1, 1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.68, -0.55, 0.27, 1.55],
          delay: 0.3,
        }}
        className="absolute left-[15%] top-[25%]"
      >
        <div className="h-[112px] w-[112px] text-purple-600/15">
          <Brain size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -25, 15, -10, 0],
          x: [0, -20, 10, -15, 0],
          rotate: [0, 10, -10, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute right-[19%] bottom-[5%]"
      >
        <div className="h-[110px] w-[110px] text-indigo-600/20">
          <Coffee size="100%" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.3, 0.9, 1.2, 1],
          rotate: [0, 360],
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[40%] bottom-[30%]"
      >
        <div className="h-[80px] w-[80px] text-yellow-400/20">
          <Sparkles size="100%" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Pomodoro Timer
              </h1>
              <div className="flex items-center justify-center mt-2.5">
                <button
                  onClick={() => setShowInfo(true)}
                  className="text-gray-400 hover:text-indigo-600 transition-all duration-200 hover:scale-110"
                  title="Learn about the Pomodoro Technique"
                >
                  <HelpCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <p className="text-black-700 text-center">
              Stay focused and productive
            </p>
          </div>

          {/* Main Timer Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-8">
            {/* Task Input */}
            <div className="mb-12">
  <label
    htmlFor="task"
    className="block text-center mb-4 text-base font-semibold text-indigo-500 tracking-wide"
  >
    What's Your Main Focus Today?
  </label>

  <input
    id="task"
    type="text"
    value={currentTask}
    onChange={(e) => setCurrentTask(e.target.value)}
    placeholder="e.g., Complete project presentation..."
    className="w-full max-w-xl mx-auto block bg-indigo-50 text-gray-800 border border-indigo-100 rounded-2xl px-6 py-4 placeholder-indigo-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300/30 focus:border-indigo-400 text-center text-lg transition-all duration-300"
  />
</div>




            {/* Timer Mode Selection */}
            <div className="flex justify-center space-x-4 mb-8">
              {(["pomodoro", "shortBreak", "longBreak"] as const).map(
                (timerMode) => (
                  <motion.button
                    key={timerMode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMode(timerMode)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      mode === timerMode
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-indigo-50"
                    }`}
                  >
                    {timerMode === "pomodoro"
                      ? "Pomodoro"
                      : timerMode === "shortBreak"
                      ? "Short Break"
                      : "Long Break"}
                  </motion.button>
                )
              )}
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              <div className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 font-mono tracking-wider mb-8">
                {formatTime(timeLeft)}
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center items-center space-x-4 flex-wrap gap-4 sm:gap-6 mt-8 px-4">
      {/* Start/Pause Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTimer}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-16 sm:px-16 py-6 rounded-2xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isRunning ? 'Pause' : 'Start'}
      </motion.button>

      {/* Reset Button */}
      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: 360,
          backgroundColor: 'rgba(238, 242, 255, 1)',
          color: 'rgba(79, 70, 229, 1)',
          boxShadow: '0 0 12px rgba(79, 70, 229, 0.3)',
        }}
        whileTap={{ scale: 0.9 }}
        onClick={resetTimer}
        className="bg-white text-gray-600 p-6 rounded-2xl shadow-md border border-gray-100/50 backdrop-blur-sm hover:text-indigo-600 transition-all duration-500"
        title="Reset Timer"
      >
        <motion.div
          animate={{ rotate: isRunning ? [0, 360] : 0 }}
          transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: 'linear' }}
        >
          <RotateCcw className="w-7 h-7" />
        </motion.div>
      </motion.button>

      {/* Settings Button */}
      <motion.button
        whileHover={{
          scale: 1.1,
          backgroundColor: 'rgba(238, 242, 255, 1)',
          color: 'rgba(79, 70, 229, 1)',
          boxShadow: '0 0 12px rgba(79, 70, 229, 0.3)',
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSettings(true)}
        className="bg-white text-gray-600 p-6 rounded-2xl shadow-md border border-gray-100/50 backdrop-blur-sm hover:text-indigo-600 transition-all duration-300"
        title="Settings"
      >
        <motion.div
          whileHover={{ rotate: [0, 90, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Settings className="w-7 h-7" />
        </motion.div>
      </motion.button>

      {/* Sound Toggle Button */}
      <motion.button
        whileHover={{
          scale: 1.1,
          rotate: settings.soundEnabled ? 0 : 180,
          backgroundColor: 'rgba(238, 242, 255, 1)',
          boxShadow: '0 0 12px rgba(79, 70, 229, 0.3)',
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() =>
          setSettings((s) => ({
            ...s,
            soundEnabled: !s.soundEnabled,
          }))
        }
        className={`bg-white ${
          settings.soundEnabled ? 'text-indigo-600' : 'text-gray-600'
        } p-6 rounded-2xl shadow-md border border-gray-100/50 backdrop-blur-sm hover:text-indigo-600 transition-all duration-300`}
        title={settings.soundEnabled ? 'Sound On' : 'Sound Off'}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: settings.soundEnabled ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3, repeat: settings.soundEnabled ? 1 : 0 }}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-7 h-7" />
          ) : (
            <VolumeX className="w-7 h-7" />
          )}
        </motion.div>
      </motion.button>
    </div>



            </div>

            {/* Progress Info */}
            <div className="mt-8 flex justify-between items-center">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-xl">
                <span className="text-gray-600">Completed:</span>{" "}
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                  {completedPomodoros}
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-xl">
                <span className="text-gray-600">Long Break in:</span>{" "}
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                  {settings.longBreakInterval -
                    (completedPomodoros % settings.longBreakInterval)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PomodoroSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default PomodoroTimer;
