/**
 * Route Checking Utilities
 * Provides functions to validate and fix URL formats in the application.
 * Handles edge cases and malformed URLs to ensure consistent routing behavior.
 */

/**
 * Fixes incorrect URL formats in the application
 * 
 * Handles two main cases:
 * 1. Converts /login#/path to /#/path format
 * 2. Fixes malformed hash URLs that don't follow the /#/ pattern
 * 
 * This ensures consistent routing behavior across the application
 * and prevents routing-related issues.
 */
export const checkAndFixUrlFormat = (): void => {
  const url = window.location.href;
  const origin = window.location.origin;
  
  // Handle /login#/ pattern
  if (url.includes('/login#/')) {
    const correctUrl = `${origin}/#/${url.split('/login#/')[1]}`;
    // Silently update the URL without affecting navigation
    window.history.replaceState(null, '', correctUrl);
  }
  
  // Handle malformed hash URLs
  const hash = window.location.hash;
  if (hash && 
      hash !== '#' && 
      !window.location.pathname.endsWith('/') && 
      window.location.pathname !== '/') {
    const path = window.location.pathname;
    
    // Fix URLs like /somepath#/route to /#/route
    if (path.length > 1 && hash.startsWith('#/')) {
      const correctUrl = `${origin}/#${hash.substring(1)}`;
      // Silently update the URL without affecting navigation
      window.history.replaceState(null, '', correctUrl);
    }
  }
};

/**
 * Initializes the route checking system
 * 
 * Sets up:
 * 1. Initial URL check when the app loads
 * 2. Continuous monitoring of URL changes via hashchange event
 * 
 * This ensures URLs remain properly formatted throughout the
 * application's lifecycle.
 */
export const initRouteChecker = (): void => {
  // Perform initial URL check
  checkAndFixUrlFormat();
  
  // Monitor future URL changes
  window.addEventListener('hashchange', checkAndFixUrlFormat);
}; 