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

// Initialize route checking early
initRouteChecker();

// Get root element once for better performance
const rootElement = document.getElementById('root');

// Function to initialize the application
const initializeApp = () => {
  if (!rootElement) return;

  const root = createRoot(rootElement);
  
  // Render the app with or without StrictMode based on environment
  if (import.meta.env.DEV) {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    root.render(<App />);
  }

  // Apply image optimizations after initial render
  requestIdleCallback(() => {
    imageOptimization.lazyLoadAllImages();
  });
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
