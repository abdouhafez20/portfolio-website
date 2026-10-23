import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function BooksPage() {
  const { isAr } = useLanguage();

  usePageMeta(
    isAr ? 'الكتب والإصدارات — د. عبدالرحمن حافظ' : 'Books & Publications — Dr Abdurrahman M. Hafez',
    isAr
      ? 'تصفح الكتب الطبية والمذكرات الأكاديمية والملخصات.'
      : 'Explore medical textbooks, academic handouts, and structured question banks.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? 'الكتب والإصدارات' : 'Books & Publications'}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted max-w-xl">
        {isAr
          ? 'مكتبة الأعمال والمشاريع الطبية والأكاديمية المصممة بعناية.'
          : 'Selected medical and academic book projects with editorial precision.'}
      </p>
    </section>
  );
}
