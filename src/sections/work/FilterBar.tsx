import {
  BookOpen,
  FileQuestion,
  FileText,
  Layers3,
  Presentation,
  Sparkles,
} from 'lucide-react';
import { siteContent } from '@/data/content';
import type { Category, WorkCopy } from './types';

const filters = siteContent.work.filters;

const filterIconMap = {
  layers: Layers3,
  book: BookOpen,
  question: FileQuestion,
  file: FileText,
  presentation: Presentation,
  sparkles: Sparkles,
} as const;

export interface FilterBarProps {
  activeFilter: Category;
  onFilterChange: (filter: Category) => void;
  copy: WorkCopy;
}

/* ─────────────────────────────────────────
   FilterBar
───────────────────────────────────────── */
export default function FilterBar({
  activeFilter,
  onFilterChange,
  copy,
}: FilterBarProps) {
  return (
    <div className="reveal reveal-delay-2">
      {/*
        Scrollable on mobile. Each pill has a larger tap target via py-2.
        Active state is a solid fill; inactive is a ghost with clear hover.
      */}
      <div
        role="group"
        aria-label="Filter projects"
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {filters.map((filter) => {
          const Icon = filterIconMap[filter.icon];
          const active = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value as Category)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-forest/25 ${
                active
                  ? 'border-forest bg-forest text-white dark:border-dark-forest dark:bg-dark-forest'
                  : 'border-card-border bg-white/70 text-mist hover:border-forest/30 hover:text-ink dark:border-dark-border dark:bg-white/[0.03] dark:text-dark-muted dark:hover:border-dark-forest/30 dark:hover:text-dark-text'
              }`}
            >
              <Icon size={11} strokeWidth={2} />
              {copy.filters[filter.value]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
