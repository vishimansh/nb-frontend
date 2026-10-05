export const GOALS = [
  {
    id: 'reach',
    title: 'ज्यादा लोगों तक पहुंच (Reach)',
    description: 'इलाके में ज्यादा से ज्यादा लोगों को विज्ञापन दिखाएं',
    defaultCtaKey: 'learn_more',
    defaultButtonLabel: 'अधिक जानें',
  },
  {
    id: 'engagement',
    title: 'कॉल और मैसेज (Engagement)',
    description: 'सीधे कॉल या WhatsApp पर ग्राहक से पूछताछ पाएं',
    defaultCtaKey: 'whatsapp_us',
    defaultButtonLabel: 'WhatsApp करें',
  },
  {
    id: 'ctrs',
    title: 'वेबसाइट क्लिक्स (CTR)',
    description: 'अपनी वेबसाइट, स्टोर लिंक या सोशल पेज पर लोग लाएं',
    defaultCtaKey: 'view_now',
    defaultButtonLabel: 'अभी देखें',
  },
];

export const getGoalById = (id) => GOALS.find((g) => g.id === id) || GOALS[1];
