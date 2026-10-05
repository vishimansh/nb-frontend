import React, { useState, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import RangeSlider from '../components/ui/RangeSlider';
import Stepper from '../components/ui/Stepper';
import BillSheet from '../components/sheets/BillSheet';
import Badge from '../components/ui/Badge';
import HelpSheet from '../components/sheets/HelpSheet';
import CityChips from '../components/map/CityChips';
import CitySheet from '../components/sheets/CitySheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { PACKAGES } from '../data/packages';
import { calculateTotal, getMoneyBreakdown } from '../utils/money';
import { formatIN } from '../utils/formatIN';
import { resolveSelectedCities, getDistanceKm } from '../utils/geo';
import { CITIES, getCityById } from '../data/cities';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import {
  ChevronRight,
  MapPin,
  Users,
  Zap,
  Calendar,
  RotateCcw,
} from 'lucide-react';

const RADIUS_PRESETS = [5, 10, 15, 20, 25];
const DAY_PRESETS = [3, 7, 15, 30];

export default function S07_Budget({ onOpenFacilitator }) {
  const { state, updateDraft } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();

  const shop = state.shop || {};
  const draftArea = state.draft?.area || { radiusKm: 10, manualCityIds: [], excludedCityIds: [] };
  const homeCityId = shop.cityId || 'indore';
  const homeCity = getCityById(homeCityId) || { lat: 22.7196, lng: 75.8577, name: 'इंदौर' };
  const pin = useMemo(() => {
    return shop.pin?.lat ? shop.pin : { lat: homeCity.lat, lng: homeCity.lng };
  }, [shop.pin, homeCity.lat, homeCity.lng]);

  // Location State
  const [radiusKm, setRadiusKm] = useState(draftArea.radiusKm || 10);
  const [manualCityIds, setManualCityIds] = useState(draftArea.manualCityIds || []);
  const [excludedCityIds, setExcludedCityIds] = useState(draftArea.excludedCityIds || []);
  const [showCitySheet, setShowCitySheet] = useState(false);

  // Budget State
  const draftBudget = state.draft?.budget || {
    packageId: 'standard',
    dailyAmount: 250,
    days: 7,
    startMode: 'after_review',
    startDate: null,
  };

  const [selectedPkgId, setSelectedPkgId] = useState(draftBudget.packageId || 'standard');
  const [dailyAmount, setDailyAmount] = useState(draftBudget.dailyAmount || 250);
  const [days, setDays] = useState(draftBudget.days || 7);
  const [startMode, setStartMode] = useState(draftBudget.startMode || 'after_review');
  const [startDate, setStartDate] = useState(draftBudget.startDate || '');

  const [showBillSheet, setShowBillSheet] = useState(false);
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

  // Selected cities
  const selectedCityIds = useMemo(() => {
    return resolveSelectedCities(homeCityId, autoCityIds, manualCityIds, excludedCityIds);
  }, [homeCityId, autoCityIds, manualCityIds, excludedCityIds]);

  // Money calculations
  const money = useMemo(() => {
    return getMoneyBreakdown(dailyAmount, days);
  }, [dailyAmount, days]);

  /**
   * Unified Reach Formula:
   * Budget has high elasticity (0.85), Location has mild bounded elasticity (0.90 to 1.30).
   */
  const reachablePeople = useMemo(() => {
    const locationFactor = 0.90 + ((radiusKm - 5) / 20) * 0.40;
    const budgetRatio = Math.max(100, dailyAmount) / 300;
    const durationRatio = Math.max(1, days) / 7;
    const baseReach = 5800;
    const raw = baseReach * Math.pow(budgetRatio, 0.85) * Math.pow(durationRatio, 0.75) * locationFactor;
    return Math.max(1200, Math.round(raw));
  }, [dailyAmount, days, radiusKm]);

  const handleRadiusChange = (newRadius) => {
    setRadiusKm(newRadius);
    updateDraft('area.radiusKm', newRadius);
    track('radius_changed', { radiusKm: newRadius });
  };

  const handleRemoveCity = (cityId) => {
    const nextExcluded = [...excludedCityIds, cityId];
    const nextManual = manualCityIds.filter((id) => id !== cityId);
    setExcludedCityIds(nextExcluded);
    setManualCityIds(nextManual);
    updateDraft('area.excludedCityIds', nextExcluded);
    updateDraft('area.manualCityIds', nextManual);
    track('city_removed', { cityId });
  };

  const handleSelectPackage = (pkg) => {
    if (pkg.id === 'custom') {
      setSelectedPkgId('custom');
      updateDraft('budget.packageId', 'custom');
      return;
    }

    setSelectedPkgId(pkg.id);
    setDailyAmount(pkg.dailyAmount);
    setDays(pkg.days);

    updateDraft('budget', {
      packageId: pkg.id,
      dailyAmount: pkg.dailyAmount,
      days: pkg.days,
      startMode,
      startDate,
    });
    track('package_selected', { id: pkg.id });
  };

  const handleDailySliderChange = (newDaily) => {
    setDailyAmount(newDaily);
    const match = PACKAGES.find(
      (p) => p.id !== 'custom' && p.dailyAmount === newDaily && p.days === days
    );
    const pkgId = match ? match.id : 'custom';
    setSelectedPkgId(pkgId);
    updateDraft('budget.dailyAmount', newDaily);
    updateDraft('budget.packageId', pkgId);
  };

  const handleDaysChange = (newDays) => {
    setDays(newDays);
    const match = PACKAGES.find(
      (p) => p.id !== 'custom' && p.dailyAmount === dailyAmount && p.days === newDays
    );
    const pkgId = match ? match.id : 'custom';
    setSelectedPkgId(pkgId);
    updateDraft('budget.days', newDays);
    updateDraft('budget.packageId', pkgId);
  };

  const handleStartModeChange = (mode) => {
    setStartMode(mode);
    updateDraft('budget.startMode', mode);
  };

  const handleStartDateChange = (dateVal) => {
    setStartDate(dateVal);
    updateDraft('budget.startDate', dateVal);
  };

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const formattedHindiDate = useMemo(() => {
    if (!startDate) return '';
    try {
      const parts = startDate.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return startDate;
    }
  }, [startDate]);

  const handleSubmit = () => {
    updateDraft('area', {
      radiusKm,
      manualCityIds,
      excludedCityIds,
    });
    updateDraft('budget', {
      packageId: selectedPkgId,
      dailyAmount,
      days,
      startMode,
      startDate,
    });
    proceedNextStep();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header (Step 5 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={5}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scrollbar-none">
        {/* Level 2: Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h2 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            इलाका और बजट चुनें
          </h2>
          <p className="text-[12px] text-[#6B7280]">
            दायरा, बजट और दिन तय करें
          </p>
        </div>

        {/* Level 1: TOP HERO REACH CARD (अनुमानित पाठक संख्या) */}
        <div className="p-3.5 rounded-[18px] bg-gradient-to-br from-[#FFFDF7] via-[#FFFBF0] to-[#FEF3C7]/40 border border-[#FDE68A] shadow-xs flex flex-col gap-2 sticky top-0 z-20 backdrop-blur-md">
          {/* Header Row: Label & Live Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#E39026]" />
              <span className="text-[11.5px] font-bold text-[#854D0E] uppercase tracking-wider">
                अनुमानित पाठक संख्या
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF8F2] border border-[#2F8F5B]/20 text-[#2F8F5B] text-[10.5px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F8F5B] animate-pulse" />
              लाइव अनुमान
            </span>
          </div>

          {/* Metric Row: Dominant Hero Readers Count */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[30px] font-black text-[#2B2437] tracking-tight tabular-nums leading-none">
                ~{formatIN(reachablePeople)}
              </span>
              <span className="text-[13px] font-bold text-[#E39026]">
                स्थानीय पाठक
              </span>
            </div>

            {/* Active Parameters Pill */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4A4358] bg-white/95 border border-[#FDE68A] px-2.5 py-0.5 rounded-full shadow-2xs">
              <span>{radiusKm} किमी</span>
              <span className="text-[#D1D5DB]">·</span>
              <span>₹{dailyAmount}/दिन</span>
              <span className="text-[#D1D5DB]">·</span>
              <span>{days} दिन</span>
            </div>
          </div>
        </div>

        {/* Level 3: SECTION 1 - विज्ञापन का दायरा */}
        <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#2B2437]">
              <MapPin className="w-4 h-4 text-[#E39026]" />
              <span>1. विज्ञापन का दायरा</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[11.5px] font-bold text-[#E39026]">
                {radiusKm} किमी दायरा
              </span>
              {radiusKm !== 10 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(10)}
                  className="text-[11px] text-[#6B7280] hover:text-[#2B2437] flex items-center gap-0.5 cursor-pointer underline"
                >
                  <RotateCcw className="w-3 h-3 text-[#6B7280]" />
                  <span>रीसेट</span>
                </button>
              )}
            </div>
          </div>

          {/* Range Slider */}
          <RangeSlider
            min={5}
            max={25}
            step={1}
            value={radiusKm}
            onChange={handleRadiusChange}
            unit="किमी"
          />

          {/* Presets */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {RADIUS_PRESETS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleRadiusChange(km)}
                className={`flex-1 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                  radiusKm === km
                    ? 'bg-[#2B2437] text-white shadow-2xs'
                    : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-neutral-100'
                }`}
              >
                {km} किमी
              </button>
            ))}
          </div>

          {/* City Chips */}
          <div className="pt-2 border-t border-[#F3F4F6]">
            <CityChips
              homeCityId={homeCityId}
              selectedCityIds={selectedCityIds}
              onRemoveCity={handleRemoveCity}
              onOpenCitySheet={() => setShowCitySheet(true)}
            />
          </div>
        </div>

        {/* Level 3: SECTION 2 - बजट और अवधि तय करें */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[14px] font-bold text-[#2B2437]">
              2. बजट और अवधि तय करें
            </span>
            <span className="text-[11px] font-medium text-[#6B7280]">
              पैकेज चुनें
            </span>
          </div>

          {PACKAGES.map((pkg) => {
            const isSelected = selectedPkgId === pkg.id;

            if (pkg.id === 'custom') {
              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`p-3 rounded-[16px] border flex items-center justify-between cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-white border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-bold text-[14px] text-[#2B2437]">
                      अपना बजट खुद तय करें (कस्टम)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </div>
              );
            }

            const pkgTotal = pkg.total || calculateTotal(pkg.dailyAmount * pkg.days);

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                className={`p-3 rounded-[16px] border flex flex-col gap-1 cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'bg-white border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                    : 'bg-white border-[#E5E7EB] hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-bold text-[14.5px] text-[#2B2437]">
                      {pkg.name}
                    </span>
                  </div>
                  {pkg.recommended && (
                    <Badge variant="amber">{STRINGS.budget.recommendedBadge}</Badge>
                  )}
                </div>

                <div className="pl-6.5 flex items-baseline justify-between">
                  <span className="text-[12.5px] font-medium text-[#4A4358]">
                    ₹{pkg.dailyAmount}/दिन · {pkg.days} दिन
                  </span>
                  <div className="text-right">
                    <span className="text-[14.5px] font-extrabold text-[#2B2437]">
                      ₹{formatIN(pkgTotal)}
                    </span>
                    <span className="text-[10.5px] font-normal text-[#6B7280] ml-1">
                      (GST सहित)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Daily Slider Card */}
        {selectedPkgId === 'custom' && (
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#2B2437]">
                रोज़ का खर्च:
              </span>
              <span className="text-[16px] font-bold text-[#2B2437] font-mono">
                ₹{dailyAmount}/दिन
              </span>
            </div>

            <RangeSlider
              min={100}
              max={2500}
              step={25}
              value={dailyAmount}
              onChange={handleDailySliderChange}
              unit="₹"
            />
          </div>
        )}

        {/* Stepper for Days (in custom mode or custom duration) */}
        {selectedPkgId === 'custom' && (
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#2B2437]">
                दिन तय करें:
              </span>
              <span className="text-[15px] font-bold text-[#2B2437] font-mono">
                {days} दिन
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">दिन बदलें:</span>
              <Stepper
                value={days}
                min={1}
                max={90}
                step={1}
                onChange={handleDaysChange}
                unit="दिन"
              />
            </div>

            <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#F3F4F6]">
              {DAY_PRESETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDaysChange(d)}
                  className={`flex-1 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                    days === d
                      ? 'bg-[#2B2437] text-white'
                      : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-neutral-100'
                  }`}
                >
                  {d} दिन
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 3: SECTION 3 - विज्ञापन कब शुरू करना है? */}
        <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-2">
          <span className="text-[14px] font-bold text-[#2B2437]">
            3. विज्ञापन कब शुरू करना है?
          </span>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="radio"
                name="startMode"
                checked={startMode === 'after_review'}
                onChange={() => handleStartModeChange('after_review')}
                className="w-4 h-4 text-[#2B2437] focus:ring-[#2B2437]"
              />
              <span className="text-[13px] font-medium text-[#2B2437] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#E39026]" />
                {STRINGS.budget.startModeImmediate}
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer">
              <input
                type="radio"
                name="startMode"
                checked={startMode === 'scheduled'}
                onChange={() => handleStartModeChange('scheduled')}
                className="w-4 h-4 text-[#2B2437] focus:ring-[#2B2437]"
              />
              <span className="text-[13px] font-medium text-[#2B2437] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#4A4358]" />
                {STRINGS.budget.startModeScheduled}
              </span>
            </label>

            {startMode === 'scheduled' && (
              <div className="pl-6.5 pt-1 flex flex-col gap-1">
                <input
                  type="date"
                  min={tomorrowStr}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D1D5DB] text-[13px] font-bold text-[#2B2437] bg-white focus:outline-none focus:ring-1 focus:ring-[#2B2437]"
                />
                {formattedHindiDate && (
                  <span className="text-[11.5px] text-[#2F8F5B] font-semibold">
                    तारीख: {formattedHindiDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={handleSubmit}
        showArrow={!isFromReview}
        summaryContent={
          <div className="w-full flex items-center justify-between">
            <span className="font-extrabold text-[15px] text-[#2B2437] tabular-nums">
              {STRINGS.budget.totalWithGstSticky(formatIN(money.total))}
            </span>
            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="text-[12.5px] font-bold text-[#E39026] hover:underline cursor-pointer"
            >
              {STRINGS.budget.viewBill}
            </button>
          </div>
        }
      />

      {/* CitySheet Modal */}
      <CitySheet
        isOpen={showCitySheet}
        onClose={() => setShowCitySheet(false)}
        selectedCityIds={selectedCityIds}
        onSaveSelection={(newCityIds) => {
          setManualCityIds(newCityIds.filter((id) => !autoCityIds.includes(id) && id !== homeCityId));
          setExcludedCityIds(autoCityIds.filter((id) => !newCityIds.includes(id)));
        }}
        onToggleCity={(cityId) => {
          if (selectedCityIds.includes(cityId)) {
            handleRemoveCity(cityId);
          } else {
            setManualCityIds((prev) => [...prev, cityId]);
            setExcludedCityIds((prev) => prev.filter((id) => id !== cityId));
          }
        }}
      />

      {/* Bill Breakdown Bottom Sheet */}
      <BillSheet
        isOpen={showBillSheet}
        onClose={() => setShowBillSheet(false)}
        dailyAmount={dailyAmount}
        days={days}
      />

      {/* Help Sheet */}
      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        topic="budget"
      />
    </div>
  );
}
