import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StateCard from '../../components/onboarding/StateCard';
import { STATES_DATA } from '../../data/onboardingData';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Screen 5: State Selection Screen
 * Exact styling: 22px bold header, 13px subtext, 2-col grid with gap-x-4 gap-y-5,
 * 56px rounded-[16px] CTA button, and 3-state limit floating toast.
 */
export default function StateSelectionScreen() {
  const navigate = useNavigate();
  const { selectedStates, toggleState, alertMessage, showAlert, setSelectedStates } = useOnboarding();

  const handleSave = () => {
    if (selectedStates.length === 0) {
      if (showAlert) showAlert('कृपया कम से कम एक राज्य चुनें या स्किप करें');
      return;
    }
    navigate('/onboarding/select-city');
  };

  const handleSkip = () => {
    if (selectedStates.length === 0 && setSelectedStates) {
      setSelectedStates([{ id: 'mp', name: 'मध्य प्रदेश', priority: 1, landmark: 'सांची स्तूप' }]);
    }
    navigate('/onboarding/select-city');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col pt-[64px] relative overflow-hidden select-none">
      {/* Toast Alert for Max 3 States: Centered vertically and horizontally */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-[#2B2437] text-white text-[13px] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <span>⚠️</span>
              <span className="font-medium">{alertMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm z-10 flex-shrink-0">
        <h1 className="text-[22px] font-bold text-[#2B2437] tracking-tight">
          राज्य चुनें
        </h1>
        <button
          onClick={handleSkip}
          className="text-[15px] font-semibold text-[#2B2437] cursor-pointer hover:opacity-75 transition-opacity"
        >
          स्किप
        </button>
      </div>

      {/* Subtitle: 13px, Regular 400, #6B7280, leading-[1.4] */}
      <div className="px-6 pt-3 pb-1 flex-shrink-0">
        <p className="text-[13px] font-normal text-[#6B7280] leading-[1.4] whitespace-pre-line">
          {"अपना पसंदीदा राज्य चुनें ताकि हम आपको बेहतर\nस्थानीय खबरें दिखा सकें"}
        </p>
      </div>

      {/* 2-Column State Grid: px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-5 */}
      <div className="px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-5 flex-1 overflow-y-auto pb-28 scrollbar-none">
        {STATES_DATA.map((state) => {
          const selectedObj = selectedStates.find((s) => s.id === state.id);
          const isSelected = Boolean(selectedObj);
          const priority = selectedObj ? selectedObj.priority : null;

          return (
            <StateCard
              key={state.id}
              state={state}
              isSelected={isSelected}
              priority={priority}
              onClick={() => toggleState(state)}
            />
          );
        })}
      </div>

      {/* Sticky Bottom CTA: matching notifications permission button dimensions */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-6 z-20">
        <button
          onClick={handleSave}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#3D334E] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
