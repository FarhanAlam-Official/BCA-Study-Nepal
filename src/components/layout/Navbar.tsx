import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  School,
  BriefcaseIcon,
  Menu,
  X,
  Home,
  Mail,
  ChevronDown,
  FileText,
  FileQuestion,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { 
    name: 'Resources', 
    href: '#', 
    icon: BookOpen,
    children: [
      { name: 'Notes', href: '/notes', icon: FileText },
      { name: 'Question Papers', href: '/question-papers', icon: FileQuestion },
    ]
  },
  { name: 'Syllabus', href: '/syllabus', icon: GraduationCap },
  { name: 'Colleges', href: '/colleges', icon: School },
  { name: 'Career', href: '/career', icon: BriefcaseIcon },
  { name: 'Contact', href: '/contact', icon: Mail },
];

interface NavLinkProps {
  item: NavItem;
  mobile?: boolean;
}

const NavLink = ({ item, mobile = false }: NavLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if current path matches item or any of its children
  const isActive = item.href === location.pathname || 
                  item.children?.some(child => child.href === location.pathname);

  // Check if any child is active (for dropdown)
  const hasActiveChild = item.children?.some(child => child.href === location.pathname);

  if (item.children) {
    return (
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
          onMouseEnter={() => !mobile && setIsOpen(true)}
          onMouseLeave={() => !mobile && setIsOpen(false)}
        >
          <button
            onClick={() => mobile && setIsOpen(!isOpen)}
            className={`group flex items-center transition-all duration-200 ${
              mobile
                ? 'px-4 py-2 text-base font-medium w-full'
                : 'inline-flex items-center px-1 pt-1 text-sm font-medium'
            } ${
              hasActiveChild 
                ? 'text-indigo-600 bg-indigo-50/50' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`${
                mobile ? 'h-6 w-6 mr-3' : 'h-5 w-5 mr-2'
              } ${
                hasActiveChild 
                  ? 'text-indigo-600 stroke-[2]' 
                  : 'text-gray-500 group-hover:text-indigo-700 group-hover:stroke-[2]'
              } transition-all duration-200`}
            />
            {item.name}
            <ChevronDown 
              className={`ml-1 h-4 w-4 transition-all duration-300 ${
                isOpen || hasActiveChild ? 'rotate-180 text-indigo-600' : 'text-gray-500'
              } group-hover:text-indigo-700`} 
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`${
                  mobile 
                    ? 'mt-0 ml-6' 
                    : 'absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden'
                }`}
              >
                {item.children.map((child, index) => {
                  const isChildActive = child.href === location.pathname;
                  
                  return (
                    <motion.div
                      key={child.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={child.href}
                        className={`block px-4 py-2 text-sm transition-all duration-200 ${
                          isChildActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center group">
                          <child.icon 
                            className={`h-4 w-4 mr-2 transition-all duration-200 ${
                              isChildActive
                                ? 'text-indigo-700 stroke-[2]'
                                : 'text-gray-500 group-hover:text-indigo-700 group-hover:stroke-[2]'
                            }`}
                          />
                          <span className={`group-hover:translate-x-1 transition-transform duration-200 ${
                            isChildActive ? 'font-medium' : ''
                          }`}>
                            {child.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={item.href}
        className={`group flex items-center transition-all duration-200 ${
          mobile
            ? 'px-4 py-2 text-base font-medium w-full'
            : 'inline-flex items-center px-1 pt-1 text-sm font-medium'
        } ${
          isActive 
            ? 'text-indigo-600 bg-indigo-50/50' 
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <item.icon
          className={`${
            mobile ? 'h-6 w-6 mr-3' : 'h-5 w-5 mr-2'
          } ${
            isActive 
              ? 'text-indigo-600 stroke-[2]' 
              : 'text-gray-500 group-hover:text-indigo-700 group-hover:stroke-[2]'
          } transition-all duration-200`}
        />
        <span className={`group-hover:translate-x-1 transition-transform duration-200 ${
          isActive ? 'font-medium' : ''
        }`}>
          {item.name}
        </span>
      </Link>
    </motion.div>
  );
};

const Logo = () => (
  <div>
    <Link to="/" className="flex-shrink-0 flex items-center group">
      <GraduationCap className="h-8 w-8 text-indigo-600 group-hover:text-black-700" />
      <span className="ml-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
        BCA Study Nepal
      </span>
    </Link>
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Logo />
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Right section - Search and Mobile Menu */}
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <SearchBar />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">
                  {isOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden"
            id="mobile-menu"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink item={item} mobile />
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 pb-3"
            >
              <SearchBar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
