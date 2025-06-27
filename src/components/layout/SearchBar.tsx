import { useState, useRef, useEffect } from 'react';
import { Search, Book, School, FileText, Newspaper, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useClickAway } from 'react-use';
import { showError } from '../../utils/notifications';

/**
 * Interface defining the structure of a search result item
 * @property {string} title - The title of the search result
 * @property {'note' | 'college' | 'syllabus' | 'question_paper' | 'resource'} type - The type of content
 * @property {string} url - The URL to navigate to when clicked
 * @property {string} [description] - Optional description of the result
 */
interface SearchResult {
  title: string;
  type: 'note' | 'college' | 'syllabus' | 'question_paper' | 'resource';
  url: string;
  description?: string;
}

/**
 * Mapping of result types to their corresponding Lucide icons
 */
const typeIcons = {
  note: Book,
  college: School,
  syllabus: FileText,
  question_paper: Newspaper,
  resource: Lightbulb
};

/**
 * Mapping of result types to their corresponding Tailwind color classes
 */
const typeColors = {
  note: 'bg-blue-100 text-blue-800',
  college: 'bg-purple-100 text-purple-800',
  syllabus: 'bg-green-100 text-green-800',
  question_paper: 'bg-orange-100 text-orange-800',
  resource: 'bg-pink-100 text-pink-800'
};

/**
 * SearchBar component provides a search interface with real-time results
 * Features:
 * - Real-time search with API integration
 * - Categorized results with visual indicators
 * - Responsive design with animations
 * - Keyboard navigation support
 * - Click-away detection
 */
export default function SearchBar() {
  // State management for search functionality
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs for DOM manipulation and click-away detection
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle clicks outside the search component
  useClickAway(searchRef, () => {
    setIsFocused(false);
  });

  // Setup keyboard event listener for Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  /**
   * Handles the search operation by making an API call
   * @param searchQuery - The search term to query
   */
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    // Only search if query is at least 2 characters
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch {
      showError('Failed to fetch search results. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handles click on a search result
   * @param result - The selected search result
   */
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  /**
   * Clears the search input and results
   * Keeps focus on the input field
   */
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search input container */}
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex items-center w-full"
        >
          <div className="relative w-full group">
            {/* Decorative gradient effects */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 to-blue-600 
              rounded-full opacity-0 group-hover:opacity-30 group-focus-within:opacity-40 
              transition-all duration-300 blur-lg" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-400/30 via-blue-500/30 to-indigo-400/30
              rounded-full opacity-0 group-hover:opacity-40 blur-md
              transition-all duration-300" />

            <div className="relative flex items-center w-full">
              {/* Search icon */}
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                <Search className={`h-[18px] w-[18px] transition-colors duration-200 ${
                  isFocused ? 'text-indigo-600' : 'text-gray-500/80'
                }`} />
              </div>

              {/* Search input field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search anything..."
                className={`pl-10 pr-10 py-2.5 w-full rounded-full
                  bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md 
                  transition-all duration-200 outline-none
                  border relative
                  ${isFocused 
                    ? 'ring-[3px] ring-indigo-500/30 border-indigo-500 shadow-lg' 
                    : 'border-gray-200 hover:border-indigo-400/50 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-md hover:ring-2 hover:ring-indigo-400/20'
                  }
                  hover:bg-white/95
                  placeholder:text-gray-400 text-gray-900 text-sm`}
              />

              {/* Clear search button - only shown when query exists */}
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearSearch}
                    className="absolute right-3 p-1.5 rounded-full z-20
                      bg-red-50/80 hover:bg-red-100/90 text-red-400 hover:text-red-600
                      transition-all duration-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search results dropdown */}
      <AnimatePresence>
        {(results.length > 0 || isSearching) && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-white/95 backdrop-blur-lg rounded-lg 
              shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200/60
              max-h-[calc(100vh-200px)] overflow-y-auto z-[100]"
          >
            {/* Loading state */}
            {isSearching ? (
              <div className="p-3 text-center">
                <div className="relative mx-auto w-6 h-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-transparent 
                      border-t-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            ) : (
              // Search results list
              results.map((result, index) => {
                const Icon = typeIcons[result.type];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-3 hover:bg-gray-50/80 cursor-pointer transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Result type icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg ${typeColors[result.type]} bg-opacity-20 
                        group-hover:bg-opacity-30 group-hover:scale-105 transition-all duration-200`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {/* Result content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-gray-900 break-words 
                            group-hover:text-indigo-600 transition-colors duration-200">
                            {result.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium 
                            rounded-full ${typeColors[result.type]} group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}>
                            {result.type.replace('_', ' ')}
                          </span>
                        </div>
                        {/* Optional description */}
                        {result.description && (
                          <p className="mt-1 text-sm text-gray-500 break-words 
                            group-hover:text-gray-700 transition-colors duration-200">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}