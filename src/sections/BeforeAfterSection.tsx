import { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

interface SliderProps {
  beforeSrc: string;
  afterSrc: string;
  defaultValue: number;
  caseNum: string;
  title: string;
  hintAr: string;
  ariaLabel: string;
  dragHint: string;
  beforeLabel: string;
  afterLabel: string;
}

function ComparisonSlider({
  beforeSrc,
  afterSrc,
  defaultValue,
  caseNum,
  title,
  hintAr,
  ariaLabel,
  dragHint,
  beforeLabel,
  afterLabel,
}: SliderProps) {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const clamp = (v: number) => Math.max(2, Math.min(98, v));

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return value;
    const rect = containerRef.current.getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }, [value]);

  const updateFromClientX = useCallback((clientX: number) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setValue(getPercent(clientX)));
  }, [getPercent]);

  /* ── Pointer events (mouse + touch unified) ── */
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHasInteracted(true);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = () => setIsDragging(false);


  /* ── Keyboard accessibility ── */
  const onKeyDown = (e: React.KeyboardEvent) => {
    setHasInteracted(true);
    if (e.key === 'ArrowLeft') setValue((v) => clamp(v - 2));
    if (e.key === 'ArrowRight') setValue((v) => clamp(v + 2));
    if (e.key === 'Home') setValue(2);
    if (e.key === 'End') setValue(98);
  };

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  return (
    <div className="group/card flex flex-col gap-4">

      {/* ── Slider container ── */}
      <div
        ref={containerRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden select-none touch-none focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-dark-bg"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onKeyDown={onKeyDown}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
      >
        {/* Before image */}
        <img
          src={beforeSrc}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
          alt={`${title} before redesign`}
          loading="eager"
        />

        {/* After image — clipped */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <img
            src={afterSrc}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            alt={`${title} after redesign`}
            loading="lazy"
          />
        </div>

        {/* Clear divider line */}
        <div
          className="absolute top-0 bottom-0 w-[3px] rounded-full bg-white/95 pointer-events-none"
          style={{
            left: `${value}%`,
            transform: 'translateX(-50%)',
            boxShadow:
              '0 0 0 1px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.25), 0 0 18px rgba(0,0,0,0.4)',
          }}
        />

        {/*
          ── Handle ──
          Much larger hit area (56px touch target) with a refined visual.
          The outer ring is semi-transparent white, inner is solid.
          isDragging state scales it up for tactile feedback.
        */}
        <div
          className="absolute top-1/2 pointer-events-none"
          style={{
            left: `${value}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border border-black/10 bg-white/95 shadow-[0_0_0_4px_rgba(255,255,255,0.35),0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-100"
            style={{
              width: isDragging ? 54 : 46,
              height: isDragging ? 54 : 46,
            }}
          >
            <MoveHorizontal
              size={isDragging ? 18 : 16}
              strokeWidth={1.8}
              className="text-neutral-800 transition-all duration-100"
            />
          </div>
        </div>

        {/* Corner labels */}
        <span className="absolute top-3 left-3 text-[9px] font-semibold uppercase tracking-widest bg-black/50 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full pointer-events-none">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-widest bg-forest/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full pointer-events-none">
          {afterLabel}
        </span>

        {/* Drag hint — fades out after first interaction */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 pointer-events-none transition-opacity duration-500"
          style={{ opacity: hasInteracted ? 0 : 1 }}
        >
          <span className="text-[10px] text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            {dragHint}
          </span>
        </div>
      </div>

      {/* ── Meta ── */}
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-[0.18em] text-mist dark:text-dark-muted font-medium mb-1">
            {caseNum}
          </div>
          <div className="text-sm font-semibold text-ink dark:text-dark-text leading-snug">
            {title}
          </div>
        </div>

        <p
          className="text-[11px] text-mist dark:text-dark-muted font-arabic text-right shrink-0 max-w-[130px] leading-relaxed"
          dir="rtl"
        >
          {hintAr}
        </p>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════ */

export default function BeforeAfterSection({ lang }: Props) {
  const { t } = lang;
  const sectionRef = useIntersectionReveal();
  const cases = siteContent.beforeAfter.cases;

  return (
    <section
      id="before-after"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 border-t border-card-border dark:border-dark-border"
    >
      <div className="max-w-3xl mx-auto space-y-12">

        {/* ── Header ── */}
        <div className="reveal space-y-3">
          <span className="eyebrow">{t('ba.eyebrow')}</span>

          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-tight tracking-tight">
            {t('ba.title')}{' '}
            <em className="not-italic text-forest dark:text-dark-forest">
              {t('ba.titleHighlight')}
            </em>
          </h2>

          <p className="text-sm text-mist dark:text-dark-muted max-w-sm leading-relaxed">
            {t('ba.subtitle')}
          </p>
        </div>

        {/* ── Sliders ── */}
        <div className="grid md:grid-cols-2 gap-6 reveal">
          {cases.map((item) => (
            <ComparisonSlider
              key={item.caseNum}
              beforeSrc={item.beforeSrc}
              afterSrc={item.afterSrc}
              defaultValue={item.defaultValue}
              caseNum={item.caseNum}
              title={t(item.titleKey)}
              hintAr={t(item.hintKey)}
              ariaLabel={item.ariaLabel}
              dragHint={t('ba.dragHint')}
              beforeLabel={t('ba.beforeLabel')}
              afterLabel={t('ba.afterLabel')}
            />
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="reveal">
          <div className="rounded-2xl border border-forest/15 dark:border-dark-forest/15 bg-forest/5 dark:bg-dark-forest/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-1">
              <p className="font-semibold text-ink dark:text-dark-text">
                {t('ba.ctaTitle')}
              </p>
              <p
                className="text-sm text-mist dark:text-dark-muted font-arabic"
                dir="rtl"
              >
                {t('ba.ctaBtnAr')}
              </p>
            </div>

            <a
              href={siteContent.links.whatsapp}
              target={/^(https?:|\/\/|mailto:)/.test(String(siteContent.links.whatsapp)) ? '_blank' : undefined}
              rel={/^(https?:|\/\/|mailto:)/.test(String(siteContent.links.whatsapp)) ? 'noopener noreferrer' : undefined}
              className="shrink-0 inline-flex items-center justify-center bg-wa-green hover:bg-wa-green/90 active:scale-[0.97] text-white text-[10px] uppercase tracking-widest font-semibold px-6 py-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wa-green/40"
            >
              {t('ba.ctaBtn')}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
