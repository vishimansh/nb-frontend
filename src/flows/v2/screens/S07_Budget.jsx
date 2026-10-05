import React, { useState, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import RangeSlider from '../components/ui/RangeSlider';
import Stepper from '../components/ui/Stepper';
import BillSheet from '../components/sheets/BillSheet';
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
  MapPin,
  Users,
  Zap,
  Calendar,
  RotateCcw,
} from 'lucide-react';

const RADIUS_PRESETS = [5, 10, 15, 20, 25];
const DAILY_PRESETS = [100, 250, 500, 1000];
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

  const activePackage = useMemo(() => {
    return PACKAGES.find((p) => p.id === selectedPkgId);
  }, [selectedPkgId]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none">
      {/* Header (Step 5 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={5}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col gap-2.5 scrollbar-none">
        {/* Screen Title */}
        <div className="flex items-center justify-center pt-0.5 pb-0.5">
          <h2 className="text-[17px] font-extrabold text-[#2B2437] tracking-tight">
            इलाका और बजट चुनें
          </h2>
        </div>

        {/* Level 1: TOP HERO REACH CARD (अनुमानित पाठक संख्या) */}
        <div className="p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#F6DFA8] shadow-xs flex flex-col gap-2 sticky top-0 z-20 backdrop-blur-md">
          {/* Header Row: Label & Live Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider">
                अनुमानित पाठक संख्या
              </span>
            </div>
          </div>

          {/* Metric Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[28px] font-black text-[#2B2437] tracking-tight tabular-nums leading-none">
                ~{formatIN(reachablePeople)}
              </span>
              <span className="text-[13px] font-bold text-[#B45309]">
                पाठक
              </span>
            </div>
          </div>
        </div>

        {/* Level 2: SECTION 1 - विज्ञापन का दायरा */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[13.5px] font-bold text-[#2B2437]">
              <MapPin className="w-3.5 h-3.5 text-[#E39026]" />
              <span>1. विज्ञापन का दायरा</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-bold text-[#2B2437] tabular-nums">
                {radiusKm} किमी
              </span>
              {radiusKm !== 10 && (
                <button
                  type="button"
                  onClick={() => handleRadiusChange(10)}
                  className="text-[10.5px] text-[#9CA3AF] hover:text-[#2B2437] flex items-center gap-0.5 cursor-pointer underline"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
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

          {/* Segmented Presets */}
          <div className="flex items-center bg-[#F4F4F2] p-0.5 rounded-xl gap-0.5">
            {RADIUS_PRESETS.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleRadiusChange(km)}
                className={`flex-1 py-1 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                  radiusKm === km
                    ? 'bg-white text-[#2B2437] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#2B2437]'
                }`}
              >
                {km} किमी
              </button>
            ))}
          </div>

          {/* City Chips */}
          <div className="pt-2 border-t border-[#F4F4F2]">
            <CityChips
              homeCityId={homeCityId}
              selectedCityIds={selectedCityIds}
              onRemoveCity={handleRemoveCity}
              onOpenCitySheet={() => setShowCitySheet(true)}
            />
          </div>
        </div>

        {/* Level 3: SECTION 2 - बजट और अवधि तय करें (CUSTOM BUDGET FIRST) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13.5px] font-bold text-[#2B2437]">
              2. बजट और अवधि तय करें
            </span>
          </div>

          {/* PRIMARY: CUSTOM BUDGET CONTROLS */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            {/* Daily Spend */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-[#6B7280]">
                  दैनिक बजट
                </span>
                <span className="text-[16px] font-black text-[#2B2437] font-mono tabular-nums">
                  ₹{formatIN(dailyAmount)}
                  <span className="text-[11px] font-medium text-[#9CA3AF] ml-0.5">/दिन</span>
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

              {/* Segmented Amount Chips */}
              <div className="flex items-center bg-[#F4F4F2] p-0.5 rounded-xl gap-0.5">
                {DAILY_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleDailySliderChange(amt)}
                    className={`flex-1 py-1 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                      dailyAmount === amt
                        ? 'bg-white text-[#2B2437] shadow-xs'
                        : 'text-[#6B7280] hover:text-[#2B2437]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#F4F4F2]" />

            {/* Duration / Days */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-semibold text-[#6B7280]">
                  अवधि
                </span>
                <Stepper
                  value={days}
                  min={1}
                  max={90}
                  step={1}
                  onChange={handleDaysChange}
                  unit="दिन"
                />
              </div>

              {/* Segmented Day Chips */}
              <div className="flex items-center bg-[#F4F4F2] p-0.5 rounded-xl gap-0.5">
                {DAY_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDaysChange(d)}
                    className={`flex-1 py-1 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                      days === d
                        ? 'bg-white text-[#2B2437] shadow-xs'
                        : 'text-[#6B7280] hover:text-[#2B2437]'
                    }`}
                  >
                    {d} दिन
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECONDARY: TEMPLATE PACKAGES */}
          <div className="flex flex-col gap-1.5 pt-0.5">
            <span className="text-[11px] font-semibold text-[#8C8C94] uppercase tracking-wider px-1">
              तैयार पैकेज
            </span>

            <div className="grid grid-cols-3 gap-2">
              {PACKAGES.filter((p) => p.id !== 'custom').map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                const pkgTotal = pkg.total || calculateTotal(pkg.dailyAmount * pkg.days);

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                        : 'bg-white border-[#EDEDEA] hover:border-[#D1D5DB]'
                    }`}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 rounded-full bg-[#E39026] text-white text-[8.5px] font-bold tracking-tight shadow-2xs">
                        {STRINGS.budget.recommendedBadge}
                      </span>
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[12.5px] text-[#2B2437]">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <span className="w-3 h-3 rounded-full bg-[#2B2437] text-white flex items-center justify-center text-[8px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8C8C94] font-medium mt-0.5">
                        ₹{pkg.dailyAmount} · {pkg.days} दिन
                      </span>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[#F4F4F2]">
                      <span className="text-[12.5px] font-black text-[#2B2437] tabular-nums">
                        ₹{formatIN(pkgTotal)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level 4: SECTION 3 - शुरुआत */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-2.5">
          <span className="text-[13.5px] font-bold text-[#2B2437]">
            3. शुरुआत
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleStartModeChange('after_review')}
              className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                startMode === 'after_review'
                  ? 'bg-white border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                  : 'bg-[#F9F9F8] border-[#EDEDEA] hover:bg-neutral-50'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  startMode === 'after_review' ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                }`}
              >
                {startMode === 'after_review' && <span className="w-1 h-1 rounded-full bg-white" />}
              </div>
              <span className="text-[12px] font-bold text-[#2B2437] flex items-center gap-1 truncate">
                <Zap className="w-3 h-3 text-[#E39026]" />
                तुरंत
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleStartModeChange('scheduled')}
              className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                startMode === 'scheduled'
                  ? 'bg-white border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                  : 'bg-[#F9F9F8] border-[#EDEDEA] hover:bg-neutral-50'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  startMode === 'scheduled' ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                }`}
              >
                {startMode === 'scheduled' && <span className="w-1 h-1 rounded-full bg-white" />}
              </div>
              <span className="text-[12px] font-bold text-[#2B2437] flex items-center gap-1 truncate">
                <Calendar className="w-3 h-3 text-[#4A4358]" />
                तारीख तय करें
              </span>
            </button>
          </div>

          {startMode === 'scheduled' && (
            <div className="pt-2 border-t border-[#F4F4F2] flex flex-col gap-1.5 animate-fadeIn">
              <input
                type="date"
                min={tomorrowStr}
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#D1D5DB] text-[12.5px] font-bold text-[#2B2437] bg-white focus:outline-none focus:ring-1 focus:ring-[#2B2437]"
              />
              {formattedHindiDate && (
                <span className="text-[11px] text-[#2F8F5B] font-semibold">
                  {formattedHindiDate}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={handleSubmit}
        showArrow={!isFromReview}
        summaryContent={
          <div className="w-full flex items-center justify-between py-1">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-[22px] text-[#2B2437] tabular-nums tracking-tight leading-tight">
                  कुल ₹{formatIN(money.total)}
                </span>
                <span className="text-[12px] font-semibold text-[#8C8C94]">
                  (GST सहित)
                </span>
              </div>
              <span className="text-[11px] font-medium text-[#8C8C94] mt-0.5">
                ₹{formatIN(dailyAmount)}/दिन × {days} दिन
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FFF8E7] border border-[#F6DFA8] text-[12px] font-bold text-[#D97706] hover:bg-[#FDE68A] transition-colors cursor-pointer shadow-2xs shrink-0"
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
