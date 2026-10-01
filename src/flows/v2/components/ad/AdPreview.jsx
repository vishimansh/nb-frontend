import React, { useState, useRef } from 'react';
import {
  Heart as HeartIcon,
  Whatsapp as WhatsappIcon,
  VolumeHigh,
  VolumeCross,
  ExportSquare,
  Speaker as SpeakerIcon,
} from 'iconsax-react';
import {
  Play,
  ChevronLeft,
  X,
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

const mvpLumea = rawReelAdsData?.[2] || {
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
 * Authentic Ad Preview Component with refined dimensions and layout structures:
 * - Reel Formats (Video, Grid, Carousel): Exactly proportioned 9:16 phone chassis (270px × 480px).
 * - Full text visibility: All Hindi matras protected with proper line-height, text shadows, and high contrast.
 * - Feed Card Format: Authentic 3:1 banner card shown in native newsfeed context.
 * - Sponsored Article Format: Authentic FeedCard shown in native newsfeed context with full article reader modal.
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
      thumbSrc = images[0]?.dataUrl || mvpFeather.gridImages[0] || exampleGridReel;
      formatLabel = '2×2 ग्रिड रील';
    } else if (isCarousel) {
      thumbSrc = images[0]?.dataUrl || mvpLumea.carouselSlides[0] || exampleCarouselReel;
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
  // Perfectly proportioned 9:16 phone chassis (270px × 480px)
  // High contrast vignette + matra-safe line height (100% visible text)
  // ========================================================
  if (isReel) {
    const carouselSlides =
      images.length > 0
        ? images.map((img) => img.dataUrl)
        : mvpLumea.carouselSlides || [exampleCarouselReel];

    return (
      <div
        className={`w-[270px] h-[480px] max-w-full rounded-[24px] overflow-hidden bg-black relative flex flex-col justify-between select-none shadow-xl border border-white/15 mx-auto text-white shrink-0 ${className}`}
      >
        {/* Dynamic Island Mock */}
        <div className="w-16 h-2.5 rounded-full bg-black mx-auto mt-1.5 z-30 shrink-0 border border-white/10 shadow-sm" />

        {/* Carousel Story Segmented Progress Dashes */}
        {isCarousel && (
          <div className="absolute top-5 left-3.5 right-3.5 z-40 flex items-center gap-1 pointer-events-none">
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

        {/* Top Navigation Mock */}
        <div
          className={`w-full px-3 z-30 flex items-center justify-between ${
            isCarousel ? 'pt-4' : 'pt-1.5'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-[11px] text-white">
            ‹
          </div>

          {/* Centered [ वीडियो | पॉडकास्ट ] Pill Toggle */}
          <div className="px-1.5 py-0.2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[9px] font-bold flex items-center gap-1 shadow-sm">
            <span className="px-1.5 py-0.2 rounded-full bg-white text-[#1C1C1E] shadow-2xs">
              वीडियो
            </span>
            <span className="text-white/80 px-0.5">पॉडकास्ट</span>
          </div>

          <div className="w-6" />
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
                className="w-full h-full object-cover"
              />

              {/* Play Pause Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto bg-black/25">
                  <div className="w-13 h-13 rounded-full bg-black/65 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl active:scale-95 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Grid Reel Ad */}
          {isGrid && (
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#2D2A26]">
              <img
                src={mvpFeather.backgroundTexture}
                alt=""
                className="w-full h-full object-cover absolute inset-0 opacity-75 filter brightness-90"
              />

              {/* Centered 2x2 Image Grid Canvas (True 1:1 Aspect Square) */}
              <div className="w-[210px] aspect-square grid grid-cols-2 grid-rows-2 gap-1.5 z-10 p-1">
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

          {/* Top and Bottom Ambient Vignette Gradients (Rich bottom vignette for 100% text legibility) */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none z-10" />
        </div>

        {/* Right-Side Interaction Rail — sits above the bottom text overlay */}
        <div className="absolute right-2.5 bottom-36 z-20 flex flex-col items-center gap-3 pointer-events-auto">
          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleLike}
              className="w-8.5 h-8.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform shadow-lg cursor-pointer"
            >
              <HeartIcon
                size={18}
                color={isLiked ? '#EF4444' : '#FFFFFF'}
                variant={isLiked ? 'Bold' : 'Linear'}
              />
            </button>
            <span className="text-[10px] font-semibold text-white drop-shadow mt-0.5">
              {likeCount}
            </span>
          </div>

          {/* WhatsApp Share Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleShare}
              className="w-8.5 h-8.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-95 transition-transform shadow-lg text-white cursor-pointer"
            >
              <WhatsappIcon size={18} color="#FFFFFF" variant="Bold" />
            </button>
            <span className="text-[9px] font-medium text-white drop-shadow mt-0.5">
              शेयर
            </span>
          </div>

          {/* Sound Toggle */}
          {isVideo && (
            <button
              type="button"
              onClick={handleSoundToggle}
              className="w-8.5 h-8.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-90 transition-transform shadow-lg text-white cursor-pointer"
            >
              {isMuted ? (
                <VolumeCross size={16} color="#FFFFFF" />
              ) : (
                <VolumeHigh size={16} color="#FFFFFF" />
              )}
            </button>
          )}
        </div>

        {/* Bottom-Left Overlay Stack: Absolutely pinned to chassis bottom, 100% visible Hindi Matras */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 z-20 flex flex-col gap-1.5 text-left pr-[52px] pointer-events-auto">
          {/* Attribution: Circular brand logo + Company Name */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/40 bg-white shrink-0 shadow-sm flex items-center justify-center text-[#2B2437] font-bold text-[10.5px]">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                resolvedBrandName.charAt(0)
              )}
            </div>
            <span className="text-[13px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] leading-[1.5] truncate">
              {resolvedBrandName}
            </span>
          </div>

          {/* Headline with generous line-height: matras above/below consonants always fully rendered */}
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-semibold text-white leading-[20px] pt-[3px] pb-[3px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] line-clamp-2">
              {resolvedHeadline}
            </p>
            <button
              type="button"
              onClick={handleCtaClick}
              className="text-[10.5px] font-medium text-white/85 underline decoration-white/60 hover:text-white cursor-pointer w-fit text-left tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-[1.5]"
            >
              विज्ञापन
            </button>
          </div>

          {/* Action Button: "और जानें ↗" (Rounded Pill CTA) */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="px-3.5 py-2 bg-[#2B2437] border border-white/20 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer text-white hover:bg-[#3D334E] transition-all w-fit"
          >
            <span className="text-[12px] font-semibold text-white tracking-wide leading-[1.4]">
              {resolvedCtaLabel}
            </span>
            <ExportSquare size={12} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>
    );
  }

  // ========================================================
  // FORMAT 4: FEED AD CARD (3:1 NATIVE BANNER CARD)
  // Rendered inside authentic Navbharat Newsfeed context
  // Entire card is the clickable CTA link; NO headline or description overlay.
  // ========================================================
  if (isFeedCard) {
    const bannerImg = images[0]?.dataUrl || adBhopalHaat;

    return (
      <div className={`w-full max-w-[360px] mx-auto flex flex-col gap-2.5 select-none ${className}`}>
        {/* Newsfeed Snippet Container */}
        <div className="rounded-[20px] bg-[#F7F7F4] border border-[#E5E7EB] p-2.5 flex flex-col gap-2.5 shadow-xs">
          {/* Editorial Story Snippet (Above) */}
          <div className="p-2 rounded-[10px] bg-white border border-[#E5E7EB]/80 flex items-start gap-2 shadow-2xs opacity-80 pointer-events-none">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6783A]" />
                <span className="text-[9.5px] font-bold text-[#B6783A]">राजनीति</span>
                <span className="text-[9px] text-[#9CA3AF]">• 15 मिनट पहले</span>
              </div>
              <p className="text-[11.5px] font-medium text-[#2B2437] line-clamp-1 leading-[18px] pt-0.5">
                विधानसभा के विशेष सत्र में जनहित के कई प्रस्ताव पारित
              </p>
            </div>
            <div className="w-12 h-9 rounded bg-[#E5E7EB] shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* The 3:1 Feed Banner Card itself (Clickable Destination Link) */}
          <aside
            aria-label={resolvedHeadline}
            onClick={handleCtaClick}
            className="w-full aspect-[3/1] rounded-[14px] overflow-hidden shadow-xs relative border border-[#CBD5E1] select-none cursor-pointer group active:scale-[0.99] transition-transform bg-white"
          >
            <img
              src={bannerImg}
              alt={resolvedHeadline}
              className="w-full h-full object-cover object-center pointer-events-none select-none"
              loading="lazy"
              draggable={false}
            />

            {/* Top-Right 'विज्ञापन' Badge */}
            <div className="absolute top-1.5 right-1.5 z-10 pointer-events-none">
              <span className="px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[8.5px] font-bold border border-white/20 shadow-2xs">
                विज्ञापन
              </span>
            </div>
          </aside>

          {/* Editorial Story Snippet (Below) */}
          <div className="p-2 rounded-[10px] bg-white border border-[#E5E7EB]/80 flex items-start gap-2 shadow-2xs opacity-80 pointer-events-none">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#557E63]" />
                <span className="text-[9.5px] font-bold text-[#557E63]">खेल</span>
                <span className="text-[9px] text-[#9CA3AF]">• 25 मिनट पहले</span>
              </div>
              <p className="text-[11.5px] font-medium text-[#2B2437] line-clamp-1 leading-[18px] pt-0.5">
                राष्ट्रीय खेलों में प्रदेश के खिलाड़ियों ने जीते स्वर्ण पदक
              </p>
            </div>
            <div className="w-12 h-9 rounded bg-[#E5E7EB] shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Micro-hint explaining native card behavior */}
        <div className="flex items-center justify-between px-1 text-[11.5px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E39026]" />
            पूरा कार्ड लिंक है (अलग से बटन नहीं है)
          </span>
          <span className="font-bold text-[#2B2437]">{resolvedCtaLabel} ↗</span>
        </div>
      </div>
    );
  }

  // ========================================================
  // FORMAT 5: SPONSORED ARTICLE AD FORMAT
  // Rendered inside authentic Navbharat Newsfeed context
  // Tapping opens the full interactive Article Reader experience modal.
  // ========================================================
  const articleThumb =
    images[0]?.dataUrl || mvpSponsoredArticle.imageUrl || exampleSponsoredArticle;

  return (
    <>
      <div className={`w-full max-w-[360px] mx-auto flex flex-col gap-2.5 select-none ${className}`}>
        {/* Newsfeed Snippet Container */}
        <div className="rounded-[20px] bg-[#F7F7F4] border border-[#E5E7EB] p-2.5 flex flex-col gap-2.5 shadow-xs">
          {/* Editorial Story Snippet (Above) */}
          <div className="p-2 rounded-[10px] bg-white border border-[#E5E7EB]/80 flex items-start gap-2 shadow-2xs opacity-80 pointer-events-none">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B6783A]" />
                <span className="text-[9.5px] font-bold text-[#B6783A]">राजनीति</span>
                <span className="text-[9px] text-[#9CA3AF]">• 15 मिनट पहले</span>
              </div>
              <p className="text-[11.5px] font-medium text-[#2B2437] line-clamp-1 leading-[18px] pt-0.5">
                विधानसभा के विशेष सत्र में जनहित के कई प्रस्ताव पारित
              </p>
            </div>
            <div className="w-12 h-9 rounded bg-[#E5E7EB] shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Authentic MVP FeedCard with isSponsored={true} */}
          <article
            onClick={() => setShowArticleModal(true)}
            className="w-full min-h-[96px] p-2.5 rounded-[12px] bg-white border-2 border-[#E39026]/40 shadow-xs flex flex-col justify-between select-none cursor-pointer transition-all hover:border-[#E39026] active:scale-[0.99] relative"
          >
            {/* Top Section: Left Text Column + Right Thumbnail */}
            <div className="flex items-start justify-between w-full gap-2">
              {/* Left Column */}
              <div className="flex-1 min-w-0 flex flex-col justify-start">
                {/* Category Badge Row */}
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <SpeakerIcon size={8} color="#FFFFFF" variant="Bold" />
                  </span>

                  <span className="text-[11px] font-bold text-[#2B2437] leading-normal pt-[1px] shrink-0">
                    स्पॉन्सर्ड
                  </span>

                  <span className="text-[10px] font-semibold text-[#6B7280] leading-normal shrink-0 truncate max-w-[100px]">
                    • {resolvedBrandName}
                  </span>
                </div>

                {/* Headline (Protective leading so matras are never cut) */}
                <h3 className="mt-1 text-[13.5px] font-medium text-[#2B2437] leading-[19px] pt-0.5 pb-0.5 line-clamp-2">
                  {resolvedHeadline}
                </h3>
              </div>

              {/* Right Column: 96px wide × 60px tall Thumbnail */}
              <div className="w-[96px] h-[60px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
                <img
                  src={articleThumb}
                  alt={resolvedHeadline}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Hairline Divider */}
            <div
              className="w-full my-1"
              style={{
                height: '0.64px',
                backgroundColor: 'rgba(24, 37, 59, 0.08)',
              }}
            />

            {/* Bottom Meta Row */}
            <div className="flex items-center justify-between w-full text-[10.5px] text-[#6B7280]">
              <div className="flex items-center gap-1.5 font-medium leading-normal">
                <span>{mvpSponsoredArticle.publishedAgo}</span>
                <span>•</span>
                <span>{mvpSponsoredArticle.readTime}</span>
              </div>

              {/* Right Action: Read Article Prompt */}
              <div className="flex items-center gap-1 text-[#E39026] font-bold">
                <span>आर्टिकल पढ़ें ↗</span>
              </div>
            </div>
          </article>

          {/* Editorial Story Snippet (Below) */}
          <div className="p-2 rounded-[10px] bg-white border border-[#E5E7EB]/80 flex items-start gap-2 shadow-2xs opacity-80 pointer-events-none">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#557E63]" />
                <span className="text-[9.5px] font-bold text-[#557E63]">खेल</span>
                <span className="text-[9px] text-[#9CA3AF]">• 25 मिनट पहले</span>
              </div>
              <p className="text-[11.5px] font-medium text-[#2B2437] line-clamp-1 leading-[18px] pt-0.5">
                राष्ट्रीय खेलों में प्रदेश के खिलाड़ियों ने जीते स्वर्ण पदक
              </p>
            </div>
            <div className="w-12 h-9 rounded bg-[#E5E7EB] shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=120&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Micro note */}
        <div className="flex items-center justify-between px-1 text-[11.5px] text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E39026]" />
            टैप करने पर पूरा प्रायोजित आर्टिकल खुलता है
          </span>
          <span
            onClick={() => setShowArticleModal(true)}
            className="font-bold text-[#E39026] hover:underline cursor-pointer"
          >
            आर्टिकल देखें ↗
          </span>
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
                    प्रायोजित स्टोरी • {resolvedBrandName}
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

            {/* Modal Scrollable Article Body (Generous pb-28 so zero text is hidden behind sticky CTA) */}
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
