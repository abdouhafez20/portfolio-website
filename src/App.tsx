import { type ReactNode, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDarkMode } from '@/hooks/useDarkMode';

// Unmounted sections preserved in repo for later stages / reference:
// - HeroSection (src/sections/HeroSection.tsx)
// - MarqueeSection (src/sections/MarqueeSection.tsx)
// - TrustedByBar (src/sections/TrustedByBar.tsx)
// - WorkSection (src/sections/WorkSection.tsx)
// - BeforeAfterSection (src/sections/BeforeAfterSection.tsx)
// - TestimonialsSection (src/sections/TestimonialsSection.tsx)
// - ServicesSection (src/sections/ServicesSection.tsx)
// - AboutSection (src/sections/AboutSection.tsx)
// - ContactSection (src/sections/ContactSection.tsx)

function AppLoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream text-forest dark:bg-dark-bg dark:text-dark-forest"
    >
      <div className="h-10 w-10 rounded-full border-2 border-current border-t-transparent animate-spin" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

interface AppProps {
  children?: ReactNode;
}

export default function App({ children }: AppProps) {
  useLanguage();
  useDarkMode();
  const [isInitializing, setIsInitializing] = useState(true);

  // NOTE: Duplicate html dir/lang effect removed — handled only in useLanguage hook

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitializing(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {isInitializing && <AppLoadingScreen />}
      <div
        id="main"
        aria-busy={isInitializing}
        className={`min-h-screen transition-opacity duration-300 ${
          isInitializing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}
