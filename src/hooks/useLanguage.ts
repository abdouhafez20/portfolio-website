import { useState, useEffect, useCallback } from 'react';
import { translations } from '@/data/content';

export type Language = 'en' | 'ar';

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    return (localStorage.getItem('portfolio-language') as Language) || 'ar';
  });

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('portfolio-language', lang);
  }, [lang]);

  const setLang = useCallback((l: Language) => setLangState(l), []);
  const toggle = useCallback(() => setLangState(prev => prev === 'en' ? 'ar' : 'en'), []);

  const t = useCallback((key: string) => {
    return translations[lang]?.[key as keyof typeof translations.en] || key;
  }, [lang]);

  return { lang, setLang, toggle, t, isAr: lang === 'ar' };
}

