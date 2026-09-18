import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight2, More } from 'iconsax-react';
import supremeCourtImg from '../../assets/cards/supreme-court.jpg';
import ArticleOptionsMenu from '../common/ArticleOptionsMenu';

/**
 * Hero Live Updates News Card
 * Pixel-accurately built to match the reference Figma design:
 * - 386px × 283px exact card footprint with 16px corner radius and #1E213D base
 * - 200px upper media banner with gradient overlay showing full pediment & dome
 * - "• लाइव अपडेट" pill on top-left (top: 10px, left: 10px, h: 24px, rounded-[7px], bg: #CA0000)
 * - "देश" category badge: rounded-[6px], bg: #1E213D with subtle border
 * - Headline: 17px bold white, 2 lines, tight leading (22px)
 * - Meta row: "5 मिनट पहले • 2 मिनट पढ़ें" in light slate (#CBD5E1) + white WhatsApp & 3-dots
 * - 83px integrated live updates drawer:
 *   - Continuous vertical connecting track (#374255) through dot centers at 10.5px
 *   - Red dot & red rounded-[6px] time badge for latest update
 *   - Slate dots & slate rounded-[6px] time badges (#3D485B) for previous updates
 *   - 12px font-medium white update text
 *   - "सभी अपडेट देखें >" box: 82px wide × 52px tall, rounded-[12px], border-[#55647A], bg-[#1E213D]
 */
