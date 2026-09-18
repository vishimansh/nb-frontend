import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TickCircle } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useVideo } from '../context/VideoContext';
import rawReelAdsData from '../data/reelAdsData.json';
import { mergeReelsWithAds } from '../utils/feedInjector';
import ReelItem from '../components/videos/ReelItem';
import AdMediaRenderer from '../components/videos/AdMediaRenderer';
import AdReelOverlay from '../components/videos/AdReelOverlay';
import PodcastCard from '../components/videos/PodcastCard';
import CommentSheet from '../components/videos/CommentSheet';
import TranscriptOverlay from '../components/videos/TranscriptOverlay';

export default function VideosPage() {
  const navigate = useNavigate();
  const {
    mediaMode,
    switchMediaMode,
    reels: rawReelsData,
    podcasts,
    videoCurrentIndex,
    setVideoCurrentIndex,
    podcastCurrentIndex,
    setPodcastCurrentIndex,
    isMuted,
    toggleMuted,
  } = useVideo();

  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Guaranteed merge ensuring all 3 ad formats are cleanly inserted
  const mergedFeed = useMemo(() => {
    return mergeReelsWithAds(rawReelsData, rawReelAdsData, { cadence: 2 });
  }, [rawReelsData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  // Align scroll on mount to remembered index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targetIndex = mediaMode === 'video' ? videoCurrentIndex : podcastCurrentIndex;
    const height = container.clientHeight;
    if (height > 0 && targetIndex > 0) {
      container.scrollTo({ top: targetIndex * height, behavior: 'instant' });
    }
  }, []);

  // Restore scroll position ONLY when switching mediaMode
  const prevMediaMode = useRef(mediaMode);
  useEffect(() => {
    if (prevMediaMode.current !== mediaMode) {
      prevMediaMode.current = mediaMode;
      const container = containerRef.current;
      if (!container) return;
      const targetIndex = mediaMode === 'video' ? videoCurrentIndex : podcastCurrentIndex;
      const height = container.clientHeight;
      if (height > 0) {
        container.scrollTo({ top: targetIndex * height, behavior: 'instant' });
      }
    }
  }, [mediaMode, videoCurrentIndex, podcastCurrentIndex]);

  // Keep refs for smooth, non-glitchy scroll tracking
  const modeRef = useRef(mediaMode);
  const feedLengthRef = useRef(mergedFeed.length);
  const podcastsLengthRef = useRef(podcasts.length);
  const lastIndexRef = useRef(mediaMode === 'video' ? videoCurrentIndex : podcastCurrentIndex);

  useEffect(() => {
    modeRef.current = mediaMode;
    feedLengthRef.current = mergedFeed.length;
    podcastsLengthRef.current = podcasts.length;
  }, [mediaMode, mergedFeed.length, podcasts.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container) return;
          const height = container.clientHeight;
          if (height > 0) {
            const index = Math.round(container.scrollTop / height);
            const currentMode = modeRef.current;
            const maxLen =
              currentMode === 'video' ? feedLengthRef.current : podcastsLengthRef.current;
            if (index >= 0 && index < maxLen && index !== lastIndexRef.current) {
              lastIndexRef.current = index;
              if (currentMode === 'video') {
                setVideoCurrentIndex(index);
              } else {
                setPodcastCurrentIndex(index);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [setVideoCurrentIndex, setPodcastCurrentIndex]);

  const currentItem =
    mediaMode === 'video'
      ? mergedFeed[videoCurrentIndex] || mergedFeed[0]
      : podcasts[podcastCurrentIndex] || podcasts[0];

  const topNavPt =
    mediaMode === 'video' && currentItem?.isAd && currentItem?.format === 'carousel'
      ? 'pt-[76px]'
      : 'pt-[59px]';

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none flex flex-col font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-[#1E213D]/95 text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/15 backdrop-blur-md"
          >
            <TickCircle size={17} color="#EEEBDA" variant="Bold" />
            <span className="leading-none">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Top Navigation Overlay: pt-[59px] px-4 (8px below Dynamic Island) */}
      <div
        className={`absolute top-0 inset-x-0 z-30 ${topNavPt} px-4 flex items-center justify-between pointer-events-none transition-all duration-200`}
      >
        {/* Left Action: Standardized boxed back button */}
        <BackButton onClick={handleBack} ariaLabel="वापस जाएं" className="pointer-events-auto shadow-md" />

        {/* Center Action: Segmented Dual-Mode Toggle Capsule [ वीडियो | पॉडकास्ट ] (Mathematically centered on screen) */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg">
          <button
            type="button"
            onClick={() => switchMediaMode('video')}
            aria-label="वीडियो मोड"
            className={`px-3.5 py-1 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              mediaMode === 'video'
                ? 'bg-white text-[#1E213D] shadow-sm'
                : 'text-white/80 hover:text-white font-medium'
            }`}
          >
            वीडियो
          </button>
          <button
            type="button"
            onClick={() => switchMediaMode('podcast')}
            aria-label="पॉडकास्ट मोड"
            className={`px-3.5 py-1 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              mediaMode === 'podcast'
                ? 'bg-white text-[#1E213D] shadow-sm'
                : 'text-white/80 hover:text-white font-medium'
            }`}
          >
            पॉडकास्ट
          </button>
        </div>

        {/* Right Action: Empty balanced spacer to ensure symmetry */}
        <div className="w-8 h-8 shrink-0 pointer-events-none" />
      </div>

      {/* Vertical Snap-Scroll Feed Container (Full-Bleed 100% viewport) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory h-full w-full scrollbar-none relative"
      >
        {mediaMode === 'video'
          ? mergedFeed.map((item, index) => {
              const isCurrent = index === videoCurrentIndex;

              if (item.isAd) {
                return (
                  <div
                    key={item.instanceId || item.id}
                    className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none"
                  >
                    <div className="w-full h-full relative">
                      <AdMediaRenderer
                        ad={item}
                        isCurrentReel={isCurrent}
                        isMuted={isMuted}
                      />
                      <AdReelOverlay
                        ad={item}
                        isMuted={isMuted}
                        onToggleMute={toggleMuted}
                        onActionToast={showToast}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <ReelItem
                  key={item.id || index}
                  reel={item}
                  isActive={isCurrent}
                  onShareToast={showToast}
                />
              );
            })
          : podcasts.map((podcast, index) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                isActive={index === podcastCurrentIndex}
                onShareToast={showToast}
              />
            ))}
      </div>

      {/* Capped Transcript Bottom Overlay (Max 45% screen height) */}
      <TranscriptOverlay />

      {/* Comment Bottom Sheet Component */}
      <CommentSheet />
    </div>
  );
}
