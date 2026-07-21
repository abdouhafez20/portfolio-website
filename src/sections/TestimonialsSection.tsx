import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { siteContent } from '@/data/content';
import type { TestimonialEntry } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

const { cards } = siteContent.testimonials;

function Stars() {
  return (
    <div className="flex gap-1 mb-2.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10} className="text-gold fill-gold" />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  card: TestimonialEntry;
  t: (key: string) => string;
  currentLang: 'en' | 'ar';
}

function TestimonialCard({ card, t, currentLang }: TestimonialCardProps) {
  const [imgError, setImgError] = useState(false);

  const quoteText =
    (card.quote && (card.quote[currentLang] ?? card.quote.en ?? card.quote.ar)) ||
    '';

  const name = card.nameKey
    ? t(card.nameKey)
    : card.name?.[currentLang] ?? card.name?.en ?? card.name?.ar ?? 'TODO: Add name';

  const titleText = card.title?.[currentLang] ?? card.title?.en ?? card.title?.ar;
  const instText = card.institution?.[currentLang] ?? card.institution?.en ?? card.institution?.ar;
  const role = card.roleKey ? t(card.roleKey) : [titleText, instText].filter(Boolean).join(' · ');

  const isArabic = card.arabic ?? (card.quote?.ar && !card.quote?.en ? true : currentLang === 'ar');

  return (
    <div className="card-surface p-4">
      <Stars />
      <p
        className={`text-xs leading-relaxed text-ink dark:text-dark-text ${
          isArabic ? 'font-arabic' : 'font-body'
        }`}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {quoteText || <em className="text-mist">TODO: Add testimonial quote</em>}
      </p>

      <div className="mt-3 pt-3 border-t border-ink/10 dark:border-white/10 flex items-center gap-2.5">
        <div className="flex-shrink-0">
          {card.photoUrl && !imgError ? (
            <img
              src={card.photoUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${card.color}`}>
              {card.initial ?? (name ? name.charAt(0) : '?')}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-ink dark:text-dark-text truncate">{name}</div>
          <div className="text-[10px] text-mist dark:text-dark-muted truncate">
            {role ? (
              card.profileUrl ? (
                <a href={card.profileUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {role}
                </a>
              ) : (
                role
              )
            ) : (
              <span className="text-mist">TODO: Add title / institution</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ lang }: Props) {
  const { t } = lang;
  const currentLang = lang.lang;
  const sectionRef = useIntersectionReveal();

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-12 md:py-16 px-5 md:px-10 border-t border-card-border dark:border-dark-border"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 reveal">
          <span className="eyebrow">{t('testimonials.title')}</span>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold">
            {t('testimonials.title')}{' '}
            <em className="text-forest dark:text-dark-forest">
              {t('testimonials.titleHighlight')}
            </em>
          </h2>
          <p className="text-xs text-mist dark:text-dark-muted mt-3 max-w-lg">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 reveal md:grid-cols-2 lg:grid-cols-4">

          {cards.map((card, idx) => (
            <TestimonialCard
              key={(card as TestimonialEntry).nameKey ?? `testimonial-${idx}`}
              card={card as TestimonialEntry}
              t={t}
              currentLang={currentLang}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
