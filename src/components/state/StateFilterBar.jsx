import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, Edit, ArrowDown2, Add } from 'iconsax-react';

/**
 * StateFilterBar Component
 * Matches CityFilterHeader logic:
 * - Position 0 is ALWAYS permanently the first state chosen (states[0]).
 * - Position 1 is the 2nd replaceable slot. If activeStateId is among extra states,
 *   it replaces position 1 so both the permanent state and the active state are visible in the primary bar.
 * - If user selected > 2 states: sleek '+N और' badge toggle appears.
 * - Expanding '+N और' unveils a secondary tray showing other states and a '+ और जोड़ें' button.
 * - Selecting any state from the tray sets it as active, swapping it into position 1.
 */
export default function StateFilterBar({
  states = [],
  activeStateId,
  onSelectState,
  onEditClick,
}) {
  const [isExpandedStates, setIsExpandedStates] = useState(false);

  // 1 Permanent + 2nd Replaceable slot logic matching CityFilterHeader
  const { primaryStates, extraStates } = useMemo(() => {
    if (!states || states.length <= 2) {
      return { primaryStates: states || [], extraStates: [] };
    }

    const firstPermanentState = states[0];
    const otherStates = states.slice(1);

    // If active state is the permanent first state, or already the 2nd state in order:
    if (activeStateId === firstPermanentState.id || activeStateId === otherStates[0]?.id) {
      return {
        primaryStates: [firstPermanentState, otherStates[0]],
        extraStates: otherStates.slice(1),
      };
    }

    // If active state is in extra states (index >= 2):
    // Position 0 stays firstPermanentState permanently!
    // Position 1 displays the active state so both are visible in the primary bar.
    const activeState = otherStates.find((s) => s.id === activeStateId);
    const remainingExtras = otherStates.filter((s) => s.id !== activeStateId);

    return {
      primaryStates: [firstPermanentState, activeState || otherStates[0]],
      extraStates: remainingExtras,
    };
  }, [states, activeStateId]);

  const handleSelectState = (id) => {
    if (onSelectState) {
      onSelectState(id);
    }
  };

  const renderStateChip = (st) => {
    const isActive = activeStateId === st.id;

    if (isActive) {
      return (
        <button
          key={st.id}
          type="button"
          onClick={onEditClick}
          className="bg-[#2B2437] text-white border border-[#2B2437] rounded-full h-[32px] px-3.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
          title={`${st.name} - राज्य बदलें या चुनें`}
        >
          <Location size={13} color="#FFFFFF" variant="Bold" className="shrink-0" />
          <span className="text-[13px] font-semibold text-white leading-none whitespace-nowrap">
            {st.name}
          </span>
        </button>
      );
    }

    return (
      <button
        key={st.id}
        type="button"
        onClick={() => handleSelectState(st.id)}
        className="bg-white border border-[#D1D5DB] rounded-full h-[32px] px-3 flex items-center justify-center cursor-pointer hover:border-[#2B2437] shrink-0 transition-all active:scale-95 shadow-2xs"
      >
        <span className="text-[13px] font-medium text-[#2B2437] leading-none whitespace-nowrap">
          {st.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col bg-transparent shrink-0 select-none z-30">
      {/* Primary State Chip Row */}
      <div className="w-full px-3 pt-2 pb-1.5 bg-transparent flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {primaryStates.map((st) => renderStateChip(st))}

            {/* +N और button when more than 2 states exist */}
            {extraStates.length > 0 && (
              <button
                type="button"
                onClick={() => setIsExpandedStates((prev) => !prev)}
                aria-label={`${extraStates.length} और राज्य देखें`}
                className={`rounded-full h-[32px] px-2.5 flex items-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95 select-none ${
                  isExpandedStates
                    ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                    : 'bg-[#FFF6ED] text-[#C05621] border border-[#FDBA74] hover:bg-[#FFEDD5]'
                }`}
              >
                <span className="text-[12px] font-bold leading-none">
                  +{extraStates.length}
                </span>
                <span className="text-[12px] font-medium leading-none">
                  और
                </span>
                <ArrowDown2
                  size={12}
                  variant="Bold"
                  className={`transition-transform duration-200 ${
                    isExpandedStates ? 'rotate-180 text-white' : 'text-[#C05621]'
                  }`}
                  color={isExpandedStates ? '#FFFFFF' : '#C05621'}
                />
              </button>
            )}
          </div>

          {/* Trailing Action Chip: "✎ अपने राज्य चुनें" */}
          <button
            type="button"
            onClick={onEditClick}
            className="bg-white border border-[#D1D5DB] text-[#2B2437] rounded-full h-[32px] px-3 flex items-center gap-1.5 text-[12.5px] font-medium shrink-0 cursor-pointer hover:border-[#2B2437] active:scale-95 transition-all shadow-2xs ml-auto"
          >
            <Edit size={13} color="#2B2437" variant="Linear" className="shrink-0" />
            <span className="leading-none whitespace-nowrap">अपने राज्य चुनें</span>
          </button>
        </div>

        {/* Expanded Additional States Tray */}
        <AnimatePresence>
          {isExpandedStates && extraStates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-2 bg-[#EDECE8] border border-[#D1D5DB]/80 rounded-[14px] flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-[#6B7280] pl-1 select-none">
                    अन्य राज्य:
                  </span>
                  {extraStates.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleSelectState(st.id)}
                      className="bg-white border border-[#D1D5DB] text-[#2B2437] hover:border-[#2B2437] rounded-full h-[28px] px-2.5 text-[12px] font-medium flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      <span>{st.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onEditClick}
                  className="text-[11.5px] font-semibold text-[#C05621] hover:underline shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 cursor-pointer whitespace-nowrap"
                >
                  <Add size={12} color="#C05621" variant="Bold" />
                  <span>और जोड़ें</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
