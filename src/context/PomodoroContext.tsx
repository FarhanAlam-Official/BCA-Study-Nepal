import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, X } from 'lucide-react';
import TimerCompletionModal from '../components/tools/Pomodoro/TimerCompletionModal';
// import { useSound } from 'use-sound';

// Sound URL that points to a stable external source
// const SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869.wav';
const SOUND_URL = '../../assets/sounds/notification.mp3';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  soundEnabled: boolean;
}

export interface PomodoroContextType {
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;
  timeLeft: number;
  isRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  completedPomodoros: number;
  settings: TimerSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimerSettings>>;
  currentTask: string;
  setCurrentTask: (task: string) => void;
}

const defaultSettings: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  longBreakInterval: 4,
  soundEnabled: true,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state from localStorage
  const loadSavedState = () => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    const savedTimeLeft = localStorage.getItem('pomodoroTimeLeft');
    const savedMode = localStorage.getItem('pomodoroMode') as TimerMode;
    const savedIsRunning = localStorage.getItem('pomodoroIsRunning');
    const savedCompletedPomodoros = localStorage.getItem('pomodoroCompleted');
    const savedCurrentTask = localStorage.getItem('pomodoroCurrentTask');

    return {
      settings: savedSettings ? JSON.parse(savedSettings) : defaultSettings,
      timeLeft: savedTimeLeft ? parseInt(savedTimeLeft) : defaultSettings.pomodoro * 60,
      mode: savedMode || 'pomodoro',
      isRunning: savedIsRunning === 'true',
      completedPomodoros: savedCompletedPomodoros ? parseInt(savedCompletedPomodoros) : 0,
      currentTask: savedCurrentTask || ''
    };
  };

  const savedState = loadSavedState();

  const [mode, setMode] = useState<TimerMode>(savedState.mode);
  const [settings, setSettings] = useState<TimerSettings>(savedState.settings);
  const [timeLeft, setTimeLeft] = useState(savedState.timeLeft);
  const [isRunning, setIsRunning] = useState(savedState.isRunning);
  const [completedPomodoros, setCompletedPomodoros] = useState(savedState.completedPomodoros);
  const [currentTask, setCurrentTask] = useState(savedState.currentTask);
  const [showMiniTimer, setShowMiniTimer] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Preload audio for notifications
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = new Audio(SOUND_URL);
    audio.preload = 'auto';
    audio.volume = 1.0;
    
    audio.addEventListener('canplaythrough', () => {
      audioRef.current = audio;
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Failed to load timer notification sound:', e);
    });
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      audioRef.current = null;
    };
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    localStorage.setItem('pomodoroTimeLeft', timeLeft.toString());
    localStorage.setItem('pomodoroMode', mode);
    localStorage.setItem('pomodoroIsRunning', isRunning.toString());
    localStorage.setItem('pomodoroCompleted', completedPomodoros.toString());
    localStorage.setItem('pomodoroCurrentTask', currentTask);
  }, [settings, timeLeft, mode, isRunning, completedPomodoros, currentTask]);

  const playSound = useCallback(() => {
    if (settings.soundEnabled && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1.0;
      audio.loop = true;
      
      const playForDuration = async () => {
        await audio.play();
        setTimeout(() => {
          audio.loop = false;
          audio.pause();
          audio.currentTime = 0;
        }, 2000);
      };
      
      playForDuration().catch(err => console.error('Failed to play timer notification sound:', err));
    }
  }, [settings.soundEnabled]);

  const handleSnooze = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
  };

  const handleStartNext = () => {
    if (mode === 'pomodoro') {
      const needsLongBreak = (completedPomodoros + 1) % settings.longBreakInterval === 0;
      setMode(needsLongBreak ? 'longBreak' : 'shortBreak');
      setCompletedPomodoros(prev => prev + 1);
    } else {
      setMode('pomodoro');
    }
    setIsRunning(true);
  };

  const handleFinish = () => {
    setTimeLeft(settings[mode] * 60);
    setIsRunning(false);
    setShowMiniTimer(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(settings[mode] * 60);
  }, [mode, settings]);

  // Timer logic - simplified to focus on pause/resume
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion separately
  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      
      if (mode === 'pomodoro') {
        playSound();
        setShowCompletionModal(true);
        
        // Update completed count
        setCompletedPomodoros(prev => prev + 1);
        
        // Determine break type
        const needsLongBreak = (completedPomodoros + 1) % settings.longBreakInterval === 0;
        setMode(needsLongBreak ? 'longBreak' : 'shortBreak');
        
        // Auto-start break if enabled
        if (settings.autoStartBreaks) {
          setTimeout(() => setIsRunning(true), 500);
        }
      } else if (mode === 'shortBreak' || mode === 'longBreak') {
        playSound();
        setShowCompletionModal(true);
        
        // Return to pomodoro mode
        setMode('pomodoro');
        
        // Auto-start pomodoro if enabled
        if (settings.autoStartPomodoros) {
          setTimeout(() => setIsRunning(true), 500);
        }
      }
    }
  }, [timeLeft, mode, settings, completedPomodoros, playSound]);

  // Only reset timer on mode or settings change, not on pause
  const lastMode = useRef(mode);
  const lastSettings = useRef(settings);

  useEffect(() => {
    const modeChanged = lastMode.current !== mode;
    const settingsChanged = JSON.stringify({
      ...lastSettings.current,
      soundEnabled: settings.soundEnabled
    }) !== JSON.stringify({
      ...settings,
      soundEnabled: settings.soundEnabled
    });
    
    if (modeChanged || settingsChanged) {
      setTimeLeft(settings[mode] * 60);
      lastMode.current = mode;
      lastSettings.current = settings;
    }
  }, [mode, settings]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
    setShowMiniTimer(true);
  }, []);

  // Mini Timer Portal Component
  const MiniTimer = () => {
    if (!showMiniTimer) return null;
    
    const portalTarget = typeof document !== 'undefined' ? document.body : null;
    if (!portalTarget) return null;

    const getBackgroundColor = () => {
      switch (mode) {
        case 'pomodoro':
          return 'from-indigo-500 to-indigo-700';
        case 'shortBreak':
          return 'from-indigo-400 to-indigo-600';
        case 'longBreak':
          return 'from-indigo-600 to-indigo-800';
        default:
          return 'from-indigo-500 to-indigo-700';
      }
    };
    
    const miniTimerContent = (
      <div className="fixed bottom-4 right-4 z-40">
        <div
          className={`bg-gradient-to-br ${getBackgroundColor()} rounded-2xl p-4 shadow-lg flex items-center space-x-4 transition-all duration-300`}
        >
          <button
            onClick={() => setShowMiniTimer(false)}
            className="absolute -top-2 -right-2 bg-white/20 rounded-full p-1 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <div className="text-white font-mono text-xl font-bold">
            {formatTime(timeLeft)}
          </div>
          
          <button
            onClick={toggleTimer}
            className="text-white hover:text-white/80 transition-colors"
          >
            {isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    );

    return createPortal(miniTimerContent, portalTarget);
  };

  return (
    <PomodoroContext.Provider
      value={{
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
      }}
    >
      {children}
      <MiniTimer />
      <TimerCompletionModal
        isOpen={showCompletionModal}
        mode={mode}
        onClose={() => setShowCompletionModal(false)}
        onSnooze={handleSnooze}
        onStartNext={handleStartNext}
        onFinish={handleFinish}
        currentTask={currentTask}
      />
    </PomodoroContext.Provider>
  );
};

export default PomodoroContext;