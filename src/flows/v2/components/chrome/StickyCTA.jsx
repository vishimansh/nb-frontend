import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function StickyCTA({
  label,
  primaryLabel,
  onClick,
  onPrimary,
  disabled = false,
  missingHint = null,
  summaryContent = null,
  stickySubtitle = null,
  secondaryLabel = null,
  onSecondary = null,
  showArrow = true,
  variant = 'primary', // 'primary' | 'amber'
  subAction = null,
}) {
  const isAmber = variant === 'amber';
  const effectiveLabel = label || primaryLabel || '';
  const effectiveOnClick = onClick || onPrimary;

  let effectiveSummary = summaryContent;
  if (!effectiveSummary && (stickySubtitle || secondaryLabel)) {
    effectiveSummary = (
      <div className="w-full flex items-center justify-between text-[14px]">
        {stickySubtitle && (
          <span className="font-extrabold text-[15px] text-[#2B2437]">
            {stickySubtitle}
          </span>
        )}
        {secondaryLabel && (
          <button
            type="button"
            onClick={onSecondary}
            className="text-[12.5px] font-bold text-[#E39026] hover:underline cursor-pointer ml-auto"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 w-full z-20 pointer-events-auto">
      {/* Cream gradient fade above the CTA */}
      <div className="h-6 w-full bg-gradient-to-t from-[#F7F7F4] to-transparent pointer-events-none" />

      <div className="bg-[#F7F7F4]/95 backdrop-blur-md px-4 pt-1.5 pb-6 flex flex-col gap-2 border-t border-[#E5E7EB]/50">
        {/* Optional Missing Info Explanation for disabled state */}
        {disabled && missingHint && (
          <div className="text-center text-[12px] font-medium text-[#DC2626]">
            {missingHint}
          </div>
        )}

        {/* Optional Summary Line (e.g. Budget/Review Total) */}
        {effectiveSummary && (
          <div className="w-full flex items-center justify-between px-1 text-[14px]">
            {effectiveSummary}
          </div>
        )}

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={disabled ? undefined : effectiveOnClick}
          disabled={disabled}
          className={`w-full h-[54px] rounded-[16px] font-bold text-[17px] flex items-center justify-center gap-2 transition-all duration-150 select-none shadow-md ${
            disabled
              ? 'bg-[#A6A4A9] text-white/70 cursor-not-allowed shadow-none'
              : isAmber
              ? 'bg-[#E39026] text-white hover:bg-[#C97F1E] active:scale-[0.98]'
              : 'bg-[#2B2437] text-white hover:bg-[#3D334E] active:scale-[0.98]'
          }`}
        >
          {effectiveLabel && <span>{effectiveLabel}</span>}
          {showArrow && !disabled && <ArrowRight className="w-5 h-5 text-white/90" />}
        </button>

        {/* Optional Sub action link */}
        {subAction && <div className="text-center pt-0.5">{subAction}</div>}
      </div>
    </div>
  );
}
