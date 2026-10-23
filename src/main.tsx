import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Layout from '@/components/Layout';
import './index.css';

// Lazy-loaded route pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const BooksPage = lazy(() => import('@/pages/BooksPage'));
const BookDetailPage = lazy(() => import('@/pages/BookDetailPage'));
const GraduationPage = lazy(() => import('@/pages/GraduationPage'));
const GraduationDetailPage = lazy(() => import('@/pages/GraduationDetailPage'));
const InteractiveBooksPage = lazy(() => import('@/pages/InteractiveBooksPage'));
const InteractiveBookDetailPage = lazy(() => import('@/pages/InteractiveBookDetailPage'));
const PresentationsPage = lazy(() => import('@/pages/PresentationsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="w-full min-h-[50vh] flex items-center justify-center"
    >
      <div className="w-8 h-8 border-2 border-forest dark:border-dark-forest border-t-transparent rounded-full animate-spin opacity-40" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="books/:slug" element={<BookDetailPage />} />
              <Route path="graduation" element={<GraduationPage />} />
              <Route path="graduation/:slug" element={<GraduationDetailPage />} />
              <Route path="interactive-books" element={<InteractiveBooksPage />} />
              <Route path="interactive-books/:slug" element={<InteractiveBookDetailPage />} />
              <Route path="presentations" element={<PresentationsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
