import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import imageOptimization from '../../utils/imageOptimization';

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
  const [isLoading, setIsLoading] = useState(!priority);
  const [isError, setIsError] = useState(false);

  // Generate srcset for responsive images
  const srcSet = imageOptimization.generateSrcSet(src);
  
  // Try WebP format if browser supports it
  const webpSrc = imageOptimization.getWebPUrl(src);
  
  // Placeholder for loading state
  const placeholder = imageOptimization.getImagePlaceholder();

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
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="small" />
        </div>
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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