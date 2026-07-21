import { useEffect, useState } from 'react';
import { Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import NoticeCard from '@/components/ui/NoticeCard';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { siteContent } from '@/data/content';
import CollectionPreview from './CollectionPreview';
import ProjectActions from './ProjectActions';
import type { WorkProject, WorkAsset, WorkCopy } from './types';

export interface MajorProjectCardProps {
  project: WorkProject;
  expanded: boolean;
  onRequestSample: () => void;
  onToggleFiles: () => void;
  copy: WorkCopy;
  getCategoryLabel: (p: WorkProject) => string;
  showNotice?: boolean;
  onViewAsset?: (asset: WorkAsset) => void;
  onViewGallery?: (asset?: WorkAsset) => void;
}

/* ─────────────────────────────────────────
   MajorProjectCard
───────────────────────────────────────── */
export default function MajorProjectCard({
  project,
  expanded,
  onRequestSample,
  onToggleFiles,
  copy,
  getCategoryLabel,
  showNotice = false,
  onViewAsset,
  onViewGallery,
}: MajorProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-card-border bg-white/70 backdrop-blur-sm transition-all duration-300 hover:border-forest/20 active:border-forest/20 focus-within:border-forest/20 dark:border-dark-border dark:bg-white/[0.03] dark:hover:border-dark-forest/25 dark:active:border-dark-forest/25 dark:focus-within:border-dark-forest/25">

      {/* Main content */}
      <div className="grid md:grid-cols-[260px_1fr]">

        {/* Preview */}
        <div
          role={onViewGallery ? 'button' : undefined}
          tabIndex={onViewGallery ? 0 : undefined}
          aria-label={onViewGallery ? `View ${project.title}` : undefined}
          onClick={() => onViewGallery?.()}
          onKeyDown={(event) => {
            if (onViewGallery && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              onViewGallery();
            }
          }}
          className="flex items-center justify-center border-b border-card-border bg-slate-50/60 p-5 dark:border-dark-border dark:bg-slate-950/20 md:border-b-0 md:border-r cursor-pointer"
        >
          <CollectionPreview images={project.previewImages} title={project.title} />
        </div>

        {/* Info */}
          <div className="flex min-w-0 flex-col gap-3 p-4 sm:p-5">

          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-forest dark:text-dark-forest">
                {copy.currentProject}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-[0.03em] leading-normal text-ink dark:text-dark-text">
                {project.title}
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-card-border bg-white/80 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-mist dark:border-dark-border dark:bg-white/[0.04] dark:text-dark-muted">
              {copy.statusCurrent}
            </span>
          </div>

          {/* Stats row — 3 pills */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              [copy.projectName, getCategoryLabel(project)],
              [copy.lectureCount, project.lectureCount ?? project.scope],
              [copy.date, project.year],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-card-border bg-slate-50/70 px-2.5 py-2 dark:border-dark-border dark:bg-white/[0.03]"
              >
                <div className="truncate text-[11px] font-semibold text-ink dark:text-dark-text">
                  {value}
                </div>
                <div className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-mist dark:text-dark-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>

            {/* Notice (only for selected flagship projects) */}
            {showNotice && (
              <div className="mt-2">
                <NoticeCard onRequest={onRequestSample} />
              </div>
            )}

              {/* Actions */}
              <div className="mt-auto">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        onClick={onToggleFiles}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-forest/25 bg-transparent px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-forest transition-all duration-200 hover:bg-forest/5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-forest/25 dark:border-dark-forest/30 dark:text-dark-forest sm:w-auto"
                      >
                        <Eye size={12} strokeWidth={2} />
                        {expanded ? (copy.hideFiles ?? copy.viewFiles) : copy.viewFiles}
                      </button>

                      <button
                        type="button"
                        onClick={onRequestSample}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-wa-green px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:bg-wa-green/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-wa-green/30 sm:w-auto"
                      >
                        <WhatsAppIcon width={14} height={14} fill="white" />
                        {copy.requestSimilar}
                      </button>
                    </div>
                  </div>
        </div>
      </div>

      {/* Expandable file list */}
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {expanded && (
          <div className="border-t border-card-border bg-slate-50/50 p-4 dark:border-dark-border dark:bg-white/[0.02]">

            {/* File list header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-forest dark:text-dark-forest">
                {project.collectionSummary}
              </span>
              <span className="rounded-full bg-forest/8 px-2.5 py-0.5 text-[8px] font-semibold text-forest dark:bg-dark-forest/10 dark:text-dark-forest">
                {project.assets?.length ?? 0} {copy.files}
              </span>
            </div>

            {/* File rows (desktop: scrollable; mobile: paginated with larger touch targets) */}
            <FileRows
              project={project}
              copy={copy}
              onViewAsset={onViewAsset}
              onViewGallery={onViewGallery}
            />

          </div>
          )}
        </div>
      </div>
    </article>
  );
}

function FileRows({
  project,
  copy,
  onViewAsset,
  onViewGallery,
}: {
  project: WorkProject;
  copy: WorkCopy;
  onViewAsset?: (asset: WorkAsset) => void;
  onViewGallery?: (asset?: WorkAsset) => void;
}) {
  const assets = project.assets ?? [];
  const PAGE_SIZE = 6;
  const [isNarrow, setIsNarrow] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767.98px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsNarrow('matches' in e ? e.matches : false);
    setIsNarrow(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange as any);
    else mq.addListener(onChange as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange as any);
      else mq.removeListener(onChange as any);
    };
  }, []);

  useEffect(() => {
    setPage(0);
  }, [project.id]);

  const totalPages = Math.max(1, Math.ceil(assets.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, assets.length);
  const currentAssets = isNarrow ? assets.slice(start, end) : assets;

  return (
    <>
      <div
        role="list"
        aria-label={`${project.collectionSummary} files`}
        className={isNarrow ? 'space-y-2' : 'max-h-64 space-y-1.5 overflow-y-auto pr-1'}
      >
        {currentAssets.map((asset) => (
          <div
            key={`${project.id}-${asset.title}`}
            role="listitem"
            className="flex items-center gap-3 rounded-lg border border-card-border bg-white/80 px-3 py-2.5 dark:border-dark-border dark:bg-white/[0.04]"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-ink dark:text-dark-text">
                {asset.title}
              </div>
              <div className="mt-0.5 text-[9px] text-mist dark:text-dark-muted">
                {asset.type}{asset.pages ? ` · ${asset.pages}` : ''}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {asset.pdfUrl || asset.imageGallery?.length ? (
                <ProjectActions
                  compact={!isNarrow}
                  touchLarge={isNarrow}
                  label={copy.view ?? copy.viewFiles}
                  onView={() => {
                    if (asset.pdfUrl && onViewAsset) {
                      onViewAsset(asset);
                    } else if (asset.imageGallery?.length && onViewGallery) {
                      onViewGallery(asset);
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className={isNarrow ? 'inline-flex items-center justify-center gap-1.5 rounded-full bg-forest/10 text-forest font-semibold uppercase tracking-[0.14em] px-4 h-11 text-[9px] opacity-60 cursor-not-allowed' : 'inline-flex items-center justify-center gap-1.5 rounded-full bg-forest/10 text-forest font-semibold uppercase tracking-[0.14em] px-2.5 py-1 text-[8px] opacity-60 cursor-not-allowed'}
                >
                  <FileText size={isNarrow ? 12 : 10} strokeWidth={2} />
                  Sample coming soon
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const base = siteContent.links.whatsapp ?? '';
                  const msg = `Hi, I would like to request the full file for: ${asset.title}`;
                  if (!base || /^#/.test(base) || !/^(https?:\/\/)/.test(base)) {
                    const el = document.querySelector('#contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                  }
                  const url = base.includes('?') ? `${base}&text=${encodeURIComponent(msg)}` : `${base}?text=${encodeURIComponent(msg)}`;
                  const w = window.open(url, '_blank');
                  if (w) w.opener = null;
                }}
                className={isNarrow ? 'inline-flex items-center gap-2 rounded-full bg-wa-green text-white px-4 h-11 font-semibold uppercase tracking-[0.12em] transition-all duration-150 hover:bg-wa-green/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-wa-green/30' : 'inline-flex items-center gap-1.5 rounded-full bg-wa-green px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-150 hover:bg-wa-green/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-wa-green/30'}
              >
                <WhatsAppIcon width={14} height={14} fill="white" />
                {copy.requestSimilar}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isNarrow && totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[13px] text-mist dark:text-dark-muted">
            {start + 1}-{end} of {assets.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous files"
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center justify-center rounded-full bg-white/80 border border-card-border h-11 w-11 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-forest/25"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-[13px] text-mist dark:text-dark-muted">{page + 1}/{totalPages}</div>
            <button
              aria-label="Next files"
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="inline-flex items-center justify-center rounded-full bg-white/80 border border-card-border h-11 w-11 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-forest/25"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
