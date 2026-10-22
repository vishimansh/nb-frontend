import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { CONFIG } from '../config';
import { STRINGS } from '../strings/hi';
import { track } from '../utils/track';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function S00_Intro({ onOpenFacilitator }) {
  const { state, navigateTo, resetDraft } = useAdvertiserV2();
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
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-3 flex flex-col items-center justify-between gap-3.5 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="text-center pt-1 px-1">
          <h1 className="text-[25px] font-black text-[#221B2D] tracking-tight leading-[1.25]">
            {STRINGS.intro.title}
          </h1>
          {STRINGS.intro.subtitle && (
            <p className="text-[14px] font-medium text-[#655E70] mt-1.5 leading-[1.4] max-w-[320px] mx-auto">
              {STRINGS.intro.subtitle}
            </p>
          )}
        </div>

        {/* Hero Illustration - Transparent natural blend */}
        <div className="w-full max-w-[320px] shrink-0 relative flex items-center justify-center my-0.5">
          <img
            src={CONFIG.HERO_SRC}
            alt="नवभारत ऐड्स"
            className="w-full h-auto object-contain select-none filter drop-shadow-sm pointer-events-none"
          />
        </div>

        {/* Three Value Micro-Cards */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[350px] shrink-0">
          {/* Badge 1: Local / Placement */}
          <div className="bg-white rounded-[18px] border border-[#E9E8E4] py-3 px-2 flex flex-col items-center justify-between text-center min-h-[114px] shadow-[0_2px_8px_rgba(43,36,55,0.04)] hover:border-[#F5B55C]/60 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#FFF9EE] to-[#FFF1DE] border border-[#FDE68A] flex items-center justify-center text-[#D97706] mb-1.5 shadow-2xs shrink-0">
              <MapPin className="w-[18px] h-[18px] text-[#D97706]" />
            </div>
            <p className="text-[11.5px] font-bold text-[#2B2437] leading-[1.3] flex-1 flex items-center justify-center">
              {STRINGS.intro.badge1}
            </p>
          </div>

          {/* Badge 2: Budget */}
          <div className="bg-white rounded-[18px] border border-[#E9E8E4] py-3 px-2 flex flex-col items-center justify-between text-center min-h-[114px] shadow-[0_2px_8px_rgba(43,36,55,0.04)] hover:border-[#F5B55C]/60 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#FFF9EE] to-[#FFF1DE] border border-[#FDE68A] flex items-center justify-center text-[#D97706] font-extrabold text-[19px] leading-none mb-1.5 shadow-2xs shrink-0">
              ₹
            </div>
            <p className="text-[11.5px] font-bold text-[#2B2437] leading-[1.3] flex-1 flex items-center justify-center">
              {STRINGS.intro.badge2}
            </p>
          </div>

          {/* Badge 3: Fast & Easy */}
          <div className="bg-white rounded-[18px] border border-[#E9E8E4] py-3 px-2 flex flex-col items-center justify-between text-center min-h-[114px] shadow-[0_2px_8px_rgba(43,36,55,0.04)] hover:border-[#F5B55C]/60 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#FFF9EE] to-[#FFF1DE] border border-[#FDE68A] flex items-center justify-center text-[#D97706] mb-1.5 shadow-2xs shrink-0">
              <Clock className="w-[18px] h-[18px] text-[#D97706]" />
            </div>
            <p className="text-[11.5px] font-bold text-[#2B2437] leading-[1.3] flex-1 flex items-center justify-center">
              {STRINGS.intro.badge3}
            </p>
          </div>
        </div>

        {/* Sleek Reassurance Strip */}
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] border border-[#10B981]/30 shadow-2xs text-[12px] font-semibold text-[#065F46] max-w-[94%] text-center leading-snug">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{STRINGS.intro.reassurance}</span>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <StickyCTA
        label={ctaLabel}
        onClick={handleCtaClick}
        showArrow
        subAction={
          <div className="flex flex-col items-center gap-2 pt-0.5">
            {isLoggedIn && isShopComplete && (
              <button
                type="button"
                onClick={handleStartNewAd}
                className="text-[13px] text-[#4A4358] font-bold hover:underline cursor-pointer"
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
                className="text-[13px] text-[#6B7280] font-medium hover:text-[#2B2437] hover:underline cursor-pointer transition-colors"
              >
                {STRINGS.intro.hasAccountLogin}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                window.location.href = '/feed';
              }}
              className="text-[12px] font-medium text-[#9CA3AF] hover:text-[#4A4358] transition-colors cursor-pointer"
            >
              ← मुख्य ऐप पर जाएँ
            </button>
          </div>
        }
      />

      {/* Help WhatsApp Sheet */}
      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
