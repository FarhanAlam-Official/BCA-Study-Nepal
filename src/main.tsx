import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import imageOptimization from './utils/imageOptimization';
import { initRouteChecker } from './utils/routeChecker';

// Initialize route checking to fix any URL issues
initRouteChecker();

// Use a more performant approach by getting the root element once
const rootElement = document.getElementById('root');

// Apply lazy loading to all images when DOM is fully loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    imageOptimization.lazyLoadAllImages();
  });
}

// Function to remove the initial loading indicator
const removeLoadingIndicator = () => {
  const loadingIndicator = document.getElementById('root-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
};

// Ensure the element exists before rendering
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Remove StrictMode in production to avoid double-rendering
  // and keep it only in development for better debugging
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
  setTimeout(removeLoadingIndicator, 100);
}
