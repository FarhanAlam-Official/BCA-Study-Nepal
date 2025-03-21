/**
 * Type definitions and validation schemas for college-related data structures
 */

import { z } from 'zod';

/**
 * Represents a college entity with all its properties
 */
export interface College {
  id: string;
  name: string;
  description: string;
  location: string;
  website: string;
  logo?: string;                 // Original logo URL
  logo_url?: string;            // Processed logo URL
  extracted_favicon?: string;    // Favicon extracted from website
  display_logo?: string;        // URL to use for display (prioritized from available options)
  cover_image?: string;         // Original cover image URL
  cover_image_url?: string;     // Processed cover image URL
  display_cover?: string;       // URL to use for display (prioritized from available options)
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

/**
 * Represents a favorite college relationship between a user and a college
 */
export interface CollegeFavorite {
  id: string;
  user: string;
  college: College | string;  // Can be either a College object or college ID
  created_at: string;
}

/**
 * Zod validation schema for College data
 * Ensures all required fields are present and in correct format
 */
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

/**
 * Zod validation schema for CollegeFavorite data
 */
export const CollegeFavoriteSchema = z.object({
  id: z.string(),
  user: z.string(),
  college: z.union([z.string(), CollegeSchema]),
  created_at: z.string()
});

/**
 * Generic interface for paginated API responses
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Response type for toggle favorite operation
 */
export interface ToggleFavoriteResponse {
  status: 'college favorited' | 'college unfavorited';
  message: string;
}

/**
 * Interface for college filtering options
 */
export interface CollegeFilters {
  search?: string;              // Search term for college name/description
  location?: string;            // Filter by location
  programs?: string[];         // Filter by available programs
  admission_status?: string;    // Filter by admission status
  rating_min?: number;         // Minimum rating filter
  facilities?: string[];       // Filter by available facilities
  showFeatured?: boolean;      // Show only featured colleges
  showFavorites?: boolean;     // Show only favorited colleges
  sortBy?: 'rating' | 'established_year' | 'name' | 'views_count';  // Sort field
  sortOrder?: 'asc' | 'desc';  // Sort direction
} 