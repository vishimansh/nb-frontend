import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Messages1,
  Whatsapp,
  VolumeHigh,
  VolumeCross,
  Location,
  Profile,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';
import { getCitizenCategory, getCategoryVideo, getCategoryPoster } from '../../data/citizenReportConfig';

export default function CitizenReelItem({ reel, isActive, onShareToast, isPreview = false }) {
  const { isMuted, toggleMuted, isCommentSheetOpen, openCommentSheet, toggleCitizenLike } = useVideo();

  const videoRef = useRef(null);
  const lastTapRef = useRef(0);
  const singleTapRef = useRef(null);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [showMuteHint, setShowMuteHint] = useState(false);
  const [showPlayFlash, setShowPlayFlash] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive && !isPausedByUser && !isCommentSheetOpen) {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // If unmuted playback was blocked by browser autoplay policy, mute and retry
          if (videoRef.current && !videoRef.current.muted) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
      if (isMuted) {
        setShowMuteHint(true);
        const timer = setTimeout(() => setShowMuteHint(false), 2800);
        return () => clearTimeout(timer);
      }
    } else {
      video.pause();
    }
  }, [isActive, isPausedByUser, isCommentSheetOpen, currentVideoSrc]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
    if (!isMuted) setShowMuteHint(false);
  }, [isMuted]);

  useEffect(() => {
    if (!isActive) {
      setIsPausedByUser(false);
      setIsExpanded(false);
      setShowMuteHint(false);
      setShowPlayFlash(false);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  const handleMediaTap = (e) => {
    e.stopPropagation();
    if (isCommentSheetOpen) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      clearTimeout(singleTapRef.current);
      singleTapRef.current = null;
      if (!isPreview && !reel.isLiked) toggleCitizenLike(reel.id);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 700);
    } else {
      singleTapRef.current = setTimeout(() => {
        togglePlayPause();
        singleTapRef.current = null;
      }, 280);
    }
    lastTapRef.current = now;
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `*नवभारत नागरिक रिपोर्ट* 🔴\nस्थान: ${placeLabel}\nखबर: ${reel.headline}\n\nपूरी ग्राउंड रिपोर्ट नवभारत ऐप पर देखें:`;
    if (navigator.share) {
      navigator.share({ title: reel.headline, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
      onShareToast?.('व्हाट्सएप शेयर लिंक कॉपी हो गया!');
    }
  };

  const railDisabled = isPreview ? 'pointer-events-none opacity-70' : '';

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. Full-Bleed Video Surface (Edge-to-Edge like standard reels) */}
      <div
        onClick={handleMediaTap}
        className="w-full h-full absolute inset-0 cursor-pointer z-0 bg-black"
      >
        {/* Crisp Poster Image Layer (Always visible underneath so there is never a void or blank screen) */}
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

      {/* Unmute Prompt Hint */}
      <AnimatePresence>
        {showMuteHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleMuted();
            }}
            className="absolute top-[150px] left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-2xl cursor-pointer"
          >
            <VolumeCross size={14} color="#F5B55C" variant="Bold" />
            <span>आवाज़ सुनने के लिए टैप करें</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play/Pause Button when Paused - Dead Center */}
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

      {/* Top and Bottom Gradient Scrims (Matched with standard ReelItem) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none z-10" />

      {/* Double-tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.25 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <Heart size={80} color="#EF4444" variant="Bold" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Rail */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute right-[16px] bottom-[48px] z-30 flex flex-col items-center gap-[16px] ${railDisabled}`}
      >
        {/* Support / Like */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => toggleCitizenLike(reel.id)}
            aria-label="समर्थन करें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
          >
            <motion.div animate={reel.isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.25 }}>
              <Heart size={28} color={reel.isLiked ? '#EF4444' : '#FFFFFF'} variant={reel.isLiked ? 'Bold' : 'Linear'} />
            </motion.div>
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">{reel.likeCount}</span>
        </div>

        {/* Discussion / Comments */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => openCommentSheet(reel.id)}
            aria-label="कमेंट्स देखें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
          >
            <Messages1 size={26} color="#FFFFFF" variant="Linear" />
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">{reel.commentCount || 0}</span>
        </div>

        {/* WhatsApp Share */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleShare}
            aria-label="व्हाट्सएप पर शेयर करें"
            className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-lg"
          >
            <Whatsapp size={28} color="#FFFFFF" variant="Bold" />
          </button>
          <span className="text-[13px] font-medium text-white mt-1 drop-shadow">शेयर</span>
        </div>

        {/* Mute Toggle */}
        <button
          type="button"
          onClick={() => {
            toggleMuted();
            onShareToast?.(isMuted ? 'आवाज़ चालू' : 'म्यूट');
          }}
          aria-label={isMuted ? 'आवाज़ चालू करें' : 'म्यूट करें'}
          className="w-[48px] h-[48px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
        >
          {isMuted ? <VolumeCross size={28} color="#FFFFFF" /> : <VolumeHigh size={28} color="#FFFFFF" />}
        </button>
      </div>

      {/* Bottom-left Content Stack */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-[48px] left-[16px] right-[80px] z-30 flex flex-col gap-[11px] text-left"
      >
        {/* 1. Byline & Reporter Credit */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#2B2437] border border-white/30 flex items-center justify-center shrink-0 text-[13px] font-bold text-[#F5B55C]">
              {reel.isAnonymous || !reel.reporterName ? (
                <Profile size={16} color="#F5B55C" variant="Bold" />
              ) : (
                reel.reporterName.charAt(0)
              )}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[14px] font-semibold text-white truncate">
                {reel.isAnonymous ? 'नागरिक रिपोर्टर (गोपनीय)' : reel.reporterName}
              </span>
              <span className="text-[11.5px] text-white/70 leading-tight">नागरिक रिपोर्टर · {reel.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* 2. Category & Place Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white rounded-full p-[5px] pr-[9px] flex items-center gap-[5px] shadow-md w-fit shrink-0">
            <div
              style={{ backgroundColor: category.color }}
              className="w-[19px] h-[19px] rounded-full flex items-center justify-center shrink-0"
            >
              <CategoryIcon size={12} color="#FFFFFF" variant="Bold" />
            </div>
            <span style={{ color: category.color }} className="text-[14px] font-semibold leading-none">
              {category.label}
            </span>
          </div>

          {placeLabel && (
            <div className="flex items-center gap-1 min-w-0 drop-shadow">
              <Location size={14} color="#FFFFFF" variant="Bold" className="shrink-0" />
              <span className="text-[14px] font-medium leading-none text-white truncate">{placeLabel}</span>
            </div>
          )}
        </div>

        {/* 3. Headline & Limited Description */}
        <div onClick={() => setIsExpanded((p) => !p)} className="cursor-pointer">
          <p className={`text-[15.5px] font-medium text-white leading-[1.4] drop-shadow ${isExpanded ? '' : 'line-clamp-2'}`}>
            {reel.headline}
          </p>
          {!isExpanded && reel.fullDescription && (
            <span className="text-[13px] text-[#F5B55C] font-normal">...और पढ़ें</span>
          )}
          <AnimatePresence>
            {isExpanded && reel.fullDescription && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[13.5px] text-white/90 leading-[1.4] mt-1.5 line-clamp-2">
                  {reel.fullDescription}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
