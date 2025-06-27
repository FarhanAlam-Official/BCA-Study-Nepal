import { Resource, ResourceFavorite } from '../../types/resource-radar/resource-radar.types';
import { ResourceCard } from './ResourceCard';
import { AnimatePresence, motion } from 'framer-motion';
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

  // Update currentSearch when search prop changes
  useEffect(() => {
    setCurrentSearch(search);
  }, [search]);

  /**
   * Fetches resources based on current filters and settings
   */
  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
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
      } else {
        // Fetch regular resources with applied filters
        const searchTerm = currentSearch ? currentSearch.trim() : undefined;

        data = await resourceRadarApi.getResources({
          category: category || undefined,
          tag: tags.length > 0 ? tags.join(',') : undefined,
          search: searchTerm,
          ordering: sortOrder === 'newest' ? '-created_at' : '-view_count'
        });
      }

      // Apply featured filter if needed
      let finalResources = Array.isArray(data) ? data : data.results || [];
      if (showFeatured) {
        finalResources = finalResources.filter((resource: Resource) => resource.featured);
      }

      setResources(finalResources);
      setError(null);
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message || 'Failed to load resources';
      console.error('Error fetching resources:', error);
      setError(errorMessage);
      setResources([]);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [category, tags, currentSearch, showBookmarked, showFeatured, sortOrder]);

  // Fetch resources whenever filters change
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /**
   * Handles changes in resource favorite status
   */
  const handleFavoriteChange = useCallback(async (resourceId: string, isFavorite: boolean) => {
    try {
      if (showBookmarked && !isFavorite) {
        // Remove unfavorited resource immediately in favorites view
        setResources(prev => prev.filter(r => r.id !== resourceId));
        // Refetch to ensure data consistency
        await fetchResources();
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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <AnimatePresence mode="popLayout">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
          >
            <ResourceCard 
              resource={resource} 
              onFavoriteChange={handleFavoriteChange}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};