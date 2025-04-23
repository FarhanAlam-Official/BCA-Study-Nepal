import { Resource, ResourceFavorite } from './resource-radar';
import { ResourceCard } from './ResourceCard';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { resourceRadarApi } from './resourceRadar';
import { Lightbulb } from 'lucide-react';

interface ResourceGridProps {
  category?: string | null;
  tags?: string[];
  search?: string;
  showBookmarked?: boolean;
  showFeatured?: boolean;
  sortOrder?: 'newest' | 'popular';
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

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

  useEffect(() => {
    setCurrentSearch(search);
  }, [search]);

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      let data: Resource[] | PaginatedResponse<Resource>;
      
      if (showBookmarked) {
        console.log('Fetching bookmarked resources');
        // Fetch bookmarked resources
        const favorites = await resourceRadarApi.getFavorites();
        console.log('Favorites response:', favorites);
        
        // Handle both array and paginated response formats
        const favoritesArray = Array.isArray(favorites) ? favorites : favorites.results || [];
        
        // Extract resources from favorites and ensure they're valid
        data = favoritesArray
          .filter((fav: ResourceFavorite) => fav && (fav.resource || fav.id)) // Filter out invalid favorites
          .map((fav: ResourceFavorite) => fav.resource || fav) // Map to resources
          .filter((resource): resource is Resource => !!resource); // Filter out nulls
      } else {
        // Fetch regular resources with filters
        const searchTerm = currentSearch ? currentSearch.trim() : undefined;
        console.log('Fetching resources with filters:', {
          category,
          tags,
          search: searchTerm,
          ordering: sortOrder === 'newest' ? '-created_at' : '-view_count'
        });

        data = await resourceRadarApi.getResources({
          category: category || undefined,
          tag: tags.length > 0 ? tags.join(',') : undefined,
          search: searchTerm,
          ordering: sortOrder === 'newest' ? '-created_at' : '-view_count'
        });
      }

      // Filter for featured resources if needed
      let finalResources = Array.isArray(data) ? data : data.results || [];
      if (showFeatured) {
        finalResources = finalResources.filter((resource: Resource) => resource.featured);
      }

      console.log('Setting resources:', finalResources.length);
      setResources(finalResources);
      setError(null);
    } catch (error) {
      console.error('Error fetching resources:', error);
      const err = error as Error;
      const errorMessage = err.message || 'Failed to load resources';
      setError(errorMessage);
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, tags, currentSearch, showBookmarked, showFeatured, sortOrder]);

  // Refetch resources when filters change
  useEffect(() => {
    console.log('Filters changed, fetching resources:', {
      category,
      tags,
      search: currentSearch,
      showBookmarked,
      showFeatured,
      sortOrder
    });
    fetchResources();
  }, [fetchResources]);

  const handleFavoriteChange = useCallback(async (resourceId: string, isFavorite: boolean) => {
    if (showBookmarked) {
      console.log('Favorite changed in bookmarked view:', { resourceId, isFavorite });
      if (!isFavorite) {
        // If we're showing favorites and a resource was unfavorited, remove it immediately
        setResources(prev => prev.filter(r => r.id !== resourceId));
      }
      // Refetch the list to ensure we have the latest state
      await fetchResources();
    }
  }, [showBookmarked, fetchResources]);

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