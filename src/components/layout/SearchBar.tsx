import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  title: string;
  type: 'note' | 'college' | 'syllabus' | 'career' | 'page';
  url: string;
  description?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
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
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 w-full md:w-[300px] rounded-full border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
          />
        </motion.div>
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900">{result.title}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {result.type}
                </span>
              </div>
              {result.description && (
                <p className="mt-1 text-sm text-gray-500">{result.description}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
}