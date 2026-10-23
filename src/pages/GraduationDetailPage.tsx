import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function GraduationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAr } = useLanguage();

  usePageMeta(
    isAr
      ? `دفعة التخرج ${slug ? `(${slug})` : ''} — د. عبدالرحمن حافظ`
      : `Graduation Batch ${slug ? `(${slug})` : ''} — Dr Abdurrahman M. Hafez`,
    isAr
      ? 'تفاصيل ومعرض صور مجلة وأوشحة دفعة التخرج.'
      : 'Graduation batch book preview and identity gallery.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <nav className="mb-6">
        <Link
          to="/graduation"
          className="text-xs uppercase tracking-wider text-forest dark:text-dark-forest hover:underline"
        >
          {isAr ? '← العودة لحفلات التخرج' : '← Back to Graduation'}
        </Link>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? `دفعة التخرج: ${slug || ''}` : `Graduation Batch: ${slug || ''}`}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted">
        {isAr ? 'صفحة تفاصيل الدفعة قيد التجهيز للمرحلة الخامسة.' : 'Graduation batch detail placeholder for Stage 5.'}
      </p>
    </section>
  );
}
