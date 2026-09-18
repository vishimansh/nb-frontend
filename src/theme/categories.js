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
    color: '#5267A8',
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
    color: '#526D8D',
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

export function getCategoryMeta(categoryId) {
  return (
    NOTIFICATION_CATEGORIES[categoryId] || {
      id: categoryId || 'general',
      label: 'समाचार',
      color: '#497877',
      icon: TrendUp,
    }
  );
}

export default NOTIFICATION_CATEGORIES;
