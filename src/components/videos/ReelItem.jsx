import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Messages1,
  Whatsapp,
  VolumeHigh,
  VolumeCross,
  Location,
  TrendUp,
  VideoPlay,
  Buildings,
  Cup,
  Flash,
  DocumentText,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';
import { getCategoryMeta } from '../../theme/categories';

function getCategoryIcon(catId, color = '#FFFFFF', size = 16) {
  const meta = getCategoryMeta(catId);
  const IconComp = meta?.icon || Buildings;
  return <IconComp size={size} color={color} variant="Linear" />;
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
  const navigate = useNavigate();
  const {
    isMuted,
    toggleMuted,
    isCommentSheetOpen,
    openCommentSheet,
    toggleLike,
  } = useVideo();

  const videoRef = useRef(null);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showPlayFlash, setShowPlayFlash] = useState(false);
  const [showBottomContent, setShowBottomContent] = useState(false);
  const lastTapRef = useRef(0);
  const singleTapTimeoutRef = useRef(null);

  // Synchronize video playback with active snap-scroll state and user pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPausedByUser && !isCommentSheetOpen) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser restrictions apply
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, isPausedByUser, isCommentSheetOpen]);

  // Show bottom-left content section after 7 seconds from becoming active
  useEffect(() => {
    if (!isActive) {
      setShowBottomContent(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowBottomContent(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, [isActive]);

  // Keep muted state synced
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Reset state cleanly when swiped away
  useEffect(() => {
    if (!isActive) {
      setIsPausedByUser(false);
      setShowPlayFlash(false);
      setIsDescriptionExpanded(false);
      setShowBottomContent(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) {
      setIsPausedByUser((prev) => !prev);
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
      setIsPausedByUser(false);
      setShowPlayFlash(true);
      setTimeout(() => setShowPlayFlash(false), 450);
    } else {
      video.pause();
      setIsPausedByUser(true);
    }
  };

  const handleMediaTap = (e) => {
    e.stopPropagation();
    if (isCommentSheetOpen) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double-tap detected: cancel pending pause and toggle like
      if (singleTapTimeoutRef.current) {
        clearTimeout(singleTapTimeoutRef.current);
        singleTapTimeoutRef.current = null;
      }
      if (!reel.isLiked) {
        toggleLike(reel.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);
    } else {
      // Single tap: toggle play / pause
      singleTapTimeoutRef.current = setTimeout(() => {
        togglePlayPause();
        singleTapTimeoutRef.current = null;
      }, 280);
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

  const handleCommentClick = (e) => {
    e.stopPropagation();
    openCommentSheet(reel.id);
  };

  const handleSoundClick = (e) => {
    e.stopPropagation();
    toggleMuted();
  };

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. Fast-Loading Video/Image Surface */}
      <div
        onClick={handleMediaTap}
        className="w-full h-full absolute inset-0 cursor-pointer z-0 bg-black"
      >
        {reel.videoUrl ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.posterThumbnail || reel.backupPoster}
            muted={isMuted}
            playsInline
            loop
            preload="auto"
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= 7) {
                setShowBottomContent(true);
              }
            }}
            className="w-full h-full object-cover absolute inset-0 z-0"
          />
        ) : (
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
        )}
      </div>

      {/* Center Play/Pause Option: prominent interactive button when paused */}
      <AnimatePresence>
        {isPausedByUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer pointer-events-auto"
          >
            <button
              type="button"
              aria-label="चलाएं (Play)"
              className="w-[76px] h-[76px] rounded-full bg-black/65 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] active:scale-90 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[24px] border-l-white border-b-[15px] border-b-transparent ml-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Flash Animation on Resume */}
      <AnimatePresence>
        {showPlayFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="w-[76px] h-[76px] rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[24px] border-l-white border-b-[15px] border-b-transparent ml-1.5 drop-shadow" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleCommentClick}
            aria-label="कमेंट्स देखें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg text-white"
          >
            <Messages1 size={26} color="#FFFFFF" variant="Linear" />
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">
            {reel.commentCount}
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

      {/* 5. Bottom-Left Metadata Overlay Stack (Pops up from below after 7 seconds) */}
      <AnimatePresence>
        {showBottomContent && (
          <motion.div
            key={`reel-bottom-content-${reel.id}`}
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 70 }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-[48px] left-[16px] right-20 z-30 flex flex-col gap-[16px] pointer-events-auto text-left"
          >
            {/* Tag Row: Trending + Category + Location */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Trending Tag: circular badge matching category pill height (32px) */}
              {reel.isTrending && (
                <div
                  className="w-8 h-8 rounded-full bg-[#C05621] flex items-center justify-center text-white shrink-0 shadow-md"
                  title="ट्रेंडिंग"
                  aria-label="ट्रेंडिंग"
                >
                  <Flash size={18} color="#FFFFFF" variant="Bold" />
                </div>
              )}

              {/* Category Tag Pill: 6px padding all sides, 6px gap, hug content, icon inside 20x20px circle, 16px medium label */}
              <div className="bg-white rounded-full p-[6px] flex items-center gap-[6px] shadow-md w-fit shrink-0">
                <div
                  style={{ backgroundColor: reel.category?.color || '#2B2437' }}
                  className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center shrink-0"
                >
                  {getCategoryIcon(reel.category?.id, '#FFFFFF', 16)}
                </div>
                <span
                  style={{ color: reel.category?.color || '#2B2437' }}
                  className="text-[16px] font-medium leading-none"
                >
                  {reel.category?.label}
                </span>
              </div>

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
                    className="text-[#F5B55C] font-normal cursor-pointer hover:underline ml-1 inline-block"
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

            {/* न्यूज़ पढ़ें Button: bottom of left overlay, matching PodcastCard transcript button style */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/feed');
              }}
              aria-label="न्यूज़ पढ़ें — ताज़ा खबरें देखें"
              className="p-[12px] bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
            >
              <DocumentText size={16} color="#F5B55C" variant="Bold" />
              <span className="text-[16px] font-medium text-white tracking-wide leading-none">
                न्यूज़ पढ़ें
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
