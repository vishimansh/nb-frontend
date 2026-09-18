import React from 'react';
import ArticleTile from './ArticleTile';
import { CATEGORY_PALETTES } from './FeedCard';
import NativeFeedAd, { AD_CARDS, CATEGORY_ADS } from './NativeFeedAd';

/**
 * Filtered Category News Screen (Content Frame)
 * - Contains 5 to 7 news cards of the active category
 * - Features exactly one high-resolution Feed AD card (positioned between articles)
 * - Background: #F7F7F4
 * - Padding bottom: pb-24 (clearance for fixed bottom tab bar)
 * - Reuse <ArticleTile> (386px × 120px)
 */
export default function CategoryFeedContent({
  articles = [],
  categoryId,
  onCategoryClick,
}) {
  const categoryPalette = CATEGORY_PALETTES[categoryId] || null;

  // Always show 5 to 7 articles
  const displayArticles = articles.slice(0, 7);

  // Selected ad for this category
  const adId = CATEGORY_ADS[categoryId] || 'ad-concert';
  const adData = AD_CARDS[adId] || AD_CARDS['ad-concert'];

  const firstBatch = displayArticles.slice(0, 3);
  const secondBatch = displayArticles.slice(3);

  return (
    <div className="w-full flex flex-col items-center space-y-2 bg-[#F7F7F4] pb-24 select-none">
      {/* First 3 News Cards */}
      {firstBatch.map((article) => (
        <ArticleTile
          key={article.id}
          article={article}
          categoryOverride={categoryPalette}
          onCategoryClick={onCategoryClick}
        />
      ))}

      {/* Exactly one Feed AD card for this category screen */}
      {adData && displayArticles.length >= 3 && (
        <div className="w-[386px] my-1 flex justify-center">
          <NativeFeedAd ad={adData} />
        </div>
      )}

      {/* Remaining News Cards (Cards 4 to 7) */}
      {secondBatch.map((article) => (
        <ArticleTile
          key={article.id}
          article={article}
          categoryOverride={categoryPalette}
          onCategoryClick={onCategoryClick}
        />
      ))}
    </div>
  );
}
