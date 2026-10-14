export const GOALS = [
  {
    id: 'reach',
    title: 'ज़्यादा लोगों तक पहुँचें',
    description: 'आपके इलाके में ज़्यादा लोग देखें',
    defaultCtaKey: 'learn_more',
    defaultButtonLabel: 'अधिक जानें',
  },
  {
    id: 'engagement',
    title: 'कॉल और मैसेज पाएँ',
    description: 'ग्राहक सीधे कॉल या WhatsApp करें',
    defaultCtaKey: 'whatsapp_us',
    defaultButtonLabel: 'WhatsApp करें',
  },
  {
    id: 'ctrs',
    title: 'वेबसाइट पर विज़िट',
    description: 'लोग आपकी वेबसाइट या पेज पर आएँ',
    defaultCtaKey: 'view_now',
    defaultButtonLabel: 'अभी देखें',
  },
];

export const getGoalById = (id) => GOALS.find((g) => g.id === id) || GOALS[1];
