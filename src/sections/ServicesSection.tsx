import { Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

const services = siteContent.services;

export default function ServicesSection({ lang }: Props) {
  const { t } = lang;
  const sectionRef = useIntersectionReveal();

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-10 md:py-14 px-5 md:px-10 border-t border-card-border dark:border-dark-border"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">

          {/* ── Left: label + CTA ── */}
          <div className="shrink-0 reveal">
            <span className="eyebrow">{t('services.title')}</span>
            <h2 className="mt-2 font-display text-[clamp(1.4rem,2.8vw,2rem)] font-semibold leading-tight text-ink dark:text-dark-text">
              {t('services.heading')}{' '}
              <em className="text-forest dark:text-dark-forest">
                {t('services.headingHighlight')}
              </em>
            </h2>
            <a
              href="#contact"
              className="btn-shimmer inline-flex items-center gap-2 mt-5 px-5 py-2.5 text-[10px]"
            >
              <Calendar size={14} />
              {t('services.cta')}
            </a>
          </div>

          {/* ── Right: text-only grid ── */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-px bg-card-border dark:bg-dark-border rounded-xl overflow-hidden reveal">
            {services.map((service, i) => (
              <div
                key={service.index}
                className={`bg-white dark:bg-dark-bg px-5 py-4 group reveal reveal-delay-${i + 1}`}
              >
                <div className="flex items-baseline gap-2.5 mb-2">
                  <span className="text-[8px] uppercase tracking-[0.28em] text-mist dark:text-dark-muted font-medium tabular-nums">
                    {service.index}
                  </span>
                  <span className="h-px flex-1 bg-card-border dark:bg-dark-border" />
                </div>

                <h3 className="font-display text-sm font-semibold text-ink dark:text-dark-text leading-snug">
                  {t(service.titleKey)}
                </h3>

                <p
                  className="font-arabic text-[10px] text-forest dark:text-dark-forest mt-0.5"
                  dir="rtl"
                >
                  {t(service.titleArKey)}
                </p>

                <p className="text-[11px] leading-5 text-mist dark:text-dark-muted mt-2 font-light">
                  {t(service.descKey)}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}