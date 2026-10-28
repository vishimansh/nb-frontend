import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TickCircle, Add, Location, Camera, Edit } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useVideo } from '../context/VideoContext';
import { useAdvertiser } from '../context/AdvertiserContext';
import { useCity } from '../context/CityContext';
import rawReelAdsData from '../data/reelAdsData.json';
import { mergeReelsWithAds } from '../utils/feedInjector';
import ReelItem from '../components/videos/ReelItem';
import CitizenReelItem from '../components/videos/CitizenReelItem';
import CitizenUploadSheet from '../components/videos/CitizenUploadSheet';
import AdMediaRenderer from '../components/videos/AdMediaRenderer';
import AdReelOverlay from '../components/videos/AdReelOverlay';
import PodcastCard from '../components/videos/PodcastCard';
import CommentSheet from '../components/videos/CommentSheet';
import TranscriptOverlay from '../components/videos/TranscriptOverlay';

/** Last snap card in the citizen feed — doubles as the empty state. */
function CitizenFeedEndCard({ isEmpty, cityLabel, onCreate }) {
  return (
    <div className="h-full w-full snap-start relative flex-shrink-0 flex flex-col items-center justify-center px-8 text-center bg-[#1E1926]">
      <div className="w-16 h-16 rounded-full bg-[#F5B55C]/15 border border-[#F5B55C]/40 flex items-center justify-center shadow-inner">
        <Camera size={30} color="#F5B55C" variant="Bold" />
      </div>
      <h3 className="text-[20px] font-bold text-white mt-5 leading-snug">
        {isEmpty ? `${cityLabel} से अभी कोई नागरिक रिपोर्ट नहीं` : 'आपके इलाके में क्या चल रहा है?'}
      </h3>
      <p className="text-[14px] text-white/70 mt-2 leading-relaxed max-w-[290px]">
        {isEmpty
          ? `पहली रिपोर्ट आप भेजें। नवभारत डेस्क सत्यापन के बाद इसे ${cityLabel} के सभी पाठकों को दिखाएगा।`
          : 'सड़क, पानी, बिजली या कोई स्थानीय आयोजन — 60 सेकंड का वीडियो भेजें और अपने शहर की आवाज़ बनें।'}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onCreate}
          className="h-[50px] px-7 rounded-full bg-gradient-to-r from-[#F5B55C] to-[#E39026] text-[#2B2437] text-[15px] font-bold flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-[#F5B55C]/20 border border-[#F5B55C]/50"
        >
          <Add size={20} color="#2B2437" />
          अपनी खबर भेजें
        </button>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const navigate = useNavigate();
  const {
    mediaMode,
    switchMediaMode,
    reels: rawReelsData,
    podcasts,
    citizenReels = [],
    videoCurrentIndex,
    setVideoCurrentIndex,
    podcastCurrentIndex,
    setPodcastCurrentIndex,
    citizenCurrentIndex,
    setCitizenCurrentIndex,
    citizenCityFilter,
    setCitizenCityFilter,
    isUploadSheetOpen,
    setIsUploadSheetOpen,
    isMuted,
    toggleMuted,
  } = useVideo();

  const { campaigns = [] } = useAdvertiser();
  const { savedCities = [], activeCityId, setActiveCityId } = useCity();

  // Active city object from saved cities (Single Source of Truth)
  const currentSavedCity = useMemo(() => {
    return savedCities.find((c) => c.id === activeCityId) || savedCities[0] || { id: 'bhopal', name: 'भोपाल' };
  }, [savedCities, activeCityId]);

  const containerRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [adPausedMap, setAdPausedMap] = useState({});

  // Strict City Filter: only allows cities currently present in savedCities or 'all_saved'
  const activeCityFilter = useMemo(() => {
    if (citizenCityFilter === 'all_saved') return 'all_saved';
    if (citizenCityFilter && savedCities.some((c) => c.name === citizenCityFilter)) {
      return citizenCityFilter;
    }
    return currentSavedCity.name;
  }, [citizenCityFilter, savedCities, currentSavedCity]);

  // Keep citizenCityFilter synced if savedCities changes
  useEffect(() => {
    if (
      citizenCityFilter &&
      citizenCityFilter !== 'all_saved' &&
      !savedCities.some((c) => c.name === citizenCityFilter)
    ) {
      setCitizenCityFilter(currentSavedCity.name);
    }
  }, [citizenCityFilter, savedCities, currentSavedCity.name, setCitizenCityFilter]);

  // Filter citizen reels strictly by user's selected cities
  const filteredCitizenReels = useMemo(() => {
    if (activeCityFilter === 'all_saved') {
      const savedCityNames = savedCities.map((sc) => sc.name);
      return citizenReels.filter((r) => savedCityNames.includes(r.city));
    }
    return citizenReels.filter((r) => r.city === activeCityFilter);
  }, [citizenReels, activeCityFilter, savedCities]);

  const mergedFeed = useMemo(() => {
    const liveVideoCampaigns = campaigns.filter((c) => c.status === 'live' && c.format === 'video_ad');
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
      videoUrl: cmp.details?.uploadedCreativeUrl?.startsWith('blob') ? cmp.details.uploadedCreativeUrl : '/videos/toyota-car-ad.mp4',
      posterThumbnail: cmp.details?.uploadedCreativeUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    }));
    const allAds = [...customAds, ...rawReelAdsData];
    return mergeReelsWithAds(rawReelsData, allAds, { cadence: 2 });
  }, [rawReelsData, campaigns]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((prev) => (prev === msg ? null : prev)), 2400);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/feed');
  };

  const indexForMode = (mode) =>
    mode === 'video' ? videoCurrentIndex : mode === 'citizen' ? citizenCurrentIndex : podcastCurrentIndex;

  const openUpload = () => {
    setIsUploadSheetOpen(true);
  };

  // Align scroll on mount to remembered index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targetIndex = indexForMode(mediaMode);
    const height = container.clientHeight;
    if (height > 0 && targetIndex > 0) {
      container.scrollTo({ top: targetIndex * height, behavior: 'instant' });
    }
  }, []);

  // Restore scroll position when switching mediaMode
  const prevMediaMode = useRef(mediaMode);
  useEffect(() => {
    if (prevMediaMode.current !== mediaMode) {
      prevMediaMode.current = mediaMode;
      const container = containerRef.current;
      if (!container) return;
      const targetIndex = indexForMode(mediaMode);
      lastIndexRef.current = targetIndex;
      const height = container.clientHeight;
      if (height > 0) container.scrollTo({ top: targetIndex * height, behavior: 'instant' });
    }
  }, [mediaMode, videoCurrentIndex, podcastCurrentIndex, citizenCurrentIndex]);

  const modeRef = useRef(mediaMode);
  const feedLengthRef = useRef(mergedFeed.length);
  const podcastsLengthRef = useRef(podcasts.length);
  const citizenLengthRef = useRef(filteredCitizenReels.length + 1);
  const lastIndexRef = useRef(indexForMode(mediaMode));

  useEffect(() => {
    modeRef.current = mediaMode;
    feedLengthRef.current = mergedFeed.length;
    podcastsLengthRef.current = podcasts.length;
    citizenLengthRef.current = filteredCitizenReels.length + 1; // +1 for the end card
  }, [mediaMode, mergedFeed.length, podcasts.length, filteredCitizenReels.length]);

  // Synchronize city selection with CityContext and reset scroll
  const handleSelectCityChip = (cityObj) => {
    if (cityObj === 'all_saved') {
      setCitizenCityFilter('all_saved');
    } else {
      setActiveCityId(cityObj.id);
      setCitizenCityFilter(cityObj.name);
    }
    setCitizenCurrentIndex(0);
    lastIndexRef.current = 0;
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  };

  // After a submission, reset index to 0 and scroll container to top
  useEffect(() => {
    if (mediaMode === 'citizen') {
      lastIndexRef.current = 0;
      setCitizenCurrentIndex(0);
      containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [citizenReels.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const height = container.clientHeight;
        if (height > 0) {
          const index = Math.round(container.scrollTop / height);
          const currentMode = modeRef.current;
          const maxLen =
            currentMode === 'video'
              ? feedLengthRef.current
              : currentMode === 'citizen'
              ? citizenLengthRef.current
              : podcastsLengthRef.current;
          if (index >= 0 && index < maxLen && index !== lastIndexRef.current) {
            lastIndexRef.current = index;
            if (currentMode === 'video') setVideoCurrentIndex(index);
            else if (currentMode === 'citizen') setCitizenCurrentIndex(index);
            else setPodcastCurrentIndex(index);
          }
        }
        ticking = false;
      });
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [setVideoCurrentIndex, setPodcastCurrentIndex, setCitizenCurrentIndex]);

  const currentItem =
    mediaMode === 'video' ? mergedFeed[videoCurrentIndex] || mergedFeed[0] : null;

  const topNavPt =
    mediaMode === 'video' && currentItem?.isAd && currentItem?.format === 'carousel'
      ? 'pt-[76px]'
      : 'pt-[59px]';

  const modeBtn = (mode, label) =>
    `h-full px-3.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center whitespace-nowrap ${
      mediaMode === mode ? 'bg-white text-[#2B2437] font-bold shadow-md' : 'text-white/85 hover:text-white'
    }`;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none flex flex-col font-sans">
      {/* Toast */}
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

      {/* Top Navigation Overlay */}
      <div className={`absolute top-0 inset-x-0 w-full z-30 ${topNavPt} px-3.5 sm:px-4 pointer-events-none transition-all duration-200`}>
        <div className="relative w-full h-[40px] flex items-center justify-between pointer-events-none">
          <BackButton
            onClick={handleBack}
            ariaLabel="वापस जाएं"
            className="!w-[40px] !h-[40px] !rounded-[13px] pointer-events-auto shadow-md relative z-10"
            iconSize={19}
          />

          {/* 3-mode toggle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto h-[40px] flex items-center bg-black/60 backdrop-blur-md border border-white/25 rounded-full p-[3px] shadow-xl">
              <button type="button" onClick={() => switchMediaMode('video')} aria-label="वीडियो मोड" className={modeBtn('video', 'वीडियो')}>
                वीडियो
              </button>
              <button type="button" onClick={() => switchMediaMode('podcast')} aria-label="पॉडकास्ट मोड" className={modeBtn('podcast', 'पॉडकास्ट')}>
                पॉडकास्ट
              </button>
              <button type="button" onClick={() => switchMediaMode('citizen')} aria-label="नागरिक रिपोर्ट मोड" className={modeBtn('citizen', 'नागरिक रिपोर्ट')}>
                नागरिक रिपोर्ट
              </button>
            </div>
          </div>

          {/* Right slot: create button in citizen mode */}
          {mediaMode === 'citizen' ? (
            <div className="relative z-10 pointer-events-auto">
              <button
                type="button"
                onClick={openUpload}
                aria-label="अपनी खबर भेजें"
                className="w-[40px] h-[40px] rounded-[13px] bg-[#F5B55C] flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
              >
                <Add size={24} color="#2B2437" />
              </button>
            </div>
          ) : (
            <div className="w-[40px] h-[40px] shrink-0 pointer-events-none relative z-10" />
          )}
        </div>

        {/* Hyperlocal City Chips: Strictly bound to user's savedCities from CityContext (No Add City) */}
        {mediaMode === 'citizen' && (
          <div className="mt-3 -mx-3.5 px-3.5 flex items-center gap-2 overflow-x-auto scrollbar-none pointer-events-auto">
            {/* 1. User's saved cities */}
            {savedCities.map((city) => {
              const isActive = activeCityFilter === city.name;
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelectCityChip(city)}
                  className={`h-[32px] px-3.5 rounded-full flex items-center gap-1.5 shrink-0 text-[13px] transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#F5B55C] text-[#2B2437] font-bold shadow-md shadow-[#F5B55C]/20 border border-[#F5B55C]'
                      : 'bg-black/55 backdrop-blur-md border border-white/20 text-white font-medium hover:border-white/40'
                  }`}
                >
                  <Location size={13} color={isActive ? '#2B2437' : '#FFFFFF'} variant="Bold" />
                  <span>{city.name}</span>
                </button>
              );
            })}

            {/* 2. "सभी चुने शहर" (Show all user's cities together) if user selected > 1 city */}
            {savedCities.length > 1 && (
              <button
                type="button"
                onClick={() => handleSelectCityChip('all_saved')}
                className={`h-[32px] px-3.5 rounded-full flex items-center shrink-0 text-[13px] transition-all cursor-pointer active:scale-95 ${
                  activeCityFilter === 'all_saved'
                    ? 'bg-[#F5B55C] text-[#2B2437] font-bold shadow-md shadow-[#F5B55C]/20 border border-[#F5B55C]'
                    : 'bg-black/55 backdrop-blur-md border border-white/20 text-white font-medium hover:border-white/40'
                }`}
              >
                सभी {savedCities.length} शहर
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feed Container */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll snap-y snap-mandatory h-full w-full scrollbar-none relative">
        {mediaMode === 'video' &&
          mergedFeed.map((item, index) => {
            const isCurrent = index === videoCurrentIndex;
            if (item.isAd) {
              const adKey = item.instanceId || item.id;
              const isAdPaused = Boolean(adPausedMap[adKey]);
              const toggleAdPause = () => setAdPausedMap((prev) => ({ ...prev, [adKey]: !prev[adKey] }));
              return (
                <div key={adKey} className="h-full w-full snap-start relative flex-shrink-0 flex items-center justify-center overflow-hidden bg-black select-none">
                  <div className="w-full h-full relative">
                    <AdMediaRenderer ad={item} isCurrentReel={isCurrent} isMuted={isMuted} isPaused={isAdPaused} onTogglePlayPause={toggleAdPause} />
                    <AdReelOverlay ad={item} isMuted={isMuted} onToggleMute={toggleMuted} onActionToast={showToast} isPaused={isAdPaused} onTogglePlayPause={toggleAdPause} />
                  </div>
                </div>
              );
            }
            return <ReelItem key={item.id || index} reel={item} isActive={isCurrent} onShareToast={showToast} />;
          })}

        {mediaMode === 'citizen' && (
          <>
            {filteredCitizenReels.map((report, index) => (
              <CitizenReelItem
                key={report.id}
                reel={report}
                isActive={index === citizenCurrentIndex && !isUploadSheetOpen}
                onShareToast={showToast}
              />
            ))}
            <CitizenFeedEndCard
              isEmpty={filteredCitizenReels.length === 0}
              cityLabel={activeCityFilter === 'all_saved' ? 'आपके शहरों' : activeCityFilter}
              onCreate={openUpload}
            />
          </>
        )}

        {mediaMode === 'podcast' &&
          podcasts.map((podcast, index) => (
            <PodcastCard key={podcast.id} podcast={podcast} isActive={index === podcastCurrentIndex} onShareToast={showToast} />
          ))}
      </div>

      <CitizenUploadSheet
        isOpen={isUploadSheetOpen}
        onClose={() => setIsUploadSheetOpen(false)}
        onSuccessToast={showToast}
      />
      <TranscriptOverlay />
      <CommentSheet />
    </div>
  );
}
