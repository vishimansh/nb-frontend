import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, TickCircle } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useOnboarding } from '../context/OnboardingContext';
import {
  CANONICAL_CATEGORY_ORDER,
  CATEGORY_METADATA,
} from '../theme/categoryMeta';

export default function CategorySelectionScreen() {
  const navigate = useNavigate();
  const { selectedCategories, setSelectedCategories } = useOnboarding();

  // Local staging draft categories
  const [draftCategories, setDraftCategories] = useState(
    selectedCategories && selectedCategories.length > 0
      ? (selectedCategories.length > 7 ? selectedCategories.slice(0, 7) : [...selectedCategories])
      : ['politics', 'entertainment', 'sports', 'business', 'tech', 'education', 'astro']
  );

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2500);
  };

  const handleToggleCategory = (categoryId) => {
    const isSelected = draftCategories.includes(categoryId);

    if (isSelected) {
      if (draftCategories.length <= 3) {
        showToast('कम से कम 3 श्रेणियाँ चुनें');
        return;
      }
      setDraftCategories(draftCategories.filter((id) => id !== categoryId));
    } else {
      if (draftCategories.length >= 7) {
        showToast('आप 7 से ज़्यादा श्रेणियाँ नहीं चुन सकते');
        return;
      }
      setDraftCategories([...draftCategories, categoryId]);
    }
  };

  const handleSave = () => {
    // Sort draftCategories strictly against CANONICAL_CATEGORY_ORDER
    const sortedDraft = draftCategories.slice().sort((a, b) => {
      return (
        CANONICAL_CATEGORY_ORDER.indexOf(a) -
        CANONICAL_CATEGORY_ORDER.indexOf(b)
      );
    });

    setSelectedCategories(sortedDraft);
    navigate('/menu', { replace: true });
  };

  // Exact 2-column layout order matching screenshot
  const SCREENSHOT_CATEGORY_ORDER = [
    'politics',
    'entertainment',
    'sports',
    'tech',
    'business',
    'astro',
    'health',
    'education',
    'auto',
    'lifestyle',
  ];

  // Configurable X and Y spacing between category tabs (in pixels)
  const GAP_X = 12; // Horizontal gap between category columns
  const GAP_Y = 12; // Vertical gap between category rows

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Light Status Bar Clearance */}
      <div className="h-[54px] w-full shrink-0" />

      {/* Floating Toast: Centered vertically and horizontally */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2B2437] text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <span>ℹ️</span>
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#F7F7F4] sticky top-[54px] z-20 shrink-0">
        <BackButton onClick={() => navigate('/menu')} ariaLabel="वापस जाएं" />
        <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight mx-auto pr-[46px]">
          श्रेणियां चुनें
        </h1>
      </div>

      {/* Instructional Copy & Dynamic Selection Counter (MVP Accent #F5B55C) */}
      <div className="px-6 pt-1 pb-3 text-center shrink-0">
        <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-[290px] mx-auto">
          होम स्क्रीन के लिए पसंदीदा श्रेणियां चुनें ताकि हम आपको बेहतर खबरें दिखा सकें
        </p>
        <span className="text-[14px] font-bold text-[#F5B55C] mt-2 block">
          {draftCategories.length}/7 कैटेगरी चुनी गई हैं
        </span>
      </div>

      {/* Flexbox Category Container with Screenshot Sizing and Positioning */}
      <div
        className="px-4 py-1 flex flex-wrap overflow-y-auto scrollbar-none pb-40 flex-1 content-start"
        style={{
          columnGap: `${GAP_X}px`,
          rowGap: `${GAP_Y}px`,
        }}
      >
        {SCREENSHOT_CATEGORY_ORDER.map((catId) => {
          const meta = CATEGORY_METADATA[catId];
          if (!meta) return null;

          const isSelected = draftCategories.includes(catId);
          const IconComp = meta.iconComponent;

          return (
            <div
              key={catId}
              onClick={() => handleToggleCategory(catId)}
              style={{
                width: `calc(50% - ${GAP_X / 2}px)`,
              }}
              className={`h-[68px] rounded-[20px] px-3.5 flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-95 shrink-0 ${
                isSelected
                  ? 'bg-white border border-[#2B2437] shadow-xs'
                  : 'bg-white border border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Left Icon Container (MVP #2B2437 / #F3F4F6) */}
              <div
                className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#2B2437] text-white shadow-2xs'
                    : 'bg-[#F3F4F6] text-[#2B2437]'
                }`}
              >
                {IconComp && (
                  <IconComp
                    size={22}
                    color={isSelected ? '#FFFFFF' : '#2B2437'}
                    variant={isSelected ? 'Bold' : 'Linear'}
                  />
                )}
              </div>

              {/* Category Label */}
              <span
                className={`text-[14.5px] flex-1 ml-2.5 truncate ${
                  isSelected
                    ? 'font-bold text-[#2B2437]'
                    : 'font-medium text-[#4B5563]'
                }`}
              >
                {meta.label}
              </span>

              {/* Trailing Check Indicator (MVP TickCircle & #2B2437) */}
              {isSelected ? (
                <div className="w-[20px] h-[20px] rounded-full bg-[#2B2437] flex items-center justify-center shrink-0 shadow-2xs">
                  <TickCircle size={14} color="#FFFFFF" variant="Bold" />
                </div>
              ) : (
                <div className="w-[20px] h-[20px] rounded-full border-2 border-[#D1D5DB] shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-4 z-20">
        {/* Low-Emphasis Info Strip */}
        <div className="p-3 rounded-[18px] bg-white border border-[#E5E7EB] mb-3 flex items-center justify-center gap-2.5 text-[12.5px] shadow-2xs">
          <div className="w-6 h-6 rounded-[8px] bg-[#F5B55C]/10 text-[#F5B55C] flex items-center justify-center shrink-0">
            <Bookmark size={14} color="#F5B55C" variant="Bold" />
          </div>
          <span className="font-medium text-[#4B5563]">
            आप जब चाहें अपनी प्राथमिकताएं बदल सकते हैं
          </span>
        </div>

        {/* Save CTA Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[54px] rounded-[18px] bg-[#2B2437] text-white text-[18px] font-bold shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center hover:bg-[#3D334E] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
