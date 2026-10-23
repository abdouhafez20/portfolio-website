import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function InteractiveBooksPage() {
  const { isAr } = useLanguage();

  usePageMeta(
    isAr ? 'الكتب التفاعلية — د. عبدالرحمن حافظ' : 'Interactive Books — Dr Abdurrahman M. Hafez',
    isAr
      ? 'تصفح الكتب الطبية الإلكترونية التفاعلية مباشرة عبر المتصفح.'
      : 'Browse and read interactive digital flipbooks directly in your browser.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? 'الكتب التفاعلية' : 'Interactive Books'}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted max-w-xl">
        {isAr
          ? 'تجربة قراءة رقمية تفاعلية تحاكي تصفح الكتاب الورقي بدقة وسلاسة.'
          : 'Interactive flipbook experiences engineered for engaging digital medical learning.'}
      </p>
    </section>
  );
}
