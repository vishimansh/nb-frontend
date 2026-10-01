import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import SampleAdSheet from '../components/ad/SampleAdSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { CONFIG } from '../config';
import { STRINGS } from '../strings/hi';
import { track } from '../utils/track';
import { MapPin, IndianRupee, Clock } from 'lucide-react';

export default function S00_Intro({ onOpenFacilitator }) {
  const { state, navigateTo, resetDraft } = useAdvertiserV2();
  const [showSampleSheet, setShowSampleSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const isLoggedIn = state.auth?.otpVerified;
  const hasPhone = !!state.auth?.phone;
  const isShopComplete = !!(state.shop?.name && state.shop?.categoryId && (state.shop?.cityId || state.shop?.city));

  // Determine smart CTA label and target
  let ctaLabel = STRINGS.intro.ctaCreate;
  let ctaTarget = 'login';

  if (!isLoggedIn) {
    if (hasPhone) {
      ctaLabel = STRINGS.intro.ctaOtpLogin;
      ctaTarget = 'login';
    } else {
      ctaLabel = STRINGS.intro.ctaCreate;
      ctaTarget = 'login';
    }
  } else {
    if (!isShopComplete) {
      ctaLabel = STRINGS.intro.ctaCompleteShop;
      ctaTarget = 'shop';
    } else {
      ctaLabel = STRINGS.intro.ctaDashboard;
      ctaTarget = 'dashboard';
    }
  }

  const handleCtaClick = () => {
    track('cta_tap', { screen: 'intro', target: ctaTarget });
    navigateTo(ctaTarget);
  };

  const handleStartNewAd = () => {
    resetDraft();
    navigateTo('goal');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header (No back button on intro) */}
      <V2Header
        showBack={false}
        onHelp={() => {
          track('help_tap', { screen: 'intro' });
          setShowHelpSheet(true);
        }}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Scrollable Intro Body */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col items-center justify-between gap-3 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="text-center pt-1">
          <h1 className="text-[30px] font-extrabold text-[#2B2437] tracking-tight leading-tight">
            {STRINGS.intro.title}
          </h1>
          <p className="text-[15.5px] font-medium text-[#E39026] mt-1.5 leading-[1.35] max-w-[320px] mx-auto">
            {STRINGS.intro.subtitle}
          </p>
        </div>

        {/* Hero Chai-Shop Picture with cropped edges container */}
        <div className="w-full max-w-[350px] rounded-[32px] overflow-hidden bg-[#F7F7F4] shadow-xs shrink-0 border border-[#E5E7EB]/70 relative flex items-center justify-center">
          <img
            src={CONFIG.HERO_SRC}
            alt="दुकानदार"
            className="w-full h-auto object-cover transform scale-[1.04] rounded-[32px]"
          />
        </div>

        {/* Three Value Badges in a Row (Flow A circular amber treatment) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[350px] shrink-0 pt-1">
          {/* Badge 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#E39026] text-white flex items-center justify-center shadow-xs shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-[1.3] mt-2 text-center">
              {STRINGS.intro.badge1}
            </p>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#E39026] text-white flex items-center justify-center shadow-xs shrink-0 font-bold text-[22px] leading-none">
              ₹
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-[1.3] mt-2 text-center">
              {STRINGS.intro.badge2}
            </p>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#E39026] text-white flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-[1.3] mt-2 text-center">
              {STRINGS.intro.badge3}
            </p>
          </div>
        </div>

        {/* Reassurance Caption */}
        <p className="text-[12.5px] text-[#6B7280] text-center font-medium mt-0.5">
          {STRINGS.intro.reassurance}
        </p>
      </div>

      {/* Sticky Bottom Actions */}
      <StickyCTA
        label={ctaLabel}
        onClick={handleCtaClick}
        showArrow
        subAction={
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                track('sample_open');
                setShowSampleSheet(true);
              }}
              className="text-[13px] font-semibold text-[#E39026] hover:underline"
            >
              {STRINGS.intro.viewSample}
            </button>

            {isLoggedIn && isShopComplete && (
              <button
                type="button"
                onClick={handleStartNewAd}
                className="text-[13px] text-[#4A4358] font-medium hover:underline"
              >
                {STRINGS.intro.newAdSecondary}
              </button>
            )}

            {!isLoggedIn && !hasPhone && (
              <button
                type="button"
                onClick={() => {
                  track('login_link_tap');
                  navigateTo('login');
                }}
                className="text-[12.5px] text-[#6B7280] hover:underline"
              >
                {STRINGS.intro.hasAccountLogin}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="text-[12px] text-[#9CA3AF] hover:text-[#2B2437] transition-colors"
            >
              ← मुख्य ऐप पर जाएँ
            </button>
          </div>
        }
      />

      {/* Sample Ad Sheet */}
      <SampleAdSheet
        isOpen={showSampleSheet}
        onClose={() => setShowSampleSheet(false)}
        onStartCreating={() => {
          setShowSampleSheet(false);
          handleCtaClick();
        }}
      />

      {/* Help WhatsApp Sheet */}
      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
