import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/common/BackButton';
import {
  ArrowRight2,
  Monitor,
  Sun1,
  VolumeHigh,
  ShieldSecurity,
  InfoCircle,
  Lock,
  DocumentText,
  Star1,
  Star,
  Trash,
  TickCircle,
} from 'iconsax-react';

export default function SettingsPrivacyScreen() {
  const navigate = useNavigate();

  // Component local states
  const [personalizedAdsEnabled, setPersonalizedAdsEnabled] = useState(true);
  const [selectedAppMode] = useState('system'); // non-functional visual state
  const [fontSize] = useState('सामान्य'); // non-functional visual state

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Delete account confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Auto-dismiss toast after 2s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleBack = () => {
    navigate('/menu');
  };

  const handleRateApp = () => {
    setToastMessage('रेटिंग के लिए धन्यवाद!');
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    navigate('/onboarding/login');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden font-sans">
      {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

      {/* Floating Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-[#18253B] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10"
          >
            <TickCircle size={17} color="#E39026" variant="Bold" />
            <span className="leading-normal">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Fixed Header Bar */}
      <header className="px-4 py-3 bg-[#F7F7F4] flex items-center justify-between border-b border-[#E5E7EB]/80 shrink-0 sticky top-[54px] z-20">
        <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />

        {/* Page Title (Corrected from Figma bug) */}
        <h1 className="text-[18px] font-bold text-[#18253B] tracking-tight text-center flex-1 pr-[46px] leading-normal">
          सेटिंग्स और प्राइवेसी
        </h1>
      </header>

      {/* Scrollable Middle Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-6">
        {/* Step 2: Section 1 — "डिसप्ले सेटिंग्स" (Display Settings) */}
        <div className="mx-4 mt-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#FFF9EE] border border-[#F7C873] flex items-center justify-center text-[#E39026] shrink-0">
              <Monitor size={16} color="#E39026" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B] leading-snug">डिसप्ले सेटिंग्स</h2>
          </div>

          {/* Inner Stack */}
          <div className="space-y-2.5">
            {/* 1. Font Size Tile (MVP Visual Placeholder — Non-Functional) */}
            <div
              className="h-[64px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-default"
              title="फ़ॉन्ट साइज़ (जल्द आ रहा है)"
            >
              <div className="flex items-center">
                {/* Dark Navy Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center font-bold text-[15px] mr-3 flex-shrink-0 shadow-2xs">
                  Aa
                </div>
                {/* Text Block */}
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#18253B] leading-snug">फ़ॉन्ट साइज़</span>
                  <span className="text-[11px] text-[#6B7280] leading-tight">खबरों का टेक्स्ट आकार बदलें</span>
                </div>
              </div>

              {/* Right Stack */}
              <div className="flex items-center">
                <span className="text-[13px] font-medium text-[#6B7280] mr-1 leading-none">{fontSize}</span>
                <ArrowRight2 size={14} color="#9CA3AF" />
              </div>
            </div>

            {/* 2. App Mode Tile (MVP Visual Placeholder — Non-Functional) */}
            <div
              className="h-[64px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-default"
              title="ऐप मोड (सिस्टम डिफॉल्ट)"
            >
              <div className="flex items-center">
                {/* Dark Navy Icon Box */}
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <Sun1 size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-bold text-[#18253B] leading-snug">ऐप मोड</span>
              </div>

              {/* Right Segmented Switcher */}
              <div className="bg-white border border-[#E5E7EB] rounded-full p-1 flex items-center gap-1 shadow-2xs">
                {/* Segment "सिस्टम" (Active) */}
                <div
                  className={`text-[11px] font-bold px-3 py-1 rounded-full relative flex items-center gap-1.5 transition-colors ${
                    selectedAppMode === 'system'
                      ? 'bg-[#18253B] text-white shadow-xs'
                      : 'text-[#6B7280]'
                  }`}
                >
                  {selectedAppMode === 'system' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E39026] shrink-0" />
                  )}
                  <span className="leading-tight">सिस्टम</span>
                </div>

                {/* Segment "लाइट" (Inactive) */}
                <div
                  className={`text-[11px] font-medium px-2 py-1 leading-tight ${
                    selectedAppMode === 'light'
                      ? 'bg-[#18253B] text-white rounded-full'
                      : 'text-[#6B7280]'
                  }`}
                >
                  लाइट
                </div>

                {/* Divider */}
                <div className="w-[1px] h-3 bg-[#E5E7EB]" />

                {/* Segment "डार्क" (Inactive) */}
                <div
                  className={`text-[11px] font-medium px-2 py-1 leading-tight ${
                    selectedAppMode === 'dark'
                      ? 'bg-[#18253B] text-white rounded-full'
                      : 'text-[#6B7280]'
                  }`}
                >
                  डार्क
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Section 2 — "गोपनीयता और नियम" (Privacy & Rules) */}
        <div className="mx-4 mt-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#FFF9EE] border border-[#F7C873] flex items-center justify-center text-[#E39026] shrink-0">
              <ShieldSecurity size={16} color="#E39026" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B] leading-snug">गोपनीयता और नियम</h2>
          </div>

          {/* Inner Stack */}
          <div className="space-y-2.5">
            {/* 1. Personalized Ads Tile (Interactive Toggle) */}
            <div className="h-[64px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between">
              <div className="flex items-center flex-1 mr-3">
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <VolumeHigh size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#18253B] leading-snug">व्यक्तिगत विज्ञापन</span>
                  <span className="text-[11px] text-[#6B7280] leading-tight">आपकी रुचि के अनुसार प्रासंगिक विज्ञापन दिखाएं</span>
                </div>
              </div>

              {/* Right Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={personalizedAdsEnabled}
                onClick={() => setPersonalizedAdsEnabled((prev) => !prev)}
                className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out cursor-pointer p-0.5 flex items-center shrink-0 ${
                  personalizedAdsEnabled ? 'bg-[#E39026] justify-end' : 'bg-[#D1D5DB] justify-start'
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-white shadow-md"
                />
              </button>
            </div>

            {/* 2. "हमारे बारे में" (About Us) */}
            <div
              onClick={() => navigate('/about')}
              className="h-[56px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <InfoCircle size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B] leading-none">हमारे बारे में</span>
              </div>
              <ArrowRight2 size={14} color="#9CA3AF" />
            </div>

            {/* 3. "प्राइवेसी पॉलिसी" (Privacy Policy) */}
            <div
              onClick={() => navigate('/privacy')}
              className="h-[56px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <Lock size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B] leading-none">प्राइवेसी पॉलिसी</span>
              </div>
              <ArrowRight2 size={14} color="#9CA3AF" />
            </div>

            {/* 4. "नियम एवं शर्तें" (Terms & Conditions) */}
            <div
              onClick={() => navigate('/terms')}
              className="h-[56px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <DocumentText size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B] leading-none">नियम एवं शर्तें</span>
              </div>
              <ArrowRight2 size={14} color="#9CA3AF" />
            </div>

            {/* 5. "ऐप को रेट करें" (Rate App) */}
            <div
              onClick={handleRateApp}
              className="h-[56px] bg-[#F9FAFB] rounded-[16px] border border-[#F1F3F5] px-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-[#18253B] text-white flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <Star1 size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B] leading-none">ऐप को रेट करें</span>
              </div>
              <ArrowRight2 size={14} color="#9CA3AF" />
            </div>

            {/* 6. "खाता हटाएं" (Delete Account — Destructive Action) */}
            <div
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-[56px] bg-[#FFF5F5] rounded-[16px] border border-[#FECACA] px-3.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all hover:bg-[#FEE2E2]/60"
            >
              <div className="flex items-center">
                {/* Danger Icon Box: star outline matching mockup */}
                <div className="w-10 h-10 rounded-xl bg-white border border-[#FECACA] text-[#DC2626] flex items-center justify-center mr-3 flex-shrink-0 shadow-2xs">
                  <Star size={18} color="#DC2626" />
                </div>
                <span className="text-[14px] font-bold text-[#DC2626] leading-none">खाता हटाएं</span>
              </div>
              <ArrowRight2 size={14} color="#DC2626" />
            </div>
          </div>
        </div>

        {/* Step 4: Footer App Metadata */}
        <div className="mt-6 mb-12 text-center select-none space-y-1">
          <p className="text-[12px] font-semibold text-[#9CA3AF] leading-normal">
            नवभारत ऐप • v1.0.0
          </p>
          <p className="text-[11px] font-normal text-[#9CA3AF] leading-normal">
            © 2026 Navbharat Media. सर्वाधिकार सुरक्षित
          </p>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center text-center border border-gray-100"
            >
              {/* Danger Warning Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] border border-[#FECACA] flex items-center justify-center text-[#DC2626] mb-3.5 shadow-inner">
                <Trash size={28} color="#DC2626" variant="Bold" />
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#18253B] leading-snug mb-2">
                क्या आप वाकई खाता हटाना चाहते हैं?
              </h3>

              {/* Description */}
              <p className="text-[13px] text-[#6B7280] leading-relaxed mb-6">
                आपका सारा डेटा और प्राथमिकताएं हटा दी जाएंगी।
              </p>

              {/* Actions Stack */}
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 h-[46px] rounded-[14px] bg-[#F3F4F6] text-[#4B5563] text-[14px] font-bold cursor-pointer hover:bg-gray-200 active:scale-95 transition-all"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 h-[46px] rounded-[14px] bg-[#DC2626] text-white text-[14px] font-bold cursor-pointer hover:bg-[#B91C1C] active:scale-95 transition-all shadow-md shadow-red-500/20"
                >
                  हटाएं
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
