import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { siteContent } from '@/data/content';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [useWillChange, setUseWillChange] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // When visibility toggles, briefly hint will-change to improve transform performance
    let t: number | null = null;
    if (visible) {
      setUseWillChange(true);
      t = window.setTimeout(() => setUseWillChange(false), 350);
    }
    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [visible]);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setUseWillChange(true)}
      onMouseLeave={() => setUseWillChange(false)}
      className={`fixed bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-ink dark:bg-white text-white dark:text-ink shadow-lift dark:shadow-dark-lift flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink dark:focus:ring-offset-dark-bg ${
        useWillChange ? 'will-change-transform' : ''
      } ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label={siteContent.backToTop.label}
      title={siteContent.backToTop.label}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
