import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, School, BriefcaseIcon, Menu, X, Home } from 'lucide-react';
import SearchBar from './SearchBar';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Notes', href: '/notes', icon: BookOpen },
  { name: 'Syllabus', href: '/syllabus', icon: GraduationCap },
  { name: 'Colleges', href: '/colleges', icon: School },
  { name: 'Career', href: '/career', icon: BriefcaseIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BCA Study Nepal</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <SearchBar />
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-3">
            <SearchBar />
          </div>
        </div>
      )}
    </nav>
  );
}