import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAr } = useLanguage();

  usePageMeta(
    isAr
      ? `تفاصيل الكتاب ${slug ? `(${slug})` : ''} — د. عبدالرحمن حافظ`
      : `Book Details ${slug ? `(${slug})` : ''} — Dr Abdurrahman M. Hafez`,
    isAr
      ? 'تفاصيل المشروع ومعاينة الصفحات وعينات PDF.'
      : 'Project details, page previews, and sample PDF documents.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <nav className="mb-6">
        <Link
          to="/books"
          className="text-xs uppercase tracking-wider text-forest dark:text-dark-forest hover:underline"
        >
          {isAr ? '← العودة للكتب' : '← Back to Books'}
        </Link>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? `تفاصيل الكتاب: ${slug || ''}` : `Book Details: ${slug || ''}`}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted">
        {isAr ? 'صفحة تفاصيل الكتاب قيد التجهيز للمرحلة الثالثة.' : 'Book detail page placeholder for Stage 3.'}
      </p>
    </section>
  );
}
