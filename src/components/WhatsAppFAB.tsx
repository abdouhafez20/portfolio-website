import { siteContent } from '@/data/content';
import { useState } from 'react';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

export default function WhatsAppFAB() {
  const waHref = siteContent.links.whatsapp ?? '#contact';
  const waIsExternal = /^(https?:|\/\/|mailto:)/.test(String(waHref));
  const [useWillChange, setUseWillChange] = useState(false);

  return (
    <a
      href={waHref}
      target={waIsExternal ? '_blank' : undefined}
      rel={waIsExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setUseWillChange(true)}
      onMouseLeave={() => setUseWillChange(false)}
      className={`fixed bottom-24 right-5 z-40 w-14 h-14 bg-wa-green hover:bg-wa-green/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl dark:shadow-wa transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-wa-green/50 focus:ring-offset-2 dark:focus:ring-offset-dark-bg ${
        useWillChange ? 'will-change-transform' : ''
      }`}
      aria-label={siteContent.whatsappFab.ariaLabel}
      title={siteContent.whatsappFab.title}
    >
      <WhatsAppIcon width={28} height={28} fill="white" />
    </a>
  );
}
