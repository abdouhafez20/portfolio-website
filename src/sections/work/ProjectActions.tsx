import { FileText } from 'lucide-react';

export interface ProjectActionsProps {
  onView: () => void;
  label?: string;
  compact?: boolean;
  touchLarge?: boolean; // when true, make touch target at least 44x44px for mobile
}

/* ─────────────────────────────────────────
   ProjectActions
───────────────────────────────────────── */
export default function ProjectActions({
  onView,
  label = 'View',
  compact = false,
  touchLarge = false,
}: ProjectActionsProps) {
  return (
    <button
      type="button"
      onClick={onView}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-forest text-white font-semibold uppercase tracking-[0.14em] transition-all duration-200 hover:bg-forest-hover active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-forest/30 dark:bg-dark-forest ${
        compact ? 'px-2.5 py-1 text-[8px]' : 'px-3.5 py-1.5 text-[9px]'
      } ${touchLarge ? 'h-11' : ''}`}
    >
      <FileText size={compact ? 10 : 12} strokeWidth={2} />
      {label}
    </button>
  );
}
