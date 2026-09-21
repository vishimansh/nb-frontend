import React from 'react';
import {
  Judge,
  VideoPlay,
  Activity,
  TrendUp,
  Cpu,
  Teacher,
  Moon,
  Coffee,
  Car,
  Heart,
  SearchNormal1,
  InfoCircle,
  Logout,
} from 'iconsax-react';

// Standardized to iconsax-react library across the application
export const MovieClapperIcon = VideoPlay;
export const SportsWhistleIcon = Activity;
export const GraduationCapIcon = Teacher;
export const ParkLifestyleIcon = Coffee;
export const HealthPulseIcon = Heart;
export const ListSearchIcon = SearchNormal1;
export const ExclamationCircleIcon = InfoCircle;
export const LogoutIcon = Logout;

export const CANONICAL_CATEGORY_ORDER = [
  'politics',
  'entertainment',
  'sports',
  'business',
  'tech',
  'education',
  'astro',
  'lifestyle',
  'auto',
  'health',
];

export const CATEGORY_METADATA = {
  politics: {
    id: 'politics',
    label: 'राजनीति',
    color: '#C87528',
    iconComponent: Judge,
  },
  entertainment: {
    id: 'entertainment',
    label: 'मनोरंजन',
    color: '#8A5A78',
    iconComponent: VideoPlay,
  },
  sports: {
    id: 'sports',
    label: 'खेल',
    color: '#557E63',
    iconComponent: Activity,
  },
  business: {
    id: 'business',
    label: 'बिज़नेस',
    color: '#287A78',
    iconComponent: TrendUp,
  },
  tech: {
    id: 'tech',
    label: 'टेक्नोलॉजी',
    color: '#5267A8',
    iconComponent: Cpu,
  },
  education: {
    id: 'education',
    label: 'शिक्षा',
    color: '#526D8D',
    iconComponent: Teacher,
  },
  astro: {
    id: 'astro',
    label: 'ज्योतिष',
    color: '#74648F',
    iconComponent: Moon,
  },
  lifestyle: {
    id: 'lifestyle',
    label: 'लाइफस्टाइल',
    color: '#71866C',
    iconComponent: Coffee,
  },
  auto: {
    id: 'auto',
    label: 'ऑटो',
    color: '#526778',
    iconComponent: Car,
  },
  health: {
    id: 'health',
    label: 'स्वास्थ्य',
    color: '#C56F6B',
    iconComponent: Heart,
  },
};
