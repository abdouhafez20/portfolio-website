import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function InteractiveBookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAr } = useLanguage();

  usePageMeta(
    isAr
      ? `الكتاب التفاعلي ${slug ? `(${slug})` : ''} — د. عبدالرحمن حافظ`
      : `Interactive Book ${slug ? `(${slug})` : ''} — Dr Abdurrahman M. Hafez`,
    isAr
      ? 'قارئ الكتاب التفاعلي الرقمي المتجاوب.'
      : 'Interactive digital flipbook reader view.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <nav className="mb-6">
        <Link
          to="/interactive-books"
          className="text-xs uppercase tracking-wider text-forest dark:text-dark-forest hover:underline"
        >
          {isAr ? '← العودة للكتب التفاعلية' : '← Back to Interactive Books'}
        </Link>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? `الكتاب التفاعلي: ${slug || ''}` : `Interactive Book: ${slug || ''}`}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted">
        {isAr ? 'صفحة القارئ التفاعلي قيد التجهيز للمرحلة الرابعة.' : 'Interactive book reader placeholder for Stage 4.'}
      </p>
    </section>
  );
}
