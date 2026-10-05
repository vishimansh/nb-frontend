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
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={2}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center gap-3.5 scrollbar-none">
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h2 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.goal.title}
          </h2>
          <p className="text-[12px] text-[#6B7280]">
            {STRINGS.goal.subtitle}
          </p>
        </div>

        {/* Goals Selection Cards Stack */}
        <div className="w-full max-w-[360px] flex flex-col gap-2.5">
          {GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoal;
            const IconComp = ICON_MAP[goal.id] || Users;

            return (
              <div
                key={goal.id}
                onClick={() => handleSelectGoal(goal.id)}
                className={`p-3.5 rounded-[20px] border transition-all duration-150 cursor-pointer select-none flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-white border-[#2B2437] ring-2 ring-[#2B2437]/15 shadow-sm'
                    : 'bg-white border-[#E5E7EB] hover:border-neutral-300 shadow-2xs'
                } active:scale-[0.99]`}
              >
                {/* Icon tile */}
                <div
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-[#FFF9EE] text-[#E39026] border border-[#FDE68A]' : 'bg-[#F7F7F4] text-[#4A4358]'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[14.5px] font-bold text-[#2B2437] leading-tight">
                      {goal.title}
                    </h4>
                    {goal.id === 'engagement' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[10.5px] font-bold text-[#C97F1E]">
                        लोकप्रिय
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-snug mt-0.5">
                    {goal.description}
                  </p>
                </div>

                {/* Check / Radio indicator */}
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#2B2437] bg-[#2B2437]'
                        : 'border-[#D1D5DB] bg-white'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Button Notice Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[11.5px] font-bold text-[#4A4358] shadow-2xs inline-flex items-center gap-1.5 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#E39026]" />
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
