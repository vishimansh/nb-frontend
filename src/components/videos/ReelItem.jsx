import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Whatsapp,
  VolumeHigh,
  VolumeCross,
  Location,
  TrendUp,
  VideoPlay,
  Buildings,
  Cup,
  ExportSquare,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';

function getCategoryIcon(catId, color = '#FFFFFF', size = 16) {
  if (catId === 'business') return <TrendUp size={size} color={color} variant="Linear" />;
  if (catId === 'entertainment') return <VideoPlay size={size} color={color} variant="Linear" />;
  if (catId === 'sports') return <Cup size={size} color={color} variant="Linear" />;
  return <Buildings size={size} color={color} variant="Linear" />;
}

function getCollapsedExcerpt(hookOrDesc, headline) {
  if (!hookOrDesc) return '';
  const clean = hookOrDesc.replace(/\.+$/, '').trim();
  const headlineLen = (headline || '').length;
  const budget = Math.max(12, 54 - headlineLen);
  if (clean.length <= budget) return clean;
  return clean.slice(0, budget).trim();
}

export default function ReelItem({ reel, isActive, onShareToast }) {
  const {
    isMuted,
    toggleMuted,
    isCommentSheetOpen,
    toggleLike,
  } = useVideo();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const lastTapRef = useRef(0);

  // Reset expansion state cleanly when swiped away
  useEffect(() => {
    if (!isActive) {
      setIsDescriptionExpanded(false);
    }
  }, [isActive]);

  const handleMediaTap = (e) => {
    e.stopPropagation();
    if (isCommentSheetOpen) return;

    // Detect double-tap to like
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!reel.isLiked) {
        toggleLike(reel.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);
    }
    lastTapRef.current = now;
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    onShareToast?.('लिंक कॉपी हो गया!');
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(reel.id);
  };

  const handleSoundClick = (e) => {
    e.stopPropagation();
    toggleMuted();
  };

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. Fast-Loading Image Surface */}
      <div
        onClick={handleMediaTap}
        className="w-full h-full absolute inset-0 cursor-pointer z-0 bg-black"
      >
        <img
          src={reel.posterThumbnail || reel.backupPoster}
          alt={reel.headline}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover absolute inset-0 z-0"
          onError={(e) => {
            if (reel.backupPoster && e.target.src !== reel.backupPoster) {
              e.target.src = reel.backupPoster;
            }
          }}
        />
      </div>

      {/* 2. Top and Bottom Gradient Scrims (Curated for authentic contrast) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none z-10" />

      {/* Center Double-Tap Like Heart Animation */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.25 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <Heart
              size={80}
              color="#EF4444"
              variant="Bold"
              className="drop-shadow-[0_4px_24px_rgba(239,68,68,0.7)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Right-Side Interaction Rail (48px above bottom of screen, 16px right margin) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute right-[16px] bottom-[48px] z-30 flex flex-col items-center gap-[24px] pointer-events-auto"
      >
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleLikeClick}
            aria-label="लाइक करें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
          >
            <motion.div
              animate={reel.isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                size={28}
                color={reel.isLiked ? '#EF4444' : '#FFFFFF'}
                variant={reel.isLiked ? 'Bold' : 'Linear'}
              />
            </motion.div>
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">
            {reel.likeCount}
          </span>
        </div>

        {/* WhatsApp Share Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleShareClick}
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
          onClick={handleSoundClick}
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

      {/* 5. Bottom-Left Metadata Overlay Stack (48px above bottom of screen, 16px left margin) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-[48px] left-[16px] right-20 z-30 flex flex-col gap-[16px] pointer-events-auto text-left"
      >
        {/* Tag Row: Category + Trending + Location */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Tag Pill: 6px padding all sides, 6px gap, hug content, icon inside 20x20px circle, 16px medium label */}
          <div className="bg-white rounded-full p-[6px] flex items-center gap-[6px] shadow-md w-fit shrink-0">
            <div
              style={{ backgroundColor: reel.category?.color || '#18253B' }}
              className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center shrink-0"
            >
              {getCategoryIcon(reel.category?.id, '#FFFFFF', 16)}
            </div>
            <span
              style={{ color: reel.category?.color || '#18253B' }}
              className="text-[16px] font-medium leading-none"
            >
              {reel.category?.label}
            </span>
          </div>

          {/* Trending Tag Pill: icon 16px and text 16px medium */}
          {reel.isTrending && (
            <div className="flex items-center gap-1 text-[#FF6B6B] drop-shadow">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M12 2c-.3 1.8-1.5 3.5-3 4.5-2 1.3-3.5 3.5-3.5 6 0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5c0-3.3-2.2-6.2-5-7.2.2 1.5-.4 3.1-1.6 4.1-1.5-2-1.9-5.1-1.9-7.4z" />
              </svg>
              <span className="text-[16px] font-medium leading-none text-[#FF6B6B]">
                ट्रेंडिंग
              </span>
            </div>
          )}

          {/* Location Indicator: icon 16px and text 16px medium */}
          {reel.location && (
            <div className="flex items-center gap-1 text-white/90 drop-shadow">
              <Location size={16} color="#FFFFFF" variant="Bold" />
              <span className="text-[16px] font-medium leading-none text-white">
                {reel.location}
              </span>
            </div>
          )}
        </div>

        {/* Description & Headline Stack: description completely 16px regular */}
        <div className="transition-all duration-200 ease-out">
          {!isDescriptionExpanded ? (
            /* Collapsed State (confined strictly to 2 lines, completely regular) */
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(true);
              }}
              className="text-[16px] font-normal text-white/95 leading-[1.4] drop-shadow line-clamp-2 cursor-pointer select-none"
            >
              <span className="font-normal text-white mr-1.5">
                {reel.headline}
              </span>
              <span className="font-normal">
                {getCollapsedExcerpt(reel.shortHook || reel.fullDescription, reel.headline)}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(true);
                }}
                className="text-[#E39026] font-normal cursor-pointer hover:underline ml-1 inline-block"
              >
                ...और पढ़ें
              </span>
            </p>
          ) : (
            /* Expanded State (completely regular) */
            <p
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(false);
              }}
              className="text-[16px] font-normal text-white/95 leading-[1.5] drop-shadow cursor-pointer select-text"
              title="कम करने के लिए टैप करें"
            >
              <span className="font-normal text-white block mb-0.5">
                {reel.headline}
              </span>
              <span className="font-normal">{reel.fullDescription}</span>
            </p>
          )}
        </div>

        {/* Action Button: "पूरी न्यूज़ पढ़ें ↗" below description in bottom-left corner */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShareToast?.('पूरी न्यूज़ खुल रही है...');
          }}
          aria-label="पूरी न्यूज़ पढ़ें"
          className="p-[12px] bg-[#18253B] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#22334D] transition-all w-fit"
        >
          <span className="text-[16px] font-medium text-white tracking-wide leading-none">
            पूरी न्यूज़ पढ़ें
          </span>
          <ExportSquare size={16} color="#FFFFFF" variant="Linear" />
        </button>
      </div>
    </div>
  );
}
