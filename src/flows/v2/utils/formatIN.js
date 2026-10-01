/**
 * Indian Number and Currency Formatter
 * - Indian grouping: 1,03,435
 * - Lakh formatting for numbers >= 1,00,000: 1.03 लाख
 * - Never uses 'k'
 * - Ranges with en-dash: 6,000–7,600
 */

export function formatIN(num) {
  if (num == null || isNaN(num)) return '0';
  const n = Math.round(Number(num));
  const s = Math.abs(n).toString();

  if (s.length <= 3) {
    return (n < 0 ? '-' : '') + s;
  }

  const lastThree = s.slice(-3);
  const remaining = s.slice(0, -3);

  // Group by 2 digits for remaining
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const result = `${formattedRemaining},${lastThree}`;
  return (n < 0 ? '-' : '') + result;
}

export function formatLakh(num) {
  if (num == null || isNaN(num)) return '0';
  const n = Number(num);
  if (n < 100000) {
    return formatIN(n);
  }
  const lakhVal = n / 100000;
  // Up to two decimals, removing trailing zeroes
  const formatted = lakhVal.toFixed(2).replace(/\.?0+$/, '');
  return `${formatted} लाख`;
}

export function formatRupees(num) {
  return `₹${formatIN(num)}`;
}

export function formatRange(lo, hi) {
  return `${formatIN(lo)}–${formatIN(hi)}`;
}

export function formatRupeesRange(lo, hi) {
  return `₹${formatIN(lo)}–₹${formatIN(hi)}`;
}
