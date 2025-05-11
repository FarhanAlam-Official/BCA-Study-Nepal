/**
 * Routing Utilities
 * Provides a centralized set of functions for handling client-side routing
 * in the application's hash-based routing system.
 */

/**
 * Converts a path into a proper hash-based URL
 * 
 * @param path - The route path to convert (e.g., "about" or "/about")
 * @returns Formatted hash URL (e.g., "/#/about")
 * 
 * Examples:
 * - getHashUrl("about") => "/#/about"
 * - getHashUrl("/about") => "/#/about"
 */
export const getHashUrl = (path: string): string => {
  // Remove any leading slashes for consistency
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `/#/${cleanPath}`;
};

/**
 * Navigates to a new page using hash-based routing
 * 
 * @param path - The route path to navigate to
 * 
 * This function ensures consistent navigation behavior
 * across the application by using the hash-based URL format.
 */
export const navigateTo = (path: string): void => {
  window.location.href = getHashUrl(path);
};

/**
 * Redirects to the authentication page
 * 
 * Used when:
 * - User needs to log in
 * - Session expires
 * - Protected route is accessed without authentication
 */
export const redirectToAuth = (): void => {
  navigateTo('auth');
};

/**
 * Extracts the current path from the URL hash
 * 
 * @returns The current route path without the hash prefix
 * 
 * Examples:
 * - URL "/#/about" => returns "about"
 * - URL "/#/profile/settings" => returns "profile/settings"
 * - Empty or invalid hash => returns ""
 */
export const getCurrentPath = (): string => {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '';
  return hash.substring(hash.startsWith('#/') ? 2 : 1);
}; 