import { siteContent } from '@/data/content';

const content = siteContent.marqueeItems.join(' \u00B7 ') + ' \u00B7 ';

export default function MarqueeSection() {
  return (
    <section className="py-4 md:py-5 bg-white/20 dark:bg-white/[0.02] border-y border-card-border dark:border-dark-border overflow-hidden" aria-hidden="true">
      {/*
        The marquee uses a continuous scrolling animation while visible.
        Retain `will-change: transform` here because the element is animating continuously
        and removing it can cause visible jank. We only keep the permanent will-change
        for this specific, justified case to avoid unnecessary GPU memory usage elsewhere.
      */}
      <div className="animate-marquee motion-reduce:animate-none whitespace-nowrap flex will-change-transform">
        <span className="text-[9px] uppercase tracking-[0.32em] font-medium text-mist dark:text-dark-muted px-4 md:px-6 flex-shrink-0">
          {content}
        </span>
        <span className="text-[9px] uppercase tracking-[0.32em] font-medium text-mist dark:text-dark-muted px-4 md:px-6 flex-shrink-0">
          {content}
        </span>
      </div>
    </section>
  );
}
