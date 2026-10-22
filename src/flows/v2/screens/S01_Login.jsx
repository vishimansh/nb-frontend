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
import { Smartphone, ShieldCheck, RotateCcw, HelpCircle } from 'lucide-react';

export default function S01_Login({ onOpenFacilitator }) {
  const { state, updateAuth, navigateTo, goBack } = useAdvertiserV2();

  const [phone, setPhone] = useState(() => state.auth?.phone || loadSavedAccount()?.phone || '');
  const [phoneError, setPhoneError] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpDigits, setOtpDigits] = useState('');
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
      setOtpDigits('');
    }, 600);
  };

  const handleResend = () => {
    track('resend_tap');
    setResendTimer(30);
    setOtpError(null);
  };

  const handleOtpVerified = (verifiedCode) => {
    track('otp_verified', { phone });
    setIsSuccess(true);
    updateAuth({ phone, otpVerified: true });

    setTimeout(() => {
      const savedAccount = loadSavedAccount();
      if (savedAccount?.shop?.name && savedAccount?.shop?.categoryId) {
        navigateTo('dashboard');
      } else {
        navigateTo('shop');
      }
    }, 600);
  };

  const handleManualVerify = () => {
    if (otpDigits.length === 6) {
      handleOtpVerified(otpDigits);
    }
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

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-3.5 pb-6 flex flex-col items-center justify-start scrollbar-none">
        <div className="w-full max-w-[356px] flex flex-col items-center">
          {/* Top Context Header */}
          <div className="flex flex-col items-center text-center mb-4 pt-1">
            <div className="w-[64px] h-[64px] rounded-[20px] bg-gradient-to-br from-[#FFF9EE] to-[#FFF1DE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs">
              <Smartphone className="w-[40px] h-[40px] text-[#E39026]" strokeWidth={1.75} />
            </div>

            <h2 className="text-[22px] font-black text-[#2B2437] tracking-tight mt-2.5">
              {STRINGS.login.title}
            </h2>
            <p className="text-[13px] font-medium text-[#6B7280] max-w-[280px] leading-snug mt-1">
              {STRINGS.login.subtitle}
            </p>
          </div>

          {/* Success Burst Overlay */}
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center gap-3 animate-fadeIn">
              <CheckBurst size={68} />
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-[20px] font-black text-[#2B2437]">
                  सत्यापित हो गया!
                </span>
                <span className="text-[13px] text-[#6B7280]">
                  आपको आगे ले जाया जा रहा है…
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-3.5">
              {/* CARD 1: Mobile Number Input Card (Always visible on the screen) */}
              <div className="w-full p-4 sm:p-5 rounded-[22px] bg-white border border-[#E8E7E3] shadow-[0_2px_12px_rgba(43,36,55,0.03)] flex flex-col gap-3">
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
                      className="text-[13px] font-bold text-[#E39026] hover:text-[#C97F1E] hover:underline cursor-pointer transition-colors"
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

                {!isOtpSent && (
                  <Button
                    onClick={handleSendOtp}
                    disabled={!isPhoneValid || isSending}
                    showArrow
                    className="mt-1"
                  >
                    {isSending ? STRINGS.login.sendingOtp : STRINGS.login.sendOtp}
                  </Button>
                )}
              </div>

              {/* CARD 2: OTP Input Card (Reveals on completion / OTP sent below Card 1 on the same screen) */}
              {isOtpSent && (
                <div className="w-full p-4.5 sm:p-5 rounded-[22px] bg-white border border-[#E8E7E3] shadow-[0_4px_18px_rgba(43,36,55,0.04)] flex flex-col items-center gap-3.5 animate-fadeIn">
                  <h3 className="text-[13.5px] font-bold text-[#2B2437]">
                    {STRINGS.login.otpLabel}
                  </h3>

                  <OtpCells
                    onComplete={handleOtpVerified}
                    error={otpError}
                    setError={setOtpError}
                    onChange={(val) => setOtpDigits(val)}
                  />

                  {/* Resend and Help Row */}
                  <div className="w-full flex items-center justify-between pt-1 border-t border-[#F2EFE9] text-[12px]">
                    {resendTimer > 0 ? (
                      <span className="text-[#6B7280] font-medium flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        {STRINGS.login.resendIn(resendTimer)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="font-bold text-[#E39026] hover:text-[#C97F1E] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#E39026]" />
                        {STRINGS.login.resendBtn}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowHelpSheet(true)}
                      className="text-[#6B7280] font-semibold hover:text-[#2B2437] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{STRINGS.login.noOtpHelp}</span>
                    </button>
                  </div>

                  {/* Verify Action Button */}
                  <Button
                    onClick={handleManualVerify}
                    disabled={otpDigits.length !== 6}
                    showArrow
                    className="mt-0.5"
                  >
                    {STRINGS.login.verifyBtn}
                  </Button>
                </div>
              )}

              {/* Security Reassurance Footer Pill */}
              <div className="mt-4 flex items-center justify-center pb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#EBECEF] shadow-2xs text-[11px] font-semibold text-[#6B7280]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>100% सुरक्षित और गोपनीय लॉगिन</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
