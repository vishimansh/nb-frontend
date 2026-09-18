import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../../components/common/BackButton';
import StateCard from '../../components/onboarding/StateCard';
import { STATES_DATA } from '../../data/onboardingData';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Atomic Cascade Edit Flow - Step 1: Edit States (/edit/select-state)
 * Pre-fills with draftStates (or selectedStates).
 * Back arrow cancels atomic edit and returns directly to State Screen without mutating state.
 * "सेव करें" reconciles draftCities and advances to Step 2 without committing to global context.
 */
export default function EditStateSelectionPage() {
  const navigate = useNavigate();
  const {
    draftStates,
    selectedStates,
    toggleDraftState,
    reconcileDraftCitiesOnNext,
    cancelAtomicEdit,
    alertMessage,
  } = useOnboarding();

  const currentStates = draftStates !== null ? draftStates : selectedStates;

  const handleBack = () => {
    cancelAtomicEdit();
    navigate('/state');
  };

  const handleNext = () => {
    // Reconcile draft cities based on the current draft states before proceeding to Step 2
    reconcileDraftCitiesOnNext(currentStates);
    navigate('/edit/select-city');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col pt-[50px] relative overflow-hidden select-none">
      {/* Toast Alert: Centered vertically and horizontally */}
      <AnimatePresence>
        {alertMessage && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-[#18253B] text-white text-[13px] px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <span>⚠️</span>
              <span className="font-medium">{alertMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={handleBack} ariaLabel="रद्द करें और वापस जाएं" />
          <h1 className="text-[22px] font-bold text-[#18253B] tracking-tight">
            राज्य चुनें
          </h1>
        </div>

        <span className="text-[13px] font-medium text-[#18253B]/70 bg-[#18253B]/5 px-2.5 py-1 rounded-full">
          {currentStates.length}/3 चुने गए
        </span>
      </div>

      {/* Subtitle */}
      <div className="px-6 pt-3 pb-1 shrink-0">
        <p className="text-[13px] font-normal text-[#6B7280] leading-[1.4]">
          अपना पसंदीदा राज्य चुनें ताकि हम आपको बेहतर स्थानीय खबरें दिखा सकें (अधिकतम 3)
        </p>
      </div>

      {/* 2-Column State Grid */}
      <div className="px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-5 flex-1 overflow-y-auto pb-28 scrollbar-none">
        {STATES_DATA.map((state) => {
          const selectedObj = currentStates.find((s) => s.id === state.id);
          const isSelected = Boolean(selectedObj);
          const priority = selectedObj ? selectedObj.priority : null;

          return (
            <StateCard
              key={state.id}
              state={state}
              isSelected={isSelected}
              priority={priority}
              onClick={() => toggleDraftState(state)}
            />
          );
        })}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-6 z-20">
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-[56px] rounded-[16px] bg-[#18253B] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#1f304d] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
