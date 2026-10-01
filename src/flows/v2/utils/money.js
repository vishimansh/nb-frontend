import { CONFIG } from '../config';

/**
 * Calculates subtotal for given daily budget and duration.
 */
export function calculateSubtotal(daily, days) {
  const d = Math.max(0, Number(daily) || 0);
  const n = Math.max(0, Number(days) || 0);
  return d * n;
}

/**
 * Calculates GST amount from subtotal.
 */
export function calculateGst(subtotal) {
  const sub = Math.max(0, Number(subtotal) || 0);
  return Math.round(sub * CONFIG.GST_RATE);
}

/**
 * Calculates total payable from subtotal (subtotal + GST).
 */
export function calculateTotal(subtotal) {
  const sub = Math.max(0, Number(subtotal) || 0);
  return sub + calculateGst(sub);
}

/**
 * Convenience breakdown helper.
 */
export function getMoneyBreakdown(daily, days) {
  const subtotal = calculateSubtotal(daily, days);
  const gst = calculateGst(subtotal);
  const total = subtotal + gst;
  return { daily, days, subtotal, gst, total };
}
