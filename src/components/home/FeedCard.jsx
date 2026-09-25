import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Judge,
  TrendUp,
  Teacher,
  Heart,
  Car,
  Tree,
  More,
  Location,
  Buildings,
  DocumentText,
  Speaker,
  Whatsapp,
} from 'iconsax-react';
import { PiCricketFill } from 'react-icons/pi';
import { Clapperboard, BrainCircuit } from 'lucide-react';
import AstroZodiacWheelIcon from '../icons/AstroZodiacWheelIcon';
import ArticleOptionsMenu from '../common/ArticleOptionsMenu';

// Adapters: give react-icons & lucide-react the same { size, color } API as iconsax
const CricketIcon = ({ size = 16, color = 'currentColor' }) => (
  <PiCricketFill style={{ width: size, height: size, color }} />
);
const AstroIcon = AstroZodiacWheelIcon;
const MoonStarIcon = AstroZodiacWheelIcon;
const AstrolabeIcon = AstroZodiacWheelIcon;
const BrainCircuitIcon = ({ size = 16, color = 'currentColor' }) => (
  <BrainCircuit size={size} color={color} strokeWidth={1.8} />
);
const ClapperboardIcon = ({ size = 16, color = 'currentColor' }) => (
  <Clapperboard size={size} color={color} strokeWidth={1.8} />
);

export const CATEGORY_PALETTES = {
  politics: { label: 'राजनीति', color: '#B6783A', icon: Judge },
  entertainment: { label: 'मनोरंजन', color: '#805D76', icon: ClapperboardIcon },
  sports: { label: 'खेल', color: '#557E63', icon: CricketIcon },
  business: { label: 'बिज़नेस', color: '#497877', icon: TrendUp },
  tech: { label: 'टेक्नोलॉजी', color: '#2B2437', icon: BrainCircuitIcon },
  education: { label: 'शिक्षा', color: '#2B2437', icon: Teacher },
  astro: { label: 'ज्योतिष', color: '#71668C', icon: AstroZodiacWheelIcon },
  health: { label: 'स्वास्थ्य', color: '#B3746E', icon: Heart },
  lifestyle: { label: 'लाइफस्टाइल', color: '#77856E', icon: Tree },
  auto: { label: 'ऑटो', color: '#596776', icon: Car },
  city: { label: 'शहर', color: '#F5B55C', icon: Location },
  state: { label: 'राज्य', color: '#2B2437', icon: Buildings },
  country: { label: 'देश', color: '#2B2437', icon: DocumentText },
  'top-news': { label: 'टॉप न्यूज़', color: '#F5B55C', icon: DocumentText },
  'top_news': { label: 'टॉप न्यूज़', color: '#F5B55C', icon: DocumentText },
};

const ICON_MAP = {
  Judge,
  ClapperboardIcon,
  CricketIcon,
  AstroZodiacWheelIcon,
  MoonStarIcon,
  AstrolabeIcon,
  BrainCircuitIcon,
  TrendUp,
  Teacher,
  Heart,
  Tree,
  Car,
  Location,
  Buildings,
  DocumentText,
  // Backward-compatible mappings
  Scales: Judge,
  FilmStrip: ClapperboardIcon,
  SoccerBall: CricketIcon,
  GraduationCap: Teacher,
  Plant: Tree,
  Newspaper: DocumentText,
  MapPin: Location,
};

export const LABEL_MAP = {
  'राजनीति': 'politics',
  'मनोरंजन': 'entertainment',
  'खेल': 'sports',
  'बिज़नेस': 'business',
  'टेक्नोलॉजी': 'tech',
  'शिक्षा': 'education',
  'ज्योतिष': 'astro',
  'स्वास्थ्य': 'health',
  'लाइफस्टाइल': 'lifestyle',
  'ऑटो': 'auto',
  'देश': 'country',
  'शहर': 'city',
  'राज्य': 'state',
  'टॉप न्यूज़': 'top_news',
};

