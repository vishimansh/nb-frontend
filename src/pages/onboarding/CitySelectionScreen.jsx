import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchNormal1, TickCircle } from 'iconsax-react';
import BackButton from '../../components/common/BackButton';
import { useOnboarding } from '../../context/OnboardingContext';
import { useCity } from '../../context/CityContext';
import { CITIES_BY_STATE, STATES_DATA } from '../../data/onboardingData';

const CITY_NAME_TO_ID = {
  'भोपाल': 'bhopal',
  'जयपुर': 'jaipur',
  'नागपुर': 'nagpur',
  'इंदौर': 'indore',
  'ग्वालियर': 'gwalior',
  'जबलपुर': 'jabalpur',
  'उज्जैन': 'ujjain',
  'सतना': 'satna',
  'सागर': 'sagar',
  'रीवा': 'rewa',
  'छिंदवाड़ा': 'chhindwara',
  'रतलाम': 'ratlam',
  'खंडवा': 'khandwa',
  'जोधपुर': 'jodhpur',
  'कोटा': 'kota',
  'अजमेर': 'ajmer',
  'उदयपुर': 'udaipur',
  'बीकानेर': 'bikaner',
  'भीलवाड़ा': 'bhilwara',
  'अलवर': 'alwar',
  'सीकर': 'sikar',
  'मुंबई': 'mumbai',
  'पुणे': 'pune',
  'नाशिक': 'nashik',
  'ठाणे': 'thane',
  'औरंगाबाद': 'aurangabad',
  'कोल्हापुर': 'kolhapur',
  'अहमदाबाद': 'ahmedabad',
  'सूरत': 'surat',
  'वडोदरा': 'vadodara',
  'राजकोट': 'rajkot',
  'भावनगर': 'bhavnagar',
  'जामनगर': 'jamnagar',
  'गांधीनगर': 'gandhinagar',
  'रायपुर': 'raipur',
  'बिलासपुर': 'bilaspur',
  'दुर्ग': 'durg',
  'भिलाई': 'bhilai',
  'जगदलपुर': 'jagdalpur',
  'कोरबा': 'korba',
  'रायगढ़': 'raigarh',
};

/**
 * Screen 6: City Selection Screen
 * Exact styling: h-[50px] rounded-[14px] search, h-[42px] rounded-[14px] chips,
 * warm golden-amber #F7C873 expand chip with dark navy #1E213D text,
 * and 56px rounded-[16px] bottom CTA button.
 */
