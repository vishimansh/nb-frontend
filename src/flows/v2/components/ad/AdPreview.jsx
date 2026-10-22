import React, { useState, useRef } from 'react';
import {
  Heart as HeartIcon,
  Whatsapp as WhatsappIcon,
  VolumeHigh,
  VolumeCross,
  ExportSquare,
  Speaker as SpeakerIcon,
  Bank as BankIcon,
  ArrowLeft2,
} from 'iconsax-react';
import { MdSportsCricket } from 'react-icons/md';
import {
  Play,
  ChevronLeft,
  X,
  Download,
} from 'lucide-react';
import { useToastV2 } from '../../context/ToastV2Context';
import { STRINGS } from '../../strings/hi';

// Authentic MVP Ad Assets and Data
import adBhopalHaat from '../../../../assets/ads/feed-ad-bhopal-haat.png';
import rawReelAdsData from '../../../../data/reelAdsData.json';

import exampleVideoReel from '../../assets/examples/example_video_reel.png';
import exampleGridReel from '../../assets/examples/example_grid_reel.png';
import exampleCarouselReel from '../../assets/examples/example_carousel_reel.png';
import exampleFeedBanner from '../../assets/examples/example_feed_banner.png';
import exampleSponsoredArticle from '../../assets/examples/example_sponsored_article.png';

export const PROTOTYPE_DOWNLOADS = {
  video_ad: {
    id: 'video_ad',
    title: 'वीडियो रील विज्ञापन (Toyota India)',
    filename: 'navbharat-prototype-video-reel.png',
    imageUrl: '/prototypes/prototype-video-reel.png',
    fallbackSrc: exampleVideoReel,
    description: 'पूरे 9:16 मोबाइल स्क्रीन पर वीडियो रील विज्ञापन',
  },
  grid_ad: {
    id: 'grid_ad',
    title: '2×2 ग्रिड रील विज्ञापन (Feather India)',
    filename: 'navbharat-prototype-grid-reel.png',
    imageUrl: '/prototypes/prototype-grid-reel.png',
    fallbackSrc: exampleGridReel,
    description: '4 तस्वीरों का आकर्षक 2×2 ग्रिड रील विज्ञापन',
  },
  carousel_ad: {
    id: 'carousel_ad',
    title: 'कैरौसेल रील विज्ञापन (Lumea India)',
    filename: 'navbharat-prototype-carousel-reel.png',
    imageUrl: '/prototypes/prototype-carousel-reel.png',
    fallbackSrc: exampleCarouselReel,
    description: 'स्वाइप होने वाले मल्टी-स्लाइड कैरौसेल रील विज्ञापन',
  },
  feed_card_ad: {
    id: 'feed_card_ad',
    title: 'फ़ीड बैनर कार्ड फ़ोन मॉकअप (भोपाल हाट)',
    filename: 'navbharat-mockup-feed-card-screen.png',
    imageUrl: '/prototypes/mockup-feed-card-screen.png',
    fallbackSrc: exampleFeedBanner,
    description: 'न्यूज़ फ़ीड में 3:1 बैनर विज्ञापन का संपूर्ण मोबाइल स्क्रीन मॉकअप',
  },
  sponsored_ad: {
    id: 'sponsored_ad',
    title: 'स्पॉन्सर्ड आर्टिकल कार्ड फ़ोन मॉकअप (फैमिली रेस्टोरेंट)',
    filename: 'navbharat-mockup-sponsored-card-screen.png',
    imageUrl: '/prototypes/mockup-sponsored-card-screen.png',
    fallbackSrc: exampleSponsoredArticle,
    description: 'न्यूज़ फ़ीड में "स्पॉन्सर्ड" स्टोरी कार्ड का संपूर्ण मोबाइल स्क्रीन मॉकअप',
  },
};

