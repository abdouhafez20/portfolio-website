import { useEffect, useState } from 'react';

export interface CollectionPreviewProps {
  images: readonly string[];
  title: string;
  onClick?: () => void;
}

/* ─────────────────────────────────────────
   CollectionPreview — cycling images
───────────────────────────────────────── */
export default function CollectionPreview({ images, title, onClick }: CollectionPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % images.length),
      2800,
    );
    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View ${title}` : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick();
        }
      }}
      className="relative mx-auto aspect-[1/1.414] w-full max-w-[220px] overflow-hidden rounded-xl border border-card-border bg-slate-50 shadow-sm dark:border-dark-border dark:bg-slate-950 cursor-pointer"
    >
      {images.map((src, i) => {
        const nextIndex = (activeIndex + 1) % images.length;
        const shouldEagerLoad = i === activeIndex || i === nextIndex;

        return (
          <img
            key={src}
            src={src}
            alt={`Preview page ${i + 1} for ${title}`}
            loading={shouldEagerLoad ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((src, i) => (
            <span
              key={`dot-${src}`}
              className={`h-1 rounded-full bg-white transition-all duration-300 ${
                i === activeIndex ? 'w-4 opacity-100' : 'w-1.5 opacity-40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
