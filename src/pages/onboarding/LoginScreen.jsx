import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'iconsax-react';
import NavaBharatLogo from '../../components/common/NavaBharatLogo';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Screen 3: Login Screen
 * Entire content group (Logo, Headings, Phone Input, Trust Indicator, and CTA Button)
 * is positioned vertically in the center of the viewport, exactly matching design reference.
 */
export default function LoginScreen() {
  const navigate = useNavigate();
  const { setPhoneNumber } = useOnboarding();
  const [phone, setPhone] = useState('');
  const [showError, setShowError] = useState(false);

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (showError && cleaned.length === 10) {
      setShowError(false);
    }
  };

  const handleProceed = () => {
    if (phone.length === 10) {
      setPhoneNumber(`+91 ${phone}`);
      navigate('/onboarding/otp');
    } else {
      setShowError(true);
    }
  };

  const isComplete = phone.length === 10;

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-center px-6 pt-[64px] pb-8 select-none">
      {/* Vertically Centered Main Container */}
      <div className="w-full flex flex-col my-auto">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <NavaBharatLogo className="h-[38px] w-auto" />
        </div>

        {/* Headline */}
        <h1 className="text-[32px] font-semibold text-[#18253B] text-center tracking-tight leading-tight">
          लॉगिन करें
        </h1>

        {/* Value Proposition */}
        <p className="mt-2 text-[16px] font-medium text-center leading-relaxed whitespace-pre-line px-2">
          <span className="text-[#E39026]">अपने शहर,</span>{" "}
          <span className="text-[#6B7280]">
            {"अपनी पसंद की खबरें\nसबसे पहले पाएं"}
          </span>
        </p>

        {/* Form Field Section */}
        <div className="mt-8">
          <label className="block text-[14px] font-semibold text-[#18253B] mb-2 px-1">
            लॉगिन करें
          </label>

          {/* Composite Phone Input */}
          <div className="h-[56px] bg-white rounded-[16px] border border-[#B0B7C3] flex items-center px-4 focus-within:border-[#18253B] focus-within:ring-2 focus-within:ring-[#18253B]/10 transition-all shadow-xs">
            <span className="text-[17px] font-bold text-[#18253B] select-none">
              +91
            </span>
            <div className="h-5 w-[1px] bg-[#B0B7C3] mx-3" />
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={(e) => e.key === 'Enter' && isComplete && handleProceed()}
              placeholder="मोबाइल नंबर डालें"
              maxLength={10}
              className="text-[16px] font-medium text-[#18253B] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 tracking-wide"
            />
          </div>

          {/* Error Text */}
          {showError && (
            <p className="text-[12px] text-[#DC2626] px-1 mt-1.5 font-medium">
              कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें
            </p>
          )}

          {/* Trust Indicator Row */}
          <div className="mt-4 mb-7 flex items-start gap-3 px-1">
            <div className="w-[28px] h-[28px] rounded-full bg-[#18253B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              <Lock size={14} color="#FFFFFF" variant="Linear" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#18253B] leading-none">
                आपकी निजी जानकारी सुरक्षित है
              </p>
              <p className="text-[11px] font-normal text-[#6B7280] leading-tight mt-1">
                आपका नंबर सिर्फ़ अकाउंट वेरिफिकेशन के लिए इस्तेमाल हो रहा है
              </p>
            </div>
          </div>

          {/* Primary Action Button - matching notifications permission button dimensions */}
          <button
            onClick={handleProceed}
            disabled={!isComplete}
            className={`w-full h-[56px] rounded-[16px] text-[20px] font-medium flex items-center justify-center transition-all duration-200 ${
              isComplete
                ? 'bg-[#18253B] text-white shadow-md active:scale-[0.99] cursor-pointer hover:bg-[#1f304d]'
                : 'bg-[#18253B]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            आगे बढ़ें
          </button>
        </div>
      </div>
    </div>
  );
}
