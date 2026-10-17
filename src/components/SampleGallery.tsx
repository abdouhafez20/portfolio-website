import { useEffect, useRef, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/scrollLock';
import NoticeCard from '@/components/ui/NoticeCard';

interface Props {
  images: string[];
  embedUrl?: string;
  title?: string;
  initialIndex?: number;
  onClose: () => void;
  showNotice?: boolean;
  onRequest?: () => void;
}

export default function SampleGallery({ images, embedUrl, title, initialIndex = 0, onClose, showNotice = false, onRequest }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [isDark, setIsDark] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (embedUrl || images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 3000);
  };

  // Start on mount, clean up on unmount
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [images.length, embedUrl]);

  // Focus modal on open, save previous focus, and detect dark mode
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    // focus the close button when possible
    closeButtonRef.current?.focus?.({ preventScroll: true } as any);
    // detect dark mode at mount (site toggles `dark` class on <html>)
    try {
      setIsDark(document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      setIsDark(false);
    }

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
      prevFocusRef.current?.focus?.();
    };
  }, []);

  // Keyboard navigation + focus trap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (images.length > 1 && e.key === 'ArrowLeft') { setIndex(i => (i - 1 + images.length) % images.length); startTimer(); }
      if (images.length > 1 && e.key === 'ArrowRight') { setIndex(i => (i + 1) % images.length); startTimer(); }

      if (e.key === 'Tab') {
        const container = rootRef.current;
        if (!container) return;
        const nodes = Array.from(container.querySelectorAll<HTMLElement>('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]')).filter(n => n.offsetParent !== null);
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [images.length, embedUrl]);

  const handleClose = () => {
    stopTimer();
    onClose();
  };

  const prev = () => {
    setIndex(i => (i - 1 + images.length) % images.length);
    startTimer();
  };

  const next = () => {
    setIndex(i => (i + 1) % images.length);
    startTimer();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    moved.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    if (Math.abs(e.touches[0].clientX - startX.current) > 10) moved.current = true;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (!moved.current) return;
    if (dx > 40) prev();
    else if (dx < -40) next();
  };

  return (
    <>
      <style>{`@keyframes kenburns {
  from { transform: scale(1); }
  to   { transform: scale(1.08); }
}`}</style>
      <div
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-label={title ?? 'Sample gallery'}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative z-10 rounded-xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden w-[96vw] h-[92vh] sm:w-[75vw] sm:h-[90vh] sm:max-w-[800px]"
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          aria-label="Close gallery"
          className="absolute right-3 top-3 z-30 rounded-full bg-white/90 px-2 py-1 text-sm text-ink shadow-sm hover:bg-white"
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-sm font-medium text-ink/70 px-3 py-1">
            {title}
          </div>
        )}

        {/* Edge gradients (use inline style; Tailwind bracket notation here was invalid) */}
        {!embedUrl && <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '15%',
            background: isDark
              ? 'linear-gradient(to right, #0f172a, transparent)'
              : 'linear-gradient(to right, rgba(255,255,255,1), transparent)',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />}

        {!embedUrl && <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '15%',
            background: isDark
              ? 'linear-gradient(to left, #0f172a, transparent)'
              : 'linear-gradient(to left, rgba(255,255,255,1), transparent)',
            pointerEvents: 'none',
            zIndex: 25,
          }}
        />}

        {/* Slides */}
        <div style={{ overflow: 'hidden', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {embedUrl ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', padding: '48px 16px 8px', boxSizing: 'border-box' }}>
                <iframe
                  src={embedUrl}
                  title={title ?? 'Embedded flipbook'}
                  allowFullScreen
                  allow="autoplay; fullscreen; clipboard-write"
                  scrolling="no"
                  style={{ width: '100%', height: '428px', border: '1px solid lightgray' }}
                />
              </div>
            ) : <>
            <div
              style={{
                display: 'flex',
                height: '100%',
                transform: `translateX(calc(-${index * 75}% + 12.5%))`,
                transition: 'transform 500ms ease-in-out',
              }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: '75%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 16px 16px',
                    position: 'relative',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    filter: i !== index ? 'blur(1.5px) brightness(0.7)' : undefined,
                  }}
                >
                   <img
                    key={`img-${i}-${index === i ? 'active' : 'idle'}`}
                    src={src}
                    alt={title ? `${title} — sample ${i + 1}` : `Sample ${i + 1}`}
                    loading={i === index || i === (index + 1) % images.length ? 'eager' : 'lazy'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      animation: i === index ? 'kenburns 3s ease-in-out forwards' : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/80 w-9 h-9 flex items-center justify-center text-xl shadow hover:bg-white"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/80 w-9 h-9 flex items-center justify-center text-xl shadow hover:bg-white"
                >
                  ›
                </button>
              </>
            )}
            </>}
          </div>

          {/* Footer */}
          {!embedUrl && <div className="flex flex-col items-center gap-3 py-3 px-4 sm:px-6 w-full">
            {showNotice && (
              <div className="w-full max-w-[720px]">
                <NoticeCard onRequest={onRequest} />
              </div>
            )}

            <span className="rounded-full bg-black/10 px-3 py-1 text-sm font-medium text-ink">
              {index + 1} / {images.length}
            </span>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIndex(i); startTimer(); }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-ink' : 'bg-ink/30'}`}
                  />
                ))}
              </div>
            )}
          </div>}
        </div>
      </div>
    </div>
    </>
  );
}
