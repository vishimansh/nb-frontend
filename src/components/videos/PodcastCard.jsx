import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Messages1,
  Whatsapp,
  VolumeHigh,
  VolumeCross,
  TrendUp,
  Book,
  Messages2,
  SearchStatus,
  Microphone,
  Award,
  Coffee,
  ExportSquare,
  Flash,
} from 'iconsax-react';
import { useVideo } from '../../context/VideoContext';

function getGenreIcon(genreId, color = '#FFFFFF', size = 12) {
  const props = { size, color, variant: 'Linear' };
  switch (genreId) {
    case 'business_startup':
      return <TrendUp {...props} />;
    case 'culture_stories':
      return <Book {...props} />;
    case 'politics_talk':
      return <Messages2 {...props} />;
    case 'news_analysis':
      return <SearchStatus {...props} />;
    case 'entertainment_interview':
      return <Microphone {...props} />;
    case 'sports_talk':
      return <Award {...props} />;
    case 'lifestyle':
      return <Coffee {...props} />;
    default:
      return <TrendUp {...props} />;
  }
}

function getCollapsedExcerpt(hookOrDesc, headline) {
  if (!hookOrDesc) return '';
  const clean = hookOrDesc.replace(/\.+$/, '').trim();
  const headlineLen = (headline || '').length;
  const budget = Math.max(12, 54 - headlineLen);
  if (clean.length <= budget) return clean;
  return clean.slice(0, budget).trim();
}

export default function PodcastCard({
  podcast,
  isActive,
  onAutoAdvance,
  onShareToast,
}) {
  const {
    isMuted,
    toggleMuted,
    activeOverlay,
    openCommentSheet,
    openTranscript,
    togglePodcastLike,
  } = useVideo();

  const audioRef = useRef(null);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [showPlayFlash, setShowPlayFlash] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Audio Playback synchronization with active state and mutual-exclusive overlays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause audio if comment sheet is active or user paused or slide is inactive
    if (isActive && !isPausedByUser && activeOverlay !== 'comment') {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent fallback if autoplay policy restricts
        });
      }
    } else {
      audio.pause();
    }
  }, [isActive, isPausedByUser, activeOverlay]);

  // Reset pause and expansion state when swiped away
  useEffect(() => {
    if (!isActive) {
      setIsPausedByUser(false);
      setIsDescriptionExpanded(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isActive]);

  // Handle center media canvas tap
  const handleMediaTap = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPausedByUser(false);
      setShowPlayFlash(true);
      setTimeout(() => setShowPlayFlash(false), 450);
    } else {
      audio.pause();
      setIsPausedByUser(true);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    togglePodcastLike(podcast.id);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    openCommentSheet(podcast.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const shareText = `*${podcast.showName}*: ${podcast.shortDescription}\nसुनिए नवभारत पॉडकास्ट पर!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    if (onShareToast) {
      onShareToast('व्हाट्सएप शेयर लिंक खुल रहा है...');
    }
  };

  const handleSoundClick = (e) => {
    e.stopPropagation();
    toggleMuted();
  };

  const handleTranscriptClick = (e) => {
    e.stopPropagation();
    openTranscript(podcast.id);
  };

  const genreColor = podcast.genre?.color || '#059669';

  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
      {/* 1. Portrait Visual Cover Art Surface */}
      <div
        onClick={handleMediaTap}
        className="w-full h-full absolute inset-0 cursor-pointer z-0"
      >
        <img
          src={podcast.coverArtImage}
          alt={podcast.showName}
          className="w-full h-full object-cover"
        />

        {/* Hidden Audio Player Element */}
        <audio
          ref={audioRef}
          src={podcast.audioUrl}
          muted={isMuted}
          onEnded={onAutoAdvance}
        />
      </div>

      {/* 2. Ambient Gradient Scrims (Matching ReelItem contrast curve) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none z-10" />

      {/* 3. Center Pause Indicator (Persistent white || bars with drop shadow) */}
      <AnimatePresence>
        {isPausedByUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="flex items-center gap-2 drop-shadow-[0_4px_14px_rgba(0,0,0,0.75)]">
              <div className="w-[7px] h-[30px] bg-white rounded-full shadow-lg" />
              <div className="w-[7px] h-[30px] bg-white rounded-full shadow-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Play Flash Triangle */}
      <AnimatePresence>
        {showPlayFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[24px] border-l-white border-b-[15px] border-b-transparent ml-1 drop-shadow-[0_4px_14px_rgba(0,0,0,0.75)]" />
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
              animate={podcast.isLiked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Heart
                size={28}
                color={podcast.isLiked ? '#EF4444' : '#FFFFFF'}
                variant={podcast.isLiked ? 'Bold' : 'Linear'}
              />
            </motion.div>
          </button>
          <span className="text-[13px] font-semibold text-white drop-shadow mt-1">
            {podcast.likeCount}
          </span>
        </div>

        {/* Comment Button (Messages1 26px) */}
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
            {podcast.commentCount}
          </span>
        </div>

        {/* WhatsApp Share Button (Exact same frosted styling as Reels) */}
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
        {/* Tag Row: Trending + Genre Pill */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Trending Tag: circular badge matching genre pill height (32px) */}
          {podcast.isTrending && (
            <div
              className="w-8 h-8 rounded-full bg-[#C05621] flex items-center justify-center text-white shrink-0 shadow-md"
              title="ट्रेंडिंग"
              aria-label="ट्रेंडिंग"
            >
              <Flash size={18} color="#FFFFFF" variant="Bold" />
            </div>
          )}

          {/* Genre Badge Pill: 6px padding all sides, 6px gap, hug content, icon inside 20x20px circle, 16px medium label */}
          <div className="bg-white rounded-full p-[6px] flex items-center gap-[6px] shadow-md w-fit shrink-0">
            <div
              style={{ backgroundColor: genreColor }}
              className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center shrink-0"
            >
              {getGenreIcon(podcast.genre?.id, '#FFFFFF', 12)}
            </div>
            <span
              style={{ color: genreColor }}
              className="text-[16px] font-medium leading-none"
            >
              {podcast.genre?.label}
            </span>
          </div>
        </div>

        {/* Description & Show Name Stack: completely 16px regular matching ReelItem */}
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
                {podcast.showName}
              </span>
              <span className="font-normal">
                {getCollapsedExcerpt(podcast.shortDescription, podcast.showName)}
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
                {podcast.showName}
              </span>
              <span className="font-normal">{podcast.shortDescription}</span>
              {podcast.hostName && (
                <span className="font-normal text-white/80 block mt-1 text-[14px]">
                  होस्ट: {podcast.hostName}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Action Button: "ट्रांसक्रिप्ट पढ़ें ↗" below description in bottom-left corner */}
        <button
          type="button"
          onClick={handleTranscriptClick}
          aria-label="ट्रांसक्रिप्ट पढ़ें"
          className="p-[12px] bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
        >
          <span className="text-[16px] font-medium text-white tracking-wide leading-none">
            ट्रांसक्रिप्ट पढ़ें
          </span>
          <ExportSquare size={16} color="#FFFFFF" variant="Linear" />
        </button>
      </div>
    </div>
  );
}
