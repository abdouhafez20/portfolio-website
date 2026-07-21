import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const running = useRef(false);
  const idleTimer = useRef<number | null>(null);
  const isTouch = useRef(window.matchMedia('(hover: none)').matches);

  useEffect(() => {
    // Disable on touch devices
    if (isTouch.current) return;

    // Disable on small screens
    if (window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // Start RAF loop when mouse is actively moving
      startLoop();

      // Reset idle timer so we stop after a short pause
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        stopLoop();
      }, 220);
    };

    const animate = () => {
      if (glowRef.current && !isTouch.current) {
        // Use transform3d for GPU acceleration
        glowRef.current.style.transform = `translate3d(${pos.current.x - 150}px, ${pos.current.y - 150}px, 0)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (isTouch.current) return;
      if (running.current) return;
      running.current = true;
      // hint the browser we will transform; add class to enable will-change temporarily
      glowRef.current?.classList.add('will-change-transform');
      if (rafId.current == null) rafId.current = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (!running.current) return;
      running.current = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      // remove will-change when idle to free GPU resources
      glowRef.current?.classList.remove('will-change-transform');
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      stopLoop();
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[9999] hidden lg:block"
      style={{
        background: 'radial-gradient(circle, rgba(42, 88, 64, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
      aria-hidden="true"
    />
  );
}
