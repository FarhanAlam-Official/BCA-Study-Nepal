import '../styles/resource-radar.css';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

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

export interface ResourceFilters {
  category?: string;
  tag?: string;
  search?: string;
  ordering?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FavoriteResponse {
  status: 'resource favorited' | 'resource unfavorited';
  message?: string;
}

export interface ResourceFavorite {
  id: string;
  resource: Resource;
  created_at: string;
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.2 }
};

// Theme configuration
export const themeConfig = {
  colors: {
    primary: {
      light: '#4f46e5', // indigo-600
      dark: '#6d28d9' // purple-700
    },
    secondary: {
      light: '#7c3aed', // purple-600
      dark: '#4c1d95' // purple-900
    },
    background: {
      light: '#ffffff',
      dark: '#1f2937' // gray-800
    },
    text: {
      light: '#111827', // gray-900
      dark: '#f9fafb' // gray-50
    }
  },
  borderRadius: {
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem' // 16px
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