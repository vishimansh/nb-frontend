import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchNormal1, TickCircle } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useCity } from '../context/CityContext';
import { useOnboarding } from '../context/OnboardingContext';
import { CITIES_BY_STATE, STATES_DATA, CITY_NAME_TO_ID } from '../data/onboardingData';

export default function CitySelectionPage() {
  const navigate = useNavigate();
  const { updateSavedCities } = useCity();
  const {
    selectedStates,
    selectedCities,
    toggleCity,
    alertMessage,
    showAlert,
  } = useOnboarding();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpand = (stateId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [stateId]: !prev[stateId],
    }));
  };

  // Logic matching Onboarding flow exactly:
  // - If single state was selected: max 3 cities from that state
  // - If multi-state was selected: max 1 city per state (max 3 states => max 3 cities)
  const displayStateIds =
    selectedStates.length > 0
      ? selectedStates.map((s) => s.id)
      : STATES_DATA.map((s) => s.id);

  const isSingleStateMode = displayStateIds.length === 1;

  const handleSave = () => {
    if (selectedCities.length === 0) {
      showAlert('कृपया कम से कम एक शहर चुनें');
      return;
    }

    const newSavedCities = selectedCities.map((c) => {
      const cityId = CITY_NAME_TO_ID[c.city] || c.city.toLowerCase().replace(/\s+/g, '_');
      const stateData = CITIES_BY_STATE[c.stateId];
      return {
        id: cityId,
        name: c.city,
        state: stateData?.stateName || 'मध्य प्रदेश',
      };
    });

    updateSavedCities(newSavedCities);
    navigate('/city');
  };

  const handleBack = () => {
    navigate('/city');
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
              <span>ℹ️</span>
              <span className="font-medium">{alertMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <h1 className="text-[22px] font-bold text-[#2B2437] tracking-tight">
            शहर चुनें
          </h1>
        </div>

        {/* Selected Cities Counter Pill */}
        <span className="text-[13px] font-medium text-[#2B2437]/70 bg-[#2B2437]/5 px-2.5 py-1 rounded-full">
          {selectedCities.length} शहर चुने गए
        </span>
      </div>

      {/* Dynamic Subtitle reflecting exact Onboarding Rules */}
      <div className="px-6 pt-3 pb-2 shrink-0">
        <p className="text-[13px] font-normal text-[#6B7280] leading-[1.4] whitespace-pre-line">
          {isSingleStateMode
            ? "आप अपने राज्य से अधिकतम 3 शहर चुन सकते हैं"
            : "अपने चुने गए प्रत्येक राज्य से आप\nएक-एक शहर चुन सकते हैं"}
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

      {/* City Chip Sections: rendered strictly by displayStateIds */}
      <div className="px-6 py-2 flex-1 overflow-y-auto pb-32 scrollbar-none">
        {displayStateIds.map((stateId, idx) => {
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
                  const isSelected = selectedCities.some(
                    (c) => c.stateId === stateId && c.city === city
                  );
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(stateId, city, isSingleStateMode)}
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
                    const isSelected = selectedCities.some(
                      (c) => c.stateId === stateId && c.city === city
                    );
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleCity(stateId, city, isSingleStateMode)}
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
                    className="h-[42px] px-4 rounded-[14px] bg-[#E5E7EB] text-[#2B2437] text-[15px] font-medium cursor-pointer active:scale-95 hover:bg-gray-300 transition-all"
                  >
                    कम -
                  </button>
                )}
              </div>

              {/* Section Divider */}
              {idx < displayStateIds.length - 1 && (
                <div className="border-b border-[#E5E7EB] mt-5 mb-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom CTA: Commit Point */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-6 z-20">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#3D334E] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
