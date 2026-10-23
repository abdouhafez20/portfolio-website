import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

// Image slot constants required by the spec
const GRADUATION_PILLAR_IMAGE: string | null = null;
const INTERACTIVE_SHOWCASE_IMAGE: string | null = null;

export default function HomePage() {
  const { t, isAr } = useLanguage();

  usePageMeta(
    isAr
      ? 'د. عبدالرحمن حافظ — مصمم محتوى طبي وأكاديمي'
      : 'Dr Abdurrahman M. Hafez — Medical Content Designer',
    isAr
      ? 'تصميم وتنسيق كتب ومطبوعات طبية وأكاديمية، وهويات وجواكت التخرج، وعروض تقديمية احترافية بعناية تحريرية.'
      : 'Medical and academic books, graduation identities and jackets, and presentations — crafted with editorial care in Cairo, Egypt.',
  );

  const whatsappMessage = isAr
    ? 'مرحبًا د. عبدالرحمن، أود الاستفسار عن بدء مشروع جديد معكم.'
    : 'Hello Dr. Abdurrahman, I would like to inquire about starting a new project.';

  const pillarCards = [
    {
      title: t('home.pillarBooksTitle'),
      desc: t('home.pillarBooksDesc'),
      href: '/books',
      image: '/images/samples/behavioral-science/behavioral-science-01.jpg',
      alt: isAr ? 'نموذج من تصميم كتب ومطبوعات طبية' : 'Sample of medical books and print design',
      badge: isAr ? 'كتب ومطبوعات' : 'Books & Print',
    },
    {
      title: t('home.pillarGraduationTitle'),
      desc: t('home.pillarGraduationDesc'),
      href: '/graduation',
      image: GRADUATION_PILLAR_IMAGE,
      alt: isAr ? 'تصميم هويات وجواكت التخرج' : 'Graduation jackets and identities design',
      badge: isAr ? 'هويات وتخرج' : 'Graduation & Identities',
    },
    {
      title: t('home.pillarPresentationsTitle'),
      desc: t('home.pillarPresentationsDesc'),
      href: '/presentations',
      image: '/images/power poont presentation - chest pain .jpg',
      alt: isAr ? 'شرائح وعروض تقديمية طبية' : 'Medical and academic presentation slides',
      badge: isAr ? 'عروض تقديمية' : 'Presentations',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 md:space-y-36 pb-20">
      {/* ── 1. Hero Section (Typography-Led) ────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 md:pt-28 pb-10 sm:pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center sm:text-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 dark:bg-dark-forest/15 border border-forest/20 dark:border-dark-forest/30 text-forest dark:text-dark-forest text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-forest dark:bg-dark-forest animate-pulse" />
            {isAr ? 'تصميم محتوى طبي وأكاديمي' : 'Medical & Academic Editorial Design'}
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold text-ink dark:text-dark-text tracking-tight leading-[1.12]">
            {t('home.heroTitle')}
          </h1>

          <p className="mt-6 max-w-3xl text-lg sm:text-xl text-mist dark:text-dark-muted leading-relaxed font-body">
            {t('home.heroBlurb')}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-forest text-white font-medium text-sm sm:text-base hover:bg-forest-hover active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:transform-none"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>{t('home.heroWhatsApp')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Three Large Pillar Cards ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillarCards.map((pillar) => (
            <Link
              key={pillar.href}
              to={pillar.href}
              className="group relative flex flex-col rounded-3xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lift dark:hover:shadow-dark-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Image / Gradient Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream dark:bg-dark-bg/60">
                {pillar.image ? (
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    width={600}
                    height={375}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-forest/15 via-gold/15 to-medical/15 dark:from-dark-forest/15 dark:via-dark-gold/15 dark:to-dark-med/15 p-6 text-center">
                    <span className="font-display text-2xl text-ink/70 dark:text-dark-text/70 mb-2">
                      {pillar.title}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-mist dark:text-dark-muted font-body">
                      {t('home.graduationPlaceholder')}
                    </span>
                  </div>
                )}
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-ink/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />

                <div className="absolute top-4 start-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface/90 dark:bg-dark-card/90 backdrop-blur text-ink dark:text-dark-text border border-card-border dark:border-dark-border shadow-xs">
                    {pillar.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text group-hover:text-forest dark:group-hover:text-dark-forest transition-colors duration-200">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-mist dark:text-dark-muted leading-relaxed font-body">
                    {pillar.desc}
                  </p>
                </div>

                {/* Forward Arrow Link */}
                <div className="mt-6 pt-4 border-t border-card-border/60 dark:border-dark-border/60 flex items-center justify-between text-forest dark:text-dark-forest font-medium text-sm">
                  <span>{isAr ? 'استكشف المزيد' : 'Explore'}</span>
                  <svg
                    className="w-5 h-5 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Interactive Showcase Section ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-forest/5 via-cream/40 to-gold/10 dark:from-dark-forest/10 dark:via-dark-card dark:to-dark-gold/10 border border-card-border dark:border-dark-border p-6 sm:p-10 md:p-14 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center sm:text-start">
              <span className="eyebrow inline-block">
                {isAr ? 'تجربة رقمية جديدة' : 'New Digital Experience'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink dark:text-dark-text tracking-tight">
                {t('home.interactiveTitle')}
              </h2>
              <p className="text-base sm:text-lg text-mist dark:text-dark-muted leading-relaxed font-body">
                {t('home.interactiveSubtitle')}
              </p>
              <div className="pt-2">
                <Link
                  to="/interactive-books"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-forest text-white font-medium text-sm sm:text-base hover:bg-forest-hover active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:transform-none"
                >
                  <span>{t('home.interactiveBtn')}</span>
                  <svg
                    className="w-5 h-5 rtl:rotate-180 transition-transform duration-300 motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Showcase Panel */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-card-border dark:border-dark-border bg-surface dark:bg-dark-card shadow-sm flex items-center justify-center">
                {INTERACTIVE_SHOWCASE_IMAGE ? (
                  <img
                    src={INTERACTIVE_SHOWCASE_IMAGE}
                    alt={t('home.interactivePlaceholder')}
                    width={500}
                    height={375}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-forest/10 dark:bg-dark-forest/15 text-forest dark:text-dark-forest flex items-center justify-center">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                    </div>
                    <span className="font-display text-xl text-ink dark:text-dark-text">
                      {isAr ? 'تقنية Flipbook التفاعلية' : 'Interactive Flipbook Engine'}
                    </span>
                    <p className="text-xs text-mist dark:text-dark-muted font-body max-w-xs">
                      {t('home.interactivePlaceholder')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. About Snapshot Section ──────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <div className="rounded-3xl bg-surface/50 dark:bg-dark-card/50 border border-card-border dark:border-dark-border p-8 sm:p-12">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-ink dark:text-dark-text leading-relaxed">
            «{t('home.aboutSnapshot')}»
          </p>
          <div className="mt-6">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-forest dark:text-dark-forest font-medium hover:underline text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest rounded-sm"
            >
              <span>{t('home.aboutLink')}</span>
              <svg
                className="w-4 h-4 rtl:rotate-180 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
