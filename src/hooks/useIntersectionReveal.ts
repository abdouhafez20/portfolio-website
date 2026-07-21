import { useEffect, useRef } from 'react';

export function useIntersectionReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const revealEls = Array.from(el.querySelectorAll('.reveal'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealImmediately = () => {
      revealEls.forEach((el) => el.classList.add('revealed'));
    };

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      revealImmediately();
      observer.disconnect();
    };

    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof (prefersReducedMotion as any).addListener === 'function') {
      // Older browsers
      (prefersReducedMotion as any).addListener(handleMotionPreferenceChange);
    }

    return () => {
      observer.disconnect();
      if (typeof prefersReducedMotion.removeEventListener === 'function') {
        prefersReducedMotion.removeEventListener('change', handleMotionPreferenceChange);
      } else if (typeof (prefersReducedMotion as any).removeListener === 'function') {
        (prefersReducedMotion as any).removeListener(handleMotionPreferenceChange);
      }
    };
  }, []);

  return ref;
}
