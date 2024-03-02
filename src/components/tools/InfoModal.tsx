import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Clock, Brain, Coffee, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const benefits = [
    {
      title: 'Enhanced Focus',
      description: 'Work in focused 25-minute intervals to maintain high concentration levels',
      icon: Brain
    },
    {
      title: 'Better Time Management',
      description: 'Break work into manageable chunks and track your productivity',
      icon: Clock
    },
    {
      title: 'Regular Breaks',
      description: 'Take structured breaks to prevent mental fatigue and maintain energy',
      icon: Coffee
    },
    {
      title: 'Improved Productivity',
      description: 'Complete more tasks with better quality by avoiding distractions',
      icon: CheckCircle2
    }
  ];

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
                    The Pomodoro Technique
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Introduction */}
                  <div className="prose prose-indigo">
                    <p className="text-gray-600">
                      The Pomodoro Technique is a time management method that uses a timer to break work into focused intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a "pomodoro," named after the tomato-shaped kitchen timer.
                    </p>
                  </div>

                  {/* How it Works */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How it Works</h3>
                    <ol className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-semibold mr-3 shrink-0">1</span>
                        <span>Choose a task you want to complete</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-semibold mr-3 shrink-0">2</span>
                        <span>Work on the task for 25 minutes (one pomodoro)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-semibold mr-3 shrink-0">3</span>
                        <span>Take a 5-minute break when the timer rings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 font-semibold mr-3 shrink-0">4</span>
                        <span>After 4 pomodoros, take a longer 15-minute break</span>
                      </li>
                    </ol>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {benefits.map((benefit) => (
                        <div key={benefit.title} className="flex items-start space-x-4 p-4 rounded-lg bg-indigo-50">
                          <benefit.icon className="w-6 h-6 text-indigo-600 shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        <span>If a task takes more than 5 pomodoros, break it into smaller sub-tasks</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        <span>Use the breaks to stretch, walk, or do quick exercises</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        <span>Avoid checking emails or social media during pomodoro sessions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                        <span>Keep a log of completed pomodoros to track your productivity</span>
                      </li>
                    </ul>
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

export default InfoModal; 