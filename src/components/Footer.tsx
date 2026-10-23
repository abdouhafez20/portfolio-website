import { Link } from 'react-router-dom';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { siteContent } from '@/data/content';

export default function Footer() {
  const { t, isAr } = useLanguage();
  const { brand, links, navItems } = siteContent;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-card-border dark:border-dark-border bg-cream/50 dark:bg-dark-bg/50 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-dark-text hover:text-forest dark:hover:text-dark-forest transition-colors"
            >
              {isAr ? (
                <span className="font-amiri text-xl font-bold text-forest dark:text-dark-forest">
                  د. عبدالرحمن حافظ
                </span>
              ) : (
                <span>
                  {brand.footerName}{' '}
                  <em className="text-forest dark:text-dark-forest not-italic">Hafez</em>
                </span>
              )}
            </Link>
            <p className="text-xs text-mist dark:text-dark-muted max-w-sm">
              {t('header.subtitle')}
            </p>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            role="navigation"
            aria-label="Footer"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-mist hover:text-forest dark:text-dark-muted dark:hover:text-dark-forest transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Actions: WhatsApp + Back to top */}
          <div className="flex items-center gap-4">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-wa-green/10 px-4 py-2 text-xs font-medium text-wa-green transition-colors hover:bg-wa-green hover:text-white focus:outline-none focus:ring-2 focus:ring-wa-green/50 dark:bg-wa-green/20"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>{t('footer.whatsapp')}</span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-full border border-card-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-mist transition-colors hover:border-forest/40 hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 dark:border-dark-border dark:text-dark-muted dark:hover:text-dark-forest"
              aria-label={t('footer.backToTop')}
            >
              <ArrowUp size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">{t('footer.backToTop')}</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-card-border/50 dark:border-dark-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-wider text-mist/60 dark:text-dark-muted/60">
          <span>
            © {new Date().getFullYear()} · {isAr ? 'القاهرة، مصر' : brand.city} · {t('footer.allRightsReserved')}
          </span>
          <span className="font-mono text-[9px]">
            {isAr ? 'تصميم محتوى طبي وأكاديمي' : 'Medical Content Design'}
          </span>
        </div>
      </div>
    </footer>
  );
}
