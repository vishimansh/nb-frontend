import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import ChoiceRow from '../components/ui/ChoiceRow';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { GOALS, getGoalById } from '../data/goals';
import { STRINGS } from '../strings/hi';
import { Target, Users, MessageSquareText, Globe } from 'lucide-react';

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
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center gap-4 scrollbar-none">
        {/* Screen Icon Tile & Title */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-1">
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs">
            <Target className="w-7 h-7 text-[#E39026]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#2B2437] tracking-tight leading-tight mt-1">
            {STRINGS.goal.title}
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            {STRINGS.goal.subtitle}
          </p>
        </div>

        {/* Goals Selection Cards Stack */}
        <div className="w-full max-w-[360px] bg-white rounded-[20px] border border-[#E5E7EB] p-2.5 space-y-2 shadow-xs">
          {GOALS.map((goal) => {
            const isSelected = goal.id === selectedGoal;
            const IconComp = ICON_MAP[goal.id] || Users;

            return (
              <div key={goal.id} className="flex flex-col gap-1.5">
                <ChoiceRow
                  title={goal.title}
                  description={goal.description}
                  selected={isSelected}
                  onClick={() => handleSelectGoal(goal.id)}
                  icon={<IconComp className="w-5 h-5" />}
                />
              </div>
            );
          })}
        </div>

        {/* Live Button Notice Chip */}
        <div className="px-3.5 py-1.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[12px] font-bold text-[#C97F1E] shadow-2xs animate-fadeIn">
          {STRINGS.goal.btnPreviewNotice(currentGoalObj.defaultButtonLabel)}
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