export function triggerPrototypeDownload(formatId, onToast) {
  const item = PROTOTYPE_DOWNLOADS[formatId] || PROTOTYPE_DOWNLOADS.feed_card_ad;
  try {
    const link = document.createElement('a');
    link.href = item.imageUrl || item.fallbackSrc;
    link.download = item.filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onToast) {
      onToast(`📥 ${item.title} डाउनलोड हो रहा है...`);
    }
  } catch (err) {
    console.error('Download failed', err);
  }
}

const mvpToyota = rawReelAdsData?.[0] || {
  brandName: 'Toyota India',
  headline: 'टोयोटा टैसर पर शानदार ऑफर',
  destinationUrl: 'https://www.toyotabharat.com',
  videoUrl: '/videos/toyota-car-ad.mp4',
  posterThumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
};

const mvpFeather = rawReelAdsData?.[1] || {
  brandName: 'Feather India',
  headline: 'फेदर के साथ, हर कदम बने स्टाइल स्टेटमेंट',
  backgroundTexture: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  gridImages: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80',
  ],
};

const mvpLumea =
  rawReelAdsData?.find((ad) => ad.format === 'carousel') ||
  rawReelAdsData?.[3] || {
    brandName: 'Lumea India',
    headline: 'प्रकृति से प्रेरित, आपकी पहचान के लिए',
    carouselSlides: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    ],
  };

const mvpSponsoredArticle = {
  headline: 'भोपाल में खुला नया फैमिली रेस्टोरेंट, स्वाद, माहौल और खास ऑफ़र्स के साथ ज़रूर करें विज़िट',
  subheading: 'शहर के न्यू मार्केट में स्वादिष्ट व्यंजनों और लाइव म्यूज़िक का नया ठिकाना, उद्घाटन पर मिल रही 25% की विशेष छूट',
  imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  brandName: 'फैमिली डाइनिंग',
  publishedAgo: '20 मिनट पहले',
  readTime: '3 मिनट पढ़ें',
};

/**
 * Editorial Feed Card matching the authentic Navbharat FeedCard layout
 */
function AuthenticEditorialFeedCard({
  category,
  catColor,
  IconComponent,
  timeAgo,
  headline,
  imageSrc,
  readTime = '3 मिनट पढ़ें',
}) {
  return (
    <div className="w-full bg-white rounded-[12px] p-2.5 border border-[#E5E7EB] shadow-2xs flex flex-col justify-between pointer-events-none select-none">
      <div className="flex items-start justify-between w-full gap-2">
        <div className="flex-1 min-w-0 flex flex-col justify-start">
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap mb-1">
            <span
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: catColor }}
            >
              <IconComponent size={9} color="#FFFFFF" />
            </span>
            <span
              className="text-[11px] font-semibold leading-normal pt-[1px] shrink-0"
              style={{ color: catColor }}
            >
              {category}
            </span>
            <span className="text-[10px] text-[#6B7280]">• {timeAgo}</span>
          </div>
          <p className="text-[12.5px] font-medium text-[#111827] leading-[17px] line-clamp-2">
            {headline}
          </p>
        </div>
        <div className="w-[88px] h-[58px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
          <img src={imageSrc} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="w-full my-1.5 h-[0.64px] bg-[#18253B]/10" />
      <div className="flex items-center justify-between w-full text-[10px] text-[#6B7280]">
        <span>{timeAgo} • {readTime}</span>
        <div className="flex items-center gap-2">
          <WhatsappIcon size={13} color="#000000" variant="Bold" />
          <span className="text-black font-bold tracking-widest text-[9px]">•••</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Authentic Ad Preview Component with refined dimensions and layout structures:
 * - Reel Formats (Video, Grid, Carousel): Exactly proportioned 9:16 phone chassis (280px × 498px).
 * - Full text visibility: All Hindi matras protected with proper line-height, text shadows, and high contrast.
 * - Feed Card Format: Authentic 3:1 banner card shown in native newsfeed context with real news feed cards.
 * - Sponsored Article Format: Authentic FeedCard shown in native newsfeed context with full article reader modal.
 * - Interactive Download Button: Allows downloading the high-res prototype image for each format!
 */
