import React from 'react';
import { STRINGS } from '../../strings/hi';

export default function ProgressPill({ currentStep = 1, totalSteps = 7 }) {
  if (!currentStep || currentStep < 1 || currentStep > totalSteps) {
    return null;
  }

  return (
    <div className="inline-flex items-center justify-center gap-2.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] shadow-2xs">
      {/* 7 dots/bars */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;

          if (isActive) {
            return (
              <span
                key={stepNum}
                className="w-4 h-1.5 rounded-full bg-[#E39026] shadow-xs transition-all duration-300"
              />
            );
          }

          return (
            <span
              key={stepNum}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isDone ? 'bg-[#2B2437]' : 'bg-[#D1D5DB]'
              }`}
            />
          );
        })}
      </div>

      {/* Hindi step text */}
      <span className="text-[11.5px] font-bold text-[#2B2437] font-mono tracking-tight leading-none pt-[1px]">
        {STRINGS.common.stepPill(currentStep)}
      </span>
    </div>
  );
}
