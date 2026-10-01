export const POLICY_WORDS = {
  blocked: [
    'सट्टा',
    'जुआ',
    'चमत्कारी इलाज',
    'बिना लाइसेंस लोन',
    'अश्लील',
  ],
  claims: [
    '100% गारंटी',
    'No.1',
    'नंबर 1',
    'सबसे बेस्ट',
    'गारंटी',
  ],
};

/**
 * Checks text for blocked policy words (instant blocker).
 */
export function checkBlockedWords(text) {
  if (!text) return null;
  for (const word of POLICY_WORDS.blocked) {
    if (text.includes(word)) {
      return word;
    }
  }
  return null;
}

/**
 * Checks text for unprovable claims (amber warning).
 */
export function checkClaimWords(text) {
  if (!text) return null;
  for (const word of POLICY_WORDS.claims) {
    if (text.includes(word)) {
      return word;
    }
  }
  return null;
}
