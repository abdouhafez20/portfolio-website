/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_URL: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_EMAIL_HREF: string;
  readonly VITE_BEHANCE_URL: string;
  readonly VITE_LINKEDIN_URL: string;
  readonly VITE_INSTAGRAM_URL: string;
  readonly VITE_PDF_VIEWER_BASE_URL: string;
  readonly VITE_GOOGLE_FONTS_ORIGIN: string;
  readonly VITE_GOOGLE_FONTS_STATIC_ORIGIN: string;
  readonly VITE_GOOGLE_FONTS_STYLESHEET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
