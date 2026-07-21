import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { siteContent } from '@/data/content';

export default function Footer() {
  const lang = useLanguage();
  const { t } = lang;
  const { brand } = siteContent;

  return (
    <div className="reveal border-t border-card-border dark:border-dark-border pt-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-ink dark:text-dark-text">
            {brand.footerName}{' '}
            <em className="text-forest dark:text-dark-forest">Hafez</em>
          </span>
          <span className="text-card-border dark:text-dark-border">·</span>
          <span className="text-[9px] uppercase tracking-widest text-mist/50 dark:text-dark-muted/50">
            © {new Date().getFullYear()} · {brand.city.split(',')[0]}
          </span>
        </div>

        {/* Right: back to top */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-mist transition-colors hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 dark:text-dark-muted dark:hover:text-dark-forest"
          >
            <ArrowUp size={12} strokeWidth={2.5} />
            {t('footer.backToTop')}
          </button>
        </div>

      </div>
    </div>
  );
}
