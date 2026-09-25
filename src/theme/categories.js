import React from 'react';
import {
  TrendUp,
  Judge,
  Teacher,
  Coffee,
  Car,
  Heart,
} from 'iconsax-react';
import { PiCricketFill } from 'react-icons/pi';
import { Clapperboard, BrainCircuit } from 'lucide-react';
import AstroZodiacWheelIcon from '../components/icons/AstroZodiacWheelIcon';
import AstroPlanetIcon from '../components/icons/AstroPlanetIcon';

// Adapters so all icons accept { size, color } uniformly, matching iconsax-react API
// Note: plain .js file — use React.createElement instead of JSX
const makePiAdapter = (PiIcon) => function PiAdapter({ size = 24, color = 'currentColor' }) {
  return React.createElement(PiIcon, { style: { width: size, height: size, color } });
};
const makeLucideAdapter = (LucideIcon) => function LucideAdapter({ size = 24, color = 'currentColor' }) {
  return React.createElement(LucideIcon, { size, color, strokeWidth: 1.8 });
};

const CricketIcon = makePiAdapter(PiCricketFill);
const AstroIcon = (props) => React.createElement(AstroZodiacWheelIcon, props);
const MoonStarIcon = AstroIcon;
const MoonOrbitIcon = AstroIcon;
const AstrolabeIcon = AstroIcon;
const ClapperboardIcon = makeLucideAdapter(Clapperboard);
const BrainCircuitIcon = makeLucideAdapter(BrainCircuit);

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
    icon: CricketIcon,
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
    icon: BrainCircuitIcon,
  },
  entertainment: {
    id: 'entertainment',
    label: 'मनोरंजन',
    color: '#8A5A78',
    icon: ClapperboardIcon,
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
    icon: MoonStarIcon,
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
