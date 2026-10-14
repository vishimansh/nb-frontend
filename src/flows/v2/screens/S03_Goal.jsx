import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { GOALS, getGoalById } from '../data/goals';
import { STRINGS } from '../strings/hi';
import { Users, MessageSquareText, Globe, Check, Target, Sparkles } from 'lucide-react';
import { ArrowRight2 } from 'iconsax-react';

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
    updateDraft('ctaKey', goalObj.defaultCtaKey);
  };

  const currentGoalObj = getGoalById(selectedGoal);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none font-sans">
      {/* Header (Step 2 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={2}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 flex flex-col items-center gap-4 scrollbar-none">
        {/* Main Master Card borrowing Menu/Settings Card architecture */}
        <div className="w-full max-w-[360px] bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm flex flex-col gap-3.5">
          {/* Section Header with Golden Badge (Menu Screen signature) */}
          <div className="flex items-center gap-2.5 pb-1 border-b border-[#F5F5F4]">
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF3DC] border border-[#F5B55C]/50 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-[#E39026]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#2B2437] leading-snug">
                {STRINGS.goal.title}
              </h2>
              <p className="text-[11px] text-[#9CA3AF] font-medium leading-none mt-0.5">
                अपने विज्ञापन का मुख्य उद्देश्य चुनें
              </p>
            </div>
          </div>

          {/* Goal Action Tiles List */}
          <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={STRINGS.goal.title}>
            {GOALS.map((goal) => {
              const isSelected = goal.id === selectedGoal;
              const IconComp = ICON_MAP[goal.id] || Users;

              return (
                <button
                  key={goal.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelectGoal(goal.id)}
                  className={`w-full text-left rounded-[16px] p-3 flex items-center justify-between transition-all duration-150 cursor-pointer active:scale-[0.99] select-none ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#FFFBF0] via-[#FFF6E0] to-[#FFF0C4] border border-[#F5B55C] shadow-sm'
                      : 'bg-[#F9FAFB] border border-[#F1F3F5] hover:bg-gray-100/80 hover:border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    {/* Left Icon Tile */}
                    <div
                      className={`w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#F59E0B] to-[#E39026] text-white shadow-md'
                          : 'bg-[#2B2437]/[0.86] text-white shadow-xs'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Text Stack */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-bold text-[#2B2437] leading-snug truncate">
                          {goal.title}
                        </span>
                        {goal.id === 'engagement' && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#E39026] text-white rounded-full leading-none shrink-0">
                            लोकप्रिय
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11.5px] font-medium leading-tight mt-0.5 truncate ${
                          isSelected ? 'text-[#854D0E]' : 'text-[#6B7280]'
                        }`}
                      >
                        {goal.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Affordance Circle */}
                  <div className="shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#E39026] text-white shadow-xs'
                          : 'border-2 border-[#D1D5DB] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live CTA Button Preview Card (Matching Menu's content tile language) */}
        <div
          key={currentGoalObj.id}
          className="w-full max-w-[360px] bg-white rounded-[20px] border border-[#EBECEF] p-3.5 shadow-sm flex items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF3DC] border border-[#F5B55C]/50 flex items-center justify-center text-[#E39026] shrink-0">
              <Sparkles className="w-4 h-4 text-[#E39026]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#2B2437] truncate">
                विज्ञापन का बटन
              </span>
              <span className="text-[11px] text-[#9CA3AF] font-medium">
                पाठकों को यह बटन दिखेगा
              </span>
            </div>
          </div>

          <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#2B2437] text-white text-[12.5px] font-bold shadow-xs">
            {currentGoalObj.defaultButtonLabel}
          </span>
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
