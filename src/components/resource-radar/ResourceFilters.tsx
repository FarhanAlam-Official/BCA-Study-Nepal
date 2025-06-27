import { useEffect, useState } from 'react';
import { resourceRadarApi } from '../../api/resource-radar/resource-radar.api';
import { Category, Tag } from '../../types/resource-radar/resource-radar.types';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { HeartIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../hooks/useAuth';
import { showError, showInfo } from '../../utils/notifications';

/**
 * Type definitions for filter options
 */
type DateFilter = 'all' | 'today' | 'week' | 'month';
type DifficultyLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';
type ResourceType = 'all' | 'article' | 'video' | 'tool' | 'course';
type SortOrder = 'newest' | 'popular';

/**
 * Props interface for ResourceFilters component
 * @interface ResourceFiltersProps
 */
interface ResourceFiltersProps {
  onFilterChange: (filters: {
    category: string | null;      // Selected category slug
    tags: string[];              // Array of selected tag slugs
    search: string;             // Search query
    showBookmarked: boolean;    // Show only bookmarked resources
    showFeatured: boolean;     // Show only featured resources
    sortOrder: SortOrder;     // Current sort order
    dateFilter: DateFilter;   // Date range filter
    difficultyLevel: DifficultyLevel; // Difficulty level filter
    resourceType: ResourceType;      // Resource type filter
  }) => void;
}

/**
 * ResourceFilters component provides filtering and sorting controls for resources
 */
export const ResourceFilters = ({ onFilterChange }: ResourceFiltersProps) => {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('all');
  const [resourceType, setResourceType] = useState<ResourceType>('all');
  const [showTagsModal, setShowTagsModal] = useState(false);

  /**
   * Fetch categories and tags on component mount
   */
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          resourceRadarApi.getCategories(),
          resourceRadarApi.getTags()
        ]);
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.results || [];
        const tagsArray = Array.isArray(tagsData) ? tagsData : tagsData.results || [];
        setCategories(categoriesArray);
        setTags(tagsArray);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setCategories([]);
        setTags([]);
        showError('Failed to load filters. Please refresh the page.');
      }
    };
    fetchFilters();
  }, []);

  /**
   * Handle tag selection/deselection
   * @param tagSlug - The slug of the tag to toggle
   */
  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagSlug) 
        ? prev.filter(t => t !== tagSlug) 
        : [...prev, tagSlug];
      
      // Update filters with new tag selection
      updateFilters({
        tags: newTags
      });
      
      return newTags;
    });
  };

  /**
   * Handle category selection
   * @param category - The slug of the selected category or null to clear
   */
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    updateFilters({
      category: category
    });
  };

  /**
   * Toggle between newest and popular sort orders
   */
  const handleSortOrderChange = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'newest' ? 'popular' : 'newest';
      updateFilters({
        sortOrder: newOrder
      });
      return newOrder;
    });
  };

  /**
   * Toggle favorites filter with authentication check
   */
  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      showInfo('Please sign in to access favorites', {
        onClick: () => window.location.href = '/auth',
        style: { cursor: 'pointer' }
      });
      return;
    }
    
    setShowFavorites(prev => {
      const newValue = !prev;
      updateFilters({
        showBookmarked: newValue
      });
      return newValue;
    });
  };

  /**
   * Toggle featured resources filter
   */
  const handleFeaturedClick = () => {
    setShowFeatured(prev => {
      const newValue = !prev;
      updateFilters({
        showFeatured: newValue
      });
      return newValue;
    });
  };

  /**
   * Reset all filters to their default values
   */
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setShowFavorites(false);
    setShowFeatured(false);
    setSortOrder('newest');
    setDateFilter('all');
    setDifficultyLevel('all');
    setResourceType('all');
    
    updateFilters({
      category: null,
      tags: [],
      showBookmarked: false,
      showFeatured: false,
      sortOrder: 'newest',
      dateFilter: 'all',
      difficultyLevel: 'all',
      resourceType: 'all'
    });
  };

  /**
   * Helper function to update filters with partial changes
   * @param changes - Partial filter changes to apply
   */
  const updateFilters = (changes: Partial<Parameters<ResourceFiltersProps['onFilterChange']>[0]>) => {
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      search: '',
      showBookmarked: showFavorites,
      showFeatured,
      sortOrder,
      dateFilter,
      difficultyLevel,
      resourceType,
      ...changes
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Filter Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTagsModal(true)}
          className="inline-flex items-center px-6 py-2.5 rounded-full 
            bg-gradient-to-r from-white/80 to-white/60
            backdrop-blur-md text-gray-700 
            font-medium text-sm transition-all duration-300 
            border border-indigo-200/50
            hover:border-indigo-500/70 hover:text-indigo-600
            hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]
            sm:w-auto w-full relative group"
        >
          <span className="mr-2">#</span>
          Tags
          {selectedTags.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold">
              {selectedTags.length}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSortOrderChange}
          className={`inline-flex items-center px-6 py-2.5 rounded-full 
            font-medium text-sm transition-all duration-300 
            border backdrop-blur-md sm:w-auto w-full relative group
            ${sortOrder === 'popular'
              ? 'bg-gradient-to-r from-indigo-100/90 to-indigo-50/80 text-indigo-600 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'bg-gradient-to-r from-white/80 to-white/60 text-gray-700 border-indigo-200/50 hover:border-indigo-500/70 hover:text-indigo-600 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}
        >
          <ArrowUpDown className={`w-4 h-4 mr-2 transition-transform duration-300
            ${sortOrder === 'popular' ? 'rotate-180' : ''}`} />
          {sortOrder === 'newest' ? 'Latest' : 'Popular'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFavoritesClick}
          className={`inline-flex items-center px-6 py-2.5 rounded-full 
            font-medium text-sm transition-all duration-300 
            border backdrop-blur-md sm:w-auto w-full relative group
            ${showFavorites 
              ? 'bg-gradient-to-r from-red-100/90 to-red-50/80 text-red-600 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'bg-gradient-to-r from-white/80 to-white/60 text-gray-700 border-red-200/50 hover:border-red-500/70 hover:text-red-600 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}
        >
          <div className="relative">
            {showFavorites ? (
              <HeartIconSolid className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 duration-300" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 duration-300" />
            )}
          </div>
          Favorites
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFeaturedClick}
          className={`inline-flex items-center px-6 py-2.5 rounded-full 
            font-medium text-sm transition-all duration-300 
            border backdrop-blur-md sm:w-auto w-full relative group
            ${showFeatured 
              ? 'bg-gradient-to-r from-indigo-100/90 to-indigo-50/80 text-indigo-600 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'bg-gradient-to-r from-white/80 to-white/60 text-gray-700 border-indigo-200/50 hover:border-indigo-500/70 hover:text-indigo-600 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}
        >
          <div className="relative">
            <SparklesIcon className={`w-4 h-4 mr-2 transition-all duration-500
              ${showFeatured ? 'animate-pulse' : 'group-hover:animate-pulse'}`} />
          </div>
          Featured
        </motion.button>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-3 px-2 py-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategorySelect(null)}
            className={`flex-shrink-0 px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border
              ${!selectedCategory 
                ? 'bg-indigo-100/80 text-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                : 'bg-white/80 text-gray-600 border-gray-200/50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-[0_4px_10px_rgba(99,102,241,0.2)]'}`}
          >
            All
          </motion.button>
          {Array.isArray(categories) && categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategorySelect(category.slug)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap border
                ${selectedCategory === category.slug 
                  ? 'bg-indigo-100/80 text-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                  : 'bg-white/80 text-gray-600 border-gray-200/50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-[0_4px_10px_rgba(99,102,241,0.2)]'}`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tags Modal */}
      {showTagsModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowTagsModal(false)}
        >
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
            aria-hidden="true"
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Select Tags</h2>
                <button
                  onClick={() => setShowTagsModal(false)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
                {Array.isArray(tags) && tags.map((tag, index) => (
                  <motion.button
                    key={tag.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTagToggle(tag.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md
                      ${selectedTags.includes(tag.slug) 
                        ? 'bg-indigo-50/90 text-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                        : 'bg-white/80 text-gray-700 border-gray-200/50 hover:border-indigo-500/70 hover:text-indigo-600 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)]'}`}
                  >
                    {tag.name}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTags([])}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                    bg-red-50 text-red-600 border border-red-200
                    hover:bg-red-100 hover:border-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  Clear Tags
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Advanced Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowFilterModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Advanced Filters</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Time Period Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Time Period</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'today', 'week', 'month'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setDateFilter(period as DateFilter)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${dateFilter === period
                            ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficultyLevel(level as DifficultyLevel)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${difficultyLevel === level
                            ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Resource Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'article', 'video', 'tool', 'course'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setResourceType(type as ResourceType)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                          ${resourceType === type
                            ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSortOrder('newest')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${sortOrder === 'newest'
                          ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => setSortOrder('popular')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                        ${sortOrder === 'popular'
                          ? 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                    >
                      Most Popular
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};