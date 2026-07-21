import { useState } from 'react';

interface ImageVariant {
  width: number;
  height: number;
  webp: string;
  jpeg: string;
}

interface ImageInfo {
  original: string;
  width: number;
  height: number;
  aspectRatio: string;
  variants: ImageVariant[];
}

interface ResponsiveImageProps {
  src: string;
  alt: string;
  loading?: 'eager' | 'lazy';
  className?: string;
  imageManifest: Record<string, ImageInfo>;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * ResponsiveImage Component
 * Renders <picture> element with WebP + JPEG variants for responsive image delivery
 * Falls back to original image if manifest doesn't have variants
 */
export function ResponsiveImage({
  src,
  alt,
  loading = 'lazy',
  className = '',
  imageManifest,
  priority = false,
  onLoad,
}: ResponsiveImageProps) {
  const imageInfo = imageManifest[src];
  const [, setIsLoaded] = useState(false);

  // If no variants available, render plain img tag
  if (!imageInfo || !imageInfo.variants || imageInfo.variants.length === 0) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
      />
    );
  }

  // Build srcset strings for WebP and JPEG
  const webpSrcSet = imageInfo.variants
    .map(v => `${v.webp} ${v.width}w`)
    .join(', ');

  const jpegSrcSet = imageInfo.variants
    .map(v => `${v.jpeg} ${v.width}w`)
    .join(', ');

  // Calculate sizes attribute to help browser choose correct variant
  // Targeting: mobile (320px), tablet (640px), desktop (1024px+)
  const sizes = priority
    ? '100vw'
    : '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px';

  return (
    <picture>
      {/* WebP variants (modern browsers) */}
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />

      {/* JPEG variants (fallback) */}
      <source type="image/jpeg" srcSet={jpegSrcSet} sizes={sizes} />

      {/* Fallback img tag */}
      <img
        src={imageInfo.original}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        className={className}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        style={{ aspectRatio: imageInfo.aspectRatio }}
      />
    </picture>
  );
}

export default ResponsiveImage;
