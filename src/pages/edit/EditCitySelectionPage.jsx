import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchNormal1, TickCircle, InfoCircle } from 'iconsax-react';
import BackButton from '../../components/common/BackButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { useCity } from '../../context/CityContext';
import { CITIES_BY_STATE, CITY_NAME_TO_ID } from '../../data/onboardingData';

/**
 * Atomic Cascade Edit Flow - Step 2: Edit Cities (/edit/select-city)
 * Pre-fills with draftCities matching draftStates.
 * Back arrow returns to Step 1 without discarding the draft.
 * "सेव करें" is the Final Commit Point: commits drafts to global context and returns to State screen.
 */
export default function EditCitySelectionPage() {
  const navigate = useNavigate();
  const { updateSavedCities } = useCity();
  const {
    draftStates,
    draftCities,
    selectedStates,
    selectedCities,
    toggleDraftCity,
    commitAtomicEdit,
    alertMessage,
    showAlert,
  } = useOnboarding();

  const currentStates = draftStates !== null ? draftStates : selectedStates;
  const currentCities = draftCities !== null ? draftCities : selectedCities;

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpand = (stateId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateId]: !prev[stateId],
    }));
  };

  const isSingleStateMode = currentStates.length === 1;

  const handleBackToStep1 = () => {
    navigate('/edit/select-state');
  };

  const handleFinalSave = () => {
    // If states were chosen but zero cities selected, prompt user
    if (currentStates.length > 0 && currentCities.length === 0) {
      showAlert('कृपया कम से कम एक शहर चुनें');
      return;
    }

    // Prepare updated saved cities for CityContext
    const newSavedCities = currentCities.map((c) => {
      const cityId = CITY_NAME_TO_ID[c.city] || c.city.toLowerCase().replace(/\s+/g, '_');
      const stateData = CITIES_BY_STATE[c.stateId];
      return {
        id: cityId,
        name: c.city,
        state: stateData?.stateName || 'मध्य प्रदेश',
      };
    });

    if (newSavedCities.length > 0) {
      updateSavedCities(newSavedCities);
    }

    // Atomic commit to global context
    commitAtomicEdit();

    // Navigate directly back to State screen (origin of the edit)
    navigate('/state');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col pt-[50px] relative overflow-hidden select-none">
      {/* Toast Alert: Centered vertically and horizontally */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2B2437] text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <InfoCircle size={17} color="#F5B55C" variant="Bold" />
              <span className="font-medium">{alertMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={handleBackToStep1} ariaLabel="वापस राज्य चयन पर जाएं" />
          <h1 className="text-[22px] font-bold text-[#2B2437] tracking-tight">
            शहर चुनें
          </h1>
        </div>

        <span className="text-[13px] font-medium text-[#2B2437]/70 bg-[#2B2437]/5 px-2.5 py-1 rounded-full">
          {currentCities.length} शहर चुने गए
        </span>
      </div>

      {/* Subtitle */}
      <div className="px-6 pt-3 pb-2 shrink-0">
        <p className="text-[13px] font-normal text-[#6B7280] leading-[1.4]">
          अपने चुने गए राज्यों से अपने पसंदीदा शहर चुनें
        </p>
      </div>

      {/* Search Input Field */}
      <div className="px-6 py-2 shrink-0">
        <div className="h-[50px] bg-white rounded-[14px] border border-[#B0B7C3] flex items-center px-4 focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 transition-all shadow-2xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="अपना शहर खोजें"
            className="text-[15px] font-normal text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 tracking-wide"
          />
          <SearchNormal1 size={20} color="#2B2437" className="shrink-0" variant="Linear" />
        </div>
      </div>

      {/* City Chip Sections: strictly rendered by currentStates */}
      <div className="px-6 py-2 flex-1 overflow-y-auto pb-32 scrollbar-none">
        {currentStates.length === 0 ? (
          <div className="py-12 text-center text-[#6B7280] text-[14px]">
            कोई राज्य नहीं चुना गया है।
          </div>
        ) : (
          currentStates.map((stateObj, idx) => {
            const stateId = stateObj.id;
            const stateData = CITIES_BY_STATE[stateId];
            if (!stateData) return null;

            const isExpanded = Boolean(expandedStates[stateId]);
            const query = searchQuery.trim().toLowerCase();

            let primaryList = stateData.primary;
            let expandedList = stateData.expanded;
            if (query) {
              primaryList = primaryList.filter((c) => c.toLowerCase().includes(query));
              expandedList = expandedList.filter((c) => c.toLowerCase().includes(query));
            }

            const hasExpandedMatches = query && expandedList.length > 0;
            const showAll = isExpanded || hasExpandedMatches;

            if (query && primaryList.length === 0 && expandedList.length === 0) {
              return null;
            }

            return (
              <div key={stateId} className="mb-4">
                {/* State Header */}
                <h2 className="text-[16px] font-bold text-[#2B2437] mt-4 mb-3 tracking-tight">
                  {stateData.stateName}
                </h2>

                {/* Chips Container */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  {/* Primary Cities */}
                  {primaryList.map((city) => {
                    const isSelected = currentCities.some(
                      (c) => c.stateId === stateId && c.city === city
                    );
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleDraftCity(stateId, city)}
                        className={`px-4 py-2 rounded-[16px] text-[18px] font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-sm'
                            : 'bg-white text-[#2B2437] border border-[#B0B7C3] hover:border-[#2B2437]'
                        }`}
                      >
                        {isSelected && <TickCircle size={18} color="#FFFFFF" variant="Bold" />}
                        <span>{city}</span>
                      </button>
                    );
                  })}

                  {/* Expanded Cities */}
                  {showAll &&
                    expandedList.map((city) => {
                      const isSelected = currentCities.some(
                        (c) => c.stateId === stateId && c.city === city
                      );
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleDraftCity(stateId, city)}
                          className={`px-4 py-2 rounded-[16px] text-[18px] font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-sm'
                              : 'bg-white text-[#2B2437] border border-[#B0B7C3] hover:border-[#2B2437]'
                          }`}
                        >
                          {isSelected && <TickCircle size={18} color="#FFFFFF" variant="Bold" />}
                          <span>{city}</span>
                        </button>
                      );
                    })}

                  {/* Expand Chip ("और +") */}
                  {!showAll && stateData.expanded.length > 0 && !query && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(stateId)}
                      className="px-4 py-2 rounded-[16px] bg-[#F5B55C] text-[#2B2437] text-[18px] font-semibold cursor-pointer shadow-xs active:scale-95 hover:brightness-95 transition-all flex items-center gap-1"
                    >
                      <span>और +</span>
                    </button>
                  )}

                  {/* Collapse button when manually expanded */}
                  {isExpanded && !query && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(stateId)}
                      className="px-4 py-2 rounded-[16px] bg-[#E5E7EB] text-[#2B2437] text-[18px] font-semibold cursor-pointer active:scale-95 hover:bg-gray-300 transition-all flex items-center gap-1"
                    >
                      <span>कम -</span>
                    </button>
                  )}
                </div>

                {/* Section Divider */}
                {idx < currentStates.length - 1 && (
                  <div className="border-b border-[#E5E7EB] mt-5 mb-2" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sticky Bottom CTA: Commit Point */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-6 z-20">
        <button
          type="button"
          onClick={handleFinalSave}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#3D334E] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
