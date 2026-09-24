import {
  TrendUp,
  Activity,
  Judge,
  Cpu,
  VideoPlay,
  Teacher,
  Coffee,
  Moon,
  Car,
  Heart,
} from 'iconsax-react';

export const NOTIFICATION_CATEGORIES = {
  business: {
    id: 'business',
    label: 'बिज़नेस',
    color: '#287A78',
    icon: TrendUp,
  },
  sports: {
    id: 'sports',
    label: 'खेल',
    color: '#557E63',
    icon: Activity,
  },
  politics: {
    id: 'politics',
    label: 'राजनीति',
    color: '#C87528',
    icon: Judge,
  },
  tech: {
    id: 'tech',
    label: 'टेक्नोलॉजी',
    color: '#2B2437',
    icon: Cpu,
  },
  entertainment: {
    id: 'entertainment',
    label: 'मनोरंजन',
    color: '#8A5A78',
    icon: VideoPlay,
  },
  lifestyle: {
    id: 'lifestyle',
    label: 'लाइफस्टाइल',
    color: '#71866C',
    icon: Coffee,
  },
  education: {
    id: 'education',
    label: 'शिक्षा',
    color: '#2B2437',
    icon: Teacher,
  },
  astro: {
    id: 'astro',
    label: 'ज्योतिष',
    color: '#74648F',
    icon: Moon,
  },
  auto: {
    id: 'auto',
    label: 'ऑटो',
    color: '#526778',
    icon: Car,
  },
  health: {
    id: 'health',
    label: 'स्वास्थ्य',
    color: '#C56F6B',
    icon: Heart,
  },
};

const LEGACY_CATEGORY_MAP = {
  business_startup: 'business',
  politics_talk: 'politics',
  culture_stories: 'lifestyle',
  news_analysis: 'politics',
  health_wellness: 'health',
  entertainment_interview: 'entertainment',
  sports_talk: 'sports',
};

export function getCategoryMeta(categoryId) {
  const normalizedId = LEGACY_CATEGORY_MAP[categoryId] || categoryId;
  return (
    NOTIFICATION_CATEGORIES[normalizedId] || {
      id: categoryId || 'general',
      label: 'समाचार',
      color: '#497877',
      icon: TrendUp,
    }
  );
}

export const APP_NEWS_CATEGORIES = NOTIFICATION_CATEGORIES;
export const PODCAST_CATEGORIES = NOTIFICATION_CATEGORIES;
export default NOTIFICATION_CATEGORIES;
