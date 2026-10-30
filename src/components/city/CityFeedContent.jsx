import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentText,
  Buildings,
  Judge,
  Car,
  Tree,
  MagicStar,
  TrendUp,
  VideoPlay,
  Camera,
  Add,
  ArrowRight2,
  Location,
} from 'iconsax-react';
import { useCity } from '../../context/CityContext';
import { useVideo } from '../../context/VideoContext';
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

export default function CityFeedContent({ onCategoryClick }) {
  const navigate = useNavigate();
  const {
    activeCityId,
    activeZone,
    currentCityData,
    articles,
    setZoneFilter,
  } = useCity();

  const {
    citizenReels = [],
    switchMediaMode,
    setCitizenCityFilter,
    setCitizenCurrentIndex,
    setIsUploadSheetOpen,
  } = useVideo();

  const cityName = currentCityData?.name || 'भोपाल';

  // Filter citizen reports for this city
  const cityCitizenReports = citizenReels.filter(
    (r) => r.city === cityName
  );

  // Filter articles for this city and zone
  let filteredArticles = articles.filter((art) => {
    if (art.cityId !== activeCityId) return false;
    if (activeZone === 'all') return true;
    return art.zoneId === activeZone;
  });

  // Dynamic fallback
  if (filteredArticles.length === 0) {
    filteredArticles = [
      {
        id: `city-gen-${activeCityId}-1`,
        cityId: activeCityId,
        category: 'विकास',
        categoryColor: '#16A34A',
        title: `${cityName} में मास्टर प्लान और स्मार्ट सिटी परियोजनाओं की प्रगति पर समीक्षा बैठक, नए कार्यों को मंजूरी`,
        publishedAt: '25 मिनट पहले',
        readTime: '3 मिनट पढ़ें',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f3?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: `city-gen-${activeCityId}-2`,
        cityId: activeCityId,
        category: 'व्यापार',
        categoryColor: '#0D9488',
        title: `${cityName} के मुख्य बाजारों में व्यापारिक गतिविधियों में उछाल, त्योहारी सीजन की तैयारियों में जुटे व्यापारी`,
        publishedAt: '45 मिनट पहले',
        readTime: '2 मिनट पढ़ें',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: `city-gen-${activeCityId}-3`,
        cityId: activeCityId,
        category: 'शिक्षा',
        categoryColor: '#5B6D8A',
        title: `${cityName} के महाविद्यालयों में नए शैक्षणिक सत्र की प्रवेश प्रक्रिया शुरू, विद्यार्थियों में भारी उत्साह`,
        publishedAt: '1 घंटा पहले',
        readTime: '3 मिनट पढ़ें',
        imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
      },
    ];
  }

  const allZones = [
    ...(currentCityData?.urbanZones || []),
    ...(currentCityData?.ruralZones || []),
  ];
  const activeZoneObj = allZones.find((z) => z.id === activeZone);
  const activeZoneName = activeZoneObj ? activeZoneObj.name : activeZone;

  // Open Citizen Reel
  const handleOpenCitizenReel = (reelId) => {
    switchMediaMode('citizen');
    setCitizenCityFilter(cityName);
    const targetIdx = cityCitizenReports.findIndex((r) => r.id === reelId);
    if (targetIdx !== -1) {
      setCitizenCurrentIndex(targetIdx);
    }
    navigate('/videos');
  };

  // Open Reporter Studio
  const handleOpenStudio = () => {
    switchMediaMode('citizen');
    setCitizenCityFilter(cityName);
    setIsUploadSheetOpen(true);
    navigate('/videos');
  };

  return (
    <div className="w-full flex flex-col items-center pb-24 pt-1">
      {/* 1. Hyperlocal Citizen Dispatches Carousel: "नागरिकों की नज़र से" */}
      <section aria-label="नागरिक ग्राउंड रिपोर्ट" className="w-[386px] mb-2.5 select-none">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
            <h2 className="text-[14px] font-bold text-[#2B2437] tracking-tight">
              नागरिकों की नज़र से : {cityName}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              switchMediaMode('citizen');
              setCitizenCityFilter(cityName);
              navigate('/videos');
            }}
            className="text-[11.5px] font-medium text-[#C05621] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>सभी देखें</span>
            <ArrowRight2 size={12} color="#C05621" />
          </button>
        </div>

        {/* Horizontal Story Reel Strip */}
        <div className="w-full flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {/* Create Report Action Card */}
          <button
            type="button"
            onClick={handleOpenStudio}
            className="w-[92px] h-[140px] rounded-[14px] bg-neutral-50/90 hover:bg-neutral-100/90 border border-neutral-200/90 flex flex-col items-center justify-center p-2.5 text-center shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs group"
          >
            <div className="relative mb-2">
              <div className="w-8 h-8 rounded-full bg-[#2B2437] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Camera size={15} color="#FFFFFF" variant="Bold" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#C05621] text-white flex items-center justify-center text-[10px] font-bold border border-white leading-none">
                +
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#2B2437] leading-tight">
              रिपोर्ट भेजें
            </span>
            <span className="text-[8.5px] text-neutral-400 mt-0.5 font-normal">
              60s वीडियो
            </span>
          </button>

          {/* Citizen Reports Cards */}
          {cityCitizenReports.map((report) => {
            const hasLocality =
              report.locality &&
              report.locality.trim() !== '' &&
              report.locality.trim().toLowerCase() !== cityName.trim().toLowerCase();

            return (
              <div
                key={report.id}
                onClick={() => handleOpenCitizenReel(report.id)}
                className="w-[92px] h-[140px] rounded-[14px] bg-neutral-900 relative overflow-hidden shrink-0 cursor-pointer shadow-xs active:scale-95 transition-transform group"
              >
                {/* Thumbnail / Video poster */}
                <img
                  src={report.posterThumbnail || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80'}
                  alt={report.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Smooth Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Minimal Bottom Metadata */}
                <div className="absolute bottom-2 inset-x-2 z-10 text-left">
                  {hasLocality && (
                    <span className="block text-[8px] font-medium text-amber-300/90 mb-0.5 truncate tracking-tight">
                      {report.locality}
                    </span>
                  )}
                  <p className="text-[9.5px] font-medium text-white leading-[1.3] line-clamp-2 drop-shadow-xs">
                    {report.headline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. City Articles Feed */}
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
          <h3 className="text-[16px] font-bold text-[#2B2437] mb-1">
            {activeZoneName} में कोई नई खबर नहीं
          </h3>
          <p className="text-[13px] text-[#6B7280] leading-relaxed mb-5">
            इस इलाके में फिलहाल कोई नई खबर नहीं है।
          </p>
          <button
            type="button"
            onClick={() => setZoneFilter(activeCityId, 'all')}
            className="h-[42px] px-5 bg-[#2B2437] text-white text-[13px] font-semibold rounded-[12px] shadow-sm hover:bg-[#3D334E] transition-all cursor-pointer active:scale-95"
          >
            सभी {cityName} की खबरें देखें
          </button>
        </div>
      )}
    </div>
  );
}
