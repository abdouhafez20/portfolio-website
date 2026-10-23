import { useLanguage } from '@/hooks/useLanguage';
import { usePageMeta } from '@/hooks/usePageMeta';
import { siteContent } from '@/data/content';
import { MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const { t, isAr } = useLanguage();
  const { brand, links } = siteContent;

  usePageMeta(
    isAr ? 'عن د. عبدالرحمن حافظ — مصمم محتوى طبي' : 'About Dr Abdurrahman M. Hafez — Medical Content Designer',
    isAr
      ? 'سيرة مهنية وخبرة في تصميم وتحرير الكتب والمجلات الطبية والأكاديمية.'
      : 'Biography and background in medical and academic editorial design based in Cairo, Egypt.',
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-10 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-dark-text">
          {t('about.title')}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-mist dark:text-dark-muted leading-relaxed">
          {t('about.bio1')}
        </p>
        <p className="mt-3 text-sm sm:text-base text-mist dark:text-dark-muted leading-relaxed">
          {t('about.bio2')}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-2"
          >
            <MessageCircle size={15} />
            <span>{isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
          </a>
          <span className="text-xs text-mist dark:text-dark-muted">
            {isAr ? 'القاهرة، مصر · متاح للعمل عن بُعد' : `${brand.city} · Remote Worldwide`}
          </span>
        </div>
      </div>
    </section>
  );
}
