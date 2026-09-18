import React from 'react';
import {
  DocumentText,
  Buildings,
  Judge,
  Car,
  Tree,
  MagicStar,
  TrendUp,
  VideoPlay,
} from 'iconsax-react';
import { useCity } from '../../context/CityContext';
import FeedCard, { CATEGORY_PALETTES, LABEL_MAP } from '../home/FeedCard';

// Extended palettes for hyperlocal-specific categories
const EXTENDED_PALETTES = {
  'विकास': { label: 'विकास', color: '#16A34A', icon: Buildings },
  'क्राइम': { label: 'क्राइम', color: '#DC2626', icon: Judge },
  'यातायात': { label: 'यातायात', color: '#EA580C', icon: Car },
  'कृषि': { label: 'कृषि', color: '#CA8A04', icon: Tree },
  'व्यापार': { label: 'व्यापार', color: '#497877', icon: TrendUp },
  'संस्कृति': { label: 'संस्कृति', color: '#805D76', icon: VideoPlay },
};

/**
 * CityFeedContent
 * Uses the exact master FeedCard template as Home and Category screens.
 */
export default function CityFeedContent({ onCategoryClick }) {
  const {
    activeCityId,
    activeZone,
    currentCityData,
    articles,
    setZoneFilter,
  } = useCity();

  // Filter articles for this city and zone
  const filteredArticles = articles.filter((art) => {
    if (art.cityId !== activeCityId) return false;
    if (activeZone === 'all') return true;
    return art.zoneId === activeZone;
  });

  const cityName = currentCityData?.name || 'भोपाल';

  // Find active zone display name if filtered
  const allZones = [
    ...(currentCityData?.urbanZones || []),
    ...(currentCityData?.ruralZones || []),
  ];
  const activeZoneObj = allZones.find((z) => z.id === activeZone);
  const activeZoneName = activeZoneObj ? activeZoneObj.name : activeZone;

  return (
    <div className="w-full flex flex-col items-center pb-24 pt-2">
      {filteredArticles.length > 0 ? (
        <section aria-label="शहर समाचार" className="space-y-2 w-full flex flex-col items-center">
          {filteredArticles.map((article) => {
            const catKey =
              article.categoryId ||
              (LABEL_MAP[article.category] ? LABEL_MAP[article.category] : null);

            const palette =
              (catKey && CATEGORY_PALETTES[catKey]) ||
              EXTENDED_PALETTES[article.category] || {
                label: article.category || 'समाचार',
                color: article.categoryColor || '#497877',
                icon: MagicStar,
              };

            const categoryObj = {
              id: catKey,
              label: `${palette.label || article.category} • ${cityName}`,
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
        /* Empty State Fallback */
        <div className="w-[386px] py-12 px-6 flex flex-col items-center justify-center text-center bg-white rounded-[16px] border border-[#E5E7EB] mt-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#94A3B8] mb-4">
            <DocumentText size={32} color="#94A3B8" variant="Linear" />
          </div>
          <h3 className="text-[16px] font-bold text-[#18253B] mb-1">
            {activeZoneName} में कोई नई खबर नहीं
          </h3>
          <p className="text-[13px] text-[#6B7280] leading-relaxed mb-5">
            इस इलाके में फिलहाल कोई नई खबर नहीं है।
          </p>
          <button
            type="button"
            onClick={() => setZoneFilter(activeCityId, 'all')}
            className="h-[42px] px-5 bg-[#18253B] text-white text-[13px] font-semibold rounded-[12px] shadow-sm hover:bg-[#22334D] transition-all cursor-pointer active:scale-95"
          >
            सभी {cityName} की खबरें देखें
          </button>
        </div>
      )}
    </div>
  );
}
