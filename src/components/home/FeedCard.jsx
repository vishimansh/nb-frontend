import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Judge,
  VideoPlay,
  Activity,
  TrendUp,
  Cpu,
  Teacher,
  Moon,
  Heart,
  Car,
  Tree,
  More,
  Location,
  Buildings,
  DocumentText,
} from 'iconsax-react';
import ArticleOptionsMenu from '../common/ArticleOptionsMenu';

export const CATEGORY_PALETTES = {
  politics: { label: 'राजनीति', color: '#B6783A', icon: Judge },
  entertainment: { label: 'मनोरंजन', color: '#805D76', icon: VideoPlay },
  sports: { label: 'खेल', color: '#557E63', icon: Activity },
  business: { label: 'बिज़नेस', color: '#497877', icon: TrendUp },
  tech: { label: 'टेक्नोलॉजी', color: '#5B69A3', icon: Cpu },
  education: { label: 'शिक्षा', color: '#5B6D8A', icon: Teacher },
  astro: { label: 'ज्योतिष', color: '#71668C', icon: Moon },
  health: { label: 'स्वास्थ्य', color: '#B3746E', icon: Heart },
  lifestyle: { label: 'लाइफस्टाइल', color: '#77856E', icon: Tree },
  auto: { label: 'ऑटो', color: '#596776', icon: Car },
  city: { label: 'शहर', color: '#E39026', icon: Location },
  state: { label: 'राज्य', color: '#0284C7', icon: Buildings },
  country: { label: 'देश', color: '#18253B', icon: DocumentText },
  'top-news': { label: 'टॉप न्यूज़', color: '#E39026', icon: DocumentText },
  'top_news': { label: 'टॉप न्यूज़', color: '#E39026', icon: DocumentText },
};

const ICON_MAP = {
  Judge,
  VideoPlay,
  Activity,
  TrendUp,
  Cpu,
  Teacher,
  Moon,
  Heart,
  Tree,
  Car,
  Location,
  Buildings,
  DocumentText,
  // Backward-compatible mappings
  Scales: Judge,
  FilmStrip: VideoPlay,
  SoccerBall: Activity,
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
    ? '#18253B'
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
  const defaultPaddingClass = className.includes('p-') || className.includes('px-') || className.includes('py-') ? '' : 'p-2';

  return (
    <article
      onClick={handleCardClick}
      className={`${defaultWidthClass} min-h-[120px] ${defaultBgClass} ${defaultPaddingClass} flex flex-col justify-between select-none mx-auto cursor-pointer transition-colors relative ${defaultRoundedClass} ${isMenuOpen ? 'z-30 overflow-visible' : 'overflow-visible'} ${className}`}
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
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 3H19C17.34 3 16 4.34 16 6V7H14.41L9.71 2.29C9.33 1.91 8.79 1.76 8.27 1.88C7.75 2.01 7.32 2.39 7.12 2.89L5 8H3C1.9 8 1 8.9 1 10V14C1 15.1 1.9 16 3 16H5L7.12 21.11C7.32 21.61 7.75 21.99 8.27 22.12C8.79 22.24 9.33 22.09 9.71 21.71L14.41 17H16V18C16 19.66 17.34 21 19 21H20C21.66 21 23 19.66 23 18V6C23 4.34 21.66 3 20 3ZM3 14V10H5.5L7 14H3ZM9 18.59L6.5 12.5L9 5.41V18.59ZM14 15H11V9H14V15ZM21 18C21 18.55 20.55 19 20 19H19C18.45 19 18 18.55 18 18V6C18 5.45 18.45 5 19 5H20C20.55 5 21 5.45 21 6V18Z" />
                </svg>
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
            className="mt-[6px] pt-[1px] text-[14px] font-medium text-[#18253B] leading-[17px] line-clamp-3 overflow-hidden text-ellipsis"
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

      {/* 0.64px Hairline Divider: #18253B at 8% opacity (8px gap above and below) */}
      <div
        className="w-full my-[8px]"
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

        {/* Right Action Icons (32px gap between icons) */}
        <div className="flex items-center gap-[32px] relative">
          {/* WhatsApp / Share Icon: 18px × 18px dark navy circle */}
          <button
            type="button"
            onClick={handleWhatsApp}
            aria-label="व्हाट्सएप पर शेयर करें"
            className="w-[18px] h-[18px] rounded-full bg-[#18253B] flex items-center justify-center text-white cursor-pointer active:opacity-80 shrink-0"
          >
            <svg className="w-[11px] h-[11px] fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.04 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.68C8.02 10.88 8.89 12.04 9.02 12.2C9.14 12.37 10.74 14.84 13.2 15.9C13.79 16.15 14.24 16.3 14.6 16.42C15.19 16.61 15.73 16.58 16.16 16.52C16.64 16.45 17.63 15.92 17.84 15.34C18.04 14.75 18.04 14.25 17.98 14.15C17.92 14.05 17.76 13.99 17.51 13.87C17.26 13.74 16.03 13.14 15.8 13.06C15.58 12.97 15.41 12.93 15.25 13.18C15.08 13.42 14.6 13.99 14.45 14.15C14.31 14.32 14.17 14.34 13.92 14.21C13.67 14.09 12.87 13.82 11.92 12.97C11.18 12.31 10.68 11.5 10.53 11.25C10.39 11 10.51 10.87 10.64 10.74C10.75 10.63 10.89 10.45 11.02 10.3C11.14 10.15 11.18 10.05 11.27 9.88C11.35 9.71 11.31 9.57 11.25 9.44C11.18 9.32 10.7 8.15 10.5 7.67C10.3 7.2 10.1 7.26 9.95 7.25C9.81 7.25 9.67 7.34 9.53 7.34Z" />
            </svg>
          </button>

          {/* Overflow Menu (•••): 18px × 18px */}
          <button
            type="button"
            onClick={handleMore}
            aria-label="अधिक विकल्प"
            className="w-[18px] h-[18px] flex items-center justify-center text-[#18253B] hover:text-black cursor-pointer shrink-0"
          >
            <More size={18} color="#18253B" variant="Linear" />
          </button>

          {/* Options Menu Popover: खबर सेव करें & लिंक कॉपी करें */}
          <ArticleOptionsMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            articleId={id}
            headline={headline}
          />
        </div>
      </div>
    </article>
  );
}
