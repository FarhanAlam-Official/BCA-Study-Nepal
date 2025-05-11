/**
 * Application Entry Point
 * 
 * This file handles:
 * - React application initialization
 * - Route checking setup
 * - Image optimization
 * - Loading indicator management
 * - Development mode configuration
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import imageOptimization from './utils/imageOptimization';
import { initRouteChecker } from './utils/routeChecker';

/**
 * Initialize route checking to handle URL format issues
 * This ensures consistent routing behavior across the application
 */
initRouteChecker();

/**
 * Get root element once for better performance
 * This avoids unnecessary DOM queries
 */
const rootElement = document.getElementById('root');

/**
 * Setup image optimization when DOM is fully loaded
 * Applies lazy loading to all images for better performance
 */
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    imageOptimization.lazyLoadAllImages();
  });
}

/**
 * Removes the initial loading indicator
 * Called after React has mounted to ensure smooth transition
 */
const removeLoadingIndicator = () => {
  const loadingIndicator = document.getElementById('root-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
};

// Ensure root element exists before rendering
if (rootElement) {
  const root = createRoot(rootElement);
  
  /**
   * Conditional StrictMode usage
   * - Enabled in development for better debugging
   * - Disabled in production to avoid double-rendering
   */
  if (import.meta.env.DEV) {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    root.render(
      <App />
    );
  }
  
  // Remove loading indicator after React has mounted
  // Small delay ensures smooth transition
  setTimeout(removeLoadingIndicator, 100);
}
