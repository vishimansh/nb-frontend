import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import CanonicalErrorBanner from '../../components/advertiser/CanonicalErrorBanner';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserPhoneScreen() {
  const navigate = useNavigate();
  const { advertiserAuth, setAdvertiserAuth } = useAdvertiser();
  const [phone, setPhone] = useState(advertiserAuth.phone || '');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidIndianMobile = (num) => {
    return /^[6-9]\d{9}$/.test(num);
  };

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(rawVal);
    if (errorMessage && (rawVal.length === 10 || rawVal.length === 0)) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) {
      setErrorMessage('कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!isValidIndianMobile(phone)) {
      setErrorMessage('कृपया मान्य भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू होने वाला 10 अंकों का नंबर)।');
      return;
    }

    setAdvertiserAuth((prev) => ({
      ...prev,
      phone,
    }));
    navigate('/advertise/otp');
  };

  const isSubmitEnabled = phone.length === 10;

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      {/* Centered Clean Header */}
      <AdvertiserHeader
        variant="centered"
        title="मोबाइल नंबर"
        subtitle="विज्ञापन शुरू करने के लिए अपना नंबर डालें"
        onBack={() => navigate('/advertise/intro')}
      />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between p-4">
        <div className="space-y-4 pt-2">
          {/* Main Card */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB] shadow-xs space-y-3">
            <h2 className="text-[17px] font-bold text-[#2B2437] leading-tight">
              अपना 10 अंकों का मोबाइल नंबर डालें
            </h2>
            <p className="text-[13px] text-[#6B7280] font-normal leading-relaxed">
              वेरिफिकेशन के लिए आपके नंबर पर 6 अंकों का OTP भेजा जाएगा।
            </p>

            {/* Composite Phone Input matching MVP LoginScreen */}
            <div className="h-[56px] bg-white rounded-[16px] border border-[#B0B7C3] flex items-center px-4 focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 shadow-xs transition-all">
              <span className="text-[17px] font-bold text-[#2B2437] select-none">
                +91
              </span>
              <div className="h-5 w-[1px] bg-[#B0B7C3] mx-3" />
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="मोबाइल नंबर डालें"
                maxLength={10}
                autoFocus
                className="text-[16px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 tracking-wide"
              />
            </div>

            {/* Canonical Error Banner */}
            {errorMessage && (
              <div className="pt-1">
                <CanonicalErrorBanner message={errorMessage} />
              </div>
            )}
          </div>
        </div>

        {/* Action CTA matching MVP onboarding button */}
        <div className="pt-2 pb-2">
          <button
            type="submit"
            disabled={!isSubmitEnabled}
            className={`w-full h-[56px] rounded-[16px] font-medium text-[18px] shadow-md transition-colors flex items-center justify-center gap-2 ${
              isSubmitEnabled
                ? 'bg-[#2B2437] text-white active:scale-[0.99] cursor-pointer hover:bg-[#3D334E]'
                : 'bg-[#2B2437]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </form>
    </div>
  );
}
