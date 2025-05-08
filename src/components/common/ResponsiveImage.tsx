import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import imageOptimization from '../../utils/imageOptimization';

/**
 * Props interface for the ResponsiveImage component
 * @interface ResponsiveImageProps
 * @property {string} src - Source URL of the image
 * @property {string} alt - Alternative text for accessibility
 * @property {string} [className] - Additional CSS classes
 * @property {string} [sizes='100vw'] - Sizes attribute for responsive images
 * @property {number} [width] - Optional width constraint
 * @property {number} [height] - Optional height constraint
 * @property {boolean} [priority=false] - Whether to prioritize loading (eager vs lazy)
 * @property {'contain' | 'cover' | 'fill' | 'none' | 'scale-down'} [objectFit='cover'] - CSS object-fit property
 * @property {() => void} [onLoad] - Callback function when image loads successfully
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

/**
 * ResponsiveImage Component
 * 
 * A comprehensive image component that handles responsive loading, optimization,
 * and various loading states with fallbacks.
 * 
 * Features:
 * - Responsive image loading with srcset
 * - Loading spinner during image load
 * - Error state handling
 * - Lazy loading with priority option
 * - Configurable object-fit behavior
 * - Smooth opacity transitions
 * - Accessibility support
 * 
 * @component
 * @example
 * ```tsx
 * <ResponsiveImage
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   priority={true}
 *   objectFit="cover"
 *   onLoad={() => console.log('Image loaded')}
 * />
 * ```
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  onLoad,
}) => {
  // Track loading and error states
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  // Generate srcset for responsive images
  const srcSet = imageOptimization.generateSrcSet(src);

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(!priority);
    setIsError(false);
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
      role="img" 
      aria-label={alt}
    >
      {/* Loading state with spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="small" />
        </div>
      )}
      
      {/* Error state fallback */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
      
      {/* Main image element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectFit }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ResponsiveImage; 