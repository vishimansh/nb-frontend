import React from 'react';
import {
  Judge,
  TrendUp,
  Teacher,
  Coffee,
  Car,
  Heart,
  SearchNormal1,
  InfoCircle,
  Logout,
} from 'iconsax-react';
import { PiCricketFill } from 'react-icons/pi';
import { Clapperboard, BrainCircuit } from 'lucide-react';
import AstroZodiacWheelIcon from '../components/icons/AstroZodiacWheelIcon';
import AstroPlanetIcon from '../components/icons/AstroPlanetIcon';

/**
 * Adapter: wraps react-icons (Phosphor) components so they accept the same
 * { size, color } props that iconsax-react uses across the application.
 */
const makePiAdapter = (PiIcon) => function PiAdapter({ size = 24, color = 'currentColor' }) {
  return <PiIcon style={{ width: size, height: size, color }} />;
};

/**
 * Adapter: wraps lucide-react components so they accept the same
 * { size, color } props that iconsax-react uses across the application.
 */
const makeLucideAdapter = (LucideIcon) => function LucideAdapter({ size = 24, color = 'currentColor' }) {
  return <LucideIcon size={size} color={color} strokeWidth={1.8} />;
};

// New category-specific icons
export const CricketIcon = makePiAdapter(PiCricketFill);
export { AstroZodiacWheelIcon, AstroPlanetIcon };
export const AstroIcon = AstroZodiacWheelIcon;
export const MoonStarIcon = AstroZodiacWheelIcon;
export const MoonOrbitIcon = AstroZodiacWheelIcon;
export const AstrolabeIcon = AstroZodiacWheelIcon;
export const ClapperboardIcon = makeLucideAdapter(Clapperboard);
export const BrainCircuitIcon = makeLucideAdapter(BrainCircuit);

// Standardized icon aliases across the application
export const MovieClapperIcon = ClapperboardIcon;
export const SportsWhistleIcon = CricketIcon;
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
    iconComponent: ClapperboardIcon,
  },
  sports: {
    id: 'sports',
    label: 'खेल',
    color: '#557E63',
    iconComponent: CricketIcon,
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
    iconComponent: BrainCircuitIcon,
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
    iconComponent: AstroZodiacWheelIcon,
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
