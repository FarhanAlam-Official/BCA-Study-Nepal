/**
 * Image Optimization Utilities
 * 
 * A comprehensive set of utilities for optimizing image loading and display:
 * - Responsive image handling with srcset generation
 * - WebP format conversion
 * - Lazy loading implementation
 * - Placeholder generation
 * - Viewport-based size optimization
 */

/**
 * Generates a srcset attribute string for responsive images
 * 
 * @param imagePath - Base path of the image
 * @param widths - Array of image widths to generate srcset for (default: [320, 640, 960, 1280])
 * @returns Formatted srcset string (e.g., "image_320w.jpg 320w, image_640w.jpg 640w")
 * 
 * Example:
 * generateSrcSet("/images/photo.jpg") =>
 * "/images/photo_320w.jpg 320w, /images/photo_640w.jpg 640w, ..."
 */
export const generateSrcSet = (imagePath: string, widths: number[] = [320, 640, 960, 1280]): string => {
  return widths
    .map((width) => {
      // Generate width-specific version of the image path
      const path = imagePath.replace(/\.(jpg|jpeg|png|webp)$/, `_${width}w.$1`);
      return `${path} ${width}w`;
    })
    .join(', ');
};

/**
 * Converts image URL to WebP format if the original is in jpg/jpeg/png
 * 
 * @param url - Original image URL
 * @returns URL with .webp extension if convertible, otherwise original URL
 * 
 * Example:
 * getWebPUrl("/images/photo.jpg") => "/images/photo.webp"
 */
export const getWebPUrl = (url: string): string => {
  if (url.match(/\.(jpg|jpeg|png)$/)) {
    return url.replace(/\.(jpg|jpeg|png)$/, '.webp');
  }
  return url;
};

/**
 * Creates a lightweight SVG placeholder for images
 * Used to prevent layout shift while images are loading
 * 
 * @returns Base64 encoded SVG placeholder with a light gray background
 */
export const getImagePlaceholder = (): string => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 720" fill="none"%3E%3Crect width="1080" height="720" fill="%23e2e8f0"/%3E%3C/svg%3E';
};

/**
 * Adds lazy loading attributes to all images on the page
 * Improves page load performance by deferring off-screen image loading
 * 
 * Applies:
 * - loading="lazy" for native lazy loading
 * - decoding="async" for optimized image decoding
 */
export const lazyLoadAllImages = (): void => {
  if (typeof document !== 'undefined') {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  }
};

/**
 * Determines the appropriate image size based on viewport width
 * 
 * @param availableWidths - Array of available image widths (default: [320, 640, 960, 1280])
 * @returns The most appropriate image width for the current viewport
 * 
 * This helps in loading the most suitable image size:
 * - Prevents loading unnecessarily large images on small screens
 * - Ensures sufficient quality on larger screens
 * - Falls back to a middle size when viewport size can't be determined
 */
export const getResponsiveImageSize = (
  availableWidths: number[] = [320, 640, 960, 1280]
): number => {
  if (typeof window !== 'undefined') {
    const viewportWidth = window.innerWidth;
    // Select the smallest width that exceeds viewport width
    const appropriateWidth = availableWidths.find(width => width >= viewportWidth) || availableWidths[availableWidths.length - 1];
    return appropriateWidth;
  }
  // Default to middle size when not in browser context
  return availableWidths[Math.floor(availableWidths.length / 2)];
};

export default {
  generateSrcSet,
  getWebPUrl,
  getImagePlaceholder,
  lazyLoadAllImages,
  getResponsiveImageSize
}; 