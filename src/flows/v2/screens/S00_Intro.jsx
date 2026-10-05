import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import SampleAdSheet from '../components/ad/SampleAdSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { CONFIG } from '../config';
import { STRINGS } from '../strings/hi';
import { track } from '../utils/track';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

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
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-3 flex flex-col items-center justify-between gap-3.5 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="text-center pt-0.5 px-2">
          <h1 className="text-[26px] font-extrabold text-[#2B2437] tracking-tight leading-tight">
            {STRINGS.intro.title}
          </h1>
          <p className="text-[14px] font-medium text-[#6B7280] mt-1 leading-snug">
            {STRINGS.intro.subtitle}
          </p>
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
          {/* Badge 1: Local */}
          <div className="bg-white rounded-[16px] border border-[#EBECEF] py-3 px-2 flex flex-col items-center text-center shadow-2xs hover:border-[#F5B55C]/40 transition-colors">
            <div className="w-9 h-9 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-1.5 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#E39026]" />
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-tight">
              {STRINGS.intro.badge1}
            </p>
          </div>

          {/* Badge 2: Budget */}
          <div className="bg-white rounded-[16px] border border-[#EBECEF] py-3 px-2 flex flex-col items-center text-center shadow-2xs hover:border-[#F5B55C]/40 transition-colors">
            <div className="w-9 h-9 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] font-bold text-[17px] leading-none mb-1.5 shadow-2xs">
              ₹
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-tight">
              {STRINGS.intro.badge2}
            </p>
          </div>

          {/* Badge 3: Fast & Easy */}
          <div className="bg-white rounded-[16px] border border-[#EBECEF] py-3 px-2 flex flex-col items-center text-center shadow-2xs hover:border-[#F5B55C]/40 transition-colors">
            <div className="w-9 h-9 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-1.5 shadow-2xs">
              <Clock className="w-4 h-4 text-[#E39026]" />
            </div>
            <p className="text-[12px] font-bold text-[#2B2437] leading-tight">
              {STRINGS.intro.badge3}
            </p>
          </div>
        </div>

        {/* Sleek Minimal Reassurance Strip */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDF5E8] border border-[#F5B55C]/50 shadow-2xs text-[11.5px] font-semibold text-[#2B2437]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
          <span>{STRINGS.intro.reassurance}</span>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <StickyCTA
        label={ctaLabel}
        onClick={handleCtaClick}
        showArrow
        subAction={
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  track('sample_open');
                  setShowSampleSheet(true);
                }}
                className="text-[12.5px] font-bold text-[#E39026] hover:underline cursor-pointer"
              >
                {STRINGS.intro.viewSample}
              </button>

              {isLoggedIn && isShopComplete && (
                <>
                  <span className="text-[#D1D5DB]">•</span>
                  <button
                    type="button"
                    onClick={handleStartNewAd}
                    className="text-[12.5px] text-[#4A4358] font-bold hover:underline cursor-pointer"
                  >
                    {STRINGS.intro.newAdSecondary}
                  </button>
                </>
              )}

              {!isLoggedIn && !hasPhone && (
                <>
                  <span className="text-[#D1D5DB]">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      track('login_link_tap');
                      navigateTo('login');
                    }}
                    className="text-[12.5px] text-[#6B7280] font-medium hover:underline cursor-pointer"
                  >
                    {STRINGS.intro.hasAccountLogin}
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="text-[11.5px] text-[#9CA3AF] hover:text-[#2B2437] transition-colors cursor-pointer"
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
