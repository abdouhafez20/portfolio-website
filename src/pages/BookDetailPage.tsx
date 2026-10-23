import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { workProjects } from '@/data/content';
import type { WorkProject } from '@/sections/work/types';
import { useAssetViewer } from '@/hooks/useAssetViewer';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import NotFoundPage from './NotFoundPage';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

function getPseudoRandomSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, isAr } = useLanguage();
  const { openPdf, openGallery, openAsset, ViewerComponent } = useAssetViewer();

  // Find the project and ensure it is a book project (not a presentation)
  const project = useMemo(() => {
    const p = (workProjects as readonly WorkProject[]).find((item) => item.id === slug);
    if (!p || p.bookCategory === undefined) {
      return null;
    }
    return p;
  }, [slug]);

  // Dynamic page title and description
  usePageMeta(
    project
      ? `${project.title} — ${isAr ? 'د. عبدالرحمن حافظ' : 'Dr Abdurrahman M. Hafez'}`
      : isAr
      ? 'الكتاب غير موجود — د. عبدالرحمن حافظ'
      : 'Book Not Found — Dr Abdurrahman M. Hafez',
    project ? project.subtitle : isAr ? 'المشروع المطلوب غير موجود.' : 'The requested project could not be found.',
  );

  // 3 pseudo-random other book projects chosen once per visit keyed on the slug
  const otherProjects = useMemo(() => {
    if (!slug) return [];
    const others = (workProjects as readonly WorkProject[]).filter(
      (p) => p.bookCategory !== undefined && p.id !== slug,
    );
    const seed = getPseudoRandomSeed(slug);
    const startIdx = others.length > 0 ? seed % others.length : 0;
    const rotated = [...others.slice(startIdx), ...others.slice(0, startIdx)];
    return rotated.slice(0, 3);
  }, [slug]);

  // Preview images rule:
  // use sampleImages only for behavioral-science-system, internal-medicine-premium-notes and text-bank;
  // every other project uses previewImages (cover).
  const previewImages = useMemo(() => {
    if (!project) return [];
    if (
      ['behavioral-science-system', 'internal-medicine-premium-notes', 'text-bank'].includes(
        project.id,
      )
    ) {
      return project.sampleImages && project.sampleImages.length > 0
        ? [...project.sampleImages]
        : [...project.previewImages];
    }
    return [...project.previewImages];
  }, [project]);

  if (!project) {
    return <NotFoundPage />;
  }

  const driveUrl = project.driveUrl || (import.meta.env.VITE_DRIVE_FOLDER_URL as string | undefined);
  const hasDrive = Boolean(driveUrl && driveUrl.trim().length > 0);

  const whatsappMessage = isAr
    ? `مرحبًا د. عبدالرحمن، أود الاستفسار وطلب تفاصيل مشروع: ${project.title}`
    : `Hello Dr. Abdurrahman, I would like to request details for: ${project.title}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* ── Back Navigation ────────────────────────────────────────── */}
      <nav>
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-forest dark:text-dark-forest hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest rounded-sm"
        >
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span>{t('books.detailBack')}</span>
        </Link>
      </nav>

      {/* ── Project Header & Primary Actions ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left / Info Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 dark:bg-dark-forest/15 border border-forest/20 dark:border-dark-forest/30 text-forest dark:text-dark-forest text-xs font-medium">
            <span>{project.categoryLabel}</span>
            {project.year && <span>• {project.year}</span>}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink dark:text-dark-text tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-mist dark:text-dark-muted font-body leading-relaxed">
            {project.subtitle}
          </p>

          {/* Metadata badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border">
              <span className="text-[10px] uppercase tracking-wider text-mist dark:text-dark-muted block">
                {t('books.role')}
              </span>
              <span className="text-sm font-medium text-ink dark:text-dark-text mt-0.5 block">
                {project.role}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border">
              <span className="text-[10px] uppercase tracking-wider text-mist dark:text-dark-muted block">
                {t('books.scope')}
              </span>
              <span className="text-sm font-medium text-ink dark:text-dark-text mt-0.5 block">
                {project.scope}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border">
              <span className="text-[10px] uppercase tracking-wider text-mist dark:text-dark-muted block">
                {t('books.format')}
              </span>
              <span className="text-sm font-medium text-ink dark:text-dark-text mt-0.5 block">
                {project.format}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {/* PDF Button */}
            {project.pdfUrl && (
              <button
                type="button"
                onClick={() => openPdf(project.title, project.pdfUrl!)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-forest text-white font-medium text-sm hover:bg-forest-hover active:scale-[0.98] transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:transform-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <span>{t('books.openPdf')}</span>
              </button>
            )}

            {/* WhatsApp Request Button */}
            <a
              href={buildWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border text-ink dark:text-dark-text font-medium text-sm hover:bg-forest/10 dark:hover:bg-dark-forest/15 active:scale-[0.98] transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:transform-none"
            >
              <WhatsAppIcon className="w-4 h-4 fill-forest dark:fill-dark-forest" />
              <span>{t('books.requestWhatsApp')}</span>
            </a>

            {/* Google Drive Folder Button (Conditional) */}
            {hasDrive && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border text-ink dark:text-dark-text font-medium text-sm hover:bg-gold/10 active:scale-[0.98] transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:transform-none"
              >
                <svg
                  className="w-4 h-4 text-gold dark:text-dark-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                  />
                </svg>
                <span>{t('books.openDrive')}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right / Primary Cover Column */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-cream dark:bg-dark-bg/60 border border-card-border dark:border-dark-border shadow-md">
            <img
              src={project.image}
              alt={project.title}
              width={600}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Preview Images Section ─────────────────────────────────── */}
      {previewImages.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-card-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text">
              {t('books.previewImages')}
            </h2>
            <span className="text-xs uppercase tracking-wider text-mist dark:text-dark-muted font-body">
              {previewImages.length} {isAr ? 'عينات' : 'pages'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {previewImages.map((imgSrc, idx) => (
              <button
                key={imgSrc + idx}
                type="button"
                onClick={() => openGallery(previewImages, project.title)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream dark:bg-dark-bg/60 border border-card-border dark:border-dark-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:hover:shadow-dark-lift text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <img
                  src={imgSrc}
                  alt={`${project.title} - ${isAr ? 'عينة' : 'Sample'} ${idx + 1}`}
                  width={400}
                  height={533}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                  <span className="px-4 py-2 rounded-full bg-surface/90 dark:bg-dark-card/90 text-ink dark:text-dark-text text-xs font-medium shadow-sm backdrop-blur">
                    {t('books.viewLecture')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Collection Chapters / Assets Section ──────────────────── */}
      {project.assets && project.assets.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-card-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text">
                {t('books.lecturesHeading')}
              </h2>
              {project.collectionSummary && (
                <p className="mt-1 text-sm text-mist dark:text-dark-muted font-body">
                  {project.collectionSummary}
                </p>
              )}
            </div>
            <span className="text-xs uppercase tracking-wider text-mist dark:text-dark-muted font-body">
              {project.assets.length} {isAr ? 'ملفات' : 'files'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.assets.map((asset, idx) => {
              const hasViewable = Boolean(
                asset.flipbookUrl ||
                  asset.pdfUrl ||
                  (asset.imageGallery && asset.imageGallery.length > 0),
              );

              return (
                <div
                  key={asset.title + idx}
                  className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border flex items-center justify-between gap-4 transition-all duration-200 hover:border-forest/30 dark:hover:border-dark-forest/30"
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-ink dark:text-dark-text truncate">
                      {asset.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-mist dark:text-dark-muted font-body">
                      <span>{asset.type}</span>
                      {asset.pages && <span>• {asset.pages}</span>}
                    </div>
                  </div>

                  <div>
                    {hasViewable ? (
                      <button
                        type="button"
                        onClick={() => openAsset(asset, project.title)}
                        className="px-4 py-2 rounded-full text-xs font-medium bg-forest/10 dark:bg-dark-forest/15 text-forest dark:text-dark-forest hover:bg-forest hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest motion-reduce:transition-none"
                      >
                        {t('books.viewLecture')}
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-ink/5 dark:bg-white/5 text-mist dark:text-dark-muted cursor-not-allowed">
                        {t('books.lectureComingSoon')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── More Book Projects ────────────────────────────────────── */}
      {otherProjects.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-card-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-dark-text">
              {t('books.otherProjects')}
            </h2>
            <div className="h-px flex-1 bg-card-border dark:border-dark-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherProjects.map((item) => (
              <Link
                key={item.id}
                to={`/books/${item.id}`}
                className="group flex flex-col rounded-3xl bg-surface dark:bg-dark-card border border-card-border dark:border-dark-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:hover:shadow-dark-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest dark:focus-visible:ring-dark-forest focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream dark:bg-dark-bg/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute top-3 start-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface/90 dark:bg-dark-card/90 backdrop-blur text-ink dark:text-dark-text border border-card-border dark:border-dark-border shadow-xs">
                      {item.categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink dark:text-dark-text group-hover:text-forest dark:group-hover:text-dark-forest transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-mist dark:text-dark-muted font-body leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-card-border/60 dark:border-dark-border/60 flex items-center justify-between text-forest dark:text-dark-forest font-medium text-xs">
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

      {/* ── Shared Viewer Modal / Gallery ──────────────────────────── */}
      <ViewerComponent />
    </div>
  );
}
