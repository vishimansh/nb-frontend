import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { GOALS, getGoalById } from '../data/goals';
import { STRINGS } from '../strings/hi';
import { Users, MessageSquareText, Globe, Check } from 'lucide-react';

const ICON_MAP = {
  reach: Users,
  engagement: MessageSquareText,
  ctrs: Globe,
};

export default function S03_Goal({ onOpenFacilitator }) {
  const { state, updateDraft } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();

  const [selectedGoal, setSelectedGoal] = useState(state.draft?.goal || 'engagement');
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
    updateDraft('goal', goalId);
    const goalObj = getGoalById(goalId);
    // Reset ctaKey to that goal's default
    updateDraft('ctaKey', goalObj.defaultCtaKey);
  };

  const currentGoalObj = getGoalById(selectedGoal);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none">
      {/* Header (Step 2 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={2}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center gap-3 scrollbar-none">
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center pt-0.5 pb-0.5">
          <h2 className="text-[17px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.goal.title}
          </h2>
        </div>

        {/* Goals Selection Cards Stack */}
        <div className="w-full max-w-[360px] flex flex-col gap-2">
          {GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoal;
            const IconComp = ICON_MAP[goal.id] || Users;

            return (
              <div
                key={goal.id}
                onClick={() => handleSelectGoal(goal.id)}
                className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer select-none flex items-center gap-3 bg-white ${
                  isSelected
                    ? 'border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                    : 'border-[#EDEDEA] hover:border-[#D1D5DB] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                } active:scale-[0.99]`}
              >
                {/* Icon tile */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#FFF8E7] text-[#D97706] border border-[#F6DFA8]'
                      : 'bg-[#F4F4F2] text-[#6B7280]'
                  }`}
                >
                  <IconComp className="w-4.5 h-4.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[14px] font-bold text-[#2B2437] leading-tight">
                      {goal.title}
                    </h4>
                    {goal.id === 'engagement' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#FFF8E7] border border-[#F6DFA8] text-[9.5px] font-bold text-[#B45309]">
                        लोकप्रिय
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[#8C8C94] leading-snug mt-0.5">
                    {goal.description}
                  </p>
                </div>

                {/* Check / Radio indicator */}
                <div className="shrink-0">
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#2B2437] bg-[#2B2437]'
                        : 'border-[#D1D5DB] bg-white'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Button Notice Pill in Distinctive Warm Amber Theme */}
        <div className="px-3 py-1.5 rounded-full bg-[#FFF8E7] border border-[#F6DFA8] text-[11px] font-semibold text-[#854D0E] shadow-2xs inline-flex items-center gap-1.5 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
          <span>{STRINGS.goal.btnPreviewNotice(currentGoalObj.defaultButtonLabel)}</span>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={proceedNextStep}
        showArrow={!isFromReview}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
