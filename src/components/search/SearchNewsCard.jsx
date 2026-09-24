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
export default function SearchNewsCard({
  story,
  onCategoryClick,
  className = "",
  cardBg = "",
  isSearchScreen = false,
}) {
  const {
    id,
    isBreakingNews,
    isSponsored = false,
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

  // The breaking/live updates article in only search screen has the red bg (#FEDAD6)
  const isRedBreaking = isSearchScreen && (isBreakingNews || story.isLive);

  const cardBgClass = isRedBreaking
    ? 'bg-[#FEDAD6] border border-[#F8B4AF]'
    : cardBg
    ? cardBg
    : isSearchScreen
    ? 'bg-[#F7F7F4] border border-[#E5E7EB]'
    : 'bg-white border border-[#E5E7EB] shadow-2xs';

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
      isSponsored={isSponsored}
      location={location}
      onCategoryClick={onCategoryClick}
      className={`w-[370px] min-w-[370px] max-w-[370px] min-h-[108px] rounded-[10px] px-2.5 py-[6px] ${cardBgClass} ${className}`}
    />
  );
}
