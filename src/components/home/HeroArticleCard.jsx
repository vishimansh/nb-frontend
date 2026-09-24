import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight2, More, Whatsapp } from 'iconsax-react';
import supremeCourtImg from '../../assets/cards/supreme-court.jpg';
import ArticleOptionsMenu from '../common/ArticleOptionsMenu';

/**
 * Hero Live Updates News Card
 * Pixel-accurately built to match the reference Figma design:
 * - 386px × 283px exact card footprint with 16px corner radius and #2B2437 base
 * - 200px upper media banner with gradient overlay showing full pediment & dome
 * - "• लाइव अपडेट" pill on top-left (top: 10px, left: 10px, h: 24px, rounded-[7px], bg: #CA0000)
 * - "देश" category badge: rounded-[6px], bg: #2B2437 with subtle border
 * - Headline: 17px bold white, 2 lines, tight leading (22px)
 * - Meta row: "5 मिनट पहले • 2 मिनट पढ़ें" in light slate (#CBD5E1) + white WhatsApp & 3-dots
 * - 83px integrated live updates drawer:
 *   - Continuous vertical connecting track (#374255) through dot centers at 10.5px
 *   - Red dot & red rounded-[6px] time badge for latest update
 *   - Slate dots & slate rounded-[6px] time badges (#3D485B) for previous updates
 *   - 12px font-medium white update text
 *   - "सभी अपडेट देखें >" box: 82px wide × 52px tall, rounded-[12px], border-[#5D526D], bg-[#2B2437]
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
      className={`w-[386px] min-w-[386px] max-w-[386px] rounded-[16px] select-none bg-[#2B2437] shadow-md flex flex-col mx-auto cursor-pointer transition-transform active:scale-[0.995] relative ${isMenuOpen ? 'z-30 overflow-visible' : 'overflow-hidden'}`}
    >
      {/* 1. Upper Media Banner (214px Height) */}
      <div className="h-[214px] min-h-[214px] max-h-[214px] relative w-full bg-[#2B2437]">
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
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B2437] via-[#2B2437]/75 via-42% to-transparent pt-14 pb-[10px] px-[12px] flex flex-col justify-end z-10">
          {/* Category Pill */}
          <span className="bg-[#2B2437]/90 border border-white/25 text-white text-[11px] font-bold px-[8px] py-[2.5px] rounded-[5px] w-fit mb-[7px] leading-none">
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
                <Whatsapp size={17} color="#FFFFFF" variant="Bold" />
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
                articleData={{
                  id: story?.id || story?.title,
                  headline: story?.title,
                  thumbnail: imageSrc,
                  category: story?.category || 'देश',
                  publishedAgo: story?.publishedAt || '5 मिनट पहले',
                  readTime: story?.readTime || '2 मिनट पढ़ें',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lower Live Updates Drawer (Auto-height with complete visibility for timeline points) */}
      {story.liveUpdates && story.liveUpdates.length > 0 && (
        <div className="w-full bg-[#2B2437] px-[12px] py-[12px] flex items-center justify-between gap-[10px] border-t border-white/10">
          {/* Timeline on Left: 3 rows with continuous connecting track */}
          <div className="relative flex-1 min-w-0 flex flex-col gap-[10px]">
            {/* Continuous vertical timeline track running through dot centers at 2.75px from left */}
            <div className="absolute left-[2.75px] top-[7px] bottom-[7px] w-[1.5px] bg-[#473D54] -translate-x-1/2 pointer-events-none" />

            {story.liveUpdates.slice(0, 3).map((update, idx) => (
              <div key={idx} className="flex items-start gap-[8px] text-left relative z-10">
                {/* Timeline Dot (5.5×5.5px) */}
                <span
                  className={`w-[5.5px] h-[5.5px] rounded-full shrink-0 mt-[5px] ${
                    update.isLatest ? 'bg-[#CA0000]' : 'bg-[#D9D9D9]'
                  }`}
                />

                {/* Time Badge: rounded-[5px] */}
                <span
                  className={`text-[10px] leading-none shrink-0 px-[6px] py-[3px] rounded-[5px] mt-[1px] ${
                    update.isLatest
                      ? 'bg-[#CA0000] text-white font-bold'
                      : 'bg-[#473D54] text-[#E2E8F0] font-medium'
                  }`}
                >
                  {update.time}
                </span>

                {/* Update Text: COMPLETELY VISIBLE, NO TRUNCATION, comfortable leading for Hindi matras */}
                <p
                  className={`text-[12px] leading-[17px] m-0 ${
                    update.isLatest
                      ? 'text-white font-medium'
                      : 'text-[#CBD5E1] font-normal'
                  }`}
                >
                  {update.text}
                </p>
              </div>
            ))}
          </div>

          {/* "सभी अपडेट देखें >" Button (Right): Vertically centered, links to live article */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(story?.id ? `/article/${story.id}` : '/article/live-bhopal-encroachment');
            }}
            className="w-[84px] min-w-[84px] max-w-[84px] py-[10px] px-[8px] bg-[#2B2437] border border-[#5D526D] rounded-[12px] text-white hover:bg-[#3D334E] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer shrink-0 self-center select-none"
          >
            <div className="flex flex-col text-left leading-[14px]">
              <span className="text-[11px] font-semibold text-white">सभी</span>
              <span className="text-[11px] font-semibold text-white">अपडेट देखें</span>
            </div>
            <ArrowRight2 size={14} color="#FFFFFF" variant="Linear" className="shrink-0 ml-1" />
          </button>
        </div>
      )}
    </article>
  );
}