export default function AdPreview({
  format = 'feed_card_ad',
  shop = {},
  headline = '',
  description = '',
  ctaLabel = 'और जानें',
  media = { images: [], video: null },
  compact = false,
  className = '',
  onCompactTap = null,
  showDownloadBtn = true,
}) {
  const { showToast } = useToastV2();
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(234);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const images = media?.images || [];
  const video = media?.video;
  const isVideo = format === 'video_ad';
  const isGrid = format === 'grid_ad';
  const isCarousel = format === 'carousel_ad';
  const isReel = isVideo || isGrid || isCarousel;
  const isFeedCard = format === 'feed_card_ad';
  const isSponsored = format === 'sponsored_ad';

  // Format-aware brand and copy resolution
  const userShopName = shop?.name?.trim();
  const logoUrl = shop?.logoDataUrl;

  const resolvedBrandName =
    userShopName ||
    (isVideo
      ? mvpToyota.brandName
      : isGrid
      ? mvpFeather.brandName
      : isCarousel
      ? mvpLumea.brandName
      : isFeedCard
      ? 'भोपाल हाट'
      : mvpSponsoredArticle.brandName);

  const resolvedHeadline =
    headline?.trim() ||
    (isVideo
      ? mvpToyota.headline
      : isGrid
      ? mvpFeather.headline
      : isCarousel
      ? mvpLumea.headline
      : isSponsored
      ? mvpSponsoredArticle.headline
      : 'भोपाल हाट - आर्ट • क्राफ्ट • कल्चर');

  const resolvedCtaLabel = ctaLabel || 'और जानें';

  const handleCtaClick = (e) => {
    e?.stopPropagation?.();
    showToast(`${resolvedBrandName} · ${resolvedCtaLabel} लिंक खुल रहा है...`);
  };

  const handleDownloadPrototype = (e) => {
    e?.stopPropagation?.();
    triggerPrototypeDownload(format, showToast);
  };

  const handleLike = (e) => {
    e?.stopPropagation?.();
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  const handleShare = (e) => {
    e?.stopPropagation?.();
    showToast('व्हाट्सएप शेयर लिंक खुल रहा है...');
  };

  const handleSoundToggle = (e) => {
    e?.stopPropagation?.();
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  const handleTogglePlayPause = (e) => {
    e?.stopPropagation?.();
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
    } else {
      vid.play();
      setIsPlaying(true);
    }
  };

  // ==========================================
  // COMPACT PREVIEW MODE (Sticky Bar in S05)
  // ==========================================
  if (compact) {
    let thumbSrc = exampleFeedBanner;
    let formatLabel = 'विज्ञापन प्रीव्यू';

    if (isFeedCard) {
      thumbSrc = images[0]?.dataUrl || adBhopalHaat;
      formatLabel = 'फ़ीड बैनर (3:1 सीधा लिंक)';
    } else if (isVideo) {
      thumbSrc = images[0]?.dataUrl || mvpToyota.posterThumbnail || exampleVideoReel;
      formatLabel = 'वीडियो रील (9:16)';
    } else if (isGrid) {
      thumbSrc = images[0]?.dataUrl || mvpFeather.gridImages?.[0] || exampleGridReel;
      formatLabel = '2×2 ग्रिड रील';
    } else if (isCarousel) {
      thumbSrc = images[0]?.dataUrl || mvpLumea.carouselSlides?.[0] || exampleCarouselReel;
      formatLabel = 'कैरौसेल रील (मल्टी-स्लाइड)';
    } else if (isSponsored) {
      thumbSrc = images[0]?.dataUrl || mvpSponsoredArticle.imageUrl || exampleSponsoredArticle;
      formatLabel = 'प्रायोजित स्टोरी कार्ड';
    }

    return (
      <div
        onClick={onCompactTap}
        className="w-full h-[56px] rounded-2xl bg-white border border-[#E5E7EB] px-3.5 flex items-center justify-between shadow-2xs cursor-pointer select-none active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-14 h-8 rounded-lg bg-[#F7F7F4] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center">
            <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-[#2B2437] truncate leading-normal pt-0.5">
              {formatLabel}
            </div>
            <div className="text-[11px] text-[#6B7280] truncate leading-normal">
              {resolvedBrandName}
            </div>
          </div>
        </div>

        <span className="text-[12px] font-bold text-[#E39026] shrink-0 pl-2">
          {STRINGS.ad?.compactPreviewLabel || 'प्रीव्यू देखें ↗'}
        </span>
      </div>
    );
  }

  // ========================================================
  // REEL AD FORMATS (Video Ad, Grid Ad, Carousel Ad)
  // Proportioned 9:16 phone chassis (280px × 498px)
  // Matra-safe line height (100% visible text) + Download Button
  // ========================================================
  if (isReel) {
    const carouselSlides =
      images.length > 0
        ? images.map((img) => img.dataUrl)
        : mvpLumea.carouselSlides || [exampleCarouselReel];

    return (
      <div className={`w-full max-w-[320px] mx-auto flex flex-col items-center gap-2.5 select-none ${className}`}>
        {/* Phone Chassis Container */}
        <div className="w-[280px] h-[498px] max-w-full rounded-[30px] overflow-hidden bg-black relative shadow-[0_16px_48px_rgba(0,0,0,0.35)] border-[4px] border-[#1C1C1E] mx-auto text-white shrink-0 group select-none">
          {/* Top Status Bar & Navigation Header (Exact replica of VideosPage top bar) */}
          <div className="absolute top-0 inset-x-0 z-30 pt-2 px-3 flex flex-col items-center gap-1.5 pointer-events-none">
            {/* Dynamic Island Mock */}
            <div className="w-18 h-2.5 rounded-full bg-black mx-auto border border-white/10 shadow-sm shrink-0" />

            {/* Carousel Story Segmented Progress Dashes */}
            {isCarousel && (
              <div className="w-full flex items-center gap-1 pt-0.5">
                {carouselSlides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-[2.5px] rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Top Navigation Row matching VideosPage layout */}
            <div className="relative w-full h-[32px] flex items-center justify-between pointer-events-none">
              {/* Left Action: Standardized back button */}
              <button
                type="button"
                onClick={() => showToast('रील बंद हो रही है...')}
                aria-label="वापस जाएं"
                className="w-[30px] h-[30px] rounded-[10px] bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white pointer-events-auto shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <ArrowLeft2 size={15} color="#FFFFFF" variant="Linear" />
              </button>

              {/* Center Action: Dual-Mode Capsule [ वीडियो | पॉडकास्ट ] */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto h-[30px] flex items-center bg-black/60 backdrop-blur-md border border-white/25 rounded-full p-[2.5px] shadow-xl">
                  <span className="h-full px-3 rounded-full text-[11px] font-bold bg-white text-[#2B2437] shadow-md flex items-center justify-center">
                    वीडियो
                  </span>
                  <span className="h-full px-2.5 rounded-full text-[11px] font-semibold text-white/85 flex items-center justify-center">
                    पॉडकास्ट
                  </span>
                </div>
              </div>

              {/* Symmetrical Spacer */}
              <div className="w-[30px] h-[30px] shrink-0 pointer-events-none" />
            </div>
          </div>

          {/* Central Ad Media Surface */}
          <div className="absolute inset-0 z-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
            {/* 1. Video Reel Ad */}
            {isVideo && (
              <div
                onClick={handleTogglePlayPause}
                className="w-full h-full relative flex items-center justify-center cursor-pointer"
              >
                <video
                  ref={videoRef}
                  src={video?.objectUrl || mvpToyota.videoUrl}
                  poster={mvpToyota.posterThumbnail}
                  muted={isMuted}
                  autoPlay
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Play Pause Button Overlay (replicated from VideoAdMedia) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto bg-black/25">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlayPause();
                      }}
                      aria-label="चलाएं (Play)"
                      className="w-[56px] h-[56px] rounded-full bg-black/65 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] active:scale-90 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white border-b-[9px] border-b-transparent ml-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Grid Reel Ad (2x2 Sneaker Grid) */}
            {isGrid && (
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#2D2A26]">
                <img
                  src={mvpFeather.backgroundTexture}
                  alt=""
                  className="w-full h-full object-cover absolute inset-0 opacity-75 filter brightness-90"
                />

                {/* Centered 2x2 Image Grid Canvas (True 1:1 Aspect Square) */}
                <div className="w-[216px] aspect-square grid grid-cols-2 grid-rows-2 gap-1.5 z-10 p-1">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const userImg = images[slotIdx]?.dataUrl;
                    const fallbackImg = mvpFeather.gridImages[slotIdx];
                    const imgSrc = userImg || fallbackImg;

                    return (
                      <div
                        key={slotIdx}
                        className="rounded-xl overflow-hidden border border-white/20 shadow-md bg-black/40 relative aspect-square flex items-center justify-center"
                      >
                        <img
                          src={imgSrc}
                          alt={`Grid ${slotIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Carousel Reel Ad */}
            {isCarousel && (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <img
                  src={carouselSlides[activeSlide % carouselSlides.length]}
                  alt={`Slide ${activeSlide + 1}`}
                  className="w-full h-full object-cover pointer-events-none transition-all duration-300"
                />

                {/* Tap zones for slide navigation */}
                <div
                  onClick={() =>
                    setActiveSlide((prev) => Math.max(0, prev - 1))
                  }
                  className="absolute left-0 top-14 bottom-24 w-1/3 z-20 cursor-pointer"
                  aria-label="पिछली स्लाइड"
                />
                <div
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % carouselSlides.length)
                  }
                  className="absolute right-0 top-14 bottom-24 w-1/3 z-20 cursor-pointer"
                  aria-label="अगली स्लाइड"
                />
              </div>
            )}

            {/* Top and Bottom Ambient Vignette Gradients */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none z-10" />
          </div>

          {/* Right-Side Interaction Rail (Exact replica of AdReelOverlay.jsx) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-[12px] bottom-[36px] z-30 flex flex-col items-center gap-[16px] pointer-events-auto"
          >
            {/* Like Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleLike}
                aria-label="लाइक करें"
                className="w-[38px] h-[38px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg text-white"
              >
                <HeartIcon
                  size={20}
                  color={isLiked ? '#EF4444' : '#FFFFFF'}
                  variant={isLiked ? 'Bold' : 'Linear'}
                />
              </button>
              <span className="text-[10.5px] font-semibold text-white drop-shadow mt-1">
                {likeCount}
              </span>
            </div>

            {/* WhatsApp Share Button */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleShare}
                aria-label="व्हाट्सएप पर शेयर करें"
                className="w-[38px] h-[38px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-lg text-white"
              >
                <WhatsappIcon size={20} color="#FFFFFF" variant="Bold" />
              </button>
              <span className="text-[10px] font-medium text-white mt-1 drop-shadow">
                शेयर
              </span>
            </div>

            {/* Sound Toggle Button */}
            {isVideo && (
              <button
                type="button"
                onClick={handleSoundToggle}
                aria-label={isMuted ? 'आवाज़ चालू करें' : 'म्यूट करें'}
                className="w-[38px] h-[38px] rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg text-white"
              >
                {isMuted ? (
                  <VolumeCross size={20} color="#FFFFFF" />
                ) : (
                  <VolumeHigh size={20} color="#FFFFFF" />
                )}
              </button>
            )}
          </div>

          {/* Bottom-Left Attribution, Headline & CTA Stack (Exact replica of AdReelOverlay.jsx) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-[36px] left-[14px] right-[62px] z-30 flex flex-col gap-[12px] pointer-events-auto text-left"
          >
            {/* Attribution Row: 28px Circular brand logo + Company Name */}
            <div className="flex items-center gap-2">
              <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-white/40 bg-white shrink-0 shadow-sm flex items-center justify-center text-[#2B2437] font-bold text-[11px]">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={resolvedBrandName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (resolvedBrandName.charAt(0) || 'T').toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={handleCtaClick}
                className="text-[14px] font-bold text-white/95 drop-shadow tracking-wide leading-none cursor-pointer hover:underline text-left truncate"
              >
                {resolvedBrandName}
              </button>
            </div>

            {/* Ad Headline & Underlined Vigyapan Tag (Matching AdReelOverlay.jsx) */}
            <div className="flex flex-col gap-1">
              <p className="text-[14px] font-normal text-white leading-snug drop-shadow-md line-clamp-2">
                {resolvedHeadline}
              </p>
              <button
                type="button"
                onClick={handleCtaClick}
                className="text-[11.5px] font-medium text-white/80 underline decoration-white/60 hover:text-white cursor-pointer w-fit text-left tracking-wide"
              >
                विज्ञापन
              </button>
            </div>

            {/* Action Button: "और जानें ↗" below description in bottom-left corner */}
            <button
              type="button"
              onClick={handleCtaClick}
              aria-label={resolvedCtaLabel}
              className="py-[9px] px-3.5 bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-2 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
            >
              <span className="text-[13.5px] font-medium text-white tracking-wide leading-none">
                {resolvedCtaLabel}
              </span>
              <ExportSquare size={14} color="#FFFFFF" variant="Linear" />
            </button>
          </div>
        </div>

        {/* Prototype Image Download Bar */}
        {showDownloadBtn && (
          <div className="w-full max-w-[280px] flex items-center justify-between gap-2 px-1 pt-0.5">
            <span className="text-[11px] text-[#6B7280] font-medium flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
              <span>प्रोटोटाइप 9:16</span>
            </span>
            <button
              type="button"
              onClick={handleDownloadPrototype}
              className="px-2.5 py-1 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
              title={isVideo ? 'वीडियो रील प्रीव्यू डाउनलोड करें' : 'प्रोटोटाइप इमेज डाउनलोड करें'}
            >
              <Download className="w-3 h-3" />
              <span>{isVideo ? 'मॉकअप डाउनलोड करें' : 'इमेज डाउनलोड करें'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // FORMAT 4: FEED AD CARD (3:1 NATIVE BANNER CARD)
  // Rendered inside authentic Navbharat Newsfeed context
  // Entire card is clickable link, exactly matching NativeFeedAd
  // ========================================================
  if (isFeedCard) {
    const bannerImg = images[0]?.dataUrl || adBhopalHaat;

    return (
      <div className={`w-full max-w-[360px] mx-auto flex flex-col gap-2.5 select-none ${className}`}>
        {/* Authentic Navbharat Newsfeed Context */}
        <div className="rounded-[20px] bg-[#F7F7F4] border border-[#E5E7EB] p-2.5 flex flex-col gap-2.5 shadow-xs">
          {/* Top Feed Article (Editorial: Politics) */}
          <AuthenticEditorialFeedCard
            category="राजनीति"
            catColor="#B6783A"
            IconComponent={BankIcon}
            timeAgo="15 मिनट पहले"
            headline="विधानसभा के विशेष सत्र में जनहित के कई प्रस्ताव पारित"
            imageSrc="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80"
          />

          {/* The 3:1 Feed Banner Card itself (Exact match to NativeFeedAd.jsx) */}
          <aside
            aria-label={resolvedHeadline}
            onClick={handleCtaClick}
            className="w-full aspect-[3/1] rounded-[16px] overflow-hidden shadow-xs relative border border-[#E5E7EB] select-none cursor-pointer group active:scale-[0.99] transition-transform bg-white"
          >
            <img
              src={bannerImg}
              alt={resolvedHeadline}
              className="w-full h-full object-cover object-center pointer-events-none select-none"
              loading="lazy"
              draggable={false}
            />
          </aside>

          {/* Bottom Feed Article (Editorial: Sports) */}
          <AuthenticEditorialFeedCard
            category="खेल"
            catColor="#557E63"
            IconComponent={MdSportsCricket}
            timeAgo="25 मिनट पहले"
            headline="राष्ट्रीय खेलों में प्रदेश के खिलाड़ियों ने जीते स्वर्ण पदक"
            imageSrc="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=120&q=80"
          />
        </div>

        {/* Micro-hint and Prototype Download Bar */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E39026] shrink-0" />
            <span>पूरा 3:1 कार्ड क्लिकेबल है</span>
          </span>
          {showDownloadBtn && (
            <button
              type="button"
              onClick={handleDownloadPrototype}
              className="px-2.5 py-1 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
            >
              <Download className="w-3 h-3" />
              <span>इमेज डाउनलोड करें</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // ========================================================
  // FORMAT 5: SPONSORED ARTICLE AD FORMAT
  // Rendered inside authentic Navbharat Newsfeed context
  // Matching FeedCard.jsx with isSponsored={true}
  // ========================================================
  const articleThumb =
    images[0]?.dataUrl || mvpSponsoredArticle.imageUrl || exampleSponsoredArticle;

  return (
    <>
      <div className={`w-full max-w-[360px] mx-auto flex flex-col gap-2.5 select-none ${className}`}>
        {/* Authentic Navbharat Newsfeed Context */}
        <div className="rounded-[20px] bg-[#F7F7F4] border border-[#E5E7EB] p-2.5 flex flex-col gap-2.5 shadow-xs">
          {/* Top Feed Article (Editorial: Politics) */}
          <AuthenticEditorialFeedCard
            category="राजनीति"
            catColor="#B6783A"
            IconComponent={BankIcon}
            timeAgo="15 मिनट पहले"
            headline="विधानसभा के विशेष सत्र में जनहित के कई प्रस्ताव पारित"
            imageSrc="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80"
          />

          {/* Authentic MVP FeedCard with isSponsored={true} */}
          <article
            onClick={() => setShowArticleModal(true)}
            className="w-full bg-white rounded-[12px] p-2.5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between select-none cursor-pointer transition-all hover:border-[#2B2437] active:scale-[0.99] relative"
          >
            {/* Top Section: Left Text Column + Right Thumbnail */}
            <div className="flex items-start justify-between w-full gap-2">
              <div className="flex-1 min-w-0 flex flex-col justify-start">
                {/* Category Badge Row */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap mb-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <SpeakerIcon size={8} color="#FFFFFF" variant="Bold" />
                  </span>

                  <span className="text-[11px] font-bold text-[#2B2437] leading-normal pt-[1px] shrink-0">
                    स्पॉन्सर्ड
                  </span>

                  <span className="text-[10px] font-medium text-[#6B7280] leading-normal shrink-0 truncate max-w-[120px]">
                    • {resolvedBrandName}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-[13px] font-medium text-black leading-[18px] line-clamp-2 pt-0.5">
                  {resolvedHeadline}
                </h3>
              </div>

              {/* Right Thumbnail */}
              <div className="w-[88px] h-[58px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
                <img
                  src={articleThumb}
                  alt={resolvedHeadline}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="w-full my-1.5 h-[0.64px] bg-[#18253B]/10" />

            {/* Bottom Meta Row matching FeedCard */}
            <div className="flex items-center justify-between w-full text-[10px] text-[#6B7280]">
              <div className="flex items-center gap-1.5 font-medium leading-normal">
                <span>{mvpSponsoredArticle.publishedAgo}</span>
                <span>•</span>
                <span>{mvpSponsoredArticle.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <WhatsappIcon size={13} color="#000000" variant="Bold" />
                <span className="text-black font-bold tracking-widest text-[9px]">•••</span>
              </div>
            </div>
          </article>

          {/* Bottom Feed Article (Editorial: Sports) */}
          <AuthenticEditorialFeedCard
            category="खेल"
            catColor="#557E63"
            IconComponent={MdSportsCricket}
            timeAgo="25 मिनट पहले"
            headline="राष्ट्रीय खेलों में प्रदेश के खिलाड़ियों ने जीते स्वर्ण पदक"
            imageSrc="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=120&q=80"
          />
        </div>

        {/* Micro note and Prototype Download Bar */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#6B7280]">
          <span
            onClick={() => setShowArticleModal(true)}
            className="flex items-center gap-1 font-medium text-[#E39026] hover:underline cursor-pointer truncate"
          >
            <span>आर्टिकल खोलें ↗</span>
          </span>
          {showDownloadBtn && (
            <button
              type="button"
              onClick={handleDownloadPrototype}
              className="px-2.5 py-1 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
            >
              <Download className="w-3 h-3" />
              <span>इमेज डाउनलोड करें</span>
            </button>
          )}
        </div>
      </div>

      {/* Full-Screen Article Reader Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] h-[82vh] bg-[#F7F7F4] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative border border-[#E5E7EB]">
            {/* Modal Top App Bar */}
            <div className="h-13 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] active:scale-95 transition-transform cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#2B2437]" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] flex items-center justify-center text-white shrink-0">
                    <SpeakerIcon size={8} color="#FFFFFF" variant="Bold" />
                  </span>
                  <span className="text-[11.5px] font-bold text-[#2B2437]">
                    स्पॉन्सर्ड स्टोरी • {resolvedBrandName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowArticleModal(false)}
                className="w-7 h-7 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#6B7280] active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left scrollbar-none pb-28">
              {/* Hero Image */}
              <div className="w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-black shadow-inner">
                <img
                  src={articleThumb}
                  alt={resolvedHeadline}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Meta */}
              <div className="space-y-1">
                <h1 className="text-[17px] font-bold text-[#2B2437] leading-[23px] pt-1">
                  {resolvedHeadline}
                </h1>
                <p className="text-[11.5px] text-[#6B7280] pt-0.5">
                  {mvpSponsoredArticle.publishedAgo} • {mvpSponsoredArticle.readTime} • विशेष फीचर
                </p>
              </div>

              {/* Highlight Box */}
              <div className="p-3 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] text-[12.5px] text-[#B45309] leading-relaxed">
                ✨ <strong>विशेष पेशकश:</strong> नवभारत पाठकों के लिए विशेष छूट एवं प्राथमिकता सेवा उपलब्ध है।
              </div>

              {/* Body Narrative */}
              <div className="text-[13.5px] text-[#374151] leading-[21px] space-y-2.5 font-normal pt-1">
                <p>
                  {description.trim() ||
                    'राजधानी के नागरिकों और ग्राहकों के लिए यह एक विशेष अवसर है। यहां आपको गुणवत्ता, आधुनिक सुविधाएं और उत्कृष्ट सेवा का अनूठा संगम मिलेगा। उद्घाटन के उपलक्ष्य में विशेष छूट दी जा रही है।'}
                </p>
                <p>
                  अधिक जानकारी, बुकिंग या विशेष ऑफ़र्स का लाभ उठाने के लिए नीचे दिए गए बटन पर टैप करें और सीधे संपर्क करें।
                </p>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] flex items-center justify-between gap-3 shadow-lg z-20">
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#2B2437] truncate">
                  {resolvedBrandName}
                </div>
                <div className="text-[10.5px] text-[#6B7280]">सीधे संपर्क करें</div>
              </div>

              <button
                type="button"
                onClick={handleCtaClick}
                className="px-4.5 py-2 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white font-bold text-[12.5px] shadow-md flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <span>{resolvedCtaLabel}</span>
                <ExportSquare size={13} color="#FFFFFF" variant="Linear" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
