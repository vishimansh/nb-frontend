import React from 'react';
import { ArrowRight2 } from 'iconsax-react';
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
  const color = CATEGORY_ACCENT_COLORS[categoryKey] || category.color || '#1E213D';
  const illustration = CATEGORY_ILLUSTRATIONS[categoryKey];

  return (
    <div className={`w-full max-w-[386px] h-[46px] bg-white rounded-[14px] border border-[#E5E7EB] px-[14px] flex items-center justify-between relative overflow-hidden shadow-xs select-none mx-auto ${className}`}>
      {/* Left side: Accent bar + Title */}
      <div className="flex items-center z-10">
        <span
          className="w-[3.5px] h-[24px] rounded-none shrink-0"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-[20px] font-bold text-[#1E213D] ml-[10px] leading-none flex items-center">
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
        /* Faint Silhouette Graphic (opacity-15, themed silhouette watermark fallback) */
        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-15 overflow-hidden flex items-center z-0">
        {category.id === 'politics' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Parliament / Capitol dome silhouette */}
            <path d="M50 2 L52 8 L48 8 Z M45 8 H55 V12 H45 Z M30 12 H70 V15 H30 Z M33 15 H37 V26 H33 Z M42 15 H46 V26 H42 Z M54 15 H58 V26 H54 Z M63 15 H67 V26 H63 Z M25 26 H75 V29 H25 Z" />
          </svg>
        )}
        {category.id === 'entertainment' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Film clapper / camera reel */}
            <path d="M30 6 L45 6 L42 12 L27 12 Z M47 6 L62 6 L59 12 L44 12 Z M64 6 L79 6 L76 12 L61 12 Z M25 14 H80 V28 H25 Z M70 18 A4 4 0 1 1 70 24 A4 4 0 1 1 70 18" />
          </svg>
        )}
        {category.id === 'sports' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Sports runner / cricket bat & ball */}
            <circle cx="35" cy="10" r="4" />
            <path d="M32 15 L38 22 L45 28 M38 18 L46 14" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="70" cy="18" r="6" />
          </svg>
        )}
        {category.id === 'business' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Growth chart bars */}
            <rect x="25" y="18" width="6" height="10" rx="1" />
            <rect x="37" y="14" width="6" height="14" rx="1" />
            <rect x="49" y="9" width="6" height="19" rx="1" />
            <rect x="61" y="4" width="6" height="24" rx="1" />
            <path d="M26 16 L39 12 L51 7 L63 2" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        {category.id === 'tech' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Circuit / chip */}
            <rect x="40" y="7" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="45" y1="2" x2="45" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="55" y1="2" x2="55" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="45" y1="23" x2="45" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="55" y1="23" x2="55" y2="28" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
        {category.id === 'education' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Graduation cap */}
            <path d="M50 6 L25 15 L50 24 L75 15 Z M35 19 V24 C35 27 65 27 65 24 V19" />
          </svg>
        )}
        {category.id === 'astro' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Crescent moon and stars */}
            <path d="M48 6 A10 10 0 0 0 58 24 A12 12 0 1 1 48 6 Z M68 8 L70 12 L74 12 L71 14 L72 18 L68 15 L64 18 L65 14 L62 12 L66 12 Z" />
          </svg>
        )}
        {category.id === 'health' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Heartbeat pulse */}
            <path d="M25 16 H40 L45 7 L52 25 L58 12 L63 18 L68 16 H78" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        {category.id === 'lifestyle' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Tree and leaves */}
            <path d="M50 6 C42 6 36 12 36 19 C36 24 40 27 46 28 L46 29 H54 L54 28 C60 27 64 24 64 19 C64 12 58 6 50 6 Z" />
          </svg>
        )}
        {category.id === 'auto' && (
          <svg className="w-24 h-8 fill-current text-[#1E213D]" viewBox="0 0 100 30">
            {/* Sports car silhouette */}
            <path d="M25 21 L32 14 C36 11 43 10 52 10 L68 12 L75 17 L80 19 V24 H76 A5 5 0 0 1 66 24 H42 A5 5 0 0 1 32 24 H25 Z" />
          </svg>
        )}
      </div>
      )}

      {/* Trailing Link: और size is 16px bold/semibold in #1E213D with CaretRight icon */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onCategoryClick) {
            onCategoryClick(category.id);
          }
        }}
        aria-label={`${category.label} की और खबरें देखें`}
        className="text-[16px] font-bold text-[#1E213D] hover:text-black flex items-center gap-[6px] cursor-pointer z-10 transition-colors leading-none pr-0"
      >
        <span className="leading-none">और</span>
        <ArrowRight2 size={16} color="#1E213D" variant="Linear" className="shrink-0" />
      </button>
    </div>
  );
}
