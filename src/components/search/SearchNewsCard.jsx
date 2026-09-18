import React from 'react';
import FeedCard, { CATEGORY_PALETTES } from '../home/FeedCard';

/**
 * News Card for Search Discovery & Landing Screen
 * Strictly implements the authentic Home Feed / Category Feed design pattern:
 * - Reuses the canonical 386px × 120px FeedCard
 * - Matches exact typography, thumbnail (112px × 69px), hairline divider,
 *   navy WhatsApp button, and 3-dot overflow menu
 * - Supports breaking news pill badge and city location tag
 */
export default function SearchNewsCard({ story, onCategoryClick, className = "" }) {
  const {
    id,
    isBreakingNews,
    category,
    location,
    headline,
    thumbnail,
    timestamp,
    readTimeMinutes,
  } = story;

  const resolvedCategory =
    CATEGORY_PALETTES[category?.id || category] || category || {
      label: 'समाचार',
      color: '#497877',
    };

  const cardBgClass = isBreakingNews
    ? 'bg-[#FEDAD6] border border-[#F8B4AF]'
    : 'bg-[#F7F7F4] border border-[#E5E7EB]';

  return (
    <FeedCard
      key={id}
      id={id}
      category={resolvedCategory}
      headline={headline}
      thumbnail={thumbnail}
      publishedAgo={timestamp}
      readTime={`${readTimeMinutes} मिनट पढ़ें`}
      isBreakingNews={isBreakingNews}
      location={location}
      onCategoryClick={onCategoryClick}
      className={`w-[370px] min-w-[370px] max-w-[370px] rounded-[8px] p-2 ${cardBgClass} ${className}`}
    />
  );
}
