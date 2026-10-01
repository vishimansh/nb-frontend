import heroImg from '../../assets/illustrations/nb_ads_hero.png';

export const CONFIG = {
  HERO_SRC: heroImg,
  AD_LABEL_TEXT: 'विज्ञापन',
  PLACEHOLDER_SUPPORT_WHATSAPP: '919999999999',   // replace with real support WhatsApp number
  PLACEHOLDER_REVIEW_ETA_TEXT: null,              // null = do not print any turnaround time
  PLACEHOLDER_UNSPENT_POLICY_TEXT: null,          // null = print no refund/credit promise
  VIEWS_PER_RUPEE: 28.5,        // placeholder, from current flow (~Rs 35 per 1,000 views)
  FREQUENCY_CAP: 3,             // placeholder: max times one reader sees the ad
  GST_RATE: 0.18,
  RANGE_LOW_FACTOR: 0.8,
  MIN_DAILY: 100,
  MAX_DAILY: 2500,
  DAILY_STEP: 25,
  MIN_DAYS: 1,
  MAX_DAYS: 90,
  MAX_IMAGE_EDGE_PX: 1280,
  IMAGE_QUALITY: 0.8,
  MAX_VIDEO_SECONDS: 60,
  MAX_VIDEO_MB: 50,
  MIN_SAMPLE_FOR_INSIGHT: 1000,
  DEMO_AGE_SHARES: { '18-27': 0.34, '28-43': 0.33, '44-59': 0.21, '60+': 0.12 },
  DEMO_GENDER_SHARES: { male: 0.52, female: 0.48, all: 1 },
};
