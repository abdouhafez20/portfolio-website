import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function PresentationsPage() {
  const { isAr } = useLanguage();

  usePageMeta(
    isAr ? 'العروض التقديمية الطبية — د. عبدالرحمن حافظ' : 'Medical Presentations — Dr Abdurrahman M. Hafez',
    isAr
      ? 'عروض تقديمية وشرائح تعليمية ومحاضرات طبية مصممة باحترافية.'
      : 'Professional medical presentation slide decks, visual diagrams, and lecture slides.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? 'العروض التقديمية' : 'Presentations'}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted max-w-xl">
        {isAr
          ? 'تصميم شرائح عروض تقديمية طبية وأكاديمية للمؤتمرات والمحاضرات الجامعية.'
          : 'High-impact medical and academic presentation decks engineered for conferences and lectures.'}
      </p>
    </section>
  );
}
