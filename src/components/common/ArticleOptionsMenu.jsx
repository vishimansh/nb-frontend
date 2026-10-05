import React, { useState } from 'react';
import { Copy, TickCircle, Whatsapp } from 'iconsax-react';
import { Download, Check } from 'lucide-react';
import { useSavedArticles } from '../../context/SavedArticlesContext';

/**
 * ArticleOptionsMenu
 * Floating action popover appearing over/under the 3-dot icon on news article cards and article screens.
 * Seamlessly connects to SavedArticlesContext so downloaded articles appear on /saved and work offline.
 */
export default function ArticleOptionsMenu({
  isOpen,
  onClose,
  articleId,
  headline,
  articleData,
  fullArticleData,
  showWhatsApp = false,
  className = "",
}) {
  const { isArticleDownloaded, toggleDownloadArticle } = useSavedArticles();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetId = articleId || headline || articleData?.id;
  const isDownloaded = isArticleDownloaded(targetId);

  const handleDownload = (e) => {
    e.stopPropagation();
    const payload = articleData || {
      id: targetId,
      headline: headline || 'शीर्षक',
      category: 'टॉप न्यूज़',
      publishedAgo: 'अभी-अभी',
      readTime: '3 मिनट पढ़ें',
    };
    toggleDownloadArticle(payload, fullArticleData || articleData);

    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    try {
      const url = window.location.href;
      const text = encodeURIComponent(`${headline || articleData?.headline || 'नवभारत'} - नवभारत\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } catch {
      // Fallback
    }
    onClose();
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/article/${articleId || articleData?.id || 'live-bhopal-encroachment'}`;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 700);
  };

  return (
    <>
      {/* Invisible backdrop to dismiss menu on clicking outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Floating Popover Container (Positioned below the 3-dots icon) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-[calc(100%+8px)] right-0 z-50 bg-white rounded-[12px] shadow-xl border border-[#E5E7EB] py-1.5 w-[164px] flex flex-col select-none transition-all duration-150 ${className}`}
      >
        {/* Option 1: ऑफलाइन डाउनलोड / डाउनलोड से हटाएं */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-[#2B2437] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer rounded-t-[10px]"
        >
          {isDownloaded ? (
            <div className="relative flex items-center justify-center shrink-0">
              <Download size={16} className="text-[#E39026]" strokeWidth={2.2} />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#10B981] rounded-full flex items-center justify-center">
                <Check size={6} className="text-white stroke-[4]" />
              </span>
            </div>
          ) : (
            <Download size={16} className="text-[#2B2437] shrink-0" strokeWidth={2.2} />
          )}
          <span className={isDownloaded ? "text-[#E39026] font-bold" : ""}>
            {isDownloaded ? 'डाउनलोड से हटाएं' : 'ऑफलाइन डाउनलोड'}
          </span>
        </button>

        {/* Option 2: WhatsApp (if showWhatsApp) */}
        {showWhatsApp && (
          <>
            <div className="h-[1px] bg-[#F1F5F9] mx-2" />
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-[#2B2437] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer"
            >
              <Whatsapp size={16} color="#2B2437" variant="Bold" className="shrink-0" />
              <span>व्हाट्सएप</span>
            </button>
          </>
        )}

        {/* Hairline Divider */}
        <div className="h-[1px] bg-[#F1F5F9] mx-2" />

        {/* Option 3: लिंक कॉपी करें */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium text-[#2B2437] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer rounded-b-[10px]"
        >
          {copied ? (
            <TickCircle size={16} color="#2B2437" variant="Bold" className="shrink-0" />
          ) : (
            <Copy size={16} color="#2B2437" variant="Linear" className="shrink-0" />
          )}
          <span className={copied ? "text-[#2B2437] font-bold" : ""}>
            {copied ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}
          </span>
        </button>

        {/* Upward Pointer Notch pointing up at the 3-dots button */}
        <div className="absolute -top-1 right-2.5 w-2 h-2 bg-white border-l border-t border-[#E5E7EB] rotate-45" />
      </div>
    </>
  );
}
