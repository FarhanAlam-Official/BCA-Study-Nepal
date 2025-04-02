# Image Optimization Usage Guide

## ResponsiveImage Component

The `ResponsiveImage` component is designed to optimize image loading performance by:
- Lazy loading images
- Loading appropriate sizes for different screen widths
- Using WebP format when supported
- Showing a loading state with your existing `LoadingSpinner`
- Gracefully handling errors

### Basic Usage

```tsx
import ResponsiveImage from '../components/common/ResponsiveImage';

// Basic usage
<ResponsiveImage 
  src="/images/hero-image.jpg" 
  alt="Hero image" 
  className="rounded-lg"
/>

// With fixed size
<ResponsiveImage 
  src="/images/profile.jpg" 
  alt="Profile picture" 
  width={200}
  height={200}
  objectFit="cover"
/>

// Priority loading for above-the-fold images
<ResponsiveImage 
  src="/images/logo.png" 
  alt="Site logo"
  priority={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | (required) | Source URL of the image |
| alt | string | (required) | Alternative text for the image |
| className | string | '' | CSS classes to apply to the container |
| sizes | string | '100vw' | Sizes attribute for responsive images |
| width | number | undefined | Width in pixels |
| height | number | undefined | Height in pixels |
| priority | boolean | false | Set to true for above-the-fold images |
| objectFit | string | 'cover' | CSS object-fit property |
| onLoad | function | undefined | Callback when image is loaded |

## Image Optimization Utilities

You can also use the utility functions directly:

```tsx
import imageOptimization from '../utils/imageOptimization';

// Generate srcset for responsive images
const srcSet = imageOptimization.generateSrcSet('/images/hero.jpg');

// Get WebP version of an image URL
const webpUrl = imageOptimization.getWebPUrl('/images/photo.jpg');

// Get a placeholder for images
const placeholder = imageOptimization.getImagePlaceholder();

// Apply lazy loading to all images on a page
imageOptimization.lazyLoadAllImages();

// Get appropriate image size based on viewport
const size = imageOptimization.getResponsiveImageSize();
```

## Best Practices

1. Use `priority={true}` for above-the-fold images to load them immediately
2. Always provide meaningful `alt` text for accessibility
3. Consider using WebP images when possible for better compression
4. Use appropriate sizes for different screen widths to reduce bandwidth usage
5. For critical images, preload them in the document head
6. For decorative images that add no content value, use `alt=""` 