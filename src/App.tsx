import { useLanguage } from '@/hooks/useLanguage';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useEffect, lazy, Suspense, useState } from 'react';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import BackToTop from '@/components/BackToTop';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import CursorGlow from '@/components/CursorGlow';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';
import HeroSection from '@/sections/HeroSection';
import MarqueeSection from '@/sections/MarqueeSection';
import TrustedByBar from '@/sections/TrustedByBar';

const WorkSection = lazy(() => import('@/sections/WorkSection'));
const TestimonialsSection = lazy(() => import('@/sections/TestimonialsSection'));
const BeforeAfterSection = lazy(() => import('@/sections/BeforeAfterSection'));
const ServicesSection = lazy(() => import('@/sections/ServicesSection'));
const AboutSection = lazy(() => import('@/sections/AboutSection'));
const ContactSection = lazy(() => import('@/sections/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

function SectionSkeleton() {
  return (
    <div className="w-full py-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-30" />
    </div>
  );
}

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

function App() {
  const lang = useLanguage();
  const dark = useDarkMode();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    html.dir = lang.isAr ? 'rtl' : 'ltr';
    html.lang = lang.isAr ? 'ar' : 'en';
  }, [lang.isAr]);

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
        <ScrollProgressBar />
        <Header lang={lang} dark={dark} />
        <ErrorBoundary>
          <main>
            <HeroSection lang={lang} />
            <MarqueeSection />
            <TrustedByBar lang={lang} />

            <Suspense fallback={<SectionSkeleton />}>
              <WorkSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <BeforeAfterSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <TestimonialsSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ServicesSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <AboutSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ContactSection lang={lang} />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <Footer />
            </Suspense>
          </main>
        </ErrorBoundary>
        <BackToTop />
        <WhatsAppFAB />
        <CursorGlow />
      </div>
    </>
  );
}

export default App;
