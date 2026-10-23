import { siteContent } from '@/data/content';

/**
 * Builds a WhatsApp URL with an optional pre-filled message.
 * The base phone number URL is strictly sourced from siteContent.links.whatsapp.
 */
export function buildWhatsAppUrl(message?: string): string {
  const baseUrl = siteContent.links.whatsapp;
  if (!message || !message.trim()) {
    return baseUrl;
  }
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}text=${encodeURIComponent(message.trim())}`;
}
