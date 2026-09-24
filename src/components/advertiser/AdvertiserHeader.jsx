import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft2 } from 'iconsax-react';

export default function AdvertiserHeader({
  title = 'नवभारत विज्ञापन',
  subtitle = '',
  step = null,
  totalSteps = 7,
  phaseName = '',
  variant = 'default', // 'default' | 'brand' | 'centered'
  onBack,
  rightAction = null,
  className = '',
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (variant === 'brand') {
    return (
      <header className={`px-4 py-3 bg-[#F7F7F4] flex items-center justify-between shrink-0 sticky top-0 z-30 pt-[56px] border-b border-[#E5E7EB]/60 ${className}`}>
        {/* Left: Canonical Back Button matching MVP */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="पीछे जाएं"
          className="w-[46px] h-[46px] rounded-[14px] bg-white border border-[#D1D5DB] flex items-center justify-center text-[#2B2437] shadow-2xs cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <ArrowLeft2 size={20} color="#2B2437" variant="Linear" />
        </button>

        {/* Center: Brand Name (नवभारत ऐड्स) */}
        <div className="flex items-center gap-1 font-bold text-[20px] tracking-tight">
          <span className="text-[#2B2437]">नवभारत</span>
          <span className="text-[#E39026]">ऐड्स</span>
        </div>

        {/* Right: Stepper Pill [ — •••••• ] 1/7 */}
        <div className="flex items-center">
          {rightAction ? (
            rightAction
          ) : step ? (
            <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-2.5 py-1 shadow-2xs">
              <div className="flex items-center gap-1">
                {Array.from({ length: Number(totalSteps) || 7 }).map((_, idx) => {
                  const stepNum = idx + 1;
                  const isActive = stepNum === Number(step);
                  return isActive ? (
                    <span key={idx} className="w-3.5 h-1.5 rounded-full bg-[#E39026]" />
                  ) : (
                    <span key={idx} className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
                  );
                })}
              </div>
              <span className="text-[11px] font-bold text-[#2B2437] font-mono ml-0.5">
                {step}/{totalSteps}
              </span>
            </div>
          ) : (
            <div className="w-[46px]" />
          )}
        </div>
      </header>
    );
  }

  if (variant === 'centered') {
    return (
      <header className={`px-4 py-3 bg-[#F7F7F4] flex flex-col shrink-0 sticky top-0 z-30 pt-[56px] border-b border-[#E5E7EB]/60 ${className}`}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            aria-label="पीछे जाएं"
            className="w-[46px] h-[46px] rounded-[14px] bg-white border border-[#D1D5DB] flex items-center justify-center text-[#2B2437] shadow-2xs cursor-pointer active:scale-95 transition-transform shrink-0"
          >
            <ArrowLeft2 size={20} color="#2B2437" variant="Linear" />
          </button>

          <h1 className="text-[18px] font-bold text-[#2B2437] leading-tight text-center flex-1 mx-2">
            {title}
          </h1>

          <div className="w-[46px] shrink-0 flex justify-end">
            {rightAction || null}
          </div>
        </div>

        {subtitle && (
          <p className="text-[13px] text-[#6B7280] font-normal text-center mt-1.5 px-4 leading-relaxed">
            {subtitle}
          </p>
        )}
      </header>
    );
  }

  return (
    <header className={`px-4 py-3 bg-[#F7F7F4] flex items-center justify-between shrink-0 sticky top-0 z-30 pt-[56px] border-b border-[#E5E7EB]/60 ${className}`}>
      {/* Left: Boxed Back Button + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="पीछे जाएं"
          className="w-[46px] h-[46px] rounded-[14px] bg-white border border-[#D1D5DB] flex items-center justify-center text-[#2B2437] shadow-2xs cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <ArrowLeft2 size={20} color="#2B2437" variant="Linear" />
        </button>

        <div className="flex flex-col justify-center">
          <h1 className="text-[17px] font-bold text-[#2B2437] leading-normal pt-[1px] truncate max-w-[200px]">
            {title}
          </h1>
          {phaseName && (
            <span className="text-[12px] font-normal text-[#6B7280] leading-none mt-0.5">
              {phaseName}
            </span>
          )}
        </div>
      </div>

      {/* Right: Step Indicator or Custom Right Action */}
      <div className="flex items-center">
        {rightAction ? (
          rightAction
        ) : step ? (
          <div className="flex flex-col items-end">
            <span className="bg-[#2B2437]/10 text-[#2B2437] text-[11px] font-bold px-2.5 py-1 rounded-full leading-none">
              स्टेप {step} / {totalSteps}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
