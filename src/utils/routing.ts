/**
 * Routing utilities for consistent navigation and redirection
 */

/**
 * Get correct hash-based URL for the given path
 * This ensures proper HashRouter URL format
 */
export const getHashUrl = (path: string): string => {
  // Remove any leading slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `/#/${cleanPath}`;
};

/**
 * Navigate to a new page using proper hash routing
 */
export const navigateTo = (path: string): void => {
  window.location.href = getHashUrl(path);
};

/**
 * Redirect to auth page
 */
export const redirectToAuth = (): void => {
  navigateTo('auth');
};

/**
 * Get current path from hash (without the hash)
 */
export const getCurrentPath = (): string => {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '';
  return hash.substring(hash.startsWith('#/') ? 2 : 1);
}; 