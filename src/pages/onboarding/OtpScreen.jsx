import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'iconsax-react';
import BackButton from '../../components/common/BackButton';
import NavaBharatLogo from '../../components/common/NavaBharatLogo';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Screen 4: OTP Verification Screen
 * The core interaction block (Logo, Title, Subtitle, 6-Cell OTP, Timer, and "वेरिफ़ाई करें" CTA)
 * is vertically centered in the screen, exactly matching design reference Image 3.
 */
export default function OtpScreen() {
  const navigate = useNavigate();
  const { phoneNumber } = useOnboarding();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  const displayPhone = phoneNumber || '+91 9876543210';

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleInputChange = (index, value) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6 digits filled
    if (char && index === 5 && newOtp.every((d) => d !== '')) {
      setTimeout(() => {
        navigate('/onboarding/select-state');
      }, 300);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      setTimeout(() => {
        navigate('/onboarding/select-state');
      }, 300);
    } else {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = otp.every((d) => d !== '');

  const handleVerify = () => {
    if (isComplete) {
      navigate('/onboarding/select-state');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-between pt-[64px] pb-6 px-6 select-none relative">
      {/* Top Header Row with Back Navigation */}
      <div className="w-full py-1">
        <BackButton onClick={() => navigate('/onboarding/login')} ariaLabel="वापस जाएं" />
      </div>

      {/* Main Content Group - Vertically Centered */}
      <div className="w-full flex-1 flex flex-col justify-center items-center -mt-6">
        {/* Logo */}
        <div className="mb-6">
          <NavaBharatLogo className="h-[38px] w-auto" />
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-semibold text-[#18253B] text-center tracking-tight leading-tight">
          OTP दर्ज करें
        </h1>

        {/* Confirmation Copy */}
        <p className="mt-2 text-[14px] text-center leading-[1.5] text-[#6B7280] whitespace-pre-line px-2">
          {"आपके नंबर "}
          <span className="text-[#E39026] font-semibold">{displayPhone}</span>
          {" पर "}
          <span className="text-[#E39026] font-semibold">6 अंकों</span>
          {" का\nOTP भेजा गया है"}
        </p>

        {/* 6-Cell OTP Input Group: w-[48px] h-[64px], rounded-[12px] */}
        <div 
          className="mt-7 flex justify-center gap-2.5 w-full max-w-[340px]" 
          onPaste={handlePaste}
        >
          {otp.map((digit, idx) => (
            <div 
              key={idx} 
              className="w-[48px] h-[64px] bg-white rounded-[12px] border border-[#B0B7C3] flex flex-col items-center justify-center relative focus-within:border-[#18253B] focus-within:ring-2 focus-within:ring-[#18253B]/20 transition-all shadow-2xs"
            >
              <input
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="text-[22px] font-bold text-[#18253B] text-center bg-transparent outline-none w-full h-full z-10 select-all"
              />

              {/* Interior Bottom Dash when empty */}
              {!digit && (
                <div className="w-5 h-[2px] bg-[#9CA3AF] absolute bottom-3 pointer-events-none rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Resend Row */}
        <div className="mt-5 text-center text-[14px]">
          <span className="text-[#18253B] font-normal">OTP नहीं मिला? </span>
          {timer > 0 ? (
            <span className="font-bold text-[#18253B]">
              फिर से भेजें ({timer}s)
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="font-bold text-[#E39026] hover:underline cursor-pointer"
            >
              फिर से भेजें
            </button>
          )}
        </div>

        {/* Primary Action Button: matching notifications permission button dimensions */}
        <div className="w-full mt-8">
          <button
            onClick={handleVerify}
            disabled={!isComplete}
            className={`w-full h-[56px] rounded-[16px] text-[20px] font-medium flex items-center justify-center transition-all duration-200 ${
              isComplete
                ? 'bg-[#18253B] text-white shadow-md active:scale-[0.99] cursor-pointer hover:bg-[#1f304d]'
                : 'bg-[#18253B]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            वेरिफ़ाई करें
          </button>
        </div>
      </div>

      {/* Bottom Trust Notice - anchored at bottom */}
      <div className="w-full flex items-center justify-center gap-2 pb-2">
        <div className="w-5 h-5 rounded-full bg-[#18253B] flex items-center justify-center text-white shadow-2xs">
          <Lock size={10} color="#FFFFFF" variant="Linear" />
        </div>
        <span className="text-[12px] font-bold text-[#18253B]">
          आपकी निजी जानकारी सुरक्षित है
        </span>
      </div>
    </div>
  );
}
