import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';

interface PomodoroSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({ isOpen, onClose }) => {
  const { settings, setSettings } = usePomodoroTimer();

  const handleChange = (key: keyof typeof settings, value: number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg sm:max-w-xl transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-4 sm:p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Timer Settings
                  </Dialog.Title>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Time Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Time (minutes)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pomodoro
                        </label>
                        <motion.input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.pomodoro}
                          onChange={(e) =>
                            handleChange('pomodoro', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-200/50 bg-white/50 text-base outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Short Break
                        </label>
                        <motion.input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.shortBreak}
                          onChange={(e) =>
                            handleChange('shortBreak', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-200/50 bg-white/50 text-base outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Long Break
                        </label>
                        <motion.input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.longBreak}
                          onChange={(e) =>
                            handleChange('longBreak', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2.5 rounded-2xl border border-gray-200/50 bg-white/50 text-base outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto Start Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Auto Start</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Auto Start Breaks
                        </label>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          <input
                            type="checkbox"
                            checked={settings.autoStartBreaks}
                            onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </motion.label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Auto Start Pomodoros
                        </label>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                        >
                          <input
                            type="checkbox"
                            checked={settings.autoStartPomodoros}
                            onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </motion.label>
                      </div>
                    </div>
                  </div>

                  {/* Sound Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sound</h3>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Timer Sound
                      </label>
                      <motion.label
                        className="relative inline-flex items-center cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      >
                        <input
                          type="checkbox"
                          checked={settings.soundEnabled}
                          onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </motion.label>
                    </div>
                  </div>

                  {/* Long Break Interval */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Long Break Interval</h3>
                    <div>
                      <motion.input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.longBreakInterval}
                        onChange={(e) =>
                          handleChange('longBreakInterval', Math.max(1, parseInt(e.target.value)))
                        }
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200/50 bg-white/50 text-base outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileFocus={{ scale: 1.02 }}
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Number of pomodoros before a long break
                      </p>
                    </div>
                  </div>

                  {/* Save and Cancel Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(79, 70, 229, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full sm:w-2/5 px-6 py-2.5 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: 'rgba(254, 242, 242, 1)',
                        color: 'rgba(239, 68, 68, 1)',
                        boxShadow: '0 0 12px rgba(239, 68, 68, 0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="bg-white text-gray-600 w-full sm:w-2/5 px-6 py-2.5 rounded-2xl font-semibold text-lg shadow-md border border-gray-100/50 backdrop-blur-sm hover:text-red-600 transition-all duration-300"
                      title="Cancel"
                    >
                      Cancel
                    </motion.button>
                  </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PomodoroSettings;