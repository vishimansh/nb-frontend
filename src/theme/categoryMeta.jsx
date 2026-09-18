import React from 'react';
import {
  Judge,
  TrendUp,
  Cpu,
  Moon,
  Car,
} from 'iconsax-react';

// Custom precision SVGs to match the exact design screenshots
export function MovieClapperIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="7" width="19" height="13.5" rx="2.5" />
      <path d="M2.5 11.5h19" />
      <path d="M3 7l3.5-3.5h3.5l-3.5 3.5" />
      <path d="M10 7l3.5-3.5h3.5l-3.5 3.5" />
      <path d="M17 7l3.5-3.5h1" />
    </svg>
  );
}

export function SportsWhistleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 4a3.5 3.5 0 0 0-3.5 3.5v.5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v1a5 5 0 0 0 9.5 2.2l4-4a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0l-1.8 1.8" />
      <circle cx="10" cy="14" r="1.8" />
    </svg>
  );
}

export function GraduationCapIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12.5v4.5c3 2.5 9 2.5 12 0v-4.5" />
    </svg>
  );
}

export function ParkLifestyleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5l3.5 6h-2l3.5 6.5h-7l3.5-6.5h-2L9 3.5z" />
      <path d="M7.5 16v4.5" />
      <path d="M15 14h6" />
      <path d="M15 11v6" />
      <path d="M21 11v6" />
      <path d="M14 17.5h8" />
    </svg>
  );
}

export function HealthPulseIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572" />
      <path d="M7 13h2.5l1.5-3l2 6l1.5-3h2.5" />
    </svg>
  );
}

export function ListSearchIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="4.5" />
      <path d="M11.5 11.5l3 3" />
      <path d="M15 5.5h5.5" />
      <path d="M15 9.5h5.5" />
      <path d="M5.5 17h15" />
    </svg>
  );
}

export function ExclamationCircleIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5" />
      <circle cx="12" cy="16.5" r="0.8" fill={color} />
    </svg>
  );
}

export function LogoutIcon({ size = 18, color = '#7C7262' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 16l4-4-4-4" />
      <path d="M4 12h10" />
    </svg>
  );
}

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
    iconComponent: MovieClapperIcon,
  },
  sports: {
    id: 'sports',
    label: 'खेल',
    color: '#557E63',
    iconComponent: SportsWhistleIcon,
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
    iconComponent: GraduationCapIcon,
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
    iconComponent: ParkLifestyleIcon,
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
    iconComponent: HealthPulseIcon,
  },
};
