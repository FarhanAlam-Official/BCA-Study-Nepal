import { motion, AnimatePresence } from 'framer-motion';
import { Resource, ResourceFavorite } from '../../types/resource-radar/resource-radar.types';
import { resourceRadarApi } from '../../api/resource-radar/resource-radar.api';
import { useEffect, useState, useCallback } from 'react';
import { HeartIcon, EyeIcon, ShareIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, SparklesIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { showSuccess, showError, showInfo } from '../../utils/notifications';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

/**
 * Props for the ResourceCard component
 * @interface ResourceCardProps
 */
interface ResourceCardProps {
  resource: Resource;                                                  // The resource to display
  onFavoriteChange?: (resourceId: string, isFavorite: boolean) => void; // Callback when favorite status changes
}

/**
 * ResourceCard component displays a single resource with interactive features
 * Includes favoriting, view counting, and sharing capabilities
 */
export const ResourceCard = ({ resource, onFavoriteChange }: ResourceCardProps) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewCount, setViewCount] = useState(resource.view_count);
  const [isHovered, setIsHovered] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  /**
   * Check if resource is favorited on mount and when auth status changes
   */
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await resourceRadarApi.getFavorites();
        const favorites = response.results || [];
        
        // Check if this resource is in the favorites list
        const isFav = favorites.some((favorite: ResourceFavorite) => {
          const resourceId = favorite.resource?.id || favorite.resource;
          return resourceId === resource.id;
        });
        
        setIsFavorite(isFav);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status !== 401) {
            showError('Failed to check favorite status');
          }
        } else {
          showError('An unexpected error occurred while checking favorites');
        }
      }
    };

    checkFavoriteStatus();
  }, [resource.id, isAuthenticated]);

  /**
   * Handle resource click - opens URL and increments view count
   */
  const handleClick = useCallback(async () => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    try {
      await resourceRadarApi.incrementView(resource.id);
      setViewCount(prev => prev + 1);
    } catch (error) {
      // Silent fail for view count as it's not critical
      // But log for debugging purposes
      console.error('Error incrementing view count:', error);
    }
  }, [resource.url, resource.id]);

  /**
   * Handle favorite toggle with proper error handling and user feedback
   */
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showInfo('Please sign in to add resources to your favorites', {
        onClick: () => window.location.href = '/auth',
        style: { cursor: 'pointer' },
        toastId: 'login-required',
        icon: () => <span role="img" aria-label="lock">🔒</span>,
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      
      const response = await resourceRadarApi.toggleFavorite(resource.id);
      const newFavoriteStatus = response.status === 'resource favorited';
      
      setIsFavorite(newFavoriteStatus);
      onFavoriteChange?.(resource.id, newFavoriteStatus);

      showSuccess(
        newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        { 
          position: 'top-right', 
          autoClose: 2000
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear auth state and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth';
        } else {
          showError('Failed to update favorite status. Please try again.');
        }
      } else {
        showError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  /**
   * Handle sharing resource URL via clipboard
   */
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resource.url);
      showSuccess('Link copied to clipboard!', {
        position: 'top-right',
        autoClose: 2000
      });
    } catch {
      showError('Failed to copy link. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-100/20 p-6 flex flex-col gap-4 group cursor-pointer h-full min-h-[280px] transform-gpu will-change-transform"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
      <motion.div
        initial={false}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
      />

      {/* Featured Badge */}
      {resource.featured && (
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

      {/* Header Section */}
      <div className="flex items-center justify-between relative z-10">
        {/* Icon and Title Section */}
        <div className="flex items-center gap-4 flex-1">
          {resource.icon_url ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 p-0.5 shadow-sm flex-shrink-0"
            >
              <img
                src={resource.icon_url}
                alt={`${resource.title} icon`}
                className="w-full h-full rounded-lg object-cover"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md flex-shrink-0"
            >
              <span className="text-white text-xl font-bold">{resource.title.charAt(0)}</span>
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </motion.div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors duration-200 truncate">
              {resource.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
              </span>
              <span className="text-xs font-medium text-indigo-600">
                {resource.category.name}
              </span>
            </div>
          </div>
        </div>

        {/* Heart Button */}
        <motion.button
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`p-2 rounded-full hover:bg-red-50/80 transition-all duration-300 flex-shrink-0 z-10 relative group/heart ${
            isTogglingFavorite ? 'cursor-wait opacity-70' : 'cursor-pointer'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={isTogglingFavorite}
        >
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-full bg-red-400/10 transition-all duration-300 ${
            isFavorite ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`} />
          
          <AnimatePresence mode="wait">
            {isFavorite ? (
              <motion.div
                key="solid"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  transition: {
                    duration: 0.15,
                    ease: "easeOut"
                  }
                }}
                className="relative"
              >
                <HeartIconSolid 
                  className="w-6 h-6 text-red-500 drop-shadow-sm transition-all duration-300 group-hover/heart:text-red-600" 
                />
                {/* Subtle scale animation on favorite */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1.2, 
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  className="absolute inset-0 rounded-full bg-red-400/20"
                />
              </motion.div>
            ) : (
              <motion.div
                key="outline"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  transition: {
                    duration: 0.15,
                    ease: "easeOut"
                  }
                }}
              >
                <HeartIcon 
                  className="w-6 h-6 text-gray-400 transition-all duration-300 group-hover/heart:text-red-500" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Description and Link */}
      <div className="flex flex-col gap-2 flex-1 mt-4 z-10">
        <p className="text-sm text-black-600 group-hover:text-black-700 transition-colors duration-300 line-clamp-3">
          {resource.description}
        </p>
      </div>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 z-10">
          {resource.tags.map((tag) => (
            <motion.span
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50/50 text-indigo-700 border border-indigo-100/30 backdrop-blur-sm shadow-sm"
            >
              #{tag.name}
            </motion.span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 mt-auto z-10">
        {/* URL on the left */}
        <a 
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-gray-500 hover:text-indigo-600 transition-colors duration-300 truncate flex-1"
        >
          {resource.url}
        </a>

        {/* Action buttons on the right */}
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center text-gray-500 group-hover:text-indigo-600 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{viewCount}</span>
          </motion.div>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-indigo-50/80 transition-colors duration-300"
            aria-label="Share resource"
          >
            <ShareIcon className="w-5 h-5 text-gray-500 hover:text-indigo-600 transition-colors duration-300" />
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-indigo-50/80 transition-colors duration-300"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};