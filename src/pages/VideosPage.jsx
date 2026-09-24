import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TickCircle, DocumentText } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useVideo } from '../context/VideoContext';
import { useAdvertiser } from '../context/AdvertiserContext';
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
  const { campaigns = [] } = useAdvertiser();

  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [adPausedMap, setAdPausedMap] = useState({});

  // Guaranteed merge ensuring all ad formats (including live advertiser video campaigns) are cleanly inserted
  const mergedFeed = useMemo(() => {
    const liveVideoCampaigns = campaigns.filter(
      (c) => c.status === 'live' && c.format === 'video_ad'
    );
    const customAds = liveVideoCampaigns.map((cmp) => ({
      id: cmp.id,
      isAd: true,
      format: 'video',
      brandName: cmp.businessName,
      brandLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80',
      headline: `${cmp.businessName} - प्रायोजित वीडियो`,
      destinationUrl: cmp.details?.destinationUrl || 'https://navabharat.com',
      likeCount: 194,
      isLiked: false,
      videoUrl: cmp.details?.uploadedCreativeUrl?.startsWith('blob') ? cmp.details.uploadedCreativeUrl : 'https://vjs.zencdn.net/v/oceans.mp4',
      posterThumbnail: cmp.details?.uploadedCreativeUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    }));

    const allAds = [...customAds, ...rawReelAdsData];
    return mergeReelsWithAds(rawReelsData, allAds, { cadence: 2 });
  }, [rawReelsData, campaigns]);

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
      {/* Toast Notification: Centered vertically and horizontally */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2B2437]/95 text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/15 backdrop-blur-md pointer-events-auto"
            >
              <TickCircle size={17} color="#F5B55C" variant="Bold" />
              <span className="leading-none">{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unified Top Navigation Overlay: pt-[59px] px-3.5 sm:px-4 (8px below Dynamic Island) */}
      <div
        className={`absolute top-0 inset-x-0 w-full z-30 ${topNavPt} px-3.5 sm:px-4 pointer-events-none transition-all duration-200`}
      >
        {/* Uniform Height Row Container: locks all 3 elements onto the exact same Y-axis line */}
        <div className="relative w-full h-[40px] flex items-center justify-between pointer-events-none">
          {/* Left Action: Standardized back button */}
          <BackButton
            onClick={handleBack}
            ariaLabel="वापस जाएं"
            className="!w-[40px] !h-[40px] !rounded-[13px] pointer-events-auto shadow-md relative z-10"
            iconSize={19}
          />

          {/* Center Action: TRUE HORIZONTAL & VERTICAL MIDDLE Dual-Mode Toggle Capsule */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto h-[40px] flex items-center bg-black/60 backdrop-blur-md border border-white/25 rounded-full p-[3px] shadow-xl"
            >
              <button
                type="button"
                onClick={() => switchMediaMode('video')}
                aria-label="वीडियो मोड"
                className={`h-full px-3.5 sm:px-4 rounded-full text-[13.5px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  mediaMode === 'video'
                    ? 'bg-white text-[#2B2437] font-bold shadow-md'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                वीडियो
              </button>
              <button
                type="button"
                onClick={() => switchMediaMode('podcast')}
                aria-label="पॉडकास्ट मोड"
                className={`h-full px-3.5 sm:px-4 rounded-full text-[13.5px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  mediaMode === 'podcast'
                    ? 'bg-white text-[#2B2437] font-bold shadow-md'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                पॉडकास्ट
              </button>
            </motion.div>
          </div>

          {/* Right Action: 'News Padhein' (न्यूज़ पढ़ें) button - only in video reel, not podcasts */}
          {mediaMode === 'video' ? (
            <button
              type="button"
              onClick={() => navigate('/feed')}
              aria-label="न्यूज़ पढ़ें (ताज़ा खबरें देखें)"
              className="h-[40px] px-3.5 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white border border-[#4D4060]/80 shadow-[0_4px_18px_rgba(43,36,55,0.45)] flex items-center gap-1.5 pointer-events-auto active:scale-95 transition-all text-[13px] font-bold cursor-pointer shrink-0 relative z-10"
            >
              <DocumentText size={16} color="#F5B55C" variant="Bold" />
              <span className="leading-none whitespace-nowrap text-white font-bold tracking-wide">न्यूज़ पढ़ें</span>
            </button>
          ) : (
            <div className="w-[40px] h-[40px] shrink-0 pointer-events-none relative z-10" />
          )}
        </div>
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
                const adKey = item.instanceId || item.id;
                const isAdPaused = Boolean(adPausedMap[adKey]);
                const toggleAdPause = () => {
                  setAdPausedMap((prev) => ({ ...prev, [adKey]: !prev[adKey] }));
                };

                return (
                  <div
                    key={adKey}
                    className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none"
                  >
                    <div className="w-full h-full relative">
                      <AdMediaRenderer
                        ad={item}
                        isCurrentReel={isCurrent}
                        isMuted={isMuted}
                        isPaused={isAdPaused}
                        onTogglePlayPause={toggleAdPause}
                      />
                      <AdReelOverlay
                        ad={item}
                        isMuted={isMuted}
                        onToggleMute={toggleMuted}
                        onActionToast={showToast}
                        isPaused={isAdPaused}
                        onTogglePlayPause={toggleAdPause}
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
