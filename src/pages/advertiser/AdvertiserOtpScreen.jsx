import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import CanonicalErrorBanner from '../../components/advertiser/CanonicalErrorBanner';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserOtpScreen() {
  const navigate = useNavigate();
  const { advertiserAuth, setAdvertiserAuth, updateDraftCampaign, isBusinessProfileSaved, businessProfile } = useAdvertiser();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);

  // Use phone from advertiserAuth (pre-filled by IntroScreen when skipping phone entry)
  // or fall back to businessProfile.phone for returning users
  const phone = advertiserAuth.phone || businessProfile?.phone || '';

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setErrorMessage('');
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('कृपया सभी 6 अंकों का ओटीपी कोड दर्ज करें।');
      return;
    }

    // Mark authenticated
    setAdvertiserAuth((prev) => ({
      ...prev,
      isAuthenticated: true,
      otpVerified: true,
      phone,
    }));
    updateDraftCampaign({ phone });

    if (!isBusinessProfileSaved) {
      navigate('/advertise/business-profile');
    } else {
      navigate('/advertise/dashboard');
    }
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="centered"
        title="OTP दर्ज करें"
        onBack={() => navigate('/advertise/phone')}
      />

      <form onSubmit={handleVerify} className="flex-1 flex flex-col justify-between p-4">
        <div className="space-y-4 pt-2">
          <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB] shadow-xs space-y-4 text-center">
            <h2 className="text-[17px] font-bold text-[#2B2437] leading-tight">
              6 अंकों का OTP दर्ज करें
            </h2>

            {/* Phone Number Display with change option */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-semibold text-[#2B2437] font-mono">
                +91 {phone}
              </span>
              <span className="text-[#D1D5DB]">·</span>
              <button
                type="button"
                onClick={() => navigate('/advertise/phone')}
                className="text-[13px] font-semibold text-[#E39026] hover:underline cursor-pointer"
              >
                नंबर बदलें
              </button>
            </div>

            {/* 6-Cell OTP Inputs matching MVP OtpScreen */}
            <div className="flex justify-center gap-2 pt-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-[45px] h-[58px] bg-white rounded-[14px] border border-[#B0B7C3] flex flex-col items-center justify-center relative focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 transition-all shadow-xs"
                >
                  <input
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="text-[20px] font-bold text-[#2B2437] text-center bg-transparent outline-none w-full h-full font-mono"
                  />
                  {!digit && (
                    <div className="w-4 h-[2px] bg-[#B0B7C3] absolute bottom-2.5 rounded-full pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            {/* Resend Link & Timer */}
            <div className="text-center pt-2">
              {timer > 0 ? (
                <p className="text-[13px] text-[#6B7280] font-normal">
                  दोबारा भेजें{' '}
                  <span className="text-[#E39026] font-bold font-mono">00:{timer < 10 ? `0${timer}` : timer}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[13px] font-bold text-[#E39026] hover:underline cursor-pointer"
                >
                  OTP दोबारा भेजें
                </button>
              )}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="pt-2 text-left">
                <CanonicalErrorBanner message={errorMessage} />
              </div>
            )}
          </div>
        </div>

        {/* Action CTA matching MVP */}
        <div className="pt-2 pb-2">
          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full h-[56px] rounded-[16px] font-medium text-[18px] shadow-md transition-colors flex items-center justify-center gap-2 ${
              isComplete
                ? 'bg-[#2B2437] text-white active:scale-[0.99] cursor-pointer hover:bg-[#3D334E]'
                : 'bg-[#2B2437]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            <span>वेरिफ़ाई करें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </form>
    </div>
  );
}
