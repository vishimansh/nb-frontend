export const REJECTION_REASONS = [
  {
    id: 'blurry_photo',
    text: 'फोटो धुंधली है. साफ़ फोटो डालें',
    field: 'media',
  },
  {
    id: 'unprovable_claim',
    text: 'दावा साबित नहीं हो सकता. "No.1" या "100% गारंटी" जैसे शब्द हटाएँ',
    field: 'headline',
  },
  {
    id: 'wrong_contact',
    text: 'फोन नंबर या लिंक सही नहीं है',
    field: 'contact',
  },
  {
    id: 'banned_content',
    text: 'यह चीज़ विज्ञापन नियमों में मना है',
    field: 'headline',
  },
  {
    id: 'extra_docs',
    text: 'इस श्रेणी के लिए अतिरिक्त कागज़ चाहिए',
    field: 'none',
  },
];

export const getRejectionReasonById = (id) =>
  REJECTION_REASONS.find((r) => r.id === id) || REJECTION_REASONS[0];
