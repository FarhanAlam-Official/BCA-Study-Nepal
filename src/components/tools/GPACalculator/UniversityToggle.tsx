import React from 'react';
import { Switch } from '@headlessui/react';
interface UniversityToggleProps {
  isTU: boolean;
  onChange: (isTU: boolean) => void;
}

const UniversityToggle: React.FC<UniversityToggleProps> = ({ isTU, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <span className={`text-sm transition-all duration-200 ${!isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>
        PU
      </span>
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
      <span className={`text-sm transition-all duration-200 ${isTU ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>
        TU
      </span>
    </div>
  );
};

export default UniversityToggle; 