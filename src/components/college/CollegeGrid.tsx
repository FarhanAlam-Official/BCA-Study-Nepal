import { useEffect, useState } from 'react';
import { College, CollegeFilters } from './college';
import { collegeApi } from './collegeApi';
import { CollegeCard } from './CollegeCard';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface CollegeGridProps extends CollegeFilters {
  onFavoriteChange?: (collegeId: string, isFavorite: boolean) => void;
}

export const CollegeGrid = ({
  search,
  location,
  programs,
  admission_status,
  rating_min,
  facilities,
  showFeatured,
  showFavorites,
  sortBy,
  sortOrder,
  onFavoriteChange,
}: CollegeGridProps) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await collegeApi.getColleges({
          search,
          location,
          programs,
          admission_status,
          rating_min,
          facilities,
          showFeatured,
          showFavorites,
          sortBy,
          sortOrder,
        });
        setColleges(response.results);
      } catch (err) {
        setError('Failed to load colleges. Please try again later.');
        console.error('Error fetching colleges:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, [
    search,
    location,
    programs,
    admission_status,
    rating_min,
    facilities,
    showFeatured,
    showFavorites,
    sortBy,
    sortOrder,
  ]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/50 rounded-2xl h-[300px] shadow-lg border border-indigo-100/20"
          />
        ))}
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <AcademicCapIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Colleges Found
        </h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any colleges matching your criteria. Try adjusting your filters or search terms.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {colleges.map((college) => (
          <motion.div
            key={college.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <CollegeCard
              college={college}
              onFavoriteChange={onFavoriteChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}; 