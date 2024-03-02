import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { usePomodoroTimer } from '../../hooks/usePomodoroTimer';
import { X } from 'lucide-react';

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
                    Timer Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Time Settings */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Time (minutes)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pomodoro
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.pomodoro}
                          onChange={(e) =>
                            handleChange('pomodoro', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Break
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.shortBreak}
                          onChange={(e) =>
                            handleChange('shortBreak', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Long Break
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={settings.longBreak}
                          onChange={(e) =>
                            handleChange('longBreak', Math.max(1, parseInt(e.target.value)))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto Start Settings */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Auto Start</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Auto Start Breaks
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoStartBreaks}
                            onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Auto Start Pomodoros
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.autoStartPomodoros}
                            onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sound Settings */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Sound</h3>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Timer Sound
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.soundEnabled}
                          onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Long Break Interval */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Long Break Interval</h3>
                    <div>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.longBreakInterval}
                        onChange={(e) =>
                          handleChange('longBreakInterval', Math.max(1, parseInt(e.target.value)))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Number of pomodoros before a long break
                      </p>
                    </div>
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