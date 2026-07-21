import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

/**
 * Lightweight "Trusted By" credibility bar displaying institutions
 * the site owner has worked with. Uses text-based wordmark placeholders
 * until real logo assets are provided.
 *
 * To swap in a real logo, set the `logoSrc` field on the institution
 * entry in `siteContent.trustedBy` — no code change required.
 */
export default function TrustedByBar({ lang }: Props) {
  const { isAr } = lang;
  const sectionRef = useIntersectionReveal();
  const institutions = siteContent.trustedBy;

  return (
    <section
      ref={sectionRef}
      aria-label={isAr ? 'جهات موثوقة' : 'Trusted by'}
      className="py-8 md:py-10 px-4 sm:px-5 md:px-10 border-b border-card-border dark:border-dark-border"
    >
      {/* Eyebrow label */}
      <p className="eyebrow text-center mb-6 md:mb-8 reveal">
        {isAr ? 'موثوق من قبل' : 'Trusted By'}
      </p>

      {/* Logo / wordmark row */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12 md:gap-x-16 reveal reveal-delay-1">
        {institutions.map((inst) => (
          <div
            key={inst.id}
            className="group flex items-center justify-center transition-all duration-300"
            title={isAr ? inst.nameAr : inst.name}
          >
            {inst.logoSrc ? (
              /* Real logo — swap in by setting logoSrc in content.ts */
              <img
                src={inst.logoSrc}
                alt={isAr ? inst.nameAr : inst.name}
                className="h-8 md:h-9 w-auto object-contain grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 dark:invert dark:opacity-40 dark:group-hover:opacity-90"
                loading="lazy"
              />
            ) : (
              /* Text-based wordmark placeholder */
              <span className="select-none font-display text-[13px] sm:text-[14px] md:text-[15px] font-semibold tracking-wide text-ink/30 dark:text-dark-text/25 transition-all duration-300 group-hover:text-ink/70 dark:group-hover:text-dark-text/60 whitespace-nowrap">
                {isAr ? inst.nameAr : inst.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
