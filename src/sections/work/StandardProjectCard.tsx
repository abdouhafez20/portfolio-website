import { Eye, ExternalLink, FileText } from 'lucide-react';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { siteContent } from '@/data/content';
import type { WorkProject, WorkCopy } from './types';

export interface StandardProjectCardProps {
  project: WorkProject;
  onOpenGallery: () => void;
  onRequestSample: () => void;
  copy: WorkCopy;
  getCategoryLabel: (p: WorkProject) => string;
}

/* ─────────────────────────────────────────
   StandardProjectCard
───────────────────────────────────────── */
export default function StandardProjectCard({
  project,
  onOpenGallery,
  onRequestSample,
  copy,
  getCategoryLabel,
}: StandardProjectCardProps) {
  const isExternalDeck = Boolean(project.externalUrl);
  const isPdfOnly = Boolean(project.pdfUrl) && !project.sampleImages?.length;
  const buttonLabel = isExternalDeck ? 'View Deck' : isPdfOnly ? 'View PDF' : copy.view;
  const buttonIcon = isExternalDeck ? <ExternalLink size={12} /> : isPdfOnly ? <FileText size={12} /> : <Eye size={12} />;

  return (
    <article className="group overflow-hidden rounded-xl border border-card-border bg-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-md active:border-forest/20 active:shadow-md focus-within:border-forest/20 focus-within:shadow-md dark:border-dark-border dark:bg-white/[0.03] dark:hover:border-dark-forest/25 dark:active:border-dark-forest/25 dark:focus-within:border-dark-forest/25">

      {/* Image */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title}`}
        onClick={onOpenGallery}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpenGallery();
          }
        }}
        className="relative aspect-[1/1.414] overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
      >
        <img
          src={project.image}
          alt={`Cover for ${project.title}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-active:scale-[1.03]"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-forest backdrop-blur-sm">
          {getCategoryLabel(project)}
        </span>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-display text-base font-semibold tracking-[0.03em] leading-normal text-white">
            {project.title}
          </h3>
          <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white/60">
            {project.year} · {project.scope}
          </p>
        </div>
      </div>

      {/* Footer */}
        <div className="flex flex-col items-stretch gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 text-[11px] leading-relaxed text-mist dark:text-dark-muted sm:truncate">
          {project.subtitle}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onOpenGallery}
            className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-transparent px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-forest transition-all duration-150 hover:bg-forest/5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-forest/20 dark:border-dark-forest/30 dark:text-dark-forest"
          >
            {buttonIcon}
            {buttonLabel}
          </button>

          <a
            href={siteContent.links.whatsapp}
            onClick={(e) => {
              e.preventDefault();
              onRequestSample();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-wa-green px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-150 hover:bg-wa-green/95 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-wa-green/30"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <WhatsAppIcon width={14} height={14} fill="white" />
            </svg>
            {copy.requestSimilar ? copy.requestSimilar : 'Request'}
          </a>
        </div>
      </div>
    </article>
  );
}
