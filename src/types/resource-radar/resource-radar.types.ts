/**
 * Type definitions for the Resource Radar module
 * Contains interfaces and types for learning resources, categories, tags,
 * and related UI animations and theme configurations.
 */

/**
 * Represents a tag that can be associated with resources
 * Used for categorizing and filtering resources
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: number;
  /** Display name of the tag */
  name: string;
  /** URL-friendly version of the tag name */
  slug: string;
  /** Optional description of what the tag represents */
  description?: string;
}

/**
 * Represents a category that resources can belong to
 * Used for primary classification of resources
 */
export interface Category {
  /** Unique identifier for the category */
  id: number;
  /** Display name of the category */
  name: string;
  /** URL-friendly version of the category name */
  slug: string;
  /** Optional description of what the category represents */
  description?: string;
}

/**
 * Represents a learning resource with its associated metadata
 * Core data structure for the Resource Radar module
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: string;
  /** Title of the resource */
  title: string;
  /** Detailed description of the resource */
  description: string;
  /** URL where the resource can be accessed */
  url: string;
  /** Optional URL to the resource's icon */
  icon_url?: string;
  /** Category the resource belongs to */
  category: Category;
  /** Array of tags associated with the resource */
  tags: Tag[];
  /** Whether this is a featured/highlighted resource */
  featured: boolean;
  /** Number of times the resource has been viewed */
  view_count: number;
  /** ISO timestamp of when the resource was created */
  created_at: string;
  /** ISO timestamp of when the resource was last updated */
  updated_at: string;
}

/**
 * Filter options for querying resources
 * Used to refine resource listings based on user preferences
 */
export interface ResourceFilters {
  /** Category slug to filter by */
  category?: string;
  /** Comma-separated tag slugs */
  tag?: string;
  /** Search query string */
  search?: string;
  /** Sort order field with optional '-' prefix for descending */
  featured?: boolean;
  ordering?: string;
  page?: string;
  page_size?: number;
}

/**
 * Generic paginated response from the API
 * @template T - The type of items in the results array
 */
export interface PaginatedResponse<T> {
  /** Total number of items across all pages */
  count: number;
  /** URL for the next page of results, null if on last page */
  next: string | null;
  /** URL for the previous page of results, null if on first page */
  previous: string | null;
  /** Array of items for the current page */
  results: T[];
}

/**
 * Response format for favorite/unfavorite actions
 */
export interface FavoriteResponse {
  /** Indicates whether the resource was favorited or unfavorited */
  status: 'resource favorited' | 'resource unfavorited';
  /** Optional message providing additional context */
  message?: string;
}

/**
 * Represents a favorited resource with metadata
 */
export interface ResourceFavorite {
  /** Unique identifier for the favorite relationship */
  id: string;
  /** The favorited resource */
  resource: Resource;
  /** ISO timestamp of when the resource was favorited */
  created_at: string;
}

/**
 * Animation variants for fade-in-up effect
 * Used with Framer Motion animations
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
};

/**
 * Animation variant for staggered children animations
 * Used with Framer Motion for list animations
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Animation variant for hover and tap effects
 * Used with Framer Motion for interactive elements
 */
export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};