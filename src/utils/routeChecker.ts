/**
 * Utilities to check and fix incorrect URL paths
 */

/**
 * Fix incorrect URL formats like /login#/path to /#/path
 */
export const checkAndFixUrlFormat = (): void => {
  const url = window.location.href;
  const origin = window.location.origin;
  
  // Check for the erroneous /login#/ pattern
  if (url.includes('/login#/')) {
    const correctUrl = `${origin}/#/${url.split('/login#/')[1]}`;
    console.log(`Fixing incorrect URL format: ${url} -> ${correctUrl}`);
    window.history.replaceState(null, '', correctUrl);
  }
  
  // Handle any other potential malformed hash URLs that don't start with /#/
  const hash = window.location.hash;
  if (hash && hash !== '#' && !window.location.pathname.endsWith('/') && window.location.pathname !== '/') {
    const path = window.location.pathname;
    // If we have something like /somepath#/route
    if (path.length > 1 && hash.startsWith('#/')) {
      const correctUrl = `${origin}/#${hash.substring(1)}`;
      console.log(`Fixing incorrect hash URL format: ${url} -> ${correctUrl}`);
      window.history.replaceState(null, '', correctUrl);
    }
  }
};

/**
 * Initialize route checking when the app starts
 */
export const initRouteChecker = (): void => {
  // Run the check immediately
  checkAndFixUrlFormat();
  
  // Also check on hash changes
  window.addEventListener('hashchange', checkAndFixUrlFormat);
}; 