import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TickCircle } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import { useCity } from '../context/CityContext';

/**
 * "इलाके चुनें" (Locality Picker) Screen
 * Recreated pixel-perfectly from Nava Bharat design specifications:
 * - Header with clean arrow & "इलाके चुनें — {cityName}"
 * - Subtitle: "अपनी पसंद के इलाके चुनें ताकि आपको वहां की खबरें प्राथमिकता से मिलें"
 * - Universal 2 groups with dividers: {cityName} शहर & {cityName} ग्रामीण
 * - Saffron/Amber fill bg-[#E39026] text-white with white checkmark for selected chips
 * - Sticky bottom navy "सेव करें" button
 */
export default function LocalityPickerPage() {
  const navigate = useNavigate();
  const {
    activeCityId,
    currentCityData,
    selectedLocalitiesByCity,
    updateLocalities,
  } = useCity();

  const initialLocalities = (selectedLocalitiesByCity && selectedLocalitiesByCity[activeCityId]) || [];
  const [selectedIds, setSelectedIds] = useState(initialLocalities);

  const cityName = currentCityData?.name || 'भोपाल';
  const urbanZones = currentCityData?.urbanZones || [];
  const ruralZones = currentCityData?.ruralZones || [];

  const handleToggle = (zoneId) => {
    setSelectedIds((prev) => {
      if (prev.includes(zoneId)) {
        return prev.filter((id) => id !== zoneId);
      } else {
        return [...prev, zoneId];
      }
    });
  };

  const handleSave = () => {
    if (updateLocalities) {
      updateLocalities(activeCityId, selectedIds);
    }
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-full bg-[#F7F7F8] flex flex-col justify-between select-none relative overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
        {/* Sticky Header with Status Bar Clearance */}
        <div className="sticky top-0 z-30 bg-[#F7F7F8]/95 backdrop-blur-md">
          {/* Status Bar Clearance */}
          <div className="h-[50px] w-full shrink-0 pointer-events-none" />

          {/* Navigation & Title Row */}
          <div className="px-4 pb-3 flex items-center gap-3 border-b border-[#E5E7EB]">
            <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />

            <h1 className="text-[20px] font-bold text-[#18253B] leading-none">
              इलाके चुनें — {cityName}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-[13px] text-[#6B7280] px-4 pt-3 pb-2 leading-relaxed">
            अपनी पसंद के इलाके चुनें ताकि आपको वहां की खबरें प्राथमिकता से मिलें
          </p>
        </div>

        {/* 2-Group Architecture */}
        <div className="w-full pb-8 pt-1">
          {/* Group 1: {cityName} शहर (Urban Localities) */}
          <div className="w-full">
            <h2 className="text-[15px] font-bold text-[#18253B] px-4 mt-4 mb-2.5">
              {cityName} शहर
            </h2>
            <div className="flex flex-wrap gap-2.5 px-4">
              {urbanZones.map((zone) => {
                const isSelected = selectedIds.includes(zone.id);

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleToggle(zone.id)}
                    className={`h-[40px] px-4 rounded-[14px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 select-none ${
                      isSelected
                        ? 'bg-[#E39026] text-white border border-[#E39026] shadow-sm'
                        : 'bg-white text-[#18253B] border border-[#D1D5DB] hover:border-[#18253B]'
                    }`}
                  >
                    {isSelected && <TickCircle size={14} color="#FFFFFF" variant="Bold" />}
                    <span>{zone.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider between Group 1 and Group 2 */}
          <div className="w-[calc(100%-32px)] mx-4 h-[1px] bg-[#E5E7EB] my-5" />

          {/* Group 2: {cityName} ग्रामीण (Rural Localities) */}
          <div className="w-full">
            <h2 className="text-[15px] font-bold text-[#18253B] px-4 mb-2.5">
              {cityName} ग्रामीण
            </h2>
            <div className="flex flex-wrap gap-2.5 px-4">
              {ruralZones.map((zone) => {
                const isSelected = selectedIds.includes(zone.id);

                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleToggle(zone.id)}
                    className={`h-[40px] px-4 rounded-[14px] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 select-none ${
                      isSelected
                        ? 'bg-[#E39026] text-white border border-[#E39026] shadow-sm'
                        : 'bg-white text-[#18253B] border border-[#D1D5DB] hover:border-[#18253B]'
                    }`}
                  >
                    {isSelected && <TickCircle size={14} color="#FFFFFF" variant="Bold" />}
                    <span>{zone.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider below Group 2 */}
          <div className="w-[calc(100%-32px)] mx-4 h-[1px] bg-[#E5E7EB] my-5" />
        </div>
      </div>

      {/* Sticky Bottom Save Action */}
      <div className="w-full p-4 bg-[#F7F7F8] shrink-0 z-30">
        <button
          type="button"
          onClick={handleSave}
          className="h-[56px] w-full rounded-[16px] bg-[#18253B] text-white font-medium text-[20px] shadow-md active:scale-[0.99] hover:bg-[#22334D] transition-all flex items-center justify-center cursor-pointer"
        >
          सेव करें
        </button>
      </div>
    </div>
  );
}
