import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ScrollProgressBar from './ScrollProgressBar';
import BackToTop from './BackToTop';
import WhatsAppFAB from './WhatsAppFAB';
import CursorGlow from './CursorGlow';
import ErrorBoundary from './ErrorBoundary';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink dark:bg-dark-bg dark:text-dark-text transition-colors duration-300">
      <ScrollToTop />
      <ScrollProgressBar />
      <Header />
      <ErrorBoundary>
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
      </ErrorBoundary>
      <Footer />
      <BackToTop />
      <WhatsAppFAB />
      <CursorGlow />
    </div>
  );
}
