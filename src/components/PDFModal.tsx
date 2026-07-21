import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/scrollLock';
import { X, ExternalLink, Download, AlertCircle, Loader2 } from 'lucide-react';

interface PDFModalProps {
  title: string;
  src: string;
  closeLabel?: string;
  onClose: () => void;
}

/**
 * Build viewer URLs — returns a primary and a fallback (Google Docs viewer).
 * Hash params only work in Chromium-based browsers; Firefox and Safari ignore
 * them and may render a zoomed-in or broken view. Google Docs viewer is the
 * most reliable cross-browser fallback for remote PDFs.
 */
const PDF_VIEWER_BASE_URL = import.meta.env.VITE_PDF_VIEWER_BASE_URL;

function getViewerUrls(src: string): { primary: string; fallback: string; cleanSrc: string } {
  const clean = src.split('#')[0];

  // Build a safe fallback viewer URL. Prefer the configured viewer, but
  // if it's missing or invalid, fall back to Google Docs viewer which is
  // broadly available for remote PDFs.
  const fallbackBase = PDF_VIEWER_BASE_URL || 'https://docs.google.com/gview';
  let fallbackUrl: URL;
  try {
    fallbackUrl = new URL(fallbackBase);
  } catch (err) {
    // If the provided base isn't a valid absolute URL, use Google Docs viewer.
    fallbackUrl = new URL('https://docs.google.com/gview');
  }

  fallbackUrl.searchParams.set('url', clean);
  fallbackUrl.searchParams.set('embedded', 'true');

  return {
    // page-fit shows the full page width without clipping
    primary: `${clean}#toolbar=0&navpanes=0&scrollbar=1&view=Fit&zoom=page-fit`,
    fallback: fallbackUrl.toString(),
    cleanSrc: clean,
  };
}

export default function PDFModal({ title, src, closeLabel = 'Close', onClose }: PDFModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { primary, fallback, cleanSrc } = useMemo(() => getViewerUrls(src), [src]);
  const currentSrc = usingFallback ? fallback : primary;

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setUsingFallback(false);
  }, [src]);

  /* ── Lock body scroll ── */
  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  /* ── Keyboard handling: Escape + focus trap (Tab) ── */
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    // Focus the close button for immediate keyboard access
    closeButtonRef.current?.focus?.({ preventScroll: true } as any);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const container = overlayRef.current;
        if (!container) return;

        const nodes = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
          )
        ).filter((n) => n.offsetParent !== null);

        if (nodes.length === 0) {
          event.preventDefault();
          return;
        }

        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      // restore previous focus
      prevFocusRef.current?.focus?.();
    };
  }, [onClose]);

  /**
   * Some browsers fire onLoad even when the PDF fails to render (e.g. Safari
   * loads an empty frame). We set a 12-second timer on mount; if the iframe
   * hasn't triggered a *real* load by then, we switch to the Google fallback.
   */
  useEffect(() => {
    setLoading(true);
    setFailed(false);
    clearLoadTimer();

    if (!usingFallback) {
      loadTimerRef.current = setTimeout(() => {
        setUsingFallback(true);
        setLoading(true);
      }, 12_000);
    }

    return clearLoadTimer;
  }, [clearLoadTimer, currentSrc, usingFallback]);

  function handleLoad() {
    clearLoadTimer();
    setLoading(false);
  }

  function handleError() {
    clearLoadTimer();
    if (!usingFallback) {
      setUsingFallback(true);
    } else {
      setLoading(false);
      setFailed(true);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-0 backdrop-blur-sm md:p-5"
      onClick={onClose}
      onContextMenu={(event) => event.preventDefault()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      {/* ── Close button ── */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="fixed right-3 top-3 z-[10000] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lift transition-colors hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest/35 dark:bg-dark-card dark:text-dark-text dark:hover:text-dark-forest md:right-5 md:top-5 md:w-auto md:px-4"
        aria-label={closeLabel}
      >
        <X size={14} />
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] md:inline">
          {closeLabel}
        </span>
      </button>

      {/* ── Modal panel ── */}
      <div
        className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-white shadow-lift dark:bg-dark-card md:h-[92vh] md:w-[94vw] md:max-w-[1180px] md:rounded-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="pdf-modal-title" className="sr-only">
          {title}
        </h3>

        {/* ── Top bar with title + actions ── */}
        <div className="flex shrink-0 items-center gap-2 border-b border-black/8 bg-neutral-50 px-4 py-2 dark:border-white/8 dark:bg-dark-card">
          <span className="truncate text-xs font-semibold text-ink/70 dark:text-dark-text/70">
            {title}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            {/* Open in new tab */}
            <a
              href={cleanSrc}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-black/5 hover:text-ink dark:text-dark-text/50 dark:hover:bg-white/8 dark:hover:text-dark-text"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
            </a>

            {/* Download */}
            <a
              href={cleanSrc}
              download
              title="Download PDF"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-black/5 hover:text-ink dark:text-dark-text/50 dark:hover:bg-white/8 dark:hover:text-dark-text"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={14} />
            </a>
          </div>
        </div>

        {/* ── Viewer area ── */}
        <div className="relative min-h-0 flex-1">
          {/* Loading spinner */}
          {loading && !failed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-dark-card">
              <Loader2 size={28} className="animate-spin text-ink/30 dark:text-dark-text/30" />
              <span className="text-xs text-ink/40 dark:text-dark-text/40">
                {usingFallback ? 'Retrying with viewer…' : 'Loading PDF…'}
              </span>
            </div>
          )}

          {/* Error state */}
          {failed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white p-8 dark:bg-dark-card">
              <AlertCircle size={32} className="text-ink/25 dark:text-dark-text/25" />
              <p className="text-center text-sm text-ink/60 dark:text-dark-text/60">
                This PDF couldn't be displayed in the browser.
              </p>
              <div className="flex gap-3">
                <a
                  href={cleanSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-black/5 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-black/10 dark:bg-white/8 dark:text-dark-text dark:hover:bg-white/12"
                >
                  <ExternalLink size={13} /> Open in new tab
                </a>
                <a
                  href={cleanSrc}
                  download
                  className="inline-flex items-center gap-2 rounded-lg bg-black/5 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-black/10 dark:bg-white/8 dark:text-dark-text dark:hover:bg-white/12"
                >
                  <Download size={13} /> Download
                </a>
              </div>
            </div>
          )}

          {/* 
            The iframe is sized to 100% of its flex parent, which correctly
            fills all available space. object-fit on the iframe itself has no
            effect — the *PDF plugin* inside the frame controls zoom. Using
            view=Fit (not FitH) makes the plugin show the full page in both
            dimensions, fixing the over-zoomed / cropped appearance.
          */}
          <iframe
            key={currentSrc}           /* remount when switching to fallback */
            ref={iframeRef}
            src={currentSrc}
            className="block h-full w-full border-0 bg-white"
            title={title}
            loading="eager"
            onLoad={handleLoad}
            onError={handleError}
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>
      </div>
    </div>
  );
}
