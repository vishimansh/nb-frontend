import React, { useState, useEffect, useRef } from 'react';
import V2Header from '../components/chrome/V2Header';
import PhoneField from '../components/ui/PhoneField';
import OtpCells from '../components/ui/OtpCells';
import Button from '../components/ui/Button';
import CheckBurst from '../components/ui/CheckBurst';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { isValidPhone } from '../utils/validators';
import { loadSavedAccount } from '../utils/autosave';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { Smartphone, ShieldCheck } from 'lucide-react';

export default function S01_Login({ onOpenFacilitator }) {
  const { state, updateAuth, navigateTo, goBack } = useAdvertiserV2();

  const [phone, setPhone] = useState(() => state.auth?.phone || loadSavedAccount()?.phone || '');
  const [phoneError, setPhoneError] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const timerRef = useRef(null);

  // Timer countdown when OTP is sent
  useEffect(() => {
    if (isOtpSent && resendTimer > 0) {
      timerRef.current = setTimeout(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOtpSent, resendTimer]);

  const handleSendOtp = () => {
    if (!isValidPhone(phone)) {
      setPhoneError(STRINGS.login.phoneError);
      return;
    }
    setPhoneError(null);
    setIsSending(true);
    track('otp_sent', { phone });

    setTimeout(() => {
      setIsSending(false);
      setIsOtpSent(true);
      setResendTimer(30);
    }, 700);
  };

  const handleResend = () => {
    track('resend_tap');
    setResendTimer(30);
    setOtpError(null);
  };

  const handleOtpVerified = () => {
    track('otp_verified', { phone });
    setIsSuccess(true);
    updateAuth({ phone, otpVerified: true });

    setTimeout(() => {
      const savedAccount = loadSavedAccount();
      // If returning user with complete shop for this phone -> dashboard, else shop
      if (savedAccount?.shop?.name && savedAccount?.shop?.categoryId) {
        navigateTo('dashboard');
      } else {
        navigateTo('shop');
      }
    }, 600);
  };

  const isPhoneValid = isValidPhone(phone);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center gap-4 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center text-center gap-1 pt-1">
          <div className="w-13 h-13 rounded-[18px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs">
            <Smartphone className="w-6 h-6 text-[#E39026]" />
          </div>
          <h2 className="text-[22px] font-extrabold text-[#2B2437] tracking-tight mt-1">
            {STRINGS.login.title}
          </h2>
          <p className="text-[13px] font-medium text-[#6B7280]">
            {STRINGS.login.subtitle}
          </p>
        </div>

        {/* Success burst overlay if verified */}
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center gap-3 animate-fadeIn">
            <CheckBurst size={64} />
            <span className="text-[16px] font-bold text-[#2B2437]">
              सत्यापित हो गया!
            </span>
          </div>
        ) : (
          <div className="w-full max-w-[360px] flex flex-col gap-3.5">
            {/* Phone Card */}
            <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[13.5px] font-bold text-[#2B2437]">
                  {STRINGS.login.phoneLabel}
                </label>
                {isOtpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtpError(null);
                    }}
                    className="text-[12.5px] font-bold text-[#E39026] hover:underline cursor-pointer"
                  >
                    {STRINGS.login.changeNumber}
                  </button>
                )}
              </div>

              <PhoneField
                value={phone}
                onChange={setPhone}
                disabled={isOtpSent || isSending}
                error={phoneError}
                setError={setPhoneError}
              />

              {/* Initial Send OTP button */}
              {!isOtpSent && (
                <Button
                  onClick={handleSendOtp}
                  disabled={!isPhoneValid || isSending}
                  className="mt-1"
                >
                  {isSending ? STRINGS.login.sendingOtp : STRINGS.login.sendOtp}
                </Button>
              )}
            </div>

            {/* OTP Block (reveals under phone field) */}
            {isOtpSent && (
              <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-xs flex flex-col items-center gap-3.5 animate-fadeIn">
                <label className="text-[13.5px] font-bold text-[#2B2437]">
                  {STRINGS.login.otpLabel}
                </label>

                <OtpCells
                  onComplete={handleOtpVerified}
                  error={otpError}
                  setError={setOtpError}
                />

                {/* Resend and Help Row */}
                <div className="w-full flex items-center justify-between pt-1 text-[12.5px]">
                  {resendTimer > 0 ? (
                    <span className="text-[#6B7280] font-medium">
                      {STRINGS.login.resendIn(resendTimer)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-[#E39026] hover:underline cursor-pointer"
                    >
                      {STRINGS.login.resendBtn}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowHelpSheet(true)}
                    className="text-[#6B7280] font-medium hover:text-[#2B2437] hover:underline cursor-pointer"
                  >
                    {STRINGS.login.noOtpHelp}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Reassurance Pill */}
            <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-[#9CA3AF] font-medium py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>सुरक्षित व गोपनीय • केवल OTP सत्यापन के लिए</span>
            </div>
          </div>
        )}
      </div>

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
