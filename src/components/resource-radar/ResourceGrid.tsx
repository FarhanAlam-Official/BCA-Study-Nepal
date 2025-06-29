import { Resource, ResourceFavorite } from '../../types/resource-radar/resource-radar.types';
import { ResourceCard } from './ResourceCard';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { resourceRadarApi } from '../../api/resource-radar/resource-radar.api';
import { Lightbulb } from 'lucide-react';
import { showError } from '../../utils/notifications';

/**
 * Props interface for the ResourceGrid component
 */
interface ResourceGridProps {
  category?: string | null;      // Category filter for resources
  tags?: string[];              // Array of tag filters
  search?: string;             // Search query string
  showBookmarked?: boolean;    // Whether to show only bookmarked resources
  showFeatured?: boolean;      // Whether to show only featured resources
  sortOrder?: 'newest' | 'popular';  // Sort order for resources
}

/**
 * Generic interface for paginated API responses
 */
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * ResourceGrid component displays a grid of resource cards with filtering and sorting capabilities
 */
export const ResourceGrid = ({ 
  category, 
  tags = [], 
  search = '',
  showBookmarked = false,
  showFeatured = false,
  sortOrder = 'newest'
}: ResourceGridProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const ITEMS_PER_PAGE = 12;

  // Update currentSearch when search prop changes
  useEffect(() => {
    setCurrentSearch(search);
  }, [search]);

  /**
   * Fetches resources based on current filters and settings
   */
  const fetchResources = useCallback(async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      let data: Resource[] | PaginatedResponse<Resource>;
      
      if (showBookmarked) {
        // Fetch bookmarked resources
        const favorites = await resourceRadarApi.getFavorites();
        
        // Handle both array and paginated response formats
        const favoritesArray = Array.isArray(favorites) ? favorites : favorites.results || [];
        
        // Extract and validate resources from favorites
        let filteredResources = favoritesArray
          .filter((fav: ResourceFavorite) => fav && (fav.resource || fav.id))
          .map((fav: ResourceFavorite) => fav.resource || fav)
          .filter((resource): resource is Resource => !!resource);

        // Apply category filter if specified
        if (category) {
          filteredResources = filteredResources.filter(
            resource => resource.category?.slug === category
          );
        }

        // Apply tags filter if specified
        if (tags.length > 0) {
          filteredResources = filteredResources.filter(resource =>
            tags.every(tag => resource.tags?.some(t => t.slug === tag))
          );
        }

        data = filteredResources;
        setHasMore(false);
      } else {
        // Fetch regular resources with applied filters
        const searchTerm = currentSearch ? currentSearch.trim() : undefined;

        data = await resourceRadarApi.getResources({
          category: category || undefined,
          tag: tags.length > 0 ? tags.join(',') : undefined,
          search: searchTerm,
          ordering: sortOrder === 'newest' ? '-created_at' : '-view_count',
          page: page.toString(),
          page_size: ITEMS_PER_PAGE
        });

        if (!Array.isArray(data)) {
          setHasMore(!!data.next);
        }
      }

      // Apply featured filter if needed
      let finalResources = Array.isArray(data) ? data : data.results || [];
      if (showFeatured) {
        finalResources = finalResources.filter((resource: Resource) => resource.featured);
      }

      if (page === 1) {
        setResources(finalResources);
      } else {
        setResources(prev => [...prev, ...finalResources]);
      }
      setError(null);
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message || 'Failed to load resources';
      console.error('Error fetching resources:', error);
      if (page === 1) {
        setResources([]);
      }
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      if (page === 1) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [category, tags, currentSearch, showBookmarked, showFeatured, sortOrder]);

  // Fetch resources whenever filters change
  useEffect(() => {
    setCurrentPage(1);
    setIsExpanded(false);
    fetchResources(1);
  }, [fetchResources]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchResources(nextPage);
    setIsExpanded(true);
  };

  const handleShowLess = () => {
    setResources(prev => prev.slice(0, ITEMS_PER_PAGE));
    setIsExpanded(false);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handles changes in resource favorite status
   */
  const handleFavoriteChange = useCallback(async (resourceId: string, isFavorite: boolean) => {
    try {
      if (showBookmarked && !isFavorite) {
        // Remove unfavorited resource immediately in favorites view
        setResources(prev => prev.filter(r => r.id !== resourceId));
        // Refetch to ensure data consistency
        await fetchResources(1);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update favorites view';
      showError(errorMessage);
    }
  }, [showBookmarked, fetchResources]);

  // Error state UI
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-lg font-medium text-red-600 bg-red-100/50 px-6 py-3 rounded-lg shadow-sm">
          {error}
        </p>
      </motion.div>
    );
  }

  // Loading state UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg h-64 animate-pulse shadow-sm"
          />
        ))}
      </div>
    );
  }

  // Empty state UI
  if (resources.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 bg-gray-50 rounded-lg shadow-sm"
      >
        <Lightbulb className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
        <p className="text-lg font-medium text-gray-800">
          {showBookmarked 
            ? "No favorites yet — start exploring!" 
            : "No resources found"}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {showBookmarked 
            ? "Click the heart icon on resources you'd like to save for later." 
            : "Try adjusting your filters or search terms."}
        </p>
      </motion.div>
    );
  }

  // Resources grid UI
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1] // Smooth easing function
            }}
          >
            <ResourceCard 
              resource={resource} 
              onFavoriteChange={handleFavoriteChange}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        {isExpanded && resources.length > ITEMS_PER_PAGE && (
          <button
            onClick={handleShowLess}
            className="group relative px-6 py-2.5 text-sm font-medium text-indigo-50 bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-500 rounded-full hover:from-indigo-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-[0_2px_8px_-2px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.4)] transition-all duration-200 flex items-center gap-2 overflow-hidden isolate"
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(79,70,229,0.3)_0%,rgba(79,70,229,0)_40%,rgba(79,70,229,0)_60%,rgba(79,70,229,0.3)_100%)] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            <span className="relative">Show Less</span>
            <svg 
              className="relative w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}

        {(!isExpanded || hasMore) && (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="group relative px-6 py-2.5 text-sm font-medium text-indigo-50 bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-500 rounded-full hover:from-indigo-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-[0_2px_8px_-2px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_12px_-4px_rgba(79,70,229,0.4)] transition-all duration-200 flex items-center gap-2 overflow-hidden isolate disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[0_2px_8px_-2px_rgba(79,70,229,0.3)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(79,70,229,0.3)_0%,rgba(79,70,229,0)_40%,rgba(79,70,229,0)_60%,rgba(79,70,229,0.3)_100%)] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            {isLoadingMore ? (
              <>
                <svg className="relative animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="relative">Loading...</span>
              </>
            ) : (
              <>
                <span className="relative">Show More</span>
                <svg 
                  className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};