import React from 'react';
import { Whatsapp } from 'iconsax-react';
import navabharatCover from '../../assets/navabharat-epaper-cover.jpg';
import centralChroniclesCover from '../../assets/central-chronicles-cover.jpg';

/**
 * EPaperCard Component
 * Width: 180px, Height: 240px, Corner Radius: 12px, Padding: 8px (p-2)
 */
export default function EPaperCard({
  edition,
  cityName = 'भोपाल',
  dateText = '28 अगस्त',
  onRead,
  onShare,
}) {
  const isInteractive = edition.isInteractive !== false;

  // Resolve title dynamically
  const displayTitle = edition.isCityScoped
    ? (edition.titleTemplate || 'नवभारत-{cityName}').replace('{cityName}', cityName)
    : edition.title;

  const thumbnailSrc =
    edition.coverImage ||
    (edition.id === 'central-chronicles' || edition.type === 'english_daily'
      ? centralChroniclesCover
      : navabharatCover);

  return (
    <article
      aria-label={displayTitle}
      className="bg-white rounded-[12px] border border-[#E5E7EB] p-2 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md w-[180px] h-[240px] shrink-0 overflow-hidden"
    >
      {/* Upper Content Section */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 1. Top Tag Pill */}
        <div className={`px-[6px] py-0.5 rounded-md text-[11px] font-bold tracking-wide w-fit mb-2 shrink-0 ${edition.tagStyle}`}>
          {edition.tag}
        </div>

        {/* 2. Thumbnail Stack */}
        <div className="flex-1 min-h-0 w-full rounded-[8px] overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] relative shadow-2xs">
          <img
            src={thumbnailSrc}
            alt={displayTitle}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* 3. Edition Title: protective leading and py to prevent Hindi matras from clipping */}
        <h3
          title={displayTitle}
          className="text-[16px] font-bold text-[#1E213D] mt-1.5 mb-[4px] py-[2px] truncate shrink-0 leading-[22px]"
        >
          {displayTitle}
        </h3>
      </div>

      {/* 4. Action Button Row */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Primary 'पढ़ें →' Button */}
        {isInteractive ? (
          <button
            type="button"
            onClick={() => onRead && onRead(displayTitle)}
            className="flex-1 h-7 rounded-[8px] text-[13px] font-bold flex items-center justify-center transition-all bg-[#1E213D] text-white shadow-2xs hover:bg-[#101927] active:scale-98 cursor-pointer"
          >
            पढ़ें →
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 h-7 rounded-[8px] text-[13px] font-bold flex items-center justify-center transition-all bg-[#E5E7EB] text-[#9CA3AF] cursor-default pointer-events-none select-none"
          >
            पढ़ें →
          </button>
        )}

        {/* WhatsApp Share Button */}
        <button
          type="button"
          onClick={() => onShare && onShare(displayTitle)}
          aria-label={`${displayTitle} व्हाट्सएप पर शेयर करें`}
          className="w-7 h-7 rounded-[8px] bg-white border border-[#D1D5DB] flex items-center justify-center text-[#1E213D] shadow-2xs flex-shrink-0 cursor-pointer active:scale-95 transition-transform hover:border-[#1E213D]/40 hover:bg-[#1E213D]/5"
        >
          <Whatsapp size={14} color="#1E213D" variant="Bold" />
        </button>
      </div>
    </article>
  );
}