export default function CitySelectionScreen() {
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

  const displayStateIds =
    selectedStates.length > 0
      ? selectedStates.map((s) => s.id)
      : STATES_DATA.map((s) => s.id);

  const isSingleStateMode = displayStateIds.length === 1;

  const handleSave = () => {
    const newSavedCities = selectedCities.map((c) => {
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
    navigate('/feed');
  };

  const handleSkip = () => {
    navigate('/feed');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col pt-[64px] relative overflow-hidden select-none">
      {/* Toast Alert */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E213D] text-white text-[12px] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/10"
          >
            <span>ℹ️</span>
            <span className="font-medium">{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate('/onboarding/select-state')} ariaLabel="पीछे जाएं" />
          <h1 className="text-[22px] font-bold text-[#1E213D] tracking-tight">
            शहर चुनें
          </h1>
        </div>

        <button
          onClick={handleSkip}
          className="text-[15px] font-semibold text-[#1E213D] cursor-pointer hover:opacity-75 transition-opacity"
        >
          स्किप
        </button>
      </div>

      {/* Dynamic Subtitle: 13px, Regular 400, #6B7280, leading-[1.4] */}
      <div className="px-6 pt-3 pb-2 flex-shrink-0">
        <p className="text-[13px] font-normal text-[#6B7280] leading-[1.4] whitespace-pre-line">
          {isSingleStateMode
            ? "आप अपने राज्य से अधिकतम 3 शहर चुन सकते हैं"
            : "अपने चुने गए प्रत्येक राज्य से आप\nएक-एक शहर चुन सकते हैं"}
        </p>
      </div>

      {/* Search Input Field: h-[50px] rounded-[14px] border-[#B0B7C3] */}
      <div className="px-6 py-2 flex-shrink-0">
        <div className="h-[50px] bg-white rounded-[14px] border border-[#B0B7C3] flex items-center px-4 focus-within:border-[#1E213D] focus-within:ring-2 focus-within:ring-[#1E213D]/10 transition-all shadow-2xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="अपना शहर खोजें"
            className="text-[15px] font-normal text-[#1E213D] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 tracking-wide"
          />
          <SearchNormal1 size={20} color="#1E213D" className="w-5 h-5 flex-shrink-0" variant="Linear" />
        </div>
      </div>

      {/* City Chip Sections: max-h-[540px] pb-32 */}
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
              {/* State Header: text-[16px] font-bold text-[#1E213D] mt-4 mb-3 */}
              <h2 className="text-[16px] font-bold text-[#1E213D] mt-4 mb-3 tracking-tight">
                {stateData.stateName}
              </h2>

              {/* Chips Container: flex flex-wrap gap-2.5 items-center */}
              <div className="flex flex-wrap gap-2.5 items-center">
                {/* Primary Cities */}
                {primaryList.map((city) => {
                  const isSelected = selectedCities.some(
                    (c) => c.stateId === stateId && c.city === city
                  );
                  return (
                    <button
                      key={city}
                      onClick={() => toggleCity(stateId, city, isSingleStateMode)}
                      className={`px-4 py-2 rounded-[16px] text-[18px] font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1E213D] text-white border border-[#1E213D] shadow-sm'
                          : 'bg-white text-[#1E213D] border border-[#B0B7C3] hover:border-[#1E213D]'
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
                        onClick={() => toggleCity(stateId, city, isSingleStateMode)}
                        className={`px-4 py-2 rounded-[16px] text-[18px] font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#1E213D] text-white border border-[#1E213D] shadow-sm'
                            : 'bg-white text-[#1E213D] border border-[#B0B7C3] hover:border-[#1E213D]'
                        }`}
                      >
                        {isSelected && <TickCircle size={18} color="#FFFFFF" variant="Bold" />}
                        <span>{city}</span>
                      </button>
                    );
                  })}

                {/* Expand Chip ("और +"): px-4 py-2 rounded-[16px] bg-[#F7C873] text-[#1E213D] */}
                {!showAll && stateData.expanded.length > 0 && !query && (
                  <button
                    onClick={() => toggleExpand(stateId)}
                    className="px-4 py-2 rounded-[16px] bg-[#F7C873] text-[#1E213D] text-[18px] font-semibold cursor-pointer shadow-xs active:scale-95 hover:brightness-95 transition-all flex items-center gap-1"
                  >
                    <span>और +</span>
                  </button>
                )}

                {/* Collapse button when manually expanded */}
                {isExpanded && !query && (
                  <button
                    onClick={() => toggleExpand(stateId)}
                    className="px-4 py-2 rounded-[16px] bg-[#E5E7EB] text-[#1E213D] text-[18px] font-semibold cursor-pointer active:scale-95 hover:bg-gray-300 transition-all flex items-center gap-1"
                  >
                    <span>कम -</span>
                  </button>
                )}
              </div>

              {/* Section Divider: border-b border-[#E5E7EB] mt-5 mb-2 */}
              {idx < displayStateIds.length - 1 && (
                <div className="border-b border-[#E5E7EB] mt-5 mb-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom CTA: matching notifications permission button dimensions */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#F7F7F4] via-[#F7F7F4]/95 to-transparent pt-4 pb-8 px-6 z-20">
        <button
          onClick={handleSave}
          className="w-full h-[56px] rounded-[16px] bg-[#1E213D] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#1f304d] transition-colors"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
