import { z } from 'zod';

// College Types
export interface College {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  logo?: string;
  logo_url?: string;
  extracted_favicon?: string;
  display_logo?: string;
  cover_image?: string;
  cover_image_url?: string;
  display_cover?: string;
  email: string;
  contact_numbers: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  established_year: number | null;
  programs: string[];
  facilities: string[];
  is_featured: boolean;
  rating: number;
  views_count: number;
  admission_status: 'OPEN' | 'CLOSED' | 'COMING_SOON';
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollegeFavorite {
  id: string;
  user: string;
  college: College | string;
  created_at: string;
}

// Validation Schemas
export const CollegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  website: z.string().url(),
  logo: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  extracted_favicon: z.string().url().optional(),
  display_logo: z.string().url().optional(),
  cover_image: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  display_cover: z.string().url().optional(),
  email: z.string().email(),
  contact_numbers: z.object({
    primary: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format'),
    secondary: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format').optional(),
    tertiary: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format').optional(),
  }),
  established_year: z.number().nullable(),
  programs: z.array(z.string()),
  facilities: z.array(z.string()),
  is_featured: z.boolean(),
  rating: z.number(),
  views_count: z.number(),
  admission_status: z.enum(['OPEN', 'CLOSED', 'COMING_SOON']),
  created_at: z.string(),
  updated_at: z.string()
});

export const CollegeFavoriteSchema = z.object({
  id: z.string(),
  user: z.string(),
  college: z.union([z.string(), CollegeSchema]),
  created_at: z.string()
});

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ToggleFavoriteResponse {
  status: 'college favorited' | 'college unfavorited';
  message: string;
}

// Filter Types
export interface CollegeFilters {
  search?: string;
  location?: string;
  programs?: string[];
  admission_status?: string;
  rating_min?: number;
  facilities?: string[];
  showFeatured?: boolean;
  showFavorites?: boolean;
  sortBy?: 'rating' | 'established_year' | 'name' | 'view_count';
  sortOrder?: 'asc' | 'desc';
} 