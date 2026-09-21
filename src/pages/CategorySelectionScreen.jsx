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
      ? [...selectedCategories]
      : ['politics', 'entertainment', 'sports']
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
      <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm sticky top-[54px] z-20 shrink-0">
        <BackButton onClick={() => navigate('/menu')} ariaLabel="वापस जाएं" />
        <h1 className="text-[18px] font-bold text-[#2B2437] tracking-tight mx-auto pr-[46px]">
          श्रेणियां चुनें
        </h1>
      </div>

      {/* Instructional Copy & Selection Counter */}
      <div className="px-6 pt-4 pb-2 text-center shrink-0">
        <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-[280px] mx-auto">
          होम स्क्रीन के लिए पसंदीदा श्रेणियां चुनें ताकि हम आपको बेहतर खबरें दिखा सकें
        </p>
        <span className="text-[14px] font-bold text-[#F5B55C] mt-2 block">
          3 से 7 श्रेणियाँ चुनें
        </span>
      </div>

      {/* 2-Column Category Grid */}
      <div className="px-4 py-2 grid grid-cols-2 gap-3 overflow-y-auto scrollbar-none pb-36 flex-1">
        {CANONICAL_CATEGORY_ORDER.map((catId) => {
          const meta = CATEGORY_METADATA[catId];
          if (!meta) return null;

          const isSelected = draftCategories.includes(catId);
          const IconComp = meta.iconComponent;

          return (
            <div
              key={catId}
              onClick={() => handleToggleCategory(catId)}
              className={`h-[60px] rounded-[18px] px-3 flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-white border border-[#2B2437] shadow-xs'
                  : 'bg-white border border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Left Icon Container */}
              <div
                className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#2B2437] text-white shadow-2xs'
                    : 'bg-[#F3F4F6] text-[#2B2437]'
                }`}
              >
                {IconComp && (
                  <IconComp
                    size={20}
                    color={isSelected ? '#FFFFFF' : '#2B2437'}
                    variant={isSelected ? 'Bold' : 'Linear'}
                  />
                )}
              </div>

              {/* Category Label */}
              <span
                className={`text-[14px] flex-1 ml-2.5 truncate ${
                  isSelected
                    ? 'font-bold text-[#2B2437]'
                    : 'font-medium text-[#4B5563]'
                }`}
              >
                {meta.label}
              </span>

              {/* Trailing Check Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#2B2437] text-white shadow-2xs'
                    : 'border-2 border-[#D1D5DB]'
                }`}
              >
                {isSelected && (
                  <TickCircle size={14} color="#FFFFFF" variant="Bold" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-4 z-20">
        {/* Low-Emphasis Info Strip */}
        <div className="p-2.5 rounded-[16px] bg-white border border-[#E5E7EB] mb-3 flex items-center justify-center gap-2 text-[12px] shadow-2xs">
          <div className="w-6 h-6 rounded-[8px] bg-[#F5B55C]/10 text-[#F5B55C] flex items-center justify-center shrink-0">
            <Bookmark size={14} color="#F5B55C" variant="Bold" />
          </div>
          <span className="font-medium text-[#4B5563]">
            आप जब चाहें अपनी प्राथमिकताएं बदल सकते हैं
          </span>
        </div>

        {/* Save CTA Button: matching notifications permission button dimensions */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white text-[20px] font-medium shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center hover:bg-[#3D334E] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
