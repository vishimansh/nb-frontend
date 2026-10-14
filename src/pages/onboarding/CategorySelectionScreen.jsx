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
      navigate('/menu', {
        state: {
          from: location.state?.originPath || '/feed',
          returnedFromChild: true,
        },
      });
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
      navigate('/menu', {
        replace: true,
        state: {
          from: location.state?.originPath || '/feed',
          returnedFromChild: true,
        },
      });
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
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative overflow-hidden select-none">
      {/* 54px Status Bar Clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

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

      {/* Top Header Bar: Clean & Aligned */}
      <header className="px-5 py-2.5 border-b border-[#E5E7EB]/80 flex items-center justify-between bg-[#F7F7F4] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            श्रेणियां चुनें
          </h1>
        </div>

        {isOnboarding ? (
          <button
            type="button"
            onClick={handleSkip}
            className="text-[14px] font-bold text-[#6B7280] hover:text-[#2B2437] px-2.5 py-1.5 rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          >
            स्किप
          </button>
        ) : (
          <div className="w-[46px]" />
        )}
      </header>

      {/* Context Subtitle & Refined Counter Badge Row */}
      <div className="px-5 pt-2.5 pb-1.5 shrink-0 flex items-center justify-between gap-3">
        <p className="text-[12.5px] font-medium text-[#6B7280] leading-snug flex-1">
          हर विषय की खबर, आपकी रुचि के अनुसार।
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3DC] border border-[#F5B55C]/40 shadow-xs shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${isMinMet ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
          <span className="text-[12px] font-bold text-[#2B2437]">
            {count}/7 चुनी गईं
          </span>
          <span className="text-[10px] font-semibold text-[#8C6D38]">
            {isMinMet ? '✓' : '(न्यूनतम 3)'}
          </span>
        </div>
      </div>

      {/* Category Grid: 2-Column Layout with 20% reduced sleek card height (70px) */}
      <div className="px-4 py-2 flex-1 min-h-0 overflow-y-auto scrollbar-none pb-2">
        <div className="grid grid-cols-2 gap-2.5">
          {SCREENSHOT_CATEGORY_ORDER.map((catId) => {
            const meta = CATEGORY_METADATA[catId];
            if (!meta) return null;

            const isSelected = draftCategories.includes(catId);
            const IconComp = meta.iconComponent;

            return (
              <motion.div
                key={catId}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleCategory(catId)}
                className={`h-[70px] rounded-[20px] px-3.5 flex items-center justify-between transition-all duration-200 cursor-pointer select-none group relative bg-white ${
                  isSelected
                    ? 'border-[0.5px] border-[#2B2437] shadow-[0_2px_8px_rgba(43,36,55,0.06)]'
                    : 'border-[0.25px] border-[#D1D5DB] hover:border-[#9CA3AF] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                }`}
              >
                {/* Left Section: Rounded Squircle Icon Box + Category Label */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-1.5">
                  {/* Squircle Icon Box: Solid dark on selected, soft neutral slate on unselected */}
                  <div
                    className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#2B2437] text-white shadow-xs'
                        : 'bg-[#ECEEF2] text-[#2B2437]'
                    }`}
                  >
                    {IconComp && (
                      <IconComp
                        size={21}
                        color={isSelected ? '#FFFFFF' : '#2B2437'}
                        variant={isSelected ? 'Bold' : 'Linear'}
                      />
                    )}
                  </div>

                  {/* Category Label (Vertically aligned with icon box) */}
                  <span
                    className={`text-[15px] truncate tracking-tight leading-tight ${
                      isSelected
                        ? 'font-bold text-[#2B2437]'
                        : 'font-semibold text-[#1F2937]'
                    }`}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Right Selection Indicator */}
                {isSelected ? (
                  <div className="w-[20px] h-[20px] rounded-full bg-[#2B2437] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <TickCircle size={13} color="#FFFFFF" variant="Bold" />
                  </div>
                ) : (
                  <div className="w-[20px] h-[20px] rounded-full border-[1.25px] border-[#9CA3AF] shrink-0 bg-transparent group-hover:border-[#6B7280] transition-colors" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] pt-3 pb-8 px-5 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] flex flex-col gap-2">
        <button
          type="button"
          onClick={handleSave}
          className={`w-full h-[54px] rounded-[16px] text-white text-[18px] font-bold shadow-md active:scale-[0.99] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isMinMet
              ? 'bg-[#2B2437] hover:bg-[#3D334E]'
              : 'bg-[#2B2437]/75 hover:bg-[#2B2437]/85 opacity-90'
          }`}
        >
          {isOnboarding ? 'होम स्क्रीन पर जाएं' : 'सेव करें'}
        </button>

        {/* Discreet reassurance subtext */}
        <p className="text-[11.5px] text-center font-medium text-[#6B7280]">
          मेन्यू से आप बाद में भी श्रेणियां बदल सकते हैं
        </p>
      </div>
    </div>
  );
}
