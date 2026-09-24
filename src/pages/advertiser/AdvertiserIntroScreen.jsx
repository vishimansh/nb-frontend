import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Location, Timer1, ArrowRight } from 'iconsax-react';
import heroImg from '../../assets/illustrations/nb_ads_hero.png';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserIntroScreen() {
  const navigate = useNavigate();
  const { advertiserAuth, isBusinessProfileSaved, businessProfile, setAdvertiserAuth } = useAdvertiser();

  const handleStart = () => {
    if (!advertiserAuth?.isAuthenticated) {
      // If the user already has a saved business profile with a phone number,
      // skip the phone-entry screen — pre-fill the known number and go straight to OTP.
      const knownPhone = businessProfile?.phone || advertiserAuth?.phone;
      if (knownPhone) {
        setAdvertiserAuth((prev) => ({ ...prev, phone: knownPhone }));
        navigate('/advertise/otp');
      } else {
        navigate('/advertise/phone');
      }
    } else if (!isBusinessProfileSaved) {
      navigate('/advertise/business-profile');
    } else {
      navigate('/advertise/dashboard');
    }
  };

  // Label and micro-copy change based on whether the user is a returning advertiser
  const isReturningUser = !!(businessProfile?.phone || advertiserAuth?.phone);

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-between pt-[64px] pb-6 px-6 select-none overflow-y-auto scrollbar-none">
      {/* Top Section: Title & Subtitle */}
      <div className="text-center">
        <h1 className="text-[32px] font-bold text-[#2B2437] tracking-tight leading-tight">
          नवभारत ऐड्स
        </h1>
        <p className="text-[16px] font-medium text-[#E38827] mt-[16px] leading-[1.35] max-w-[290px] mx-auto">
          अपने कारोबार का विज्ञापन सीधे अपने शहर के ग्राहकों तक पहुँचाएँ
        </p>
      </div>

      {/* Hero Illustration Card */}
      <div className="w-full my-auto py-1">
        <div className="w-full rounded-[32px] overflow-hidden">
          <img
            src={heroImg}
            alt="ब्रू बैठक विज्ञापन"
            className="w-full h-auto object-cover object-top block rounded-[32px]"
          />
        </div>
      </div>

      {/* Three Circular Benefit Badges */}
      <div className="grid grid-cols-3 gap-2 px-1 mb-5">
        {/* Benefit 1: Location */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[52px] h-[52px] rounded-full bg-[#E38827] text-white flex items-center justify-center shadow-xs shrink-0">
            <Location size={24} color="#FFFFFF" variant="Bold" />
          </div>
          <p className="text-[12.5px] font-bold text-[#2B2437] leading-[1.3] mt-2.5">
            अपने ग्राहकों तक<br />आसानी से पहुँचें
          </p>
        </div>

        {/* Benefit 2: ₹100 Price */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[52px] h-[52px] rounded-full bg-[#E38827] text-white flex items-center justify-center shadow-xs shrink-0 font-bold text-[25px] leading-none">
            ₹
          </div>
          <p className="text-[12.5px] font-bold text-[#2B2437] leading-[1.3] mt-2.5">
            सिर्फ़ ₹100 से<br />विज्ञापन शुरू करें
          </p>
        </div>

        {/* Benefit 3: 5 Min Timer */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[52px] h-[52px] rounded-full bg-[#E38827] text-white flex items-center justify-center shadow-xs shrink-0">
            <Timer1 size={24} color="#FFFFFF" variant="Bold" />
          </div>
          <p className="text-[12.5px] font-bold text-[#2B2437] leading-[1.3] mt-2.5">
            सिर्फ़ 5 मिनट में<br />विज्ञापन पोस्ट करें
          </p>
        </div>
      </div>

      {/* Bottom CTA Block (Matches MVP onboarding button styling) */}
      <div className="shrink-0 flex flex-col items-center">
        <button
          type="button"
          onClick={handleStart}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] active:scale-[0.99] text-white text-[18px] font-medium shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <span>
            {isReturningUser && !advertiserAuth?.isAuthenticated
              ? 'OTP से लॉगिन करें'
              : isBusinessProfileSaved && advertiserAuth?.isAuthenticated
              ? 'डैशबोर्ड पर जाएं'
              : 'अपनी बिज़नेस प्रोफ़ाइल बनाएँ'}
          </span>
          <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
        </button>

        {/* Subtitle / Microcopy */}
        <p className="text-[12.5px] font-medium text-[#6B7280] text-center mt-3 leading-normal">
          अपने विज्ञापन की पहुँच और ग्राहकों की प्रतिक्रिया आसानी से देखें
        </p>
      </div>
    </div>
  );
}

