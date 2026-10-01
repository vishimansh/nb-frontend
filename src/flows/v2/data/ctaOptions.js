export const CTA_OPTIONS = {
  reach: [
    { key: 'learn_more', label: 'अधिक जानें', contactNeeded: 'none' },
    { key: 'visit_shop', label: 'दुकान पर आएँ', contactNeeded: 'none' },
    { key: 'call_us', label: 'कॉल करें', contactNeeded: 'phone' },
  ],
  engagement: [
    { key: 'whatsapp_us', label: 'WhatsApp करें', contactNeeded: 'whatsapp' },
    { key: 'call_us', label: 'कॉल करें', contactNeeded: 'phone' },
    { key: 'order_now', label: 'ऑर्डर करें', contactNeeded: 'whatsapp' },
  ],
  ctrs: [
    { key: 'view_now', label: 'अभी देखें', contactNeeded: 'link' },
    { key: 'learn_more', label: 'अधिक जानें', contactNeeded: 'link' },
    { key: 'order_now', label: 'ऑर्डर करें', contactNeeded: 'whatsapp' },
  ],
};

export const getCtaLabel = (goalId, ctaKey) => {
  const list = CTA_OPTIONS[goalId] || CTA_OPTIONS.engagement;
  const match = list.find((c) => c.key === ctaKey);
  return match ? match.label : 'WhatsApp करें';
};

export const getCtaConfig = (goalId, ctaKey) => {
  const list = CTA_OPTIONS[goalId] || CTA_OPTIONS.engagement;
  return list.find((c) => c.key === ctaKey) || list[0];
};
