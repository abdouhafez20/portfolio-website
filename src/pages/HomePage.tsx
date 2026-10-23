import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function HomePage() {
  const { isAr } = useLanguage();

  usePageMeta(
    isAr ? 'د. عبدالرحمن حافظ — مصمم محتوى طبي وأكاديمي' : 'Dr Abdurrahman M. Hafez — Medical Content Designer',
    isAr
      ? 'تصميم محتوى تعليمي احترافي، كتب أكاديمية، ملفات PDF منظمة، ومواد للجامعات والمؤسسات الطبية.'
      : 'Crafting educational content, academic books, structured PDFs, and institutional materials in Cairo, Egypt.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink dark:text-dark-text leading-tight">
          {isAr ? 'نصمم المعرفة لتبقى' : 'Designing Knowledge That Endures'}
        </h1>
        <p className="mt-4 text-base text-mist dark:text-dark-muted leading-relaxed">
          {isAr
            ? 'تصميم محتوى تعليمي احترافي، كتب أكاديمية، ملفات PDF منظمة، ومواد للجامعات والكليات والمؤسسات — مع تخصص عميق في المجال الطبي.'
            : 'Crafting educational content, academic books, structured PDFs, and institutional materials — with deep specialisation in the medical field.'}
        </p>
      </div>
    </section>
  );
}
