import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotFoundPage() {
  const { t, isAr } = useLanguage();

  usePageMeta(
    isAr ? 'الصفحة غير موجودة — د. عبدالرحمن حافظ' : 'Page Not Found — Dr Abdurrahman M. Hafez',
    isAr ? 'الصفحة المطلوبة غير موجودة.' : 'The requested page could not be found.',
  );

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <span className="text-8xl font-display font-semibold text-forest/20 dark:text-dark-forest/20">
        404
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink dark:text-dark-text">
        {t('notFound.title')}
      </h1>
      <p className="mt-2 max-w-md text-sm text-mist dark:text-dark-muted">
        {t('notFound.description')}
      </p>
      <Link
        to="/"
        className="btn-shimmer mt-8"
      >
        {t('notFound.backHome')}
      </Link>
    </section>
  );
}
