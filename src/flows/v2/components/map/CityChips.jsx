import React from 'react';
import Chip from '../ui/Chip';
import { Plus } from 'lucide-react';
import { getCityById } from '../../data/cities';

export default function CityChips({
  homeCityId,
  selectedCityIds = [],
  onRemoveCity,
  onOpenCitySheet,
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[12.5px] font-semibold text-[#6B7280]">
          कवर किए शहर
        </label>
        <span className="text-[11px] text-[#9CA3AF] font-medium">
          {selectedCityIds.length} शहर
        </span>
      </div>

      {/* Chips Flow Container */}
      <div className="flex flex-wrap items-center gap-1.5">
        {selectedCityIds.map((cityId) => {
          const city = getCityById(cityId);
          if (!city) return null;
          const isHome = cityId === homeCityId;

          return (
            <Chip
              key={cityId}
              label={city.name}
              selected
              size="sm"
              isLocked={isHome}
              onRemove={isHome ? null : () => onRemoveCity(cityId)}
            />
          );
        })}

        {/* Add more cities button */}
        <button
          type="button"
          onClick={onOpenCitySheet}
          className="h-[32px] px-2.5 rounded-full bg-white border border-dashed border-[#D1D5DB] text-[#4A4358] text-[12px] font-medium flex items-center gap-1 hover:border-[#2B2437] active:scale-[0.97] transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E39026]" />
          <span>+ शहर जोड़ें</span>
        </button>
      </div>
    </div>
  );
}