/**
 * Reusable 386px × 120px Feed Card Component
 * Pixel-measured directly from reference design:
 * - 386px × 120px fixed footprint
 * - Flat white background, no border, no drop shadow (list-row style)
 * - 8px inset padding on all four sides
 * - 16×16px category theme badge + 13px semibold theme label
 * - 16px bold headline with tight leading (line pitch ~18px), line-clamp-3
 * - 112px wide × ~74px tall right-aligned thumbnail with rounded-[10px]
 * - 1px hairline light-gray divider at ~85px from top
 * - 13px meta row with dark navy WhatsApp circle icon + 3-dot overflow menu
 */
export default function FeedCard({
  category,
  headline,
  thumbnail,
  publishedAgo,
  readTime,
  onShare,
  onMoreOptions,
  onCategoryClick,
  isSponsored = false,
  isBreakingNews = false,
  location = null,
  className = "",
  onClick,
  id,
}) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(id ? `/article/${id}` : '/article/live-bhopal-encroachment');
    }
  };

  // Robust category resolution by id, label, or string
  const catKey =
    (typeof category === 'string' && (CATEGORY_PALETTES[category] ? category : LABEL_MAP[category]))
    || category?.id
    || category?.categoryId
    || (category?.label && LABEL_MAP[category.label])
    || null;

  const palette = (catKey && CATEGORY_PALETTES[catKey]) || null;

  const catColor = isSponsored
    ? '#2B2437'
    : (palette?.color || category?.color || '#497877');

  const catLabel = isSponsored
    ? 'स्पॉन्सर्ड'
    : (category?.label || palette?.label || 'बिज़नेस');

  // Resolve valid React Component for category icon
  let IconGlyph = TrendUp;
  if (!isSponsored) {
    if (typeof category?.icon === 'function') {
      IconGlyph = category.icon;
    } else if (typeof category?.icon === 'string' && ICON_MAP[category.icon]) {
      IconGlyph = ICON_MAP[category.icon];
    } else if (palette?.icon) {
      IconGlyph = palette.icon;
    }
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare();
    } else {
      const url = window.location.href;
      const text = encodeURIComponent(`${headline} - नवभारत\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleMore = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
    if (onMoreOptions) {
      onMoreOptions();
    }
  };

  const defaultWidthClass = className.includes('w-') ? '' : 'w-[386px] min-w-[386px] max-w-[386px]';
  const defaultBgClass = className.includes('bg-')
    ? ''
    : isBreakingNews
      ? 'bg-[#FEDAD6] border border-[#F8B4AF]'
      : 'bg-white';
  const defaultRoundedClass = className.includes('rounded-') ? '' : 'rounded-[8px]';
  const defaultPaddingClass = className.includes('p-') || className.includes('px-') || className.includes('py-') ? '' : 'px-2 py-1.5';
  const defaultMinHeightClass = className.includes('min-h-') || className.includes('h-') ? '' : 'min-h-[108px]';

  return (
    <article
      onClick={handleCardClick}
      className={`${defaultWidthClass} ${defaultMinHeightClass} ${defaultBgClass} ${defaultPaddingClass} flex flex-col justify-between select-none mx-auto cursor-pointer transition-colors relative ${defaultRoundedClass} ${isMenuOpen ? 'z-30 overflow-visible' : 'overflow-visible'} ${className}`}
    >
      {/* Top Section: Left Text Column + Right Thumbnail */}
      <div className="flex items-start justify-between w-full min-h-[69px] gap-2">
        {/* Left Column: matching thumbnail, with safe matra overflow */}
        <div className="flex-1 min-w-0 min-h-[69px] flex flex-col justify-start">
          {/* Category Tag Row */}
          <div
            onClick={(e) => {
              if (onCategoryClick && catKey && !isSponsored && catKey !== 'top-news' && catKey !== 'top_news') {
                e.stopPropagation();
                onCategoryClick(catKey);
              }
            }}
            className={`flex items-center gap-[4px] shrink-0 flex-wrap ${onCategoryClick && !isSponsored && catKey && catKey !== 'top-news' && catKey !== 'top_news'
                ? 'cursor-pointer hover:opacity-80 transition-opacity'
                : ''
              }`}
          >
            {isBreakingNews && (
              <span className="bg-[#DC2626] text-white text-[11px] font-bold px-[12px] py-[6px] rounded-[8px] shadow-2xs leading-tight select-none shrink-0 inline-flex items-center justify-center">
                ब्रेकिंग न्यूज़
              </span>
            )}

            {/* 16×16px Theme Color Circle Badge */}
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: catColor }}
            >
              {isSponsored ? (
                <Speaker size={11} color="#FFFFFF" variant="Bold" />
              ) : (
                <IconGlyph size={10} color="#FFFFFF" variant="Linear" />
              )}
            </span>

            {/* Category Label: 12px semibold, with safe leading for upper matras */}
            <span
              className="text-[12px] font-semibold leading-normal pt-[1px] shrink-0"
              style={{ color: catColor }}
            >
              {catLabel}
            </span>

            {location && (
              <span className="text-[12px] font-semibold text-[#6B7280] leading-normal shrink-0 truncate">
                • {location}
              </span>
            )}
          </div>

          {/* Headline: 14px medium with protective leading and pt-[1px] for Hindi matras */}
          <h3
            className="mt-[4px] pt-[1px] text-[14px] font-medium text-[#2B2437] leading-[17px] line-clamp-3 overflow-hidden text-ellipsis"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '17px',
            }}
          >
            {headline}
          </h3>
        </div>

        {/* Right Column: 112px wide × 69px tall Thumbnail (8px corner radius) */}
        <div className="w-[112px] h-[69px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100">
          <img
            src={thumbnail}
            alt={headline}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* 0.64px Hairline Divider: #2B2437 at 8% opacity (4px gap above and below) */}
      <div
        className="w-full my-[4px]"
        style={{
          height: '0.64px',
          backgroundColor: 'rgba(24, 37, 59, 0.08)',
        }}
      />

      {/* Bottom Meta Row (18px height) */}
      <div className="flex items-center justify-between w-full h-[18px] text-[10px] text-[#6B7280]">
        {/* Meta text: "{time} पहले  •  {read time} पढ़ें" (8px gap, 10px medium, leading-normal for Hindi matras) */}
        <div className="flex items-center gap-[8px] font-medium leading-normal">
          <span>{publishedAgo}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        {/* Right Action Icons (24px gap between icons) */}
        <div className="flex items-center gap-[24px] relative">
          {/* WhatsApp / Share Icon: 18px × 18px dark navy circle */}
          <button
            type="button"
            onClick={handleWhatsApp}
            aria-label="व्हाट्सएप पर शेयर करें"
            className="w-[18px] h-[18px] rounded-full bg-[#2B2437] flex items-center justify-center text-white cursor-pointer active:opacity-80 shrink-0"
          >
            <Whatsapp size={11} color="#FFFFFF" variant="Bold" />
          </button>

          {/* Overflow Menu (•••): 18px × 18px */}
          <button
            type="button"
            onClick={handleMore}
            aria-label="अधिक विकल्प"
            className="w-[18px] h-[18px] flex items-center justify-center text-[#2B2437] hover:text-black cursor-pointer shrink-0"
          >
            <More size={18} color="#2B2437" variant="Linear" />
          </button>

          {/* Options Menu Popover: खबर सेव करें & लिंक कॉपी करें */}
          <ArticleOptionsMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            articleId={id}
            headline={headline}
            articleData={{
              id: id || headline,
              headline,
              thumbnail,
              category,
              publishedAgo,
              readTime,
            }}
          />
        </div>
      </div>
    </article>
  );
}
