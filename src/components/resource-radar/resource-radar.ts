import '../styles/resource-radar.css';

/**
 * Represents a tag that can be associated with resources
 * @interface Tag
 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

/**
 * Represents a category that resources can belong to
 * @interface Category
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

/**
 * Represents a learning resource with its associated metadata
 * @interface Resource
 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  icon_url?: string;
  category: Category;
  tags: Tag[];
  featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Filter options for querying resources
 * @interface ResourceFilters
 */
export interface ResourceFilters {
  category?: string;    // Category slug to filter by
  tag?: string;         // Comma-separated tag slugs
  search?: string;      // Search query string
  ordering?: string;    // Sort order field with optional '-' prefix for descending
}

/**
 * Generic paginated response from the API
 * @interface PaginatedResponse
 * @template T - The type of items in the results array
 */
export interface PaginatedResponse<T> {
  count: number;           // Total number of items
  next: string | null;     // URL for next page
  previous: string | null; // URL for previous page
  results: T[];           // Array of items for current page
}

/**
 * Response format for favorite/unfavorite actions
 * @interface FavoriteResponse
 */
export interface FavoriteResponse {
  status: 'resource favorited' | 'resource unfavorited';
  message?: string;
}

/**
 * Represents a favorited resource with metadata
 * @interface ResourceFavorite
 */
export interface ResourceFavorite {
  id: string;
  resource: Resource;
  created_at: string;
}

/**
 * Animation variants for fade-in-up effect
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
};

/**
 * Animation variant for staggered children animations
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
 */
export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

/**
 * Theme configuration for the resource radar
 * Includes colors, spacing, and layout values
 */
export const themeConfig = {
  colors: {
    primary: {
      light: '#4f46e5', // indigo-600
      dark: '#6d28d9'   // purple-700
    },
    secondary: {
      light: '#7c3aed', // purple-600
      dark: '#4c1d95'   // purple-900
    },
    background: {
      light: '#ffffff',
      dark: '#1f2937'   // gray-800
    },
    text: {
      light: '#111827', // gray-900
      dark: '#f9fafb'   // gray-50
    }
  },
  borderRadius: {
    sm: '0.375rem',     // 6px
    md: '0.5rem',       // 8px
    lg: '0.75rem',      // 12px
    xl: '1rem'          // 16px
  },
  spacing: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  }
}; 