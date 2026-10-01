/**
 * Format validators for Flow B inputs.
 */

export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PINCODE_REGEX = /^\d{6}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

export function isValidPhone(phone) {
  if (!phone) return false;
  return PHONE_REGEX.test(String(phone).trim());
}

export function isValidPincode(pincode) {
  if (!pincode) return false;
  return PINCODE_REGEX.test(String(pincode).trim());
}

export function isValidEmail(email) {
  if (!email || !String(email).trim()) return true; // optional
  return EMAIL_REGEX.test(String(email).trim());
}

export function isValidUrl(url) {
  if (!url) return false;
  const s = String(url).trim();
  if (!s.startsWith('https://')) return false;
  try {
    const parsed = new URL(s);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidGstin(gstin) {
  if (!gstin) return false;
  const s = String(gstin).trim().toUpperCase();
  if (!GSTIN_REGEX.test(s)) return false;
  const stateCode = parseInt(s.slice(0, 2), 10);
  return stateCode >= 1 && stateCode <= 37;
}

export function isValidPan(pan) {
  if (!pan) return false;
  const s = String(pan).trim().toUpperCase();
  return PAN_REGEX.test(s);
}

export function isValidUpi(upi) {
  if (!upi) return false;
  return UPI_REGEX.test(String(upi).trim());
}

/**
 * Masks GST or PAN so raw identity is never persisted.
 * e.g. 27AAAAA1234A1Z5 -> 27AA•••••••Z5
 */
export function maskIdentity(val) {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (s.length >= 10) {
    const start = s.slice(0, 4);
    const end = s.slice(-2);
    const dots = '•'.repeat(s.length - 6);
    return `${start}${dots}${end}`;
  }
  return s;
}
