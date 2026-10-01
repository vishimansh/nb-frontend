import { CONFIG } from '../config';

/**
 * Creates WhatsApp deep-link URL for advertiser support.
 */
export function getWhatsAppSupportUrl(message = 'नमस्ते! मुझे नवभारत ऐड्स के बारे में सहायता चाहिए.') {
  const number = CONFIG.PLACEHOLDER_SUPPORT_WHATSAPP || '919999999999';
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export function openWhatsAppSupport(message) {
  const url = getWhatsAppSupportUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}
