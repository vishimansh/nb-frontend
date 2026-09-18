import React from 'react';
import FeedCard, { CATEGORY_PALETTES } from './FeedCard';

/**
 * Standard Article Tile adapter wrapping the pixel-perfect FeedCard
 */
export default function ArticleTile({ article, categoryOverride, onCategoryClick, className = "" }) {
  const isSponsored = article.isSponsored || article.categoryId === 'sponsored';
  const category = categoryOverride || CATEGORY_PALETTES[article.categoryId] || {
    label: 'समाचार',
    color: '#1E213D',
  };

  return (
    <FeedCard
      id={article.id}
      category={category}
      headline={article.title}
      thumbnail={article.imageUrl}
      publishedAgo={article.publishedAt}
      readTime={article.readTime}
      isSponsored={isSponsored}
      onCategoryClick={onCategoryClick}
      className={className}
    />
  );
}
