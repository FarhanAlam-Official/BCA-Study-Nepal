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
  WrenchIcon,
  Calculator,
  Clock,
  CheckSquare,
  LogIn,
  LogOut,
  Radar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import { useAuth } from '../../hooks/useAuth';

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
      { name: 'Syllabus', href: '/syllabus', icon: GraduationCap },
      { name: 'Resource Radar', href: '/resource-radar', icon: Radar },
    ]
  },
  {
    name: 'Tools',
    href: '#',
    icon: WrenchIcon,
    children: [
      { name: 'GPA Calculator', href: '/tools/gpa-calculator', icon: Calculator },
      { name: 'Pomodoro Timer', href: '/tools/pomodoro', icon: Clock },
      { name: 'Todo List', href: '/tools/todo', icon: CheckSquare },
    ]
  },
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
                ? 'px-4 py-2 text-sm font-medium w-full'
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
                            className={`h-5 w-5 mr-2 transition-all duration-200 ${
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
            ? 'px-4 py-2 text-sm font-medium w-full'
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
      <GraduationCap className="h-9 w-9 text-indigo-600 group-hover:text-black-700" />
      <span className="ml-2 text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
        BCA
      </span>
    </Link>
  </div>
);

// Define a User interface for better type safety
interface User {
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

// Add this utility function for user initials
const getUserInitials = (user: User | null) => {
  if (!user) return '??';
  
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  // Handle cases where either name could be empty
  if (!firstName && !lastName) return user.username?.substring(0, 2).toUpperCase() || '??';
  if (!firstName) return lastName.substring(0, 2).toUpperCase();
  if (!lastName) return firstName.substring(0, 2).toUpperCase();
  
  // Default case: first letter of first name + first letter of last name
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex sm:items-center sm:ml-28 sm:flex-1 sm:max-w-[400px]">
              <SearchBar />
            </div>
            
            {/* Auth Buttons or User Profile */}
            {isAuthenticated ? (
              <div className="hidden sm:flex sm:items-center">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none group relative"
                >
                  {user?.profile_picture ? (
                    <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm 
                      transition-all duration-300 ease-out
                      group-hover:border-indigo-300 group-hover:shadow-md"
                    >
                      <picture>
                        <source
                          srcSet={`${user.profile_picture} 2x`}
                          type="image/jpeg"
                        />
                        <source
                          srcSet={`${user.profile_picture} 2x`}
                          type="image/png"
                        />
                        <img
                          src={user.profile_picture}
                          alt={user.username}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="eager"
                          draggable="false"
                        />
                      </picture>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                      flex items-center justify-center border-2 border-indigo-100 shadow-sm 
                      transition-all duration-300 ease-out transform 
                      group-hover:scale-105 group-hover:border-indigo-300 group-hover:shadow-md"
                    >
                      <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {getUserInitials(user)}
                      </span>
                    </div>
                  )}
                  <span className="ml-2 text-sm font-medium transition-colors duration-300 ease-out">{user?.username || 'User'}</span>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <div className="absolute inset-0 -z-10 bg-indigo-600/20 blur-md group-hover:bg-indigo-700/20 transition-all duration-200 rounded-lg" />
                </motion.div>
              </div>
            )}

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
            <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {user?.profile_picture ? (
                        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-indigo-100 shadow-sm">
                          <picture>
                            <source
                              srcSet={`${user.profile_picture} 2x`}
                              type="image/jpeg"
                            />
                            <source
                              srcSet={`${user.profile_picture} 2x`}
                              type="image/png"
                            />
                            <img
                              src={user.profile_picture}
                              alt={user.username}
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="eager"
                            />
                          </picture>
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-indigo-100">
                          <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {getUserInitials(user)}
                          </span>
                        </div>
                      )}
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/auth"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
