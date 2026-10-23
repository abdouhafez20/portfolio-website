import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function GraduationPage() {
  const { isAr } = useLanguage();

  usePageMeta(
    isAr ? 'حفلات التخرج ودفعات كليات الطب — د. عبدالرحمن حافظ' : 'Graduation Batches — Dr Abdurrahman M. Hafez',
    isAr
      ? 'تصميم مجلات ودروع وأوشحة وبوسترات حفلات التخرج لكليات الطب.'
      : 'Graduation magazines, jackets, and stage designs for medical faculties.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
        {isAr ? 'حفلات التخرج' : 'Graduation Batches'}
      </h1>
      <p className="mt-3 text-sm text-mist dark:text-dark-muted max-w-xl">
        {isAr
          ? 'تصاميم متكاملة لحفلات تخرج دفعات كليات الطب في الجامعات المصرية.'
          : 'Editorial and visual identity packages for medical school graduation batches.'}
      </p>
    </section>
  );
}
