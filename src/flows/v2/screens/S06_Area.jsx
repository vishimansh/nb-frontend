import React, { useState, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import ShopMap from '../components/map/ShopMap';
import CityChips from '../components/map/CityChips';
import CitySheet from '../components/sheets/CitySheet';
import RangeSlider from '../components/ui/RangeSlider';
import Accordion from '../components/ui/Accordion';
import Chip from '../components/ui/Chip';
import Badge from '../components/ui/Badge';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { resolveSelectedCities, getDistanceKm } from '../utils/geo';
import { areaReaders, reachRange } from '../utils/reach';
import { formatIN } from '../utils/formatIN';
import { CITIES, getCityById } from '../data/cities';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { Users, Info } from 'lucide-react';

const RADIUS_PRESETS = [5, 10, 15, 20, 25];
const ALL_AGES = ['18-27', '28-43', '44-59', '60+'];

export default function S06_Area({ onOpenFacilitator }) {
  const { state, updateDraft } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();

  const shop = state.shop || {};
  const draftArea = state.draft?.area || { radiusKm: 10, manualCityIds: [], excludedCityIds: [] };
  const draftAudience = state.draft?.audience || { gender: 'all', ages: ALL_AGES };

  const homeCityId = shop.cityId || 'indore';
  const homeCity = getCityById(homeCityId);
  const pin = shop.pin?.lat ? shop.pin : { lat: homeCity.lat, lng: homeCity.lng };

  const [radiusKm, setRadiusKm] = useState(draftArea.radiusKm || 10);
  const [manualCityIds, setManualCityIds] = useState(draftArea.manualCityIds || []);
  const [excludedCityIds, setExcludedCityIds] = useState(draftArea.excludedCityIds || []);

  const [gender, setGender] = useState(draftAudience.gender || 'all');
  const [selectedAges, setSelectedAges] = useState(draftAudience.ages || ALL_AGES);
  const [ageError, setAgeError] = useState(null);

  const [showCitySheet, setShowCitySheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  // Auto-detect cities within radius
  const autoCityIds = useMemo(() => {
    const list = [];
    for (const city of CITIES) {
      if (city.id === homeCityId) continue;
      const d = getDistanceKm(pin.lat, pin.lng, city.lat, city.lng);
      if (d <= radiusKm) {
        list.push(city.id);
      }
    }
    return list;
  }, [pin, radiusKm, homeCityId]);

  // Pure resolution of selected cities
  const selectedCityIds = useMemo(() => {
    return resolveSelectedCities(homeCityId, autoCityIds, manualCityIds, excludedCityIds);
  }, [homeCityId, autoCityIds, manualCityIds, excludedCityIds]);

  // Calculate reach numbers
  const currentAudience = useMemo(() => ({ gender, ages: selectedAges }), [gender, selectedAges]);
  const totalReadersCount = useMemo(() => {
    return areaReaders(selectedCityIds, currentAudience);
  }, [selectedCityIds, currentAudience]);

  const readersRange = useMemo(() => {
    return reachRange(totalReadersCount);
  }, [totalReadersCount]);

  // Check state count for wide area notice
  const selectedStatesCount = useMemo(() => {
    const stateSet = new Set();
    selectedCityIds.forEach((id) => {
      const c = getCityById(id);
      if (c?.state) stateSet.add(c.state);
    });
    return stateSet.size;
  }, [selectedCityIds]);

  const handleRadiusChange = (newRadius) => {
    setRadiusKm(newRadius);
    updateDraft('area.radiusKm', newRadius);
    track('radius_changed', { radiusKm: newRadius });
  };

  const handleRemoveCity = (cityId) => {
    // Add to excluded list and remove from manual
    const nextExcluded = [...excludedCityIds, cityId];
    const nextManual = manualCityIds.filter((id) => id !== cityId);
    setExcludedCityIds(nextExcluded);
    setManualCityIds(nextManual);
    updateDraft('area.excludedCityIds', nextExcluded);
    updateDraft('area.manualCityIds', nextManual);
    track('city_removed', { cityId });
  };

  const handleSaveCitySheetSelection = (newSelectedIds) => {
    // Determine manual additions
    const nextManual = Array.from(new Set([...manualCityIds, ...newSelectedIds]));
    // Remove any re-selected city from excluded list
    const nextExcluded = excludedCityIds.filter((id) => !newSelectedIds.includes(id));
    setManualCityIds(nextManual);
    setExcludedCityIds(nextExcluded);
    updateDraft('area.manualCityIds', nextManual);
    updateDraft('area.excludedCityIds', nextExcluded);
    track('city_added', { count: newSelectedIds.length });
  };

  const handleToggleAge = (ageKey) => {
    if (selectedAges.includes(ageKey)) {
      if (selectedAges.length === 1) {
        setAgeError(STRINGS.area.ageMinError);
        setTimeout(() => setAgeError(null), 1500);
        return;
      }
      const next = selectedAges.filter((a) => a !== ageKey);
      setSelectedAges(next);
      updateDraft('audience.ages', next);
    } else {
      const next = [...selectedAges, ageKey];
      setSelectedAges(next);
      updateDraft('audience.ages', next);
    }
    track('audience_changed');
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    updateDraft('audience.gender', newGender);
    track('audience_changed');
  };

  const audienceSummaryText = useMemo(() => {
    const genderText =
      gender === 'all'
        ? 'सभी पाठक'
        : gender === 'male'
        ? STRINGS.area.genderMale
        : STRINGS.area.genderFemale;
    const isAllAges = selectedAges.length === ALL_AGES.length;
    const ageText = isAllAges ? 'सभी उम्र' : selectedAges.join(', ');
    return `${genderText} · ${ageText}`;
  }, [gender, selectedAges]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={5}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center text-center gap-1 pt-1">
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs">
            <Users className="w-7 h-7 text-[#E39026]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#2B2437] tracking-tight mt-1">
            {STRINGS.area.title}
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            {STRINGS.area.subtitle}
          </p>
        </div>

        {/* 1. Procedural ShopMap */}
        <ShopMap
          pin={pin}
          shopName={shop.name || 'आपकी दुकान'}
          radiusKm={radiusKm}
        />

        {/* 2. Radius Slider Card */}
        <div className="p-4 rounded-[20px] bg-white border border-[#E5E7EB] nb2-card-shadow flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#2B2437]">
              {STRINGS.area.distanceTitle}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[13px] font-extrabold text-[#E39026]">
                {STRINGS.area.distanceValue(radiusKm)}
              </span>
              {radiusKm !== 10 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(10)}
                  className="text-[12px] text-[#6B7280] hover:text-[#2B2437] underline"
                >
                  {STRINGS.area.resetDistance}
                </button>
              )}
            </div>
          </div>

          {/* Range Slider 5 to 25 km, step 1 */}
          <RangeSlider
            min={5}
            max={25}
            step={1}
            value={radiusKm}
            onChange={handleRadiusChange}
            unit="किमी"
          />

          {/* Preset Chips */}
          <div className="flex items-center justify-between pt-1">
            {RADIUS_PRESETS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleRadiusChange(km)}
                className={`px-3 py-1 rounded-xl text-[12px] font-bold transition-all ${
                  radiusKm === km
                    ? 'bg-[#2B2437] text-white'
                    : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-neutral-100'
                }`}
              >
                {km} किमी
              </button>
            ))}
          </div>
        </div>

        {/* 3. City Chips Block */}
        <CityChips
          homeCityId={homeCityId}
          selectedCityIds={selectedCityIds}
          onRemoveCity={handleRemoveCity}
          onOpenCitySheet={() => setShowCitySheet(true)}
        />

        {/* 4. Reach Card (Amber Tint) */}
        <div className="p-4 rounded-[20px] bg-[#FFF9EE] border border-[#FDE68A] flex flex-col gap-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#2B2437]">
              <Users className="w-4 h-4 text-[#E39026]" />
              <span>{STRINGS.area.reachCardTitle}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="amber">{STRINGS.area.estimateBadge}</Badge>
              {state.sim?.showPlaceholderNotes && (
                <span className="text-[10.5px] text-[#C97F1E]">
                  {STRINGS.area.estimateTestNote}
                </span>
              )}
            </div>
          </div>

          <div className="text-[20px] font-extrabold text-[#2B2437] tabular-nums mt-0.5">
            {STRINGS.area.reachRangeFormat(
              formatIN(readersRange.lo),
              formatIN(readersRange.hi)
            )}
          </div>
        </div>

        {/* 5. Collapsed Accordion for Age and Gender */}
        <Accordion
          title={STRINGS.area.audienceAccordionTitle}
          summary={audienceSummaryText}
        >
          <div className="flex flex-col gap-4 py-1">
            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#4A4358]">
                {STRINGS.area.genderLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: STRINGS.area.genderAll },
                  { id: 'male', label: STRINGS.area.genderMale },
                  { id: 'female', label: STRINGS.area.genderFemale },
                ].map((g) => (
                  <Chip
                    key={g.id}
                    label={g.label}
                    selected={gender === g.id}
                    onClick={() => handleGenderChange(g.id)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#4A4358]">
                {STRINGS.area.ageLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_AGES.map((aKey) => (
                  <Chip
                    key={aKey}
                    label={`${aKey} वर्ष`}
                    selected={selectedAges.includes(aKey)}
                    onClick={() => handleToggleAge(aKey)}
                    size="sm"
                  />
                ))}
              </div>
              {ageError && (
                <span className="text-[12px] text-[#DC2626] font-medium animate-fadeIn">
                  {ageError}
                </span>
              )}
            </div>
          </div>
        </Accordion>

        {/* 6. Multi-state Warning Banner if >= 3 states */}
        {selectedStatesCount >= 3 && (
          <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex items-center gap-2 text-[12.5px] text-[#C97F1E] font-medium">
            <Info className="w-4 h-4 shrink-0 text-[#E39026]" />
            <span>{STRINGS.area.wideAreaBanner}</span>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={proceedNextStep}
        showArrow={!isFromReview}
      />

      {/* City Multi-select Sheet */}
      <CitySheet
        isOpen={showCitySheet}
        onClose={() => setShowCitySheet(false)}
        selectedCityIds={selectedCityIds}
        onSaveSelection={handleSaveCitySheetSelection}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
