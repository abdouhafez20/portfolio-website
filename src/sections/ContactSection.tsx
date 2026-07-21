import { useState, useRef, useCallback, useEffect } from 'react';
import {
  BriefcaseBusiness,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIntersectionReveal } from '@/hooks/useIntersectionReveal';
import Toast from '@/components/Toast';
import { siteContent } from '@/data/content';

interface Props {
  lang: ReturnType<typeof useLanguage>;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

const socialIconMap = {
  briefcase: BriefcaseBusiness,
  linkedin: Linkedin,
  instagram: Instagram,
} as const;

const { links, socials, contact } = siteContent;

/* ─────────────────────────────────────────
   Shared input class builder
───────────────────────────────────────── */
function inputCls(hasError: boolean) {
  const base = [
    'w-full',
    'text-base md:text-sm',
    'bg-white dark:bg-dark-card',
    'text-ink dark:text-dark-text',
    'placeholder:text-mist/35 dark:placeholder:text-dark-muted/35',
    'border px-4 py-3.5 rounded-[10px]',
    'transition-all duration-200',
    'focus:outline-none',
    'focus:border-forest dark:focus:border-dark-forest',
    'focus:shadow-focus',
  ].join(' ');

  const error = 'border-amber-400 dark:border-amber-500';
  const normal = 'border-ink/12 dark:border-white/10 hover:border-ink/25 dark:hover:border-white/20';

  return hasError ? `${base} ${error}` : `${base} ${normal}`;
}

export default function ContactSection({ lang }: Props) {
  const { t } = lang;
  const sectionRef = useIntersectionReveal();
  const waHref = links.whatsapp ?? '#contact';
  const waIsExternal = /^(https?:|\/\/|mailto:)/.test(String(waHref));
  const [errors, setErrors] = useState<FormErrors>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nameRef    = useRef<HTMLInputElement>(null);
  const emailRef   = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
    }
  }, []);

  const validate = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!nameRef.current?.value.trim())      e.name    = t('contact.nameError');
    const em = emailRef.current?.value.trim() ?? '';
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = t('contact.emailError');
    if (!serviceRef.current?.value)          e.service = t('contact.serviceError');
    if (!messageRef.current?.value.trim())   e.message = t('contact.messageError');
    return e;
  }, [t]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0] as keyof FormErrors;
      ({ name: nameRef, email: emailRef, service: serviceRef, message: messageRef })[first]?.current?.focus();
      return;
    }

    setSubmitting(true);

    const name    = nameRef.current!.value;
    const email   = emailRef.current!.value;
    const service = serviceRef.current!.value;
    const message = messageRef.current!.value;

    // Prepare message payload for WhatsApp
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`);

    // Derive international WhatsApp number from local input (011... -> 20... for Egypt)
    let waNumber = '0201123281688';
    waNumber = waNumber.replace(/[^0-9+]/g, '').replace(/^\+/, '');
    if (waNumber.startsWith('00')) waNumber = waNumber.slice(2);
    if (waNumber.startsWith('0')) waNumber = waNumber.slice(1);
    if (!waNumber.startsWith('20')) waNumber = `20${waNumber}`;

    const waUrl = `https://wa.me/${waNumber}?text=${body}`;

    // Small delay so the user sees the button state before WhatsApp opens
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
    }

    submitTimerRef.current = setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setSubmitting(false);
      submitTimerRef.current = null;

      if (nameRef.current)    nameRef.current.value    = '';
      if (emailRef.current)   emailRef.current.value   = '';
      if (serviceRef.current) serviceRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
      setErrors({});
      setToastVisible(true);
    }, 400);
  }, [validate]);

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="py-16 md:py-24 px-5 md:px-10 border-t border-card-border dark:border-dark-border"
      >
        <div className="max-w-screen-xl mx-auto space-y-14">

          {/* ── Header ── */}
          <div className="reveal space-y-3 text-center">
            <span className="eyebrow">{t('contact.title')}</span>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight text-ink dark:text-dark-text">
              {t('contact.heading')}{' '}
              <em className="text-forest dark:text-dark-forest">{t('contact.headingHighlight')}</em>
            </h2>
            <p className="font-arabic text-sm text-mist dark:text-dark-muted" dir="rtl">
              {t('contact.tagline')}
            </p>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16">

            {/* ── Left column ── */}
            <div className="space-y-8 reveal">

              {/* WhatsApp — primary CTA, stands out */}
              <a
                href={waHref}
                target={waIsExternal ? '_blank' : undefined}
                rel={waIsExternal ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-wa-green/30 bg-wa-green/6 dark:bg-wa-green/5 px-5 py-4 transition-all duration-200 hover:border-wa-green/60 hover:bg-wa-green/10 focus:outline-none focus:ring-2 focus:ring-wa-green/40 dark:hover:bg-wa-green/8"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wa-green/15 text-wa-green transition-colors group-hover:bg-wa-green/25">
                  <MessageCircle size={20} strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-wa-green/70">
                    {t('contact.waLabel')}
                  </div>
                  <div className="mt-0.5 truncate text-sm font-semibold text-ink dark:text-dark-text transition-colors group-hover:text-wa-green">
                    {t('contact.waTitle')}
                  </div>
                  <p className="mt-0.5 font-arabic text-[11px] text-mist dark:text-dark-muted" dir="rtl">
                    {t('contact.waHint')}
                  </p>
                </div>
                <Send size={14} className="ml-auto shrink-0 text-wa-green/40 transition-transform group-hover:translate-x-0.5" />
              </a>

              {/* Email — secondary */}
              <a
                href={links.emailHref}
                className="group flex items-center gap-4 rounded-2xl border border-card-border dark:border-dark-border px-5 py-4 transition-all duration-200 hover:border-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/30 dark:hover:border-dark-forest/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest/8 dark:bg-dark-forest/8 text-forest dark:text-dark-forest transition-colors group-hover:bg-forest/15 dark:group-hover:bg-dark-forest/15">
                  <Mail size={20} strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted">
                    {t('contact.emailLabel')}
                  </div>
                  <div className="mt-0.5 truncate text-sm text-ink dark:text-dark-text transition-colors group-hover:text-forest dark:group-hover:text-dark-forest">
                    {t('contact.emailTitle')}
                  </div>
                </div>
              </a>

              {/* Location — no hover, just info */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/8 dark:bg-gold/6 text-gold dark:text-dark-gold">
                  <MapPin size={20} strokeWidth={1.6} />
                </div>
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted">
                    {t('contact.locationLabel')}
                  </div>
                  <div className="mt-0.5 text-sm text-ink dark:text-dark-text">
                    {t('contact.locationTitle')}
                  </div>
                  <p className="mt-0.5 font-arabic text-[11px] text-mist dark:text-dark-muted" dir="rtl">
                    {t('contact.locationAr')}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-card-border dark:bg-dark-border" />

              {/* Social links — full-width row, more visual weight */}
              <div className="flex gap-2">
                {socials.map((social) => {
                  const Icon = socialIconMap[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-1 flex-col items-center gap-2 rounded-xl border border-card-border dark:border-dark-border py-3.5 text-mist dark:text-dark-muted transition-all duration-200 hover:border-forest/30 hover:bg-forest/4 hover:text-forest focus:outline-none focus:ring-2 focus:ring-forest/30 dark:hover:border-dark-forest/30 dark:hover:bg-dark-forest/4 dark:hover:text-dark-forest"
                    >
                      <Icon size={18} strokeWidth={1.6} />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">
                        {social.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* ── Right column — Form ── */}
            <div className="reveal reveal-delay-1 rounded-2xl border border-black/8 dark:border-dark-border bg-cream dark:bg-dark-card shadow-card p-6 md:p-10">
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-dark-text">
                {t('contact.formTitle')}
              </h3>
              <span className="mt-3 block h-[2px] w-10 bg-forest rounded-full" />
              <p className="mt-3 font-arabic text-xs text-mist/80 dark:text-dark-muted/80" dir="rtl">
                {t('contact.formHint')}
              </p>

              {/* mailto hint — sets expectation before they click submit */}
              <p className="mt-4 mb-6 flex items-center gap-1.5 text-[11px] text-mist/60 dark:text-dark-muted/50">
                <Mail size={12} />
                {t('contact.directEmail')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* Name + Email side by side on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted mb-2">
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      id="contact-name"
                      ref={nameRef}
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      className={inputCls(!!errors.name)}
                      aria-invalid={!!errors.name}
                      aria-required="true"
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-[10px] text-amber-500" role="alert">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted mb-2">
                      {t('contact.emailLabel2')}
                    </label>
                    <input
                      id="contact-email"
                      ref={emailRef}
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      className={inputCls(!!errors.email)}
                      aria-invalid={!!errors.email}
                      aria-required="true"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-[10px] text-amber-500" role="alert">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="contact-service" className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted mb-2">
                    {t('contact.serviceLabel')}
                  </label>
                  <div className="relative">
                    <select
                      id="contact-service"
                      ref={serviceRef}
                      defaultValue=""
                      className={`${inputCls(!!errors.service)} appearance-none pr-9 cursor-pointer`}
                      aria-invalid={!!errors.service}
                      aria-required="true"
                      aria-describedby={errors.service ? 'service-error' : undefined}
                      required
                    >
                      <option value="" disabled className="text-mist">
                        {t('contact.servicePlaceholder')}
                      </option>
                      {contact.serviceOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mist dark:text-dark-muted" />
                  </div>
                  {errors.service && (
                    <p id="service-error" className="mt-1.5 text-[10px] text-amber-500" role="alert">{errors.service}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-mist dark:text-dark-muted mb-2">
                    {t('contact.messageLabel')}
                  </label>
                  <textarea
                    id="contact-message"
                    ref={messageRef}
                    rows={4}
                    placeholder={t('contact.messagePlaceholder')}
                    className={`${inputCls(!!errors.message)} resize-none min-h-[120px]`}
                    aria-invalid={!!errors.message}
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    required
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-[10px] text-amber-500" role="alert">{errors.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-shimmer inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-12"
                  >
                    <Send size={13} className={submitting ? 'animate-pulse' : ''} />
                    {submitting ? '…' : t('contact.submitBtn')}
                  </button>

                  <a
                    href={waHref}
                    target={waIsExternal ? '_blank' : undefined}
                    rel={waIsExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-wa-green px-8 h-12 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-wa-green/40"
                  >
                    <MessageCircle size={13} />
                    {t('contact.waBtn')}
                  </a>
                </div>

              </form>
            </div>
          </div>

          {/* Footer extracted to src/components/Footer.tsx */}

        </div>
      </section>

      <Toast
        message={t('toast.message')}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}
