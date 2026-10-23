import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDarkMode } from '@/hooks/useDarkMode';
import { siteContent } from '@/data/content';

interface HeaderProps {
  lang?: ReturnType<typeof useLanguage>;
  dark?: ReturnType<typeof useDarkMode>;
}

const { brand, links, navItems, header: headerContent } = siteContent;

export default function Header({ lang: propLang, dark: propDark }: HeaderProps = {}) {
  const hookLang = useLanguage();
  const hookDark = useDarkMode();
  const lang = propLang || hookLang;
  const dark = propDark || hookDark;

  const { t, isAr, toggle: toggleLang } = lang;
  const { isDark, toggle: toggleDark } = dark;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll handler for header shadow
  useEffect(() => {
    let frameId: number | null = null;

    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frameId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const waHref = links.whatsapp;

  return (
    <>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-md transition-shadow duration-300 will-change-transform ${
          scrolled ? 'shadow-md dark:shadow-lg' : ''
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 flex items-center justify-between h-16 gap-3">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 transition-opacity duration-200 hover:opacity-90"
            aria-label={isAr ? 'د. عبدالرحمن حافظ — الرئيسية' : `${brand.fullName} — Home`}
          >
            {isAr ? (
              <span className="shrink-0 font-amiri text-2xl font-bold text-forest dark:text-dark-forest tracking-tight">
                د. عبدالرحمن حافظ
              </span>
            ) : (
              <span className="shrink-0 font-display text-xl text-forest dark:text-dark-forest">
                {brand.shortName}
              </span>
            )}

            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-xs font-semibold text-ink dark:text-dark-text">
                {isAr ? brand.displayName : brand.fullName}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-mist dark:text-dark-muted">
                {t('header.subtitle')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" role="navigation" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `text-[10px] uppercase tracking-[0.22em] font-medium transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-forest/50 ${
                    isActive
                      ? 'text-forest dark:text-dark-forest font-semibold'
                      : 'text-mist hover:text-ink dark:hover:text-dark-text'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-wa-green hover:bg-wa-green/90 text-white text-[10px] px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-wa-green/50 font-medium"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={14} />
              {headerContent.whatsappLabel}
            </a>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="w-9 h-9 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center text-xs font-medium transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50"
              aria-label={isAr ? 'Switch to English' : 'Switch to Arabic'}
              title={isAr ? 'English' : 'العربية'}
            >
              {isAr ? 'EN' : 'ع'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50 text-ink dark:text-dark-text"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50"
              aria-label={headerContent.openMenuLabel}
              aria-expanded={menuOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-cream/98 dark:bg-dark-bg/98 backdrop-blur-lg flex flex-col overflow-y-auto animate-fadeIn">
          <div className="flex justify-between items-center p-5 border-b border-card-border dark:border-dark-border">
            <span className="font-display text-lg font-semibold text-ink dark:text-dark-text">
              {headerContent.menuLabel}
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50"
              aria-label={headerContent.closeMenuLabel}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-5 py-8" role="navigation" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `max-w-full break-words px-4 py-2 text-center font-display text-2xl transition-colors duration-200 focus:outline-none ring-forest/50 focus:ring-2 sm:text-3xl ${
                    isActive
                      ? 'text-forest dark:text-dark-forest font-semibold'
                      : 'text-ink dark:text-dark-text hover:text-forest dark:hover:text-dark-forest'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-card-border dark:border-dark-border flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleLang}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/20 px-4 text-xs font-medium transition-colors duration-200 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-forest/50 dark:border-white/15 dark:hover:bg-white/5"
                aria-label={isAr ? 'Switch to English' : 'Switch to Arabic'}
              >
                {isAr ? 'EN' : 'ع'}
              </button>

              <button
                onClick={toggleDark}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ink/20 px-4 text-xs font-medium text-ink transition-colors duration-200 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-forest/50 dark:border-white/15 dark:text-dark-text dark:hover:bg-white/5"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-wa-green hover:bg-wa-green/90 text-white px-5 py-3 rounded-full text-sm font-medium transition-colors duration-200 text-center flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              {headerContent.whatsappLabel}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
