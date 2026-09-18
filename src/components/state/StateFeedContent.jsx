import React from 'react';
import { DocumentText, MagicStar } from 'iconsax-react';
import FeedCard, { CATEGORY_PALETTES, LABEL_MAP } from '../home/FeedCard';

export default function StateFeedContent({
  articles = [],
  activeStateName = 'राज्य',
  onCategoryClick,
}) {
  return (
    <div className="w-full flex flex-col items-center pb-24 pt-2">
      {articles.length > 0 ? (
        <section aria-label="राज्य समाचार" className="space-y-2 w-full flex flex-col items-center">
          {articles.map((article) => {
            const catKey =
              article.categoryId ||
              (LABEL_MAP[article.category] ? LABEL_MAP[article.category] : null);

            const palette =
              (catKey && CATEGORY_PALETTES[catKey]) || {
                label: article.category || 'समाचार',
                color: article.categoryColor || '#497877',
                icon: MagicStar,
              };

            const categoryObj = {
              id: catKey,
              label: `${palette.label || article.category} • ${activeStateName}`,
              color: palette.color,
              icon: palette.icon,
            };

            return (
              <FeedCard
                key={article.id}
                id={article.id}
                category={categoryObj}
                headline={article.title}
                thumbnail={article.imageUrl}
                publishedAgo={article.publishedAt}
                readTime={article.readTime}
                onCategoryClick={onCategoryClick}
              />
            );
          })}
        </section>
      ) : (
        <div className="w-[386px] py-12 px-6 flex flex-col items-center justify-center text-center bg-white rounded-[16px] border border-[#E5E7EB] mt-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#94A3B8] mb-4">
            <DocumentText size={32} color="#94A3B8" variant="Linear" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1E213D] mb-1">
            {activeStateName} में कोई नई खबर नहीं
          </h3>
          <p className="text-[13px] text-[#6B7280] leading-relaxed">
            इस राज्य से संबंधित ताजा खबरें जल्द ही उपलब्ध होंगी।
          </p>
        </div>
      )}
    </div>
  );
}
