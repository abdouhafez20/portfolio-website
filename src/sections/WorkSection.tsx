import { useEffect, useMemo, useState } from 'react';
import SampleGallery from '@/components/SampleGallery';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import PDFModal from '@/components/PDFModal';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/scrollLock';
import { siteContent, workProjects } from '@/data/content';

import FilterBar from './work/FilterBar';
import MajorProjectCard from './work/MajorProjectCard';
import StandardProjectCard from './work/StandardProjectCard';
import type { Category, ProjectCategory, ViewablePdf, WorkProject, WorkSectionProps } from './work/types';

const projects: readonly WorkProject[] = workProjects;

function isProjectCategory(filter: Category): filter is ProjectCategory {
  return filter !== 'all';
}

/* ─────────────────────────────────────────
   WorkSection
───────────────────────────────────────── */
export default function WorkSection({ lang }: WorkSectionProps) {
  const isAr = lang.isAr;
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<ViewablePdf | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);
  const [galleryEmbedUrl, setGalleryEmbedUrl] = useState<string | null>(null);
  const [galleryTitle, setGalleryTitle] = useState<string | undefined>(undefined);
  const [galleryShowNotice, setGalleryShowNotice] = useState<boolean>(false);
  const [galleryOnRequest, setGalleryOnRequest] = useState<(() => void) | null>(null);
  const sectionRef = useIntersectionReveal();
  const copy = siteContent.work.copy[isAr ? 'ar' : 'en'];

  const filteredProjects = useMemo(() => {
    if (!isProjectCategory(activeFilter)) return [...projects];
    return projects.filter((p) =>
      p.categories.includes(activeFilter),
    );
  }, [activeFilter]);

  const majorProjects = filteredProjects.filter((p) => p.isMajor);
  const standardProjects = filteredProjects.filter((p) => !p.isMajor);

  const getCategoryLabel = (project: WorkProject) =>
    copy.categories[project.categoryLabel] ?? project.categoryLabel;

  const setFilter = (filter: Category) => {
    setActiveFilter(filter);
    setOpenCollectionId(null);
  };

  const openGallery = (project: WorkProject, showNotice = false) => {
    setOpenCollectionId(null);
    setGalleryImages(project.sampleImages ? [...project.sampleImages] : null);
    setGalleryEmbedUrl(null);
    setGalleryTitle(project.title);
    setGalleryShowNotice(!!showNotice);
    setGalleryOnRequest(() => () => openWhatsApp(project));
  };

  const openProjectView = (project: WorkProject, showNotice = false) => {
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.pdfUrl) {
      setOpenCollectionId(null);
      setGalleryImages(null);
      setGalleryEmbedUrl(null);
      setModalItem({ title: project.title, pdfUrl: project.pdfUrl });
      return;
    }

    openGallery(project, showNotice);
  };

  const openAssetView = (asset: { title: string; pdfUrl?: string | null; imageGallery?: readonly string[]; flipbookUrl?: string }) => {
    if (asset.flipbookUrl) {
      setOpenCollectionId(null);
      setModalItem(null);
      setGalleryImages([]);
      setGalleryEmbedUrl(asset.flipbookUrl);
      setGalleryTitle(asset.title);
      setGalleryShowNotice(false);
      setGalleryOnRequest(null);
      return;
    }

    if (asset.pdfUrl) {
      setGalleryImages(null);
      setGalleryEmbedUrl(null);
      setModalItem({ title: asset.title, pdfUrl: asset.pdfUrl });
      return;
    }

    if (asset.imageGallery?.length) {
      setOpenCollectionId(null);
      setGalleryImages([...asset.imageGallery]);
      setGalleryEmbedUrl(null);
      setGalleryTitle(asset.title);
      setGalleryShowNotice(false);
      setGalleryOnRequest(null);
    }
  };

  const openWhatsApp = (project: WorkProject) => {
    const base = siteContent.links.whatsapp ?? '';
    const msg = project.whatsappMessage ?? `Hi, I would like to request the full sample for: ${project.title}`;
    // If the WhatsApp link isn't an external URL, fall back to the contact section
    if (!base || /^#/.test(base) || !/^(https?:\/\/)/.test(base)) {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const url = base.includes('?') ? `${base}&text=${encodeURIComponent(msg)}` : `${base}?text=${encodeURIComponent(msg)}`;
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
  };

  useEffect(() => {
    if (!modalItem) return;
    lockBodyScroll();
    return () => { unlockBodyScroll(); };
  }, [modalItem]);

  return (
    <>
      <section
        id="work"
        ref={sectionRef}
        className="relative border-t border-card-border bg-gradient-to-b from-forest/[0.025] to-transparent px-4 py-12 dark:border-dark-border dark:from-dark-forest/[0.045] md:px-8 md:py-16"
      >
        <div className="mx-auto max-w-screen-xl space-y-8">

          {/* ── Header ── */}
          <div className="reveal space-y-3">
            <span className="eyebrow">{copy.library}</span>
            <h2 className="font-display text-[clamp(1.65rem,3vw,2.75rem)] font-semibold leading-tight text-ink dark:text-dark-text">
              {copy.heading}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-mist dark:text-dark-muted">
              {copy.intro}
            </p>
          </div>

          {/* ── Filter bar ── */}
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setFilter}
            copy={copy}
          />

          {/* ── Major projects ── */}
          {majorProjects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-forest dark:text-dark-forest">
                    {copy.majorLabel}
                  </span>
                  <h3 className="mt-0.5 font-display text-xl font-semibold text-ink dark:text-dark-text">
                    {copy.majorHeading}
                  </h3>
                </div>
                <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-mist dark:text-dark-muted">
                  {majorProjects.length} {copy.majorCount}
                </span>
              </div>

              <div key={`major-${activeFilter}`} className="grid gap-4 lg:grid-cols-2">
                {majorProjects.map((project, i) => (
                  <MajorProjectCard
                    key={project.id}
                    project={project}
                    expanded={openCollectionId === project.id}
                    onRequestSample={() => openWhatsApp(project)}
                    onToggleFiles={() => setOpenCollectionId((prev) => (prev === project.id ? null : project.id))}
                    onViewAsset={(asset) => openAssetView(asset)}
                    onViewGallery={(asset) => (asset ? openAssetView(asset) : openProjectView(project))}
                    copy={copy}
                    getCategoryLabel={getCategoryLabel}
                    showNotice={i < 2}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Standard projects ── */}
          {standardProjects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-mist dark:text-dark-muted">
                    {copy.standardLabel}
                  </span>
                  <h3 className="mt-0.5 font-display text-xl font-semibold text-ink dark:text-dark-text">
                    {copy.standardHeading}
                  </h3>
                </div>
                <span className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-mist dark:text-dark-muted">
                  {standardProjects.length} {copy.standardCount}
                </span>
              </div>

              <div key={`standard-${activeFilter}`} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,20rem))] justify-center">
                {standardProjects.map((project) => (
                  <StandardProjectCard
                    key={project.id}
                    project={project}
                    onOpenGallery={() => openProjectView(project)}
                    onRequestSample={() => openWhatsApp(project)}
                    copy={copy}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {modalItem && modalItem.pdfUrl && (
        <PDFModal
          title={modalItem.title}
          src={modalItem.pdfUrl}
          closeLabel={copy.close}
          onClose={() => setModalItem(null)}
        />
      )}
      {(galleryImages !== null || galleryEmbedUrl !== null) && (
        <SampleGallery
          images={galleryImages ?? []}
          embedUrl={galleryEmbedUrl ?? undefined}
          title={galleryTitle}
          onClose={() => { setGalleryImages(null); setGalleryEmbedUrl(null); }}
          showNotice={galleryShowNotice}
          onRequest={() => { if (galleryOnRequest) galleryOnRequest(); }}
        />
      )}
    </>
  );
}
