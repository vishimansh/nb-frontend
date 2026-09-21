import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Location, Edit } from 'iconsax-react';
import { useCity } from '../../context/CityContext';

/**
 * 2-Tier Hyperlocal City Filter Header
 * Styled exactly matching the Figma design:
 * - Tier 1: Saved city chips (no horizontal scroll, clicking active city navigates to city selection) + trailing "✎ आपके इलाके चुनें"
 * - Tier 2: Locality chips (solid navy active pill, clean bordered inactive pills)
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

  // Find zone details (name) for active localities
  const allZonesForCity = [
    ...(currentCityData?.urbanZones || []),
    ...(currentCityData?.ruralZones || []),
  ];

  const zoneMap = new Map(allZonesForCity.map((z) => [z.id, z.name]));

  return (
    <div className="w-full flex flex-col bg-transparent shrink-0 select-none z-30">
      {/* Tier 1: User's Saved City Chip Row (No horizontal scroll, only city chips + "आपके इलाके चुनें") */}
      <div className="w-full px-3 pt-2.5 pb-2 bg-transparent flex items-center justify-between gap-1.5 overflow-hidden">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
          {savedCities.map((city) => {
            const isActive = activeCityId === city.id;

            if (isActive) {
              return (
                <button
                  key={city.id}
                  type="button"
                  className="bg-[#2B2437] text-white border border-[#2B2437] rounded-full h-[34px] px-4 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                  onClick={handleCityPickerClick}
                  title={`${city.name} - शहर बदलें या चुनें`}
                >
                  <Location size={14} color="#FFFFFF" variant="Bold" className="shrink-0" />
                  <span className="text-[13px] font-medium text-white leading-none whitespace-nowrap">
                    {city.name}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveCityId(city.id)}
                className="bg-transparent border border-[#9CA3AF] rounded-full h-[34px] px-4 flex items-center justify-center cursor-pointer hover:border-[#2B2437] shrink-0 transition-all active:scale-95"
              >
                <span className="text-[13px] font-medium text-[#2B2437] leading-none whitespace-nowrap">
                  {city.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Trailing Action Chip: "✎ आपके इलाके चुनें" */}
        <button
          type="button"
          onClick={handleLocalityPickerClick}
          className="bg-transparent border border-[#9CA3AF] text-[#2B2437] rounded-full h-[34px] px-4 flex items-center gap-1.5 text-[13px] font-medium shrink-0 cursor-pointer hover:border-[#2B2437] active:scale-95 transition-all ml-1"
        >
          <Edit size={13} color="#2B2437" variant="Linear" className="shrink-0" />
          <span className="leading-none whitespace-nowrap">आपके इलाके चुनें</span>
        </button>
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
