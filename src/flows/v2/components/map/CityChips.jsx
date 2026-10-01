import React from 'react';
import Chip from '../ui/Chip';
import { Plus } from 'lucide-react';
import { getCityById } from '../../data/cities';
import { STRINGS } from '../../strings/hi';

export default function CityChips({
  homeCityId,
  selectedCityIds = [],
  onRemoveCity,
  onOpenCitySheet,
}) {
  const isOnlyHomeCity = selectedCityIds.length === 1 && selectedCityIds[0] === homeCityId;

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-semibold text-[#2B2437]">
          {STRINGS.area.citiesVisibleLabel}
        </label>
        <span className="text-[12px] text-[#6B7280]">
          {selectedCityIds.length} शहर
        </span>
      </div>

      {/* Chips Flow Container */}
      <div className="flex flex-wrap items-center gap-2">
        {selectedCityIds.map((cityId) => {
          const city = getCityById(cityId);
          if (!city) return null;
          const isHome = cityId === homeCityId;

          return (
            <Chip
              key={cityId}
              label={city.name}
              selected
              isLocked={isHome}
              onRemove={isHome ? null : () => onRemoveCity(cityId)}
            />
          );
        })}

        {/* Add more cities button */}
        <button
          type="button"
          onClick={onOpenCitySheet}
          className="h-[40px] px-3.5 rounded-full bg-white border border-[#E5E7EB] text-[#2B2437] text-[13.5px] font-semibold flex items-center gap-1.5 hover:bg-neutral-50 active:scale-[0.97] transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E39026]" />
          <span>{STRINGS.area.addMoreCitiesBtn}</span>
        </button>
      </div>

      {/* Helper line if only home city is covered */}
      {isOnlyHomeCity && (
        <span className="text-[12.5px] text-[#6B7280]">
          {STRINGS.area.singleCityCovered}
        </span>
      )}
    </div>
  );
}
