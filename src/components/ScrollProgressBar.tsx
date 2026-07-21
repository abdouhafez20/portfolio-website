import { useEffect, useRef } from 'react';

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      barRef.current.style.width = `${pct}%`;
    };

    // rAF-throttled scroll handler (match Header's pattern)
    let frameId: number | null = null;
    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        update();
        frameId = null;
      });
    };

    // Initial measurement
    update();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-forest to-gold"
        style={{ width: '0%' }}
      />
    </div>
  );
}
