import React from 'react';
import { ChevronLeft } from 'lucide-react';
import HelpChip from './HelpChip';
import ProgressPill from './ProgressPill';
import { useLongPress } from '../../hooks/useLongPress';

export default function V2Header({
  showBack = true,
  onBack,
  onHelp,
  onLogoLongPress,
  stepNumber = null,
  rightAction = null,
}) {
  const longPressHandlers = useLongPress(() => {
    if (onLogoLongPress) {
      onLogoLongPress();
    }
  }, 800);

  return (
    <header className="w-full bg-[#F7F7F4]/92 backdrop-blur-md border-b border-[#E5E7EB]/70 px-4 pt-[54px] pb-2 flex flex-col gap-1.5 shrink-0 z-20 sticky top-0">
      {/* Row 1: Navigation, Logo & Actions */}
      <div className="flex items-center justify-between min-h-[46px]">
        {/* Back Button */}
        <div className="w-[46px] flex items-center justify-start shrink-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-[44px] h-[44px] rounded-[14px] border border-[#D1D5DB] bg-white flex items-center justify-center text-[#2B2437] active:scale-95 transition-transform hover:bg-neutral-50 shadow-2xs"
              aria-label="वापस जाएँ"
            >
              <ChevronLeft className="w-5 h-5 text-[#2B2437]" />
            </button>
          )}
        </div>

        {/* Centred Logo with 800ms Long Press trigger for Facilitator Panel */}
        <div
          {...longPressHandlers}
          className="cursor-pointer select-none text-center px-2 py-0.5 rounded-lg active:opacity-75 transition-opacity"
          title="लॉन्ग-प्रेस: फेसिलिटेटर पैनल"
        >
          <span className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            नवभारत <span className="text-[#E39026]">ऐड्स</span>
          </span>
        </div>

        {/* Right Action / Help */}
        <div className="w-[46px] flex items-center justify-end shrink-0">
          {rightAction ? rightAction : <HelpChip onClick={onHelp} />}
        </div>
      </div>

      {/* Row 2: Progress Pill (only steps 1-7) */}
      {stepNumber && (
        <div className="w-full flex items-center justify-center pt-0.5 pb-0.5">
          <ProgressPill currentStep={stepNumber} totalSteps={7} />
        </div>
      )}
    </header>
  );
}
