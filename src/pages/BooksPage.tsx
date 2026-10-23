import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { workProjects } from '@/data/content';
import type { WorkProject } from '@/sections/work/types';

type BookFilter = 'all' | 'medical' | 'teacher-notes' | 'religious';

export default function BooksPage() {
  const { t, isAr } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<BookFilter>('all');

  usePageMeta(
    isAr ? 'الكتب والمطبوعات — د. عبدالرحمن حافظ' : 'Books & Publications — Dr Abdurrahman M. Hafez',
    isAr
      ? 'كتب ومراجع طبية، وملازم تعليمية، ومطبوعات أكاديمية مصممة بعناية تحريرية دقيقة.'
      : 'Explore medical textbooks, academic handouts, and structured question banks crafted with editorial precision.',
  );

  // Exclude presentation projects — books only
  const allBookProjects = useMemo(() => {
    return (workProjects as readonly WorkProject[]).filter(
      (p) => p.bookCategory !== undefined,
    );
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return allBookProjects;
    return allBookProjects.filter((p) => p.bookCategory === activeFilter);
  }, [allBookProjects, activeFilter]);

  const majorProjects = useMemo(() => {
    return filteredProjects.filter((p) => p.isMajor);
  }, [filteredProjects]);

  const standardProjects = useMemo(() => {
    return filteredProjects.filter((p) => !p.isMajor);
  }, [filteredProjects]);

  const filterButtons: { id: BookFilter; label: string }[] = [
    { id: 'all', label: t('books.filterAll') },
    { id: 'medical', label: t('books.filterMedical') },
    { id: 'teacher-notes', label: t('books.filterTeacherNotes') },
    { id: 'religious', label: t('books.filterReligious') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 space-y-12 sm:space-y-16">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <header className="max-w-3xl space-y-4">
        <span className="eyebrow inline-block">
          {isAr ? 'المكتبة الأكاديمية والتحريرية' : 'Editorial & Academic Library'}
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-ink dark:text-dark-text tracking-tight">
          {t('books.title')}
        </h1>
        <p className="text-base sm:text-lg text-mist dark:text-dark-muted leading-relaxed font-body">
          {t('books.subtitle')}
        </p>
      </header>

      {/* ── Filter Buttons ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-card-border dark:border-dark-border pb-6">
        {filterButtons.map((btn) => {
          const isActive = activeFilter === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveFilter(btn.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none ${
                isActive
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-surface dark:bg-dark-card text-ink dark:text-dark-text border border-card-border dark:border-dark-border hover:bg-forest/10 dark:hover:bg-dark-forest/15'
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* ── Empty State for Religious Filter or No Results ─────────── */}
      {filteredProjects.length === 0 && (
        <div className="rounded-3xl border border-dashed border-card-border dark:border-dark-border p-12 text-center max-w-xl mx-auto my-12 bg-surface/30 dark:bg-dark-card/30">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-forest/10 dark:bg-dark-forest/15 text-forest dark:text-dark-forest flex items-center justify-center">
            <svg
              className="w-6 h-6"
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
          <h2 className="font-display text-2xl font-semibold text-ink dark:text-dark-text mb-2">
            {activeFilter === 'religious' ? t('books.filterReligious') : t('books.emptyState')}
          </h2>
          <p className="text-sm text-mist dark:text-dark-muted font-body">
            {activeFilter === 'religious' ? t('books.religiousEmpty') : t('books.emptyState')}
          </p>
        </div>
      )}

      {/* ── 1. Major Projects Section ──────────────────────────────── */}
      {majorProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text">
              {t('books.majorHeading')}
            </h2>
            <div className="h-px flex-1 bg-card-border dark:border-dark-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {majorProjects.map((project) => (
              <Link
                key={project.id}
                to={`/books/${project.id}`}
                className="group flex flex-col rounded-3xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:hover:shadow-dark-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream dark:bg-dark-bg/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={375}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute top-4 start-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-forest text-white shadow-xs">
                      {project.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text group-hover:text-forest dark:group-hover:text-dark-forest transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-mist dark:text-dark-muted font-body leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-card-border/60 dark:border-dark-border/60 flex items-center justify-between text-forest dark:text-dark-forest font-medium text-sm">
                    <span>{t('books.viewBook')}</span>
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
      )}

      {/* ── 2. Other Projects Section ──────────────────────────────── */}
      {standardProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text">
              {t('books.standardHeading')}
            </h2>
            <div className="h-px flex-1 bg-card-border dark:border-dark-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {standardProjects.map((project) => (
              <Link
                key={project.id}
                to={`/books/${project.id}`}
                className="group flex flex-col rounded-3xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift dark:hover:shadow-dark-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream dark:bg-dark-bg/60">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute top-3 start-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface/90 dark:bg-dark-card/90 backdrop-blur text-ink dark:text-dark-text border border-card-border dark:border-dark-border shadow-xs">
                      {project.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink dark:text-dark-text group-hover:text-forest dark:group-hover:text-dark-forest transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-mist dark:text-dark-muted font-body leading-relaxed line-clamp-2">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-card-border/60 dark:border-dark-border/60 flex items-center justify-between text-forest dark:text-dark-forest font-medium text-xs sm:text-sm">
                    <span>{t('books.viewBook')}</span>
                    <svg
                      className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
      )}
    </div>
  );
}
