/**
 * Type definitions for the Colleges module
 * Contains interfaces and validation schemas for managing college data,
 * including details, favorites, and filtering options.
 */

import { z } from 'zod';

/**
 * Represents a college entity with all its properties
 * Core data structure for the Colleges module
 */
export interface College {
  /** Unique identifier for the college */
  id: string;
  /** Official name of the college */
  name: string;
  /** Detailed description of the college */
  description: string;
  /** Physical location/address of the college */
  location: string;
  /** Official website URL */
  website: string;
  /** Original uploaded logo image URL */
  logo?: string;
  /** Processed/optimized logo image URL */
  logo_url?: string;
  /** Automatically extracted favicon from website */
  extracted_favicon?: string;
  /** Best available logo for display (prioritized from available options) */
  display_logo?: string;
  /** Original uploaded cover image URL */
  cover_image?: string;
  /** Processed/optimized cover image URL */
  cover_image_url?: string;
  /** Best available cover image for display */
  display_cover?: string;
  /** Official contact email address */
  email: string;
  /** Contact phone numbers */
  contact_numbers: {
    /** Main contact number */
    primary?: string;
    /** Alternative contact number */
    secondary?: string;
    /** Additional contact number */
    tertiary?: string;
  };
  /** Year the college was established */
  established_year: number | null;
  /** List of academic programs offered */
  programs: string[];
  /** List of available facilities */
  facilities: string[];
  /** Whether this is a featured/highlighted college */
  is_featured: boolean;
  /** Average rating of the college (0-5) */
  rating: number;
  /** Number of profile views */
  views_count: number;
  /** Current admission status */
  admission_status: 'OPEN' | 'CLOSED' | 'COMING_SOON';
  /** Whether the current user has favorited this college */
  is_favorite?: boolean;
  /** ISO timestamp of when the record was created */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
}

/**
 * Represents a favorite college relationship
 * Links users to their favorited colleges
 */
export interface CollegeFavorite {
  /** Unique identifier for the favorite relationship */
  id: string;
  /** ID of the user who favorited */
  user: string;
  /** The favorited college (either full object or just ID) */
  college: College | string;
  /** ISO timestamp of when the college was favorited */
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
 * Ensures favorite relationships are properly structured
 */
export const CollegeFavoriteSchema = z.object({
  id: z.string(),
  user: z.string(),
  college: z.union([z.string(), CollegeSchema]),
  created_at: z.string()
});

/**
 * Generic interface for paginated API responses
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
 * Response type for toggle favorite operation
 * Indicates the result of favoriting/unfavoriting a college
 */
export interface ToggleFavoriteResponse {
  /** The action that was performed */
  status: 'college favorited' | 'college unfavorited';
  /** Additional context about the operation */
  message: string;
}

/**
 * Interface for college filtering options
 * Used to refine college listings based on user preferences
 */
export interface CollegeFilters {
  /** Search term for college name/description */
  search?: string;
  /** Filter by location */
  location?: string;
  /** Filter by available programs */
  programs?: string[];
  /** Filter by admission status */
  admission_status?: string;
  /** Minimum rating filter */
  rating_min?: number;
  /** Filter by available facilities */
  facilities?: string[];
  /** Show only featured colleges */
  showFeatured?: boolean;
  /** Show only favorited colleges */
  showFavorites?: boolean;
  /** Field to sort results by */
  sortBy?: 'rating' | 'established_year' | 'name' | 'views_count';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
} 