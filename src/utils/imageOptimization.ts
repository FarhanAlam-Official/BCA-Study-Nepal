/**
 * Image optimization utilities for BCA Study Nepal
 * These utilities help with lazy loading, responsive images, and optimizing image formats
 */

// Function to generate srcset for responsive images
export const generateSrcSet = (imagePath: string, widths: number[] = [320, 640, 960, 1280]): string => {
  return widths
    .map((width) => {
      // Replace the filename with width-specific version
      const path = imagePath.replace(/\.(jpg|jpeg|png|webp)$/, `_${width}w.$1`);
      return `${path} ${width}w`;
    })
    .join(', ');
};

// Function to convert images to WebP format
export const getWebPUrl = (url: string): string => {
  if (url.match(/\.(jpg|jpeg|png)$/)) {
    return url.replace(/\.(jpg|jpeg|png)$/, '.webp');
  }
  return url;
};

// Create a placeholder gradient for images while loading
export const getImagePlaceholder = (): string => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 720" fill="none"%3E%3Crect width="1080" height="720" fill="%23e2e8f0"/%3E%3C/svg%3E';
};

// Function to add loading="lazy" attribute to all images on a page
export const lazyLoadAllImages = (): void => {
  // Run only in browser environment
  if (typeof document !== 'undefined') {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  }
};

// Helper function to get appropriate image size based on viewport
export const getResponsiveImageSize = (
  availableWidths: number[] = [320, 640, 960, 1280]
): number => {
  // Run only in browser environment
  if (typeof window !== 'undefined') {
    const viewportWidth = window.innerWidth;
    // Find the smallest width that is larger than the viewport
    const appropriateWidth = availableWidths.find(width => width >= viewportWidth) || availableWidths[availableWidths.length - 1];
    return appropriateWidth;
  }
  // Default to middle size if not in browser
  return availableWidths[Math.floor(availableWidths.length / 2)];
};

export default {
  generateSrcSet,
  getWebPUrl,
  getImagePlaceholder,
  lazyLoadAllImages,
  getResponsiveImageSize
}; 