export default function HeroArticleCard({ story }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCardClick = () => {
    navigate(story?.id ? `/article/${story.id}` : '/article/live-bhopal-encroachment');
  };

  const handleShareWhatsApp = (e) => {
    e.stopPropagation();
    const url = window.location.href;
    const text = encodeURIComponent(`${story.title} - नवभारत\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const imageSrc = supremeCourtImg || story.imageUrl;

  return (
    <article
      onClick={handleCardClick}
      className={`w-[386px] min-w-[386px] max-w-[386px] rounded-[16px] select-none bg-[#1E213D] shadow-md flex flex-col mx-auto cursor-pointer transition-transform active:scale-[0.995] relative ${isMenuOpen ? 'z-30 overflow-visible' : 'overflow-hidden'}`}
    >
      {/* 1. Upper Media Banner (214px Height) */}
      <div className="h-[214px] min-h-[214px] max-h-[214px] relative w-full bg-[#1E213D]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={imageSrc}
            alt={story.title}
            className="w-full h-full object-cover object-[center_16%]"
            loading="eager"
          />
        </div>

        {/* Live Pill (Top-Left): 23px height, rounded-[7px] with 5.5px white dot */}
        {story.isLive && (
          <div className="absolute top-[11px] left-[11px] h-[23px] bg-[#CA0000] text-white text-[11.5px] font-bold px-[9px] rounded-[7px] flex items-center gap-[5.5px] shadow-sm z-10 leading-none">
            <span className="w-[5.5px] h-[5.5px] rounded-full bg-white shrink-0" />
            <span>लाइव अपडेट</span>
          </div>
        )}

        {/* Dark Scrim Gradient Overlay for Headline & Meta Block */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E213D] via-[#1E213D]/75 via-42% to-transparent pt-14 pb-[10px] px-[12px] flex flex-col justify-end z-10">
          {/* Category Pill */}
          <span className="bg-[#1E213D]/90 border border-white/25 text-white text-[11px] font-bold px-[8px] py-[2.5px] rounded-[5px] w-fit mb-[7px] leading-none">
            {story.category || 'देश'}
          </span>

          {/* Headline: 15.5px bold white, 2 lines, comfortable 22px leading */}
          <h2 className="text-[15.5px] font-bold text-white leading-[22px] drop-shadow-xs line-clamp-2 mb-[7px]">
            {story.title}
          </h2>

          {/* Meta Row & Action Icons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-[6px] text-[11px] text-[#CBD5E1] font-normal">
              <span>{story.publishedAt}</span>
              <span className="text-[#94A3B8]">•</span>
              <span>{story.readTime}</span>
            </div>

            {/* Action Group: WhatsApp + 3-Dot Menu */}
            <div className="flex items-center gap-[12px] relative">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                aria-label="व्हाट्सएप पर शेयर करें"
                className="text-white hover:text-white/80 active:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.04 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.65 7.89 8.02 8.48 8.02 9.68C8.02 10.88 8.89 12.04 9.02 12.2C9.14 12.37 10.74 14.84 13.2 15.9C13.79 16.15 14.24 16.3 14.6 16.42C15.19 16.61 15.73 16.58 16.16 16.52C16.64 16.45 17.63 15.92 17.84 15.34C18.04 14.75 18.04 14.25 17.98 14.15C17.92 14.05 17.76 13.99 17.51 13.87C17.26 13.74 16.03 13.14 15.8 13.06C15.58 12.97 15.41 12.93 15.25 13.18C15.08 13.42 14.6 13.99 14.45 14.15C14.31 14.32 14.17 14.34 13.92 14.21C13.67 14.09 12.87 13.82 11.92 12.97C11.18 12.31 10.68 11.5 10.53 11.25C10.39 11 10.51 10.87 10.64 10.74C10.75 10.63 10.89 10.45 11.02 10.3C11.14 10.15 11.18 10.05 11.27 9.88C11.35 9.71 11.31 9.57 11.25 9.44C11.18 9.32 10.7 8.15 10.5 7.67C10.3 7.2 10.1 7.26 9.95 7.25C9.81 7.25 9.67 7.34 9.53 7.34Z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleMenuClick}
                aria-label="अधिक विकल्प"
                className="text-white hover:text-gray-200 transition-colors cursor-pointer flex items-center justify-center"
              >
                <More size={17} color="#FFFFFF" variant="Linear" />
              </button>

              {/* Floating Action Menu: खबर सेव करें & लिंक कॉपी करें */}
              <ArticleOptionsMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                articleId={story?.id}
                headline={story?.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lower Live Updates Drawer (96px Height with ample breathing room for Hindi matras) */}
      {story.liveUpdates && story.liveUpdates.length > 0 && (
        <div className="h-[96px] min-h-[96px] max-h-[96px] bg-[#1E213D] px-[12px] flex items-center justify-between gap-[10px]">
          {/* Timeline on Left: 3 rows with continuous connecting track */}
          <div className="relative flex-1 min-w-0 h-[72px] flex flex-col justify-between">
            {/* Continuous vertical timeline track running through dot centers at 2.75px from left */}
            <div className="absolute left-[2.75px] top-[10px] bottom-[10px] w-[1.5px] bg-[#374255] -translate-x-1/2 pointer-events-none" />

            {story.liveUpdates.slice(0, 3).map((update, idx) => (
              <div key={idx} className="flex items-center gap-[8px] text-left relative z-10 h-[21px]">
                {/* Timeline Dot (5.5×5.5px) */}
                <span
                  className={`w-[5.5px] h-[5.5px] rounded-full shrink-0 ${
                    update.isLatest ? 'bg-[#CA0000]' : 'bg-[#D9D9D9]'
                  }`}
                />

                {/* Time Badge: rounded-[5px] */}
                <span
                  className={`text-[10px] leading-none shrink-0 px-[6px] py-[2.5px] rounded-[5px] ${
                    update.isLatest
                      ? 'bg-[#CA0000] text-white font-bold'
                      : 'bg-[#3D485B] text-[#E2E8F0] font-medium'
                  }`}
                >
                  {update.time}
                </span>

                {/* Update Text: comfortably sized with no matra clipping */}
                <span
                  className={`text-[11.5px] leading-normal truncate max-w-[172px] ${
                    update.isLatest
                      ? 'text-white font-medium'
                      : 'text-[#E2E8F0] font-normal'
                  }`}
                >
                  {update.text}
                </span>
              </div>
            ))}
          </div>

          {/* "सभी अपडेट देखें >" Button (Right): 86px wide × 54px tall, rounded-[12px] */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/article/live-bhopal-encroachment');
            }}
            className="w-[86px] min-w-[86px] max-w-[86px] h-[54px] bg-[#1E213D] border border-[#55647A] px-[9px] rounded-[12px] text-white hover:bg-[#1F2E44] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer shrink-0 select-none"
          >
            <div className="flex flex-col text-left leading-[14px]">
              <span className="text-[11px] font-semibold text-white">सभी</span>
              <span className="text-[11px] font-semibold text-white">अपडेट देखें</span>
            </div>
            <ArrowRight2 size={15} color="#FFFFFF" variant="Linear" className="shrink-0 ml-1" />
          </button>
        </div>
      )}
    </article>
  );
}


