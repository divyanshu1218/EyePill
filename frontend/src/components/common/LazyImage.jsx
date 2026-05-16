import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyImage Component
 * Lazy loads images using Intersection Observer API
 * Displays a placeholder while loading
 */
const LazyImage = ({ src, alt, className, style, placeholder = null }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E');
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // Create Intersection Observer to detect when image is in viewport
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageSrc('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage not found%3C/text%3E%3C/svg%3E');
    setIsLoading(false);
  };

  return (
    <div className={`lazy-image-container ${isLoading ? 'loading' : 'loaded'}`} style={style}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'blur' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
    </div>
  );
};

export default LazyImage;
