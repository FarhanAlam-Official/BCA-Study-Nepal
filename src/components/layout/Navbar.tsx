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
import { showError } from '../../utils/notifications';

/**
 * Navigation item interface defining the structure of each nav item
 */
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

/**
 * Main navigation items configuration
 * Each item can have children for dropdown menus
 */
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

/**
 * Props interface for NavLink component
 */
interface NavLinkProps {
  item: NavItem;
  mobile?: boolean;
}

/**
 * NavLink component handles both regular links and dropdown menus
 * Supports both desktop and mobile views
 */
const NavLink = ({ item, mobile = false }: NavLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if current path matches item or any of its children
  const isActive = item.href === location.pathname || 
                  item.children?.some(child => child.href === location.pathname);

  // Check if any child is active (for dropdown highlighting)
  const hasActiveChild = item.children?.some(child => child.href === location.pathname);

  // Render dropdown menu if item has children
  if (item.children) {
    return (
      <div className="relative">
        <motion.div
          whileHover={{ scale: mobile ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
          onMouseEnter={() => !mobile && setIsOpen(true)}
          onMouseLeave={() => !mobile && setIsOpen(false)}
        >
          {/* Dropdown trigger button */}
          <button
            onClick={() => mobile && setIsOpen(!isOpen)}
            className={`group flex items-center transition-all duration-200 ${
              mobile
                ? 'px-4 py-3 text-sm font-medium w-full rounded-lg hover:bg-white/80'
                : 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50'
            } ${
              hasActiveChild 
                ? 'text-indigo-600 bg-indigo-50/80' 
                : 'text-gray-600 hover:text-gray-900'
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

          {/* Dropdown menu with animation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`${
                  mobile 
                    ? 'mt-1 ml-8 space-y-1' 
                    : 'absolute left-0 mt-1 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/5 backdrop-blur-sm backdrop-saturate-150'
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
                        className={`block px-4 py-2.5 text-sm transition-all duration-200 ${
                          mobile ? '' : 'first:rounded-t-lg last:rounded-b-lg'
                        } ${
                          isChildActive
                            ? 'bg-indigo-50/80 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50/80 hover:text-indigo-700'
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

  // Render regular link if item has no children
  return (
    <motion.div 
      whileHover={{ scale: mobile ? 1 : 1.02 }} 
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={item.href}
        className={`group flex items-center transition-all duration-200 ${
          mobile
            ? 'px-4 py-3 text-sm font-medium w-full rounded-lg hover:bg-white/80'
            : 'inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50'
        } ${
          isActive 
            ? 'text-indigo-600 bg-indigo-50/80' 
            : 'text-gray-600 hover:text-gray-900'
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

/**
 * Logo component with hover effects
 */
const Logo = () => (
  <div>
    <Link to="/" className="flex-shrink-0 flex items-center group">
      <GraduationCap className="h-10 w-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200" />
      <span className="ml-2.5 text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
        BCA
      </span>
    </Link>
  </div>
);

/**
 * User interface for type safety
 */
interface User {
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

/**
 * Utility function to generate user initials from name or username
 */
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

/**
 * Main Navbar component
 * Handles responsive navigation, search, and user authentication
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      showError('Failed to logout. Please try again.');
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Main navbar container */}
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 sm:h-[4.5rem]">
          {/* Left section - Logo and Desktop Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <Logo />
            <div className="hidden lg:flex lg:items-center lg:gap-4">
              {navigation.map((item) => (
                <NavLink key={item.name} item={item} />
                <NavLink key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Right section - Search and Profile */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block md:w-[240px] lg:w-[300px] xl:w-[350px]">
              <SearchBar />
            </div>
            
            {/* Auth Buttons or User Profile */}
            {isAuthenticated ? (
              <div className="hidden sm:flex sm:items-center sm:flex-shrink-0">
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none group relative px-2 sm:px-3 py-2"
                >
                  {/* User Avatar or Initials */}
                  {user?.profile_picture ? (
                    <div className="flex-shrink-0 relative h-9 sm:h-10 md:h-11 w-9 sm:w-10 md:w-11 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm 
                      transition-all duration-300 ease-out
                      group-hover:border-indigo-300 group-hover:shadow-md group-hover:scale-105"
                    >
                      <img
                        src={user?.profile_picture}
                        alt={user?.username || 'User profile'}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="eager"
                        draggable="false"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              ${getUserInitials(user)}
                            </span>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-9 sm:h-10 md:h-11 w-9 sm:w-10 md:w-11 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                      flex items-center justify-center border-2 border-indigo-100 shadow-sm 
                      transition-all duration-300 ease-out transform 
                      group-hover:scale-105 group-hover:border-indigo-300 group-hover:shadow-md"
                    >
                      <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {getUserInitials(user)}
                      </span>
                    </div>
                  )}
                  {/* Username display with truncation */}
                  <div className="ml-2 sm:ml-3 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[180px] flex flex-col overflow-hidden">
                    {user?.username ? (
                      <>
                        <span className="text-sm font-medium leading-tight transition-colors duration-300 ease-out">
                          {user.username.slice(0, 10)}
                        </span>
                        {user.username.length > 10 && (
                          <span className="text-sm font-medium leading-tight transition-colors duration-300 ease-out">
                            {user.username.slice(10, 20)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-medium leading-tight transition-colors duration-300 ease-out">
                        User
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              // Login button for non-authenticated users
              <div className="hidden sm:flex sm:items-center">
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200 hover:shadow-md"
                  >
                    <LogIn className="h-4 sm:h-5 w-4 sm:w-5" />
                    <span>Login</span>
                  </Link>
                  <div className="absolute inset-0 -z-10 bg-indigo-600/20 blur-md group-hover:bg-indigo-700/20 transition-all duration-200 rounded-lg" />
                </motion.div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">
                  {isOpen ? 'Close main menu' : 'Open main menu'}
                </span>
                {isOpen ? (
                  <X className="h-5 sm:h-6 w-5 sm:w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 sm:h-6 w-5 sm:w-6" aria-hidden="true" />
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
            className="lg:hidden bg-gray-50/50 border-t border-gray-100"
            id="mobile-menu"
          >
            {/* Mobile navigation items */}
            <div className="pt-2 pb-3 space-y-1.5 px-3 sm:px-4">
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

            {/* Mobile search bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-3 sm:px-4 pb-3"
            >
              <SearchBar />
            </motion.div>

            {/* Mobile auth buttons */}
            <div className="px-3 sm:px-4 pb-4 pt-2 flex flex-col gap-2 sm:gap-3">
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
                          <img
                            src={user?.profile_picture}
                            alt={user?.username || 'User profile'}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="eager"
                            draggable="false"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                              const parent = img.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  ${getUserInitials(user)}
                                </span>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 
                          flex items-center justify-center border border-indigo-100 shadow-sm">
                          <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {getUserInitials(user)}
                          </span>
                        </div>
                      )}
                      <span className="truncate max-w-[200px]">{user?.username || 'Profile'}</span>
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

