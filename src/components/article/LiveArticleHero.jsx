import React, { useState } from 'react';
import { More } from 'iconsax-react';
import { Download, Check } from 'lucide-react';
import BackButton from '../common/BackButton';
import supremeCourtImg from '../../assets/cards/supreme-court.jpg';
import ArticleOptionsMenu from '../common/ArticleOptionsMenu';

export default function LiveArticleHero({
  hero,
  isLive = true,
  onBack,
  onShare: _onShare,
  onToggleDownload,
  onToggleBookmark,
  isDownloaded: propDownloaded,
  isBookmarked: propBookmarked,
  articleId,
  articleData,
}) {
  const [localDownloaded, setLocalDownloaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Unify isDownloaded from props (supporting both isDownloaded and isBookmarked for compatibility)
  const isDownloaded =
    propDownloaded !== undefined
      ? propDownloaded
      : propBookmarked !== undefined
      ? propBookmarked
      : localDownloaded;

  const handleDownload = () => {
    if (onToggleDownload) {
      onToggleDownload();
    } else if (onToggleBookmark) {
      onToggleBookmark();
    } else {
      setLocalDownloaded(!localDownloaded);
    }
  };

  const caption =
    hero?.caption ||
    "सुप्रीम कोर्ट परिसर, नई दिल्ली में एक महत्वपूर्ण मामले की सुनवाई के दौरान संविधान पीठ।";

  return (
    <div className="w-full h-[320px] aspect-[402/320] relative overflow-hidden bg-[#2B2437] select-none shrink-0">
      {/* 1. Full Hero Background Image (402px × 320px) */}
      <img
        src={hero?.imageUrl || supremeCourtImg}
        alt={caption}
        className="w-full h-full object-cover"
        loading="eager"
      />

      {/* 2. Top Scrim & Bottom Gradient Scrim for 320px Height */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-10" />

      {/* 3. Top-Left Controls: Back Button & Live Capsule */}
      <div className="absolute top-[16px] left-[16px] z-20 flex items-center gap-2">
        {onBack && (
          <BackButton onClick={onBack} ariaLabel="वापस जाएं" />
        )}
        {isLive && (
          <div className="bg-[#B91C1C] text-white text-[14px] font-medium p-2 rounded-full flex items-center gap-1.5 shadow-md leading-none">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0 ml-0.5" />
            <span className="mr-1">लाइव अपडेट</span>
          </div>
        )}
      </div>

      {/* 4. Top-Right Controls: Download (Offline) & 3-Dots */}
      <div className="absolute top-[16px] right-[16px] z-20 flex items-center gap-2">
        {/* Offline Download Button (40px × 40px) */}
        <button
          type="button"
          onClick={handleDownload}
          aria-label={isDownloaded ? "डाउनलोड किया गया (ऑफलाइन उपलब्ध)" : "ऑफलाइन डाउनलोड करें"}
          title={isDownloaded ? "डाउनलोड किया गया (ऑफलाइन उपलब्ध)" : "ऑफलाइन डाउनलोड करें"}
          className={`w-[40px] h-[40px] rounded-[14px] backdrop-blur-md border flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-xs ${
            isDownloaded
              ? 'bg-black/60 border-[#F5B55C]/50 text-[#F5B55C]'
              : 'bg-black/40 border-white/20 text-white hover:bg-black/50'
          }`}
        >
          {isDownloaded ? (
            <div className="relative flex items-center justify-center">
              <Download size={19} className="text-[#F5B55C]" strokeWidth={2.2} />
              <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-[#10B981] rounded-full border border-black/80 flex items-center justify-center shadow-xs">
                <Check size={9} className="text-white stroke-[3.5]" />
              </span>
            </div>
          ) : (
            <Download size={20} className="text-white" strokeWidth={2.2} />
          )}
        </button>

        {/* 3-Dots Menu Button (40px × 40px) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="विकल्प"
            className="w-[40px] h-[40px] rounded-[14px] bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-xs"
          >
            <More size={20} color="#FFFFFF" variant="Linear" className="rotate-90" />
          </button>

          <ArticleOptionsMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            articleId={articleId}
            headline={caption}
            articleData={articleData || {
              id: articleId || caption,
              headline: caption,
              thumbnail: hero?.imageUrl || supremeCourtImg,
              category: 'देश',
              publishedAgo: 'अभी-अभी',
              readTime: '3 मिनट पढ़ें',
            }}
            showWhatsApp={true}
          />
        </div>
      </div>

      {/* 5. Bottom Caption inside Hero (bottom: 16px, left: 16px, right: 16px, typography: 14px regular) */}
      <div className="absolute bottom-[16px] left-[16px] right-[16px] z-20 pointer-events-none">
        <p className="text-[14px] text-white/95 leading-[1.4] font-normal drop-shadow-sm line-clamp-2">
          {caption}
        </p>
      </div>
    </div>
  );
}
