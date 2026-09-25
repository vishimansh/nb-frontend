import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, Edit, ArrowDown2, Add } from 'iconsax-react';
import { useCity } from '../../context/CityContext';

/**
 * 2-Tier Hyperlocal City Filter Header
 * Refined city showing logic:
 * - Active city is ALWAYS prioritized in the primary row with bold navy styling.
 * - Max 2 cities shown in the primary row + a sleek '+N और' badge toggle.
 * - Expanding '+N और' unfolds a dedicated, beautifully styled secondary tray with remaining cities and a '+ और जोड़ें' link.
 * - Selecting an extra city immediately makes it active and moves it to the primary bar.
 */
export default function CityFilterHeader({ onOpenLocalityPicker, onOpenCityPicker }) {
  const navigate = useNavigate();
  const {
    savedCities,
    activeCityId,
    setActiveCityId,
    activeZone,
    setZoneFilter,
    activeLocalities,
    currentCityData,
  } = useCity();

  // The first city in selection order (savedCities[0]) is ALWAYS permanently the first chip!
  const { primaryCities, extraCities } = useMemo(() => {
    if (!savedCities || savedCities.length <= 2) {
      return { primaryCities: savedCities || [], extraCities: [] };
    }

    const firstPermanentCity = savedCities[0];
    const otherSavedCities = savedCities.slice(1);

    // If active city is the permanent first city, or already the 2nd city in order:
    if (activeCityId === firstPermanentCity.id || activeCityId === otherSavedCities[0]?.id) {
      return {
        primaryCities: [firstPermanentCity, otherSavedCities[0]],
        extraCities: otherSavedCities.slice(1),
      };
    }

    // If active city is in extra cities (index >= 2):
    // Position 0 stays firstPermanentCity permanently!
    // Position 1 displays the active city so both are visible in the primary bar.
    const activeCity = otherSavedCities.find((c) => c.id === activeCityId);
    const remainingExtras = otherSavedCities.filter((c) => c.id !== activeCityId);

    return {
      primaryCities: [firstPermanentCity, activeCity || otherSavedCities[0]],
      extraCities: remainingExtras,
    };
  }, [savedCities, activeCityId]);

  const [isExpandedCities, setIsExpandedCities] = useState(false);

  const handleCityPickerClick = () => {
    if (onOpenCityPicker) {
      onOpenCityPicker();
    } else {
      navigate('/city/select');
    }
  };

  const handleLocalityPickerClick = () => {
    if (onOpenLocalityPicker) {
      onOpenLocalityPicker();
    } else {
      navigate('/city/localities');
    }
  };

  const handleSelectCity = (cityId) => {
    setActiveCityId(cityId);
  };

  // Find zone details (name) for active localities
  const allZonesForCity = [
    ...(currentCityData?.urbanZones || []),
    ...(currentCityData?.ruralZones || []),
  ];

  const zoneMap = new Map(allZonesForCity.map((z) => [z.id, z.name]));

  const renderCityChip = (city) => {
    const isActive = activeCityId === city.id;

    if (isActive) {
      return (
        <button
          key={city.id}
          type="button"
          className="bg-[#2B2437] text-white border border-[#2B2437] rounded-full h-[32px] px-3.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
          onClick={handleCityPickerClick}
          title={`${city.name} - शहर बदलें या चुनें`}
        >
          <Location size={13} color="#FFFFFF" variant="Bold" className="shrink-0" />
          <span className="text-[13px] font-semibold text-white leading-none whitespace-nowrap">
            {city.name}
          </span>
        </button>
      );
    }

    return (
      <button
        key={city.id}
        type="button"
        onClick={() => handleSelectCity(city.id)}
        className="bg-white border border-[#D1D5DB] rounded-full h-[32px] px-3 flex items-center justify-center cursor-pointer hover:border-[#2B2437] shrink-0 transition-all active:scale-95 shadow-2xs"
      >
        <span className="text-[13px] font-medium text-[#2B2437] leading-none whitespace-nowrap">
          {city.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col bg-transparent shrink-0 select-none z-30">
      {/* Tier 1: User's Saved City Chip Row */}
      <div className="w-full px-3 pt-2 pb-1.5 bg-transparent flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            {primaryCities.map((city) => renderCityChip(city))}

            {/* +N और button when more than 2 cities exist */}
            {extraCities.length > 0 && (
              <button
                type="button"
                onClick={() => setIsExpandedCities((prev) => !prev)}
                aria-label={`${extraCities.length} और शहर देखें`}
                className={`rounded-full h-[32px] px-2.5 flex items-center gap-1 cursor-pointer shrink-0 transition-all active:scale-95 select-none ${
                  isExpandedCities
                    ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                    : 'bg-[#FFF6ED] text-[#C05621] border border-[#FDBA74] hover:bg-[#FFEDD5]'
                }`}
              >
                <span className="text-[12px] font-bold leading-none">
                  +{extraCities.length}
                </span>
                <span className="text-[12px] font-medium leading-none">
                  और
                </span>
                <ArrowDown2
                  size={12}
                  variant="Bold"
                  className={`transition-transform duration-200 ${
                    isExpandedCities ? 'rotate-180 text-white' : 'text-[#C05621]'
                  }`}
                  color={isExpandedCities ? '#FFFFFF' : '#C05621'}
                />
              </button>
            )}
          </div>

          {/* Trailing Action Chip: "✎ आपके इलाके चुनें" */}
          <button
            type="button"
            onClick={handleLocalityPickerClick}
            className="bg-white border border-[#D1D5DB] text-[#2B2437] rounded-full h-[32px] px-3 flex items-center gap-1.5 text-[12.5px] font-medium shrink-0 cursor-pointer hover:border-[#2B2437] active:scale-95 transition-all shadow-2xs ml-auto"
          >
            <Edit size={13} color="#2B2437" variant="Linear" className="shrink-0" />
            <span className="leading-none whitespace-nowrap">आपके इलाके चुनें</span>
          </button>
        </div>

        {/* Refined Next Row: Expanded Additional Cities Tray */}
        <AnimatePresence>
          {isExpandedCities && extraCities.length > 0 && (
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
                    अन्य शहर:
                  </span>
                  {extraCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectCity(city.id)}
                      className="bg-white border border-[#D1D5DB] text-[#2B2437] hover:border-[#2B2437] rounded-full h-[28px] px-2.5 text-[12px] font-medium flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                    >
                      <span>{city.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCityPickerClick}
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

      {/* Tier 2: Zone / Locality Filter Strip */}
      <div className="w-full px-3 pb-2.5 pt-0.5 bg-transparent flex items-center gap-2 overflow-x-auto scrollbar-none">
        {/* Default First Chip: "सभी {शहर}" */}
        <button
          type="button"
          onClick={() => setZoneFilter(activeCityId, 'all')}
          className={`rounded-full h-[34px] px-4 text-[13px] font-medium flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            activeZone === 'all'
              ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
              : 'bg-transparent text-[#2B2437] border border-[#9CA3AF] hover:border-[#2B2437]'
          }`}
        >
          <span className="leading-none">सभी {currentCityData?.name || 'शहर'}</span>
        </button>

        {/* User's selected localities for this city */}
        {activeLocalities.map((zoneId) => {
          const zoneName = zoneMap.get(zoneId) || zoneId;
          const isSelected = activeZone === zoneId;

          return (
            <button
              key={zoneId}
              type="button"
              onClick={() => setZoneFilter(activeCityId, zoneId)}
              className={`rounded-full h-[34px] px-4 text-[13px] font-medium flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-xs'
                  : 'bg-transparent text-[#2B2437] border border-[#9CA3AF] hover:border-[#2B2437]'
              }`}
            >
              <span className="leading-none">{zoneName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
