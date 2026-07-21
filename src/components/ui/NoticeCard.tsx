import { Info } from 'lucide-react';

type NoticeCardProps = {
  onRequest?: () => void;
  className?: string;
};

export default function NoticeCard({ onRequest, className }: NoticeCardProps) {
  return (
    <div className={`rounded-lg border border-card-border bg-slate-50/60 p-[15px] text-xs text-ink dark:border-dark-border dark:bg-white/[0.02] ${className ?? ''}`}>
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-forest dark:bg-white/[0.04]">
            <Info size={12} strokeWidth={1.5} aria-hidden="true" />
          </span>
        </div>

        <p className="leading-relaxed">
          The displayed pages are sample previews from the lectures and do not represent the complete file. To request access to the full version,{' '}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); if (onRequest) onRequest(); }}
            className="inline font-semibold text-forest hover:opacity-90 transition-colors duration-150 focus:outline-none"
            aria-label="Request the full version"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
