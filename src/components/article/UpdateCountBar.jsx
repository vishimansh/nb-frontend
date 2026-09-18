import React from 'react';
import { RotateRight } from 'iconsax-react';

export default function UpdateCountBar({ updateCount = 8, text, onRefresh, className = "" }) {
  const displayText = text || `यह खबर ${updateCount} बार अपडेट की जा चुकी है`;

  return (
    <div
      onClick={onRefresh}
      className={`w-full rounded-[8px] bg-[#F1DECE] border border-[#E7CCA8]/50 py-2.5 px-4 flex items-center justify-center gap-2 text-center shadow-2xs select-none cursor-pointer active:scale-[0.99] transition-transform ${className}`}
    >
      <RotateRight
        size={16}
        color="#A96F37"
        variant="Linear"
        className="animate-spin-once shrink-0"
      />
      <span className="text-[13.5px] font-medium text-[#A96F37] tracking-normal">
        {displayText}
      </span>
    </div>
  );
}
