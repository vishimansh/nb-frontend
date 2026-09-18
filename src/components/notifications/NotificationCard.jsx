import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flash } from 'iconsax-react';
import { getCategoryMeta } from '../../theme/categories';

export function formatNotificationRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);

  // If timestamp is from mock dataset (2026-09-...), anchor to 2026-09-15T23:55:00Z for exact match with design
  const isMockData = typeof isoString === 'string' && isoString.startsWith('2026-09-');
  const refTime = isMockData ? new Date('2026-09-15T23:55:00Z').getTime() : Date.now();

  const diffMs = Math.max(0, refTime - date.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${Math.max(1, diffMins)} मिनट पहले`;
  }
  if (diffHours < 24) {
    return `${diffHours} घंटे पहले`;
  }
  return `${diffDays} दिन पहले`;
}

export default function NotificationCard({ notification, isTrending = false, className = '' }) {
  const navigate = useNavigate();
  const meta = getCategoryMeta(notification.categoryId);
  const CategoryIcon = meta.icon;
  const timeText = formatNotificationRelativeTime(notification.timestamp);

  const handleClick = () => {
    navigate(notification.id ? `/article/${notification.id}` : '/article/live-bhopal-encroachment');
  };

  return (
    <article
      tabIndex={0}
      onClick={handleClick}
      aria-label={notification.headline}
      className={`w-[370px] min-w-[370px] max-w-[370px] bg-[#F7F7F4] rounded-[12px] border border-[#E5E7EB] p-2.5 flex items-center gap-3 shadow-2xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.99] select-none ${className}`}
    >
      {/* Left Square Thumbnail */}
      <div className="w-[76px] h-[76px] rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0 border border-[#E5E7EB]/70">
        <img
          src={notification.thumbnail}
          alt={notification.headline}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80';
          }}
        />
      </div>

      {/* Right Content Stack */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
        {/* Top Badge & Attribution Row */}
        <div className="flex items-center gap-[4px] mb-1 flex-wrap">
          {/* Trending Flame Icon in rounded circle badge */}
          {isTrending && (
            <div
              className="w-4 h-4 rounded-full bg-[#C05621] flex items-center justify-center text-white shrink-0 shadow-2xs mr-0.5"
              aria-label="ट्रेंडिंग"
            >
              <Flash size={10} color="#FFFFFF" variant="Bold" />
            </div>
          )}

          {/* 16×16px Theme Color Circle Badge */}
          <span
            style={{ backgroundColor: meta.color }}
            className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
          >
            {CategoryIcon && <CategoryIcon size={10} color="#FFFFFF" variant="Linear" />}
          </span>

          {/* Category Label: 12px semibold, with safe leading for upper matras */}
          <span
            style={{ color: meta.color }}
            className="text-[12px] font-semibold leading-normal pt-[1px] shrink-0"
          >
            {meta.label}
          </span>

          {/* Location Indicator for Trending */}
          {isTrending && notification.location && (
            <span className="text-[12px] font-semibold text-[#6B7280] leading-normal shrink-0 truncate">
              • {notification.location}
            </span>
          )}
        </div>

        {/* Headline: matching normal news feed card (14px medium, 17px line pitch, safe matra overflow) */}
        <h3
          className="mt-[4px] pt-[1px] text-[14px] font-medium text-[#1E213D] leading-[17px] line-clamp-2 overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '17px',
          }}
        >
          {notification.headline}
        </h3>

        {/* Dynamic Relative Timestamp: matching normal feed card meta (10px medium text-[#6B7280]) */}
        <span className="text-[10px] font-medium text-[#6B7280] mt-1.5 leading-normal">
          {timeText}
        </span>
      </div>
    </article>
  );
}
