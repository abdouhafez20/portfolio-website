import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDarkMode } from '@/hooks/useDarkMode';
import { siteContent } from '@/data/content';

interface HeaderProps {
  lang: ReturnType<typeof useLanguage>;
  dark: ReturnType<typeof useDarkMode>;
}

const { brand, links, navItems, header: headerContent } = siteContent;

export default function Header({ lang, dark }: HeaderProps) {
  const { t, isAr, toggle: toggleLang } = lang;
  const { isDark, toggle: toggleDark } = dark;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // 🔥 optimized scroll handler
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

  // section observer
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // lock scroll when menu open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const waHref = links.whatsapp ?? '#contact';
  const waIsExternal = /^(https?:|\/\/|mailto:)/.test(String(waHref));

  return (
    <>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-md transition-shadow duration-300 will-change-transform ${
          scrolled
            ? 'shadow-md dark:shadow-lg'
            : ''
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 flex items-center justify-between h-16 gap-3">

          {/* Logo */}
          <a href="#" className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-display text-xl text-forest">
              {brand.shortName}
            </span>

            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-semibold text-ink dark:text-dark-text">
                {brand.fullName}
              </div>
              <div className="text-[9px] uppercase tracking-widest text-mist">
                {t('header.subtitle')}
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-[10px] uppercase tracking-[0.3em] font-medium transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-forest/50 ${
                  activeSection === item.href
                    ? 'text-forest dark:text-dark-forest'
                    : 'text-mist hover:text-ink dark:hover:text-dark-text'
                }`}
                aria-current={activeSection === item.href ? 'page' : undefined}
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* WhatsApp */}
            <a
              href={waHref}
              target={waIsExternal ? '_blank' : undefined}
              rel={waIsExternal ? 'noopener noreferrer' : undefined}
              className="hidden md:flex items-center gap-2 bg-wa-green hover:bg-wa-green/90 text-white text-[10px] px-4 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-wa-green/50 font-medium"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={14} />
              {headerContent.whatsappLabel}
            </a>

            {/* Hire */}
            <a
              href={links.contact}
              onClick={(e) => handleNavClick(e, links.contact)}
              className="hidden md:inline-flex items-center gap-2 bg-forest hover:bg-forest-hover dark:bg-dark-forest dark:hover:bg-dark-forest/90 text-white text-[10px] px-5 py-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forest/50 font-medium"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {headerContent.hireLabel}
            </a>

            {/* Language */}
            <button
              onClick={toggleLang}
              className="w-9 h-9 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center text-xs font-medium transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50"
              aria-label={isAr ? 'Switch to English' : 'Switch to Arabic'}
              title={isAr ? 'English' : 'العربية'}
            >
              {isAr ? 'EN' : 'ع'}
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50 text-ink dark:text-dark-text"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile Menu */}
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
            <span className="font-display text-lg font-semibold text-ink dark:text-dark-text">{headerContent.menuLabel}</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-ink/20 dark:border-white/15 flex items-center justify-center transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-forest/50"
              aria-label={headerContent.closeMenuLabel}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-5 py-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="max-w-full break-words px-4 py-2 text-center font-display text-2xl text-ink transition-colors duration-200 hover:text-forest focus:outline-none ring-forest/50 focus:ring-2 dark:text-dark-text dark:hover:text-dark-forest sm:text-3xl"
              >
                {t(item.key)}
              </a>
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
              target={waIsExternal ? '_blank' : undefined}
              rel={waIsExternal ? 'noopener noreferrer' : undefined}
              className="bg-wa-green hover:bg-wa-green/90 text-white px-5 py-3 rounded-full text-sm font-medium transition-colors duration-200 text-center"
            >
              {headerContent.whatsappLabel}
            </a>

            <a
              href={links.contact}
              onClick={(e) => handleNavClick(e, links.contact)}
              className="btn-shimmer text-sm text-center w-full"
            >
              {headerContent.mobileContactLabel}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
