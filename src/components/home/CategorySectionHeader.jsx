import React from 'react';
import {
  ArrowRight2,
  Judge,
  TrendUp,
  Teacher,
  Heart,
  Coffee,
  Car,
} from 'iconsax-react';
import { PiCricketFill } from 'react-icons/pi';
import { Clapperboard, BrainCircuit } from 'lucide-react';
import AstroZodiacWheelIcon from '../icons/AstroZodiacWheelIcon';

// Adapters: give react-icons & lucide-react the same { size, color } API as iconsax
const CricketIcon = ({ size = 36, color = 'currentColor' }) => (
  <PiCricketFill style={{ width: size, height: size, color }} />
);
const AstroIcon = AstroZodiacWheelIcon;
const MoonStarIcon = AstroZodiacWheelIcon;
const AstrolabeIcon = AstroZodiacWheelIcon;
const BrainCircuitIcon = ({ size = 36, color = 'currentColor' }) => (
  <BrainCircuit size={size} color={color} strokeWidth={1.8} />
);
const ClapperboardIcon = ({ size = 36, color = 'currentColor' }) => (
  <Clapperboard size={size} color={color} strokeWidth={1.8} />
);
import imgTech from '../../assets/illustrations/category-tech.png';
import imgEducation from '../../assets/illustrations/category-education.png';
import imgLifestyle from '../../assets/illustrations/category-lifestyle.png';
import imgEntertainment from '../../assets/illustrations/category-entertainment.png';
import imgSports from '../../assets/illustrations/category-sports.png';
import imgPolitics from '../../assets/illustrations/category-politics.png';
import imgAstro from '../../assets/illustrations/category-astro.png';
import imgBusiness from '../../assets/illustrations/category-business.png';
import imgAuto from '../../assets/illustrations/category-auto.png';
import imgHealth from '../../assets/illustrations/category-health.png';

const CATEGORY_ILLUSTRATIONS = {
  politics: imgPolitics,
  'राजनीति': imgPolitics,
  tech: imgTech,
  technology: imgTech,
  'टेक्नोलॉजी': imgTech,
  entertainment: imgEntertainment,
  'मनोरंजन': imgEntertainment,
  education: imgEducation,
  'शिक्षा': imgEducation,
  astro: imgAstro,
  astrology: imgAstro,
  'ज्योतिष': imgAstro,
  sports: imgSports,
  'खेल': imgSports,
  lifestyle: imgLifestyle,
  'लाइफस्टाइल': imgLifestyle,
  business: imgBusiness,
  'बिज़नेस': imgBusiness,
  auto: imgAuto,
  'ऑटो': imgAuto,
  health: imgHealth,
  'स्वास्थ्य': imgHealth,
};

const CATEGORY_ACCENT_COLORS = {
  politics: '#C87528',
  'राजनीति': '#C87528',
  tech: '#5267A8',
  technology: '#5267A8',
  'टेक्नोलॉजी': '#5267A8',
  entertainment: '#8A5A78',
  'मनोरंजन': '#8A5A78',
  education: '#526D8D',
  'शिक्षा': '#526D8D',
  astro: '#74648F',
  astrology: '#74648F',
  'ज्योतिष': '#74648F',
  sports: '#557E63',
  'खेल': '#557E63',
  lifestyle: '#71866C',
  'लाइफस्टाइल': '#71866C',
  business: '#287A78',
  'बिज़नेस': '#287A78',
  auto: '#526778',
  'ऑटो': '#526778',
  health: '#C56F6B',
  'स्वास्थ्य': '#C56F6B',
};

/**
 * Category Section Header (46px)
 * Displays category title with a colored vertical accent bar, subtle thematic
 * watermark illustration, and an 'और >' exploration link matching the design inspiration.
 */
export default function CategorySectionHeader({ category, onCategoryClick, className = "" }) {
  const categoryKey = category.id || category.label;
  const color = CATEGORY_ACCENT_COLORS[categoryKey] || category.color || '#2B2437';
  const illustration = CATEGORY_ILLUSTRATIONS[categoryKey];

  return (
    <div className={`w-full max-w-[386px] h-[46px] bg-white rounded-[14px] border border-[#E5E7EB] px-[14px] flex items-center justify-between relative overflow-hidden shadow-xs select-none mx-auto ${className}`}>
      {/* Left side: Accent bar + Title */}
      <div className="flex items-center z-10">
        <span
          className="w-[3.5px] h-[24px] rounded-none shrink-0"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-[20px] font-bold text-[#2B2437] ml-[10px] leading-none flex items-center">
          {category.label}
        </h2>
      </div>

      {/* Category Illustration / Silhouette Graphic */}
      {illustration ? (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-end">
          <img
            src={illustration}
            alt=""
            className="h-full w-auto max-w-none object-contain object-right pointer-events-none select-none"
          />
        </div>
      ) : (
        /* Faint Watermark Icon (opacity-15, themed fallback using iconsax-react) */
        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 overflow-hidden flex items-center z-0">
          {category.id === 'politics' && <Judge size={36} color="#2B2437" variant="Bold" />}
          {category.id === 'entertainment' && <ClapperboardIcon size={36} color="#2B2437" />}
          {category.id === 'sports' && <CricketIcon size={36} color="#2B2437" />}
          {category.id === 'business' && <TrendUp size={36} color="#2B2437" variant="Bold" />}
          {category.id === 'tech' && <BrainCircuitIcon size={36} color="#2B2437" />}
          {category.id === 'education' && <Teacher size={36} color="#2B2437" variant="Bold" />}
          {category.id === 'astro' && <AstroZodiacWheelIcon size={36} />}
          {category.id === 'health' && <Heart size={36} color="#2B2437" variant="Bold" />}
          {category.id === 'lifestyle' && <Coffee size={36} color="#2B2437" variant="Bold" />}
          {category.id === 'auto' && <Car size={36} color="#2B2437" variant="Bold" />}
        </div>
      )}

      {/* Trailing Link: और size is 16px bold/semibold in #2B2437 with CaretRight icon */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onCategoryClick) {
            onCategoryClick(category.id);
          }
        }}
        aria-label={`${category.label} की और खबरें देखें`}
        className="text-[16px] font-bold text-[#2B2437] hover:text-black flex items-center gap-[6px] cursor-pointer z-10 transition-colors leading-none pr-0"
      >
        <span className="leading-none">और</span>
        <ArrowRight2 size={16} color="#2B2437" variant="Linear" className="shrink-0" />
      </button>
    </div>
  );
}
