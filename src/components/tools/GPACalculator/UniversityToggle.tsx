/**
 * UniversityToggle Component
 * A toggle switch component that allows users to switch between TU (Tribhuvan University)
 * and PU (Pokhara University) grading systems.
 */
import React from 'react';
import { Switch } from '@headlessui/react';

/**
 * Props interface for the UniversityToggle component
 * @property {boolean} isTU - Current state of the toggle (true for TU, false for PU)
 * @property {function} onChange - Callback function triggered when the toggle state changes
 */
interface UniversityToggleProps {
  isTU: boolean;
  onChange: (isTU: boolean) => void;
}

const UniversityToggle: React.FC<UniversityToggleProps> = ({ isTU, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {/* PU Label - Highlighted when selected */}
      <span className={`text-sm transition-all duration-200 ${!isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>
        PU
      </span>

      {/* Toggle Switch */}
      <Switch
        checked={isTU}
        onChange={onChange}
        className={`${
          isTU ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
      >
        <span className="sr-only">Toggle university</span>
        <span
          className={`${
            isTU ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
        />
      </Switch>

      {/* TU Label - Highlighted when selected */}
      <span className={`text-sm transition-all duration-200 ${isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>
        TU
      </span>
    </div>
  );
};

export default UniversityToggle; 