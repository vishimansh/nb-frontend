import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Messages1,
  Whatsapp,
  VolumeHigh,
  VolumeCross,
  Location,
  Camera,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';
import { getCitizenCategory, getCategoryVideo, getCategoryPoster } from '../../data/citizenReportConfig';

function getCollapsedExcerpt(hookOrDesc, headline) {
  if (!hookOrDesc) return '';
  const clean = hookOrDesc.replace(/\.+$/, '').trim();
  const headlineLen = (headline || '').length;
  const budget = Math.max(12, 54 - headlineLen);
  if (clean.length <= budget) return clean;
  return clean.slice(0, budget).trim();
}

export default function CitizenReelItem({
  reel,
  isActive,
  onShareToast,
  onOpenUpload,
  isPreview = false,
}) {
  const {
    isMuted,
    toggleMuted,
    isCommentSheetOpen,
    openCommentSheet,
    toggleCitizenLike,
  } = useVideo();

  const videoRef = useRef(null);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showPlayFlash, setShowPlayFlash] = useState(false);
  const [showBottomContent, setShowBottomContent] = useState(false);
  const lastTapRef = useRef(0);
  const singleTapTimeoutRef = useRef(null);

  const category = getCitizenCategory(reel.categoryId);
  const CategoryIcon = category.icon;
  const placeLabel = [reel.locality, reel.city].filter(Boolean).join(', ');

  const defaultVideo = getCategoryVideo(reel.categoryId);
  const defaultPoster = getCategoryPoster(reel.categoryId);
  const posterSrc = reel.posterThumbnail || defaultPoster;

  const [currentVideoSrc, setCurrentVideoSrc] = useState(reel.videoUrl || defaultVideo);

  useEffect(() => {
    setCurrentVideoSrc(reel.videoUrl || defaultVideo);
  }, [reel.videoUrl, defaultVideo]);

  // Synchronize video playback with active snap-scroll state and user pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPausedByUser && !isCommentSheetOpen) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser autoplay restrictions apply
          if (videoRef.current && !videoRef.current.muted) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, isPausedByUser, isCommentSheetOpen, currentVideoSrc]);

  // Show bottom-left action button after 7 seconds from becoming active (matching ReelItem & PodcastCard)
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

  const handleVideoError = () => {
    if (currentVideoSrc !== defaultVideo) {
      setCurrentVideoSrc(defaultVideo);
      if (videoRef.current) {
        videoRef.current.src = defaultVideo;
        videoRef.current.load();
        if (isActive && !isPausedByUser) {
          videoRef.current.play().catch(() => {});
        }
      }
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
      if (!isPreview && !reel.isLiked) {
        toggleCitizenLike(reel.id);
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
    const text = `*नवभारत नागरिक रिपोर्टर* 🔴\n📍 स्थान: ${placeLabel}\n📢 मुख्य खबर: ${reel.headline}\n\nपूरी ग्राउंड रिपोर्ट नवभारत ऐप पर देखें:`;
    if (navigator.share) {
      navigator.share({ title: reel.headline, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
      onShareToast?.('शेयर लिंक सफलतापूर्वक कॉपी हो गया!');
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isPreview) {
      toggleCitizenLike(reel.id);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    openCommentSheet(reel.id);
  };

  const handleSoundClick = (e) => {
    e.stopPropagation();
    toggleMuted();
  };

  const railDisabled = isPreview ? 'pointer-events-none opacity-70' : '';

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. Fast-Loading Video/Image Surface */}
      <div
        onClick={handleMediaTap}
        className="w-full h-full absolute inset-0 cursor-pointer z-0 bg-black"
      >
        {/* Crisp Poster Image Layer */}
        <img
          src={posterSrc}
          alt={reel.headline}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover absolute inset-0 z-0"
          onError={(e) => {
            if (e.currentTarget.src !== defaultPoster) {
              e.currentTarget.src = defaultPoster;
            }
          }}
        />

        {/* Real Video Element */}
        <video
          ref={videoRef}
          src={currentVideoSrc}
          poster={posterSrc}
          muted={isMuted}
          playsInline
          loop
          preload="auto"
          onError={handleVideoError}
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
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

      {/* 4. Right-Side Interaction Rail (48px above bottom of screen, 16px right margin — strictly replicating ReelItem & PodcastCard) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-[16px] bottom-[48px] z-30 flex flex-col items-center gap-[16px] pointer-events-auto ${railDisabled}`}
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
            {reel.commentCount || 0}
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

      {/* 5. Bottom-Left Metadata Overlay Stack (48px above bottom of screen, 16px left margin — strictly replicating ReelItem & PodcastCard) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-[48px] left-[16px] right-20 z-30 flex flex-col gap-[16px] pointer-events-auto text-left"
      >
        {/* Content Box (Tags + Headline & Description): animates position in sync with button */}
        <motion.div
          layout="position"
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-[16px]"
        >
          {/* Tag Row: Category Pill + Location */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category Tag Pill: 6px padding all sides, 6px gap, hug content, icon inside 20x20px circle, 16px medium label */}
            <div className="bg-white rounded-full p-[6px] flex items-center gap-[6px] shadow-md w-fit shrink-0">
              <div
                style={{ backgroundColor: category.color }}
                className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center shrink-0"
              >
                <CategoryIcon size={12} color="#FFFFFF" variant="Bold" />
              </div>
              <span
                style={{ color: category.color }}
                className="text-[16px] font-medium leading-none"
              >
                {category.label}
              </span>
            </div>

            {/* Location Indicator: icon 16px and text 16px medium */}
            {placeLabel && (
              <div className="flex items-center gap-1 text-white/90 drop-shadow">
                <Location size={16} color="#FFFFFF" variant="Bold" />
                <span className="text-[16px] font-medium leading-none text-white">
                  {placeLabel}
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
                  {getCollapsedExcerpt(reel.fullDescription, reel.headline)}
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
                title="संक्षेप में देखने के लिए टैप करें"
              >
                <span className="font-normal text-white block mb-0.5">
                  {reel.headline}
                </span>
                <span className="font-normal">{reel.fullDescription}</span>
                {(reel.reporterName || reel.timeAgo) && (
                  <span className="font-normal text-white/80 block mt-1 text-[14px]">
                    रिपोर्टर: {reel.isAnonymous ? 'नागरिक रिपोर्टर' : (reel.reporterName || 'नागरिक')} · {reel.timeAgo}
                  </span>
                )}
              </p>
            )}
          </div>
        </motion.div>

        {/* Action Button: "अपनी खबर भेजें" — slides up from bottom after 7s in sync with content box */}
        <AnimatePresence>
          {showBottomContent && (
            <motion.button
              key={`citizen-action-btn-${reel.id}`}
              layout="position"
              type="button"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpload?.();
              }}
              aria-label="अपनी खबर भेजें"
              className="p-[12px] bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
            >
              <Camera size={16} color="#FFFFFF" variant="Bold" />
              <span className="text-[16px] font-medium text-white tracking-wide leading-none">
                अपनी खबर भेजें
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
