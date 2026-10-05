import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, TickCircle, InfoCircle } from 'iconsax-react';
import BackButton from '../../components/common/BackButton';
import { useOnboarding } from '../../context/OnboardingContext';
import {
  CANONICAL_CATEGORY_ORDER,
  CATEGORY_METADATA,
} from '../../theme/categoryMeta';

/**
 * Screen 6: Category Selection Screen
 * Minimal, refined design inspired by Menu & Home screens.
 * Uses Menu color palette: #2B2437, #F5B55C, #FDF5E8, #F9FAFB, #F0F1F3, #EBECEF.
 */
export default function CategorySelectionScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategories, setSelectedCategories } = useOnboarding();

  const isOnboarding = location.pathname.startsWith('/onboarding');

  // Default fallback categories if none selected yet
  const DEFAULT_CATS = ['politics', 'entertainment', 'sports', 'business', 'tech', 'education', 'astro'];

  // Local staging draft categories
  const [draftCategories, setDraftCategories] = useState(
    selectedCategories && selectedCategories.length > 0
      ? (selectedCategories.length > 7 ? selectedCategories.slice(0, 7) : [...selectedCategories])
      : DEFAULT_CATS
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
        showToast('कम से कम 3 श्रेणियां चुनना ज़रूरी है');
        return;
      }
      setDraftCategories(draftCategories.filter((id) => id !== categoryId));
    } else {
      if (draftCategories.length >= 7) {
        showToast('अधिकतम 7 श्रेणियां चुन सकते हैं — किसी एक को हटाकर नई जोड़ें');
        return;
      }
      setDraftCategories([...draftCategories, categoryId]);
    }
  };

  const handleBack = () => {
    if (isOnboarding) {
      navigate('/onboarding/select-city');
    } else {
      navigate('/menu');
    }
  };

  const handleSave = () => {
    if (draftCategories.length < 3) {
      showToast('कम से कम 3 श्रेणियां चुनना ज़रूरी है');
      return;
    }
    if (draftCategories.length > 7) {
      showToast('अधिकतम 7 श्रेणियां चुन सकते हैं — किसी एक को हटाकर नई जोड़ें');
      return;
    }

    // Sort draftCategories strictly against CANONICAL_CATEGORY_ORDER
    const sortedDraft = draftCategories.slice().sort((a, b) => {
      return (
        CANONICAL_CATEGORY_ORDER.indexOf(a) -
        CANONICAL_CATEGORY_ORDER.indexOf(b)
      );
    });

    setSelectedCategories(sortedDraft);

    if (isOnboarding) {
      navigate('/feed', { replace: true });
    } else {
      navigate('/menu', { replace: true });
    }
  };

  const handleSkip = () => {
    const categoriesToSave =
      draftCategories && draftCategories.length >= 3
        ? draftCategories
        : (selectedCategories && selectedCategories.length >= 3
            ? selectedCategories
            : DEFAULT_CATS);

    const sorted = categoriesToSave.slice().sort((a, b) => {
      return (
        CANONICAL_CATEGORY_ORDER.indexOf(a) -
        CANONICAL_CATEGORY_ORDER.indexOf(b)
      );
    });

    setSelectedCategories(sorted);
    navigate('/feed', { replace: true });
  };

  // Exact 2-column layout order
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

  const count = draftCategories.length;
  const isMinMet = count >= 3;

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col pt-[54px] relative overflow-hidden select-none">
      {/* Floating Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2B2437] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <InfoCircle size={16} color="#F5B55C" variant="Bold" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-[#EBECEF] flex items-center justify-between bg-[#F7F7F4]/92 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            श्रेणियां चुनें
          </h1>
        </div>

        {isOnboarding ? (
          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 py-1 rounded-full bg-white border border-[#E2E6EE] text-[13px] font-semibold text-[#6B7280] hover:text-[#2B2437] hover:border-neutral-300 active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            स्किप
          </button>
        ) : (
          <div className="w-[44px]" />
        )}
      </div>

      {/* Minimal Context Header & Counter Badge */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0 flex flex-col items-center text-center gap-1.5">
        <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-[320px]">
          होम स्क्रीन के लिए पसंदीदा श्रेणियां चुनें ताकि आपकी पसंद की खबरें पहले दिखें।
        </p>

        {/* Minimal Selection Counter Pill (Menu-inspired #FDF5E8 & #F5B55C) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF5E8] border border-[#F5B55C]/50 shadow-2xs mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B55C]" />
          <span className="text-[12.5px] font-bold text-[#2B2437]">
            {count}/7 श्रेणियां चुनी गईं
          </span>
          <span className="text-[11px] font-medium text-[#6B7280]">
            (3 से 7 चुनें)
          </span>
        </div>
      </div>

      {/* Category Grid (Directly inspired by MenuScreen Category Cards) */}
      <div className="px-4 py-2 grid grid-cols-2 gap-2.5 overflow-y-auto scrollbar-none pb-36 flex-1 content-start">
        {SCREENSHOT_CATEGORY_ORDER.map((catId) => {
          const meta = CATEGORY_METADATA[catId];
          if (!meta) return null;

          const isSelected = draftCategories.includes(catId);
          const IconComp = meta.iconComponent;

          return (
            <div
              key={catId}
              onClick={() => handleToggleCategory(catId)}
              className={`h-[58px] rounded-[16px] px-3 flex items-center justify-between transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                isSelected
                  ? 'bg-white border border-[#2B2437] shadow-xs'
                  : 'bg-[#F9FAFB] border border-[#F0F1F3] hover:border-[#E2E6EE] shadow-2xs'
              }`}
            >
              {/* Left Group: Icon + Label */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                {/* 36px Icon Container: 86% opacity of primary brand color #2B2437 */}
                <div
                  className={`w-9 h-9 rounded-[10px] bg-[#2B2437]/[0.86] flex items-center justify-center shrink-0 transition-all shadow-2xs ${
                    isSelected
                      ? 'text-white'
                      : 'text-white/85'
                  }`}
                  style={{ backgroundColor: 'rgba(43, 36, 55, 0.86)' }}
                >
                  {IconComp && (
                    <IconComp
                      size={18}
                      color="#FFFFFF"
                      variant={isSelected ? 'Bold' : 'Linear'}
                    />
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`text-[13.5px] truncate leading-tight ${
                    isSelected
                      ? 'font-bold text-[#2B2437]'
                      : 'font-medium text-[#4B5563]'
                  }`}
                >
                  {meta.label}
                </span>
              </div>

              {/* Trailing Check Indicator */}
              {isSelected ? (
                <div className="w-[18px] h-[18px] rounded-full bg-[#2B2437] flex items-center justify-center shrink-0 shadow-2xs">
                  <TickCircle size={12} color="#FFFFFF" variant="Bold" />
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border border-[#D1D5DB] shrink-0 bg-white" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/98 to-transparent pt-3 pb-8 px-4 z-20 flex flex-col gap-2">
        {/* Low-Emphasis Reassurance Strip (Menu #FDF5E8 Style) */}
        <div className="py-1.5 px-3 rounded-[12px] bg-[#FDF5E8] border border-[#F5B55C]/40 flex items-center justify-center gap-2 text-[11.5px] font-medium text-[#2B2437] shadow-2xs">
          <Bookmark size={13} color="#F5B55C" variant="Bold" className="shrink-0" />
          <span>फ़िक्र न करें, मेन्यू से आप जब चाहें अपनी प्राथमिकताएं बदल सकते हैं</span>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isMinMet}
          className={`w-full h-[52px] rounded-[16px] text-white text-[16px] font-bold shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isMinMet
              ? 'bg-[#2B2437] hover:bg-[#3D334E]'
              : 'bg-[#2B2437]/50 cursor-not-allowed opacity-60'
          }`}
        >
          {isOnboarding ? 'होम स्क्रीन पर जाएं' : 'सेव करें'}
        </button>
      </div>
    </div>
  );
}
