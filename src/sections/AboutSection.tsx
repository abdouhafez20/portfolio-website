import { useRef, useEffect, useState } from 'react';
import { BrainCircuit, Brush, FileType2, PanelsTopLeft, Presentation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

const skillIconMap = {
  brush: Brush,
  panels: PanelsTopLeft,
  fileType: FileType2,
  presentation: Presentation,
  brain: BrainCircuit,
} as const;

const { skills, timeline, expertiseTags, profileImage, profileAlt, profileBadge, profileLocation } = siteContent.about;


export default function AboutSection({ lang }: Props) {
  const { t } = lang;
  const sectionRef = useIntersectionReveal();
  const skillsRef = useRef<HTMLDivElement>(null);
  const sortedTimeline = [...timeline].sort((a, b) => {
    const getRank = (date: string) => {
      if (date.toLowerCase().includes('current')) return 9999;
      const years = date.match(/\d{4}/g)?.map(Number) ?? [0];
      return Math.max(...years);
    };

    return getRank(b.date) - getRank(a.date);
  });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = skillsRef.current;
    if (!el) return;

    const bars = el.querySelectorAll<HTMLDivElement>('.skill-fill');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        bars.forEach((bar) => {
          const target = Number(bar.dataset.width);
          if (!target) return;

          bar.style.transform = `scaleX(${target / 100})`;
        });

        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const isRTL = lang.isAr;
  const [imgSrc, setImgSrc] = useState<string>(profileImage);

  const fallbackSvg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
    <rect width='100%' height='100%' rx='32' fill='%23F3F4F6' />
    <g transform='translate(80,70)' fill='%23737482'>
      <circle cx='120' cy='120' r='80' />
      <rect x='40' y='240' rx='60' width='160' height='120' />
    </g>
  </svg>
  `;
  const fallbackDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-12 md:py-16 px-5 md:px-10 border-t border-card-border dark:border-dark-border"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20">
          
          {/* LEFT */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            
            {/* PHOTO */}
            <div className="relative max-w-sm mx-auto lg:mx-0 group reveal">
              <div className="absolute inset-0 rounded-3xl border-2 border-forest/15 dark:border-dark-forest/25 rotate-2 group-hover:rotate-0 transition-transform duration-500" />
              <div className="absolute inset-0 rounded-3xl border-2 border-gold/15 dark:border-dark-gold/20 -rotate-1 group-hover:rotate-0 transition-transform duration-500" />

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lift dark:shadow-dark-lift">
               <img
                  src={imgSrc}
                  alt={profileAlt}
                  onError={() => {
                    if (imgSrc !== fallbackDataUrl) setImgSrc(fallbackDataUrl);
                  }}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 bg-medical/12 dark:bg-medical/15 backdrop-blur-md rounded-2xl p-4 border border-medical/30 dark:border-medical/40">
                  <div className="text-[9px] uppercase tracking-[0.22em] text-medical dark:text-dark-med font-medium">
                    {profileBadge}
                  </div>
                  <div className="font-display text-lg font-semibold text-white mt-1">
                    {profileLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div ref={skillsRef} className="card-surface mt-10 reveal reveal-delay-2">
              <span className="eyebrow">{t('about.tools')}</span>

              <div className="mt-5 space-y-3.5">
                {skills.map((skill) => {
                  const Icon = skillIconMap[skill.icon];

                  return (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs font-medium text-ink dark:text-dark-text mb-1.5">
                      <span className="inline-flex items-center gap-2">
                        <Icon size={14} className="text-forest dark:text-dark-forest" strokeWidth={1.7} />
                        {skill.name}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-black/6 dark:bg-white/8 overflow-hidden">
                      <div
                        className="skill-fill h-full rounded-full bg-gradient-to-r from-forest to-dark-forest transition-transform duration-1000 ease-out"
                        data-width={skill.width}
                        style={{ transform: 'scaleX(0)' }}
                        role="progressbar"
                        aria-valuenow={skill.width}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="reveal">
            <span className="eyebrow">{t('about.title')}</span>

            <h2 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] text-ink dark:text-dark-text">
              {t('about.heading')}{' '}
              <em className="text-medical dark:text-dark-med">
                {t('about.headingHighlight')}
              </em>
            </h2>

            <div className="mt-6 space-y-4 max-w-lg">
              <p className="text-sm md:text-[15px] font-light leading-7 text-mist">
                {t('about.bio1')}
              </p>
              <p className="text-sm md:text-[15px] font-light leading-7 text-mist">
                {t('about.bio2')}
              </p>
            </div>

            {/* TAGS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {expertiseTags.map((tag) => (
                <span
                  key={tag.label}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium ${tag.bg} ${tag.text}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* TIMELINE */}
            <div className="mt-12 reveal reveal-delay-2">
              <span className="eyebrow">{t('about.experience')}</span>

              <ul
                className={`mt-5 relative ${
                  isRTL ? 'border-r-2 pr-6' : 'border-l-2 pl-6'
                } border-forest/30 dark:border-dark-forest/30 space-y-6`}
              >
                {sortedTimeline.map((item) => (
                  <li
                    key={item.org + item.date}
                    className={`relative hover:bg-forest/5 dark:hover:bg-forest/8 rounded-lg py-2 transition-all duration-300 ${isRTL ? '-mr-3 pr-3' : '-ml-3 pl-3'}`}
                  >
                    <div
                      className={`absolute ${
                        isRTL ? '-right-[19px]' : '-left-[19px]'
                      } top-3 w-3 h-3 rounded-full border-2 border-forest dark:border-dark-forest ${
                        'highlight' in item && item.highlight
                          ? 'bg-forest dark:bg-dark-forest shadow-md'
                          : 'bg-cream dark:bg-dark-bg'
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-ink dark:text-dark-text">
                          {item.org}
                        </div>
                        <p className="text-xs font-light text-mist dark:text-dark-muted mt-1 max-w-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <span
                        className={`flex-shrink-0 text-[9px] font-medium px-2.5 py-1.5 rounded-full whitespace-nowrap ${
                          'highlight' in item && item.highlight
                            ? 'bg-medical/15 dark:bg-medical/12 text-medical dark:text-dark-med'
                            : 'bg-forest/10 dark:bg-forest/12 text-forest dark:text-dark-forest'
                        }`}
                      >
                        {item.date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
