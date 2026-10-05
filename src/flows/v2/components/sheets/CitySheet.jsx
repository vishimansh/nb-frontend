import React, { useState, useMemo } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { REGIONS, getCitiesByState, CITIES } from '../../data/cities';
import { formatIN } from '../../utils/formatIN';
import { STRINGS } from '../../strings/hi';
import { Search, ChevronDown, Check } from 'lucide-react';

export default function CitySheet({
  isOpen,
  onClose,
  selectedCityIds = [],
  onSaveSelection,
  onToggleCity = null,
  singleSelect = false,
  onSelectSingleCity = null,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedCityIds);
  const [openStates, setOpenStates] = useState({ 'मध्य प्रदेश': true });

  // Reset temp selection when sheet opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedCityIds);
      setSearchQuery('');
    }
  }, [isOpen, selectedCityIds]);

  const toggleCity = (cityId) => {
    if (singleSelect) {
      if (onSelectSingleCity) onSelectSingleCity(cityId);
      onClose();
      return;
    }

    setTempSelected((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );

    if (onToggleCity) {
      onToggleCity(cityId);
    }
  };

  const toggleState = (stateName) => {
    const stateCities = getCitiesByState(stateName);
    const allSelected = stateCities.every((c) => tempSelected.includes(c.id));

    if (allSelected) {
      // Deselect all in this state
      const stateCityIds = new Set(stateCities.map((c) => c.id));
      setTempSelected((prev) => prev.filter((id) => !stateCityIds.has(id)));
    } else {
      // Select all in this state
      const next = new Set(tempSelected);
      stateCities.forEach((c) => next.add(c.id));
      setTempSelected(Array.from(next));
    }
  };

  const toggleAccordion = (stateName) => {
    setOpenStates((prev) => ({
      ...prev,
      [stateName]: !prev[stateName],
    }));
  };

  // Filtered cities based on search
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.trim().toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleDone = () => {
    if (onSaveSelection) onSaveSelection(tempSelected);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={singleSelect ? 'अपना शहर चुनें' : 'शहर या राज्य जोड़ें'}
      footer={
        !singleSelect && (
          <Button onClick={handleDone}>
            {STRINGS.citySheet.doneBtn(tempSelected.length)}
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-4 py-1">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#A6A4A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={STRINGS.citySheet.searchPlaceholder}
            className="w-full h-[46px] rounded-xl pl-10 pr-4 bg-[#F7F7F4] border border-[#E5E7EB] text-[14.5px] text-[#2B2437] outline-none focus:border-[#2B2437] focus:bg-white transition-all"
          />
        </div>

        {/* If search query active, show flat list */}
        {filteredCities ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredCities.map((city) => {
              const isSelected = tempSelected.includes(city.id);
              return (
                <div
                  key={city.id}
                  onClick={() => toggleCity(city.id)}
                  className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-[#2B2437] text-white border-[#2B2437]'
                      : 'bg-white text-[#2B2437] border-[#E5E7EB] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] leading-tight">{city.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E39026] stroke-[3]" />}
                  </div>
                  <span className={`text-[11.5px] ${isSelected ? 'text-white/80' : 'text-[#6B7280]'}`}>
                    {city.state} · {formatIN(city.readers)} पाठक
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          /* Accordion by all 9 regions */
          <div className="flex flex-col gap-2.5">
            {REGIONS.map((stateName) => {
              const stateCities = getCitiesByState(stateName);
              const isAllStateSelected =
                stateCities.length > 0 &&
                stateCities.every((c) => tempSelected.includes(c.id));
              const isOpenState = !!openStates[stateName];

              return (
                <div
                  key={stateName}
                  className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
                >
                  {/* State Header Bar */}
                  <div className="p-3.5 flex items-center justify-between bg-[#F8F8F4]/80">
                    <div
                      className="flex items-center gap-2 cursor-pointer flex-1"
                      onClick={() => toggleAccordion(stateName)}
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-[#4A4358] transition-transform duration-200 ${
                          isOpenState ? 'rotate-180' : ''
                        }`}
                      />
                      <span className="font-bold text-[15px] text-[#2B2437]">
                        {stateName}
                      </span>
                    </div>

                    {!singleSelect && (
                      <button
                        type="button"
                        onClick={() => toggleState(stateName)}
                        className={`text-[12.5px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isAllStateSelected
                            ? 'bg-[#2B2437] text-white'
                            : 'text-[#E39026] hover:bg-amber-50'
                        }`}
                      >
                        {STRINGS.citySheet.selectAllState(stateName)}
                      </button>
                    )}
                  </div>

                  {/* Cities Grid inside State */}
                  {isOpenState && (
                    <div className="p-3 grid grid-cols-2 gap-2 border-t border-[#E5E7EB]">
                      {stateCities.map((city) => {
                        const isSelected = tempSelected.includes(city.id);
                        return (
                          <div
                            key={city.id}
                            onClick={() => toggleCity(city.id)}
                            className={`p-2.5 rounded-xl border flex flex-col gap-0.5 cursor-pointer select-none transition-all ${
                              isSelected
                                ? 'bg-[#2B2437] text-white border-[#2B2437]'
                                : 'bg-[#F8F8F4] text-[#2B2437] border-[#E5E7EB] hover:bg-neutral-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[13.5px] leading-tight">
                                {city.name}
                              </span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#E39026] stroke-[3]" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] ${
                                isSelected ? 'text-white/80' : 'text-[#6B7280]'
                              }`}
                            >
                              {formatIN(city.readers)} पाठक
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
