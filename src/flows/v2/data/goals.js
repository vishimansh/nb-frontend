export const GOALS = [
  {
    id: 'reach',
    title: 'ज़्यादा लोग मेरी दुकान को जानें',
    description: 'अपने शहर में ज़्यादा से ज़्यादा लोगों को विज्ञापन दिखाएँ',
    defaultCtaKey: 'learn_more',
    defaultButtonLabel: 'अधिक जानें',
  },
  {
    id: 'engagement',
    title: 'ग्राहक कॉल या WhatsApp करें',
    description: 'ग्राहक सीधे कॉल या WhatsApp पर पूछताछ करें',
    defaultCtaKey: 'whatsapp_us',
    defaultButtonLabel: 'WhatsApp करें',
  },
  {
    id: 'ctrs',
    title: 'लोग मेरी वेबसाइट या पेज देखें',
    description: 'लोग आपकी वेबसाइट, सोशल मीडिया या स्टोर लिंक पर आएँ',
    defaultCtaKey: 'view_now',
    defaultButtonLabel: 'अभी देखें',
  },
];

export const getGoalById = (id) => GOALS.find((g) => g.id === id) || GOALS[1];
