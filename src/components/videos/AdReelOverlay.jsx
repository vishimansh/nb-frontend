import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExportSquare, Heart, Whatsapp, VolumeHigh, VolumeCross } from 'iconsax-react';

export default function AdReelOverlay({
  ad,
  isMuted,
  onToggleMute,
  onActionToast,
  isPaused = false,
  onTogglePlayPause,
}) {
  const [isLiked, setIsLiked] = useState(ad.isLiked || false);
  const [likeCount, setLikeCount] = useState(ad.likeCount || 234);

  const handleCtaClick = (e) => {
    e.stopPropagation();
    if (onActionToast) {
      onActionToast(`${ad.brandName} (${ad.destinationUrl}) खुल रहा है...`);
    }
    if (ad.destinationUrl) {
      window.open(ad.destinationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `*${ad.brandName}*: ${ad.headline}\n${ad.destinationUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    if (onActionToast) {
      onActionToast('व्हाट्सएप शेयर लिंक खुल रहा है...');
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none">
      {/* Bottom-Left Attribution, Headline & CTA Stack (48px above bottom of screen, 16px left margin) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-[48px] left-[16px] right-20 z-30 flex flex-col gap-[16px] pointer-events-auto text-left"
      >
        {/* Attribution Row: 32px Circular brand logo + 16px Company Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-[32px] h-[32px] rounded-full overflow-hidden border border-white/40 bg-white shrink-0 shadow-sm flex items-center justify-center">
            <img
              src={ad.brandLogo}
              alt={ad.brandName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80';
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleCtaClick}
            className="text-[16px] font-bold text-white/95 drop-shadow tracking-wide leading-none cursor-pointer hover:underline text-left"
          >
            {ad.brandName}
          </button>
        </div>

        {/* Ad Headline & Underlined Vigyapan Tag */}
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-normal text-white leading-snug drop-shadow-md">
            {ad.headline}
          </p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="text-[12px] font-medium text-white/80 underline decoration-white/60 hover:text-white cursor-pointer w-fit text-left tracking-wide"
          >
            विज्ञापन
          </button>
        </div>

        {/* Action Button: "और जानें ↗" below description in bottom-left corner */}
        <button
          type="button"
          onClick={handleCtaClick}
          aria-label="और जानें"
          className="p-[12px] bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
        >
          <span className="text-[16px] font-medium text-white tracking-wide leading-none">
            और जानें
          </span>
          <ExportSquare size={16} color="#FFFFFF" variant="Linear" />
        </button>
      </div>

      {/* 3. Right-Side Interaction Rail (48px above bottom of screen, 16px right margin) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-[16px] bottom-[48px] z-30 flex flex-col items-center gap-[24px] pointer-events-auto"
      >

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleLike}
            aria-label="लाइक करें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                size={28}
                color={isLiked ? '#EF4444' : '#FFFFFF'}
                variant={isLiked ? 'Bold' : 'Linear'}
              />
            </motion.div>
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">
            {likeCount}
          </span>
        </div>

        {/* WhatsApp Share Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleShare}
            aria-label="व्हाट्सएप पर शेयर करें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-lg text-white"
          >
            <Whatsapp size={28} color="#FFFFFF" variant="Bold" />
          </button>
          <span className="text-[13px] font-medium text-white mt-1 drop-shadow">
            शेयर
          </span>
        </div>

        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute?.();
          }}
          aria-label={isMuted ? 'आवाज़ चालू करें' : 'म्यूट करें'}
          className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg text-white"
        >
          {isMuted ? (
            <VolumeCross size={28} color="#FFFFFF" />
          ) : (
            <VolumeHigh size={28} color="#FFFFFF" />
          )}
        </button>
      </div>
    </div>
  );
}
