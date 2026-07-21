import { useEffect, useRef, useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { useImageManifest } from '@/hooks/useImageManifest';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

interface StatCardProps {
  value: number;
  label: string;
  color: string;
  delay: number;
}

const { hero, brand } = siteContent;
const sliderImages = hero.sliderImages;

function StackSlider() {
  const [index, setIndex] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0])); // First slide eagerly loaded
  const imageManifest = useImageManifest();
  const preloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Preload the next slide ~1.2 seconds before it becomes active (rotation interval is 2.5s)
  useEffect(() => {
    if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    
    const nextIndex = (index + 1) % sliderImages.length;
    preloadTimeoutRef.current = setTimeout(() => {
      setLoadedSlides((prev) => new Set(prev).add(nextIndex));
    }, 1200);

    return () => {
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    };
  }, [index]);

  if (!imageManifest) {
    // Manifest still loading, render with regular images
    return (
      <div className="mx-auto flex w-full max-w-[180px] items-start justify-center sm:max-w-[220px] lg:mx-0 lg:w-[240px] lg:max-w-none xl:w-[272px] mt-6 reveal reveal-delay-2">
        <div className="relative w-full aspect-[3/4] rotate-[5deg]">
          {sliderImages.map((img, i) => {
            const position = (i - index + sliderImages.length) % sliderImages.length;

            return (
              <img
                key={img}
                src={img}
                alt={`Medical content design portfolio sample ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-lift transition-all duration-700"
                style={{
                  zIndex: sliderImages.length - position,
                  transform: `
                    translateX(${position * 12}px)
                    translateY(${position * 9}px)
                    scale(${1 - position * 0.06})
                    rotate(${position * 1.2}deg)
                  `,
                  opacity: position > 3 ? 0 : 1,
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[180px] items-start justify-center sm:max-w-[220px] lg:mx-0 lg:w-[240px] lg:max-w-none xl:w-[272px] mt-6 reveal reveal-delay-2">
      <div className="relative w-full aspect-[3/4] rotate-[5deg]">

        {sliderImages.map((img, i) => {
          const position = (i - index + sliderImages.length) % sliderImages.length;
          const shouldLoad = loadedSlides.has(i); // Only render if pre-loaded or active

          return (
            <div
              key={img}
              className="absolute inset-0 w-full h-full transition-all duration-700"
              style={{
                zIndex: sliderImages.length - position,
                transform: `
                  translateX(${position * 12}px)
                  translateY(${position * 9}px)
                  scale(${1 - position * 0.06})
                  rotate(${position * 1.2}deg)
                `,
                opacity: position > 3 ? 0 : 1,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {shouldLoad && (
                <img
                  key={img}
                  src={img}
                  alt={`Medical content design portfolio sample ${i + 1}`}
                  className="w-full h-full object-cover rounded-3xl shadow-lift"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default function HeroSection({ lang }: Props) {
  const { t, isAr } = lang;
  const [currentWord, setCurrentWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useIntersectionReveal();
  const words = hero.typedWords[isAr ? 'ar' : 'en'];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentWord(words[0]);
      return;
    }
    const timeout = setTimeout(() => {
      const word = words[wordIndex];
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }
      if (isDeleting) {
        if (currentWord.length > 0) {
          setCurrentWord(word.substring(0, currentWord.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        if (currentWord.length < word.length) {
          setCurrentWord(word.substring(0, currentWord.length + 1));
        } else {
          setIsPaused(true);
        }
      }
    }, isPaused ? 1600 : isDeleting ? 55 : 95);
    return () => clearTimeout(timeout);
  }, [currentWord, wordIndex, isDeleting, isPaused, words]);

  const stats = hero.stats.map((stat) => ({ ...stat, label: t(stat.labelKey) }));

  return (
    <section ref={sectionRef} className="overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 px-4 sm:px-5 md:px-10">

      <div className="flex flex-col justify-between gap-8 lg:flex-row">

        <div className="min-w-0 max-w-[820px]">
          <div className="flex flex-wrap gap-2.5 mb-5 reveal">
            <span className="inline-flex max-w-full items-center gap-2 whitespace-normal break-words px-3 py-1.5 rounded-full border border-forest/30 dark:border-dark-forest/40 bg-forest/8 dark:bg-dark-forest/10 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.28em] font-medium leading-relaxed text-forest dark:text-dark-forest">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-forest dark:bg-dark-forest animate-ping-slow" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest dark:bg-dark-forest" />
              </span>
              {t('hero.available')}
            </span>
            <span className="inline-flex max-w-full items-center gap-2 whitespace-normal break-words px-3 py-1.5 rounded-full border border-medical/25 dark:border-dark-med/35 bg-medical/10 dark:bg-dark-med/12 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.28em] font-medium leading-relaxed text-medical dark:text-dark-med">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {t('hero.specialist')}
            </span>
          </div>

          <h1 className="reveal reveal-delay-1">
            <span className="block max-w-full break-words font-display font-semibold text-[clamp(1.35rem,9vw,3.35rem)] leading-[1.02] text-ink dark:text-dark-text sm:text-[clamp(1.55rem,4.6vw,3.35rem)] sm:leading-[0.98]">
              {brand.displayName.split(' M. ')[0]}
            </span>
            <span className="block max-w-full break-words font-display-italic font-normal text-[clamp(1.35rem,9vw,3.35rem)] leading-[1.02] text-forest dark:text-dark-forest sm:text-[clamp(1.55rem,4.6vw,3.35rem)] sm:leading-[0.98]">
              M. {brand.displayName.split(' M. ')[1]}
            </span>
          </h1>

          <div className="mt-5 min-h-[2rem] max-w-full reveal reveal-delay-2">
            <span className="font-display text-lg md:text-2xl font-light text-mist">
              {t('hero.typedPrefix')}{' '}
            </span>
            <span className="font-display text-lg md:text-2xl font-semibold text-ink dark:text-dark-text">
              {currentWord}
            </span>
            <span className="inline-block w-[2px] h-6 bg-forest dark:bg-dark-forest ml-1 animate-blink align-middle" />
          </div>

          <p className="mt-4 text-sm md:text-[15px] font-light leading-7 text-mist dark:text-dark-muted max-w-xl reveal reveal-delay-2">
            {t('hero.bio')}
          </p>

          <div className="mt-8 flex flex-col gap-3 reveal reveal-delay-3 sm:flex-row sm:flex-wrap">
            <a href="#work" className="btn-shimmer inline-flex w-full items-center justify-center gap-2 text-center text-sm sm:w-auto">
              <Eye size={18} />
              {t('hero.cta1')}
            </a>
            <a href="#contact" className="btn-outline inline-flex w-full items-center justify-center gap-2 text-center text-sm sm:w-auto">
              <MessageCircle size={18} />
              {isAr ? t('hero.cta2Ar') : t('hero.cta2')}
            </a>
          </div>

          <div className="mt-10 grid w-full grid-cols-2 gap-2.5 md:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i} />
            ))}
          </div>
        </div>

        <StackSlider />

      </div>
    </section>
  );
}

function StatCard({ value, label, color, delay }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const duration = 1600;
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 2);
            setDisplay(Math.round(eased * value));
            if (progress < 1) {
              frameRef.current = requestAnimationFrame(animate);
            }
          };
          frameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);

  return (
    <div ref={ref} className={`card-surface reveal reveal-delay-${delay + 1} p-3 md:p-3.5`}>
      <div className={`font-display text-2xl md:text-3xl font-semibold leading-tight ${color}`}>
        {display.toLocaleString()}
        <span className="text-base ml-1">+</span>
      </div>
      <div className="mt-1 text-[7px] uppercase tracking-[0.2em] font-medium text-mist dark:text-dark-muted">
        {label}
      </div>
    </div>
  );
}
