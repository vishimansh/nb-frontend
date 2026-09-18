import React, { useState, useEffect } from 'react';
import { ArchiveAdd, ArchiveTick, Copy, TickCircle, Whatsapp } from 'iconsax-react';

/**
 * ArticleOptionsMenu
 * Floating action popover appearing over/under the 3-dot icon on news article cards and article screens.
 * Options:
 * - When showWhatsApp is false (Feed Cards):
 *   1. खबर सेव करें (Save Article)
 *   2. लिंक कॉपी करें (Copy Link)
 * - When showWhatsApp is true (Article Screen):
 *   1. व्हाट्सएप पर शेयर (WhatsApp Share)
 *   2. लिंक कॉपी करें (Copy Link)
 */
export default function ArticleOptionsMenu({
  isOpen,
  onClose,
  articleId,
  headline,
  showWhatsApp = false,
  className = "",
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync saved status from localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const savedArticles = JSON.parse(localStorage.getItem('nb_saved_articles') || '[]');
      const targetId = String(articleId || headline);
      setIsSaved(savedArticles.includes(targetId));
    } catch {
      // Fallback
    }
  }, [isOpen, articleId, headline]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.stopPropagation();
    try {
      const targetId = String(articleId || headline);
      const savedArticles = JSON.parse(localStorage.getItem('nb_saved_articles') || '[]');
      let updated;
      if (savedArticles.includes(targetId)) {
        updated = savedArticles.filter((id) => id !== targetId);
        setIsSaved(false);
      } else {
        updated = [...savedArticles, targetId];
        setIsSaved(true);
      }
      localStorage.setItem('nb_saved_articles', JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    try {
      const url = window.location.href;
      const text = encodeURIComponent(`${headline || 'नवभारत'} - नवभारत\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } catch {
      // Fallback
    }
    onClose();
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/article/${articleId || 'live-bhopal-encroachment'}`;
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
    }, 800);
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
        className={`absolute top-[calc(100%+8px)] right-0 z-50 bg-white rounded-[10px] shadow-xl border border-[#E5E7EB] py-1 w-[148px] flex flex-col select-none transition-all duration-150 ${className}`}
      >
        {/* Option 1: WhatsApp (if showWhatsApp) or खबर सेव करें */}
        {showWhatsApp ? (
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] font-medium text-[#18253B] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer rounded-t-[9px]"
          >
            <Whatsapp size={16} color="#18253B" variant="Bold" className="shrink-0" />
            <span>व्हाट्सएप</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] font-medium text-[#18253B] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer rounded-t-[9px]"
          >
            {isSaved ? (
              <ArchiveTick size={16} color="#10B981" variant="Bold" className="shrink-0" />
            ) : (
              <ArchiveAdd size={16} color="#18253B" variant="Linear" className="shrink-0" />
            )}
            <span className={isSaved ? "text-[#10B981] font-semibold" : ""}>
              {isSaved ? 'खबर सेव हुई' : 'खबर सेव करें'}
            </span>
          </button>
        )}

        {/* Hairline Divider */}
        <div className="h-[1px] bg-[#F1F5F9] mx-2" />

        {/* Option 2: लिंक कॉपी करें */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] font-medium text-[#18253B] hover:bg-[#F8FAFC] active:bg-[#F1F5F9] transition-colors text-left cursor-pointer rounded-b-[9px]"
        >
          {copied ? (
            <TickCircle size={16} color="#10B981" variant="Bold" className="shrink-0" />
          ) : (
            <Copy size={16} color="#18253B" variant="Linear" className="shrink-0" />
          )}
          <span className={copied ? "text-[#10B981] font-semibold" : ""}>
            {copied ? 'लिंक कॉपी हुआ!' : 'लिंक कॉपी करें'}
          </span>
        </button>

        {/* Upward Pointer Notch pointing up at the 3-dots button */}
        <div className="absolute -top-1 right-2.5 w-2 h-2 bg-white border-l border-t border-[#E5E7EB] rotate-45" />
      </div>
    </>
  );
}
