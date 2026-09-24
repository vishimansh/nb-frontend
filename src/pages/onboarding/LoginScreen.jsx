import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Warning2 } from 'iconsax-react';
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
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const isValidIndianMobile = (num) => /^[6-9]\d{9}$/.test(num);

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (error) {
      if (cleaned.length === 0) {
        setError('');
      } else if (!/^[6-9]/.test(cleaned)) {
        setError('मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए');
      } else if (cleaned.length === 10 && isValidIndianMobile(cleaned)) {
        setError('');
      } else {
        setError('');
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleProceed = () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError('कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें');
      triggerShake();
      return;
    }
    if (!/^[6-9]/.test(trimmed)) {
      setError('मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए');
      triggerShake();
      return;
    }
    if (trimmed.length < 10) {
      setError(`${10 - trimmed.length} अंक और दर्ज करें`);
      triggerShake();
      return;
    }
    if (!isValidIndianMobile(trimmed)) {
      setError('कृपया मान्य भारतीय मोबाइल नंबर दर्ज करें');
      triggerShake();
      return;
    }
    setError('');
    setPhoneNumber(`+91 ${trimmed}`);
    navigate('/onboarding/otp');
  };

  const isComplete = isValidIndianMobile(phone);

  const digitHint =
    !error && phone.length > 0 && phone.length < 10
      ? `${10 - phone.length} अंक और चाहिए`
      : null;

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-center px-6 pt-[64px] pb-8 select-none">
      <style>{`
        @keyframes nb-shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-6px)}
          30%{transform:translateX(6px)}
          45%{transform:translateX(-4px)}
          60%{transform:translateX(4px)}
          75%{transform:translateX(-2px)}
          90%{transform:translateX(2px)}
        }
        .nb-shake { animation: nb-shake 0.45s ease; }
      `}</style>

      <div className="w-full flex flex-col my-auto">
        <div className="flex justify-center mb-6">
          <NavaBharatLogo className="h-[38px] w-auto" />
        </div>

        <h1 className="text-[32px] font-semibold text-[#2B2437] text-center tracking-tight leading-tight">
          लॉगिन करें
        </h1>

        <p className="mt-2 text-[16px] font-medium text-center leading-relaxed whitespace-pre-line px-2">
          <span className="text-[#F5B55C]">अपने शहर,</span>{" "}
          <span className="text-[#6B7280]">{"अपनी पसंद की खबरें\nसबसे पहले पाएं"}</span>
        </p>

        <div className="mt-8">
          <label className="block text-[14px] font-semibold text-[#2B2437] mb-2 px-1">
            मोबाइल नंबर
          </label>

          <div
            className={`h-[56px] bg-white rounded-[16px] border flex items-center px-4 transition-all shadow-xs ${shake ? 'nb-shake' : ''} ${
              error
                ? 'border-[#EF4444] ring-2 ring-[#EF4444]/15 bg-[#FEF2F2]/30'
                : 'border-[#B0B7C3] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
            }`}
          >
            <span className={`text-[17px] font-bold select-none ${error ? 'text-[#EF4444]' : 'text-[#2B2437]'}`}>
              +91
            </span>
            <div className={`h-5 w-[1px] mx-3 ${error ? 'bg-[#EF4444]/40' : 'bg-[#B0B7C3]'}`} />
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={(e) => e.key === 'Enter' && isComplete && handleProceed()}
              placeholder="मोबाइल नंबर डालें"
              maxLength={10}
              autoFocus
              className={`text-[16px] font-medium placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 tracking-wide ${
                error ? 'text-[#EF4444]' : 'text-[#2B2437]'
              }`}
            />
          </div>

          {error ? (
            <div className="mt-2 px-1 flex items-center gap-1.5">
              <Warning2 size={14} color="#EF4444" variant="Bold" />
              <p className="text-[12.5px] text-[#DC2626] font-semibold leading-tight">{error}</p>
            </div>
          ) : digitHint ? (
            <p className="text-[12px] text-[#9CA3AF] px-1 mt-1.5 font-medium">{digitHint}</p>
          ) : null}

          <div className="mt-4 mb-7 flex items-start gap-3 px-1">
            <div className="w-[28px] h-[28px] rounded-full bg-[#2B2437] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              <Lock size={14} color="#FFFFFF" variant="Linear" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2B2437] leading-none">
                आपकी निजी जानकारी सुरक्षित है
              </p>
              <p className="text-[11px] font-normal text-[#6B7280] leading-tight mt-1">
                आपका नंबर सिर्फ़ अकाउंट वेरिफिकेशन के लिए इस्तेमाल हो रहा है
              </p>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={!isComplete}
            className={`w-full h-[56px] rounded-[16px] text-[20px] font-medium flex items-center justify-center transition-all duration-200 ${
              isComplete
                ? 'bg-[#2B2437] text-white shadow-md active:scale-[0.99] cursor-pointer hover:bg-[#3D334E]'
                : 'bg-[#2B2437]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            आगे बढ़ें
          </button>
        </div>
      </div>
    </div>
  );
}
