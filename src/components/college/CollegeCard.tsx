import { College, CollegeFavorite } from './college';
import { collegeApi } from './collegeApi';
import { useEffect, useState, useCallback } from 'react';
import { HeartIcon, MapPinIcon, ShareIcon, AcademicCapIcon, BuildingLibraryIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, SparklesIcon } from '@heroicons/react/24/solid';
import { showSuccess, showError, showInfo } from '../resource-radar/utils/notifications';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { StarIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CollegeCardProps {
  college: College;
  onFavoriteChange?: (collegeId: string, isFavorite: boolean) => void;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"/>
);

export const CollegeCard = ({ college, onFavoriteChange }: CollegeCardProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Update favorite state when college prop changes
  useEffect(() => {
    setIsFavorite(college.is_favorite || false);
  }, [college.is_favorite]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await collegeApi.getFavorites();
        const favorites = response.results || [];
        const isFav = favorites.some((favorite: CollegeFavorite) => {
          if (typeof favorite.college === 'string') {
            return favorite.college === college.id;
          }
          return favorite.college.id === college.id;
        });
        setIsFavorite(isFav);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status !== 401) {
            showError('Failed to check favorite status');
          }
        }
      }
    };

    // Only check favorite status if is_favorite is undefined
    if (college.is_favorite === undefined) {
      checkFavoriteStatus();
    }
  }, [college.id, isAuthenticated, college.is_favorite]);

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/colleges/${college.id}`, { state: { college } });
  }, [college, navigate]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showInfo('Please sign in to add colleges to your favorites', {
        onClick: () => window.location.href = '/auth',
        style: { cursor: 'pointer' },
        toastId: 'login-required',
        icon: () => <span role="img" aria-label="lock">🔒</span>
      });
      return;
    }

    if (isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      const response = await collegeApi.toggleFavorite(college.id);
      const newFavoriteStatus = response.status === 'college favorited';
      
      setIsFavorite(newFavoriteStatus);
      onFavoriteChange?.(college.id, newFavoriteStatus);

      showSuccess(
        newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        { 
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
        } else if (error.response?.status === 404) {
          showError('College not found. Please refresh the page.');
        } else if (error.response?.status === 429) {
          showError('Too many requests. Please try again later.');
        } else {
          showError('Failed to update favorite status. Please try again.');
          console.error('Favorite toggle error:', error);
        }
      } else {
        showError('An unexpected error occurred. Please try again.');
        console.error('Unexpected favorite toggle error:', error);
      }
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(college.website);
      showSuccess('College website link copied to clipboard!');
    } catch {
      showError('Failed to copy link');
    }
  };

  return (
    <div 
      onClick={handleViewClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-indigo-100/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer min-h-[480px] flex flex-col"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-indigo-100/20" />
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
      />

      {/* Featured Badge */}
      {college.is_featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <motion.div
            initial={{ rotate: -15, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <SparklesIcon className="w-3 h-3" />
            <span>Featured</span>
          </motion.div>
        </div>
      )}

      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-3xl flex-shrink-0">
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        {/* Cover image */}
        {college.display_cover && (
          <img
            src={college.display_cover.startsWith('http') || college.display_cover.startsWith('//')
              ? college.display_cover 
              : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${college.display_cover}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-110"
            onError={(e) => {
              console.error('Failed to load cover image:', college.display_cover);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Content Container with Overlapping Logo */}
      <div className="relative px-6 pt-12 pb-6 flex-1 flex flex-col">
        {/* Logo - Overlapping Position */}
        <div className="absolute -top-8 left-6 w-16 h-16 bg-white rounded-xl p-2 shadow-md border-2 border-white">
          {college.display_logo ? (
            <img
              src={college.display_logo.startsWith('http') || college.display_logo.startsWith('//')
                ? college.display_logo
                : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${college.display_logo}`}
              alt={`${college.name} logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Failed to load logo:', college.display_logo);
                (e.target as HTMLImageElement).style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BuildingLibraryIcon className="w-8 h-8 text-indigo-300" />
            </div>
          )}
          <div className="hidden fallback-icon w-full h-full flex items-center justify-center">
            <BuildingLibraryIcon className="w-8 h-8 text-indigo-300" />
          </div>
        </div>

        {/* College Info */}
        <div className="flex-1 min-w-0">
          <div className="h-[60px] mb-1">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight break-words pr-4 line-clamp-2">{college.name}</h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{college.description}</p>

          {/* Stats and Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-indigo-50/50 rounded-xl p-3 transition-colors duration-300 group-hover:bg-indigo-50">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPinIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm truncate">{college.location}</span>
              </div>
            </div>
            <div className="bg-indigo-50/50 rounded-xl p-3 transition-colors duration-300 group-hover:bg-indigo-50">
              <div className="flex items-center gap-2 text-gray-700">
                <AcademicCapIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm truncate">
                  {(college.programs || []).length} Programs
                </span>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {(college.programs || []).slice(0, 3).map((program, index) => (
                <span
                  key={index}
                  className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-lg border border-indigo-100/50 transition-colors duration-300 group-hover:bg-indigo-100"
                >
                  {program}
                </span>
              ))}
              {(college.programs?.length || 0) > 3 && (
                <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-lg border border-purple-100/50 transition-colors duration-300 group-hover:bg-purple-100">
                  +{college.programs.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(college.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({college.views_count})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleFavorite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isTogglingFavorite ? 0.95 : 1,
                  opacity: isTogglingFavorite ? 0.7 : 1
                }}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  isFavorite ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:text-red-500 hover:bg-red-50/70'
                } ${isTogglingFavorite ? 'cursor-wait' : 'cursor-pointer'}`}
                disabled={isTogglingFavorite}
              >
                <AnimatePresence mode="wait">
                  {isTogglingFavorite ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center justify-center"
                    >
                      <LoadingSpinner />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      {isFavorite ? (
                        <HeartIconSolid className="w-5 h-5" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <button
                onClick={handleShare}
                className="p-2 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              <a 
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <BuildingLibraryIcon className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* View Button */}
              <button
                onClick={handleViewClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-indigo-200 active:scale-95"
              >
                <EyeIcon className="w-4 h-4" />
                View Details
              </button>

              {/* Admission Status */}
              <div className={`
                px-3 py-1.5 rounded-2xl text-xs font-medium shadow-sm
                ${college.admission_status === 'OPEN' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : college.admission_status === 'COMING_SOON' 
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-red-50 text-red-700 border border-red-200'}
              `}>
                {college.admission_status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};