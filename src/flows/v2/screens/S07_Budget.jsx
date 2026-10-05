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
    <div className="w-full h-full flex flex-col justify-between bg-[#F8F8F6] overflow-hidden select-none">
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
        {/* Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h2 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            इलाका और बजट चुनें
          </h2>
          <p className="text-[12px] text-[#6B7280]">
            दायरा, बजट और दिन तय करें
          </p>
        </div>

        {/* Level 1: TOP HERO REACH CARD (अनुमानित पाठक संख्या) */}
        <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7E5E4] shadow-xs flex flex-col gap-2 sticky top-0 z-20">
          {/* Header Row: Label & Live Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#E39026]" />
              <span className="text-[11.5px] font-bold text-[#854D0E] uppercase tracking-wider">
                अनुमानित पाठक संख्या
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#86EFAC]/60 text-[#16A34A] text-[10.5px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              लाइव अनुमान
            </span>
          </div>

          {/* Metric Row: Dominant Hero Readers Count */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-black text-[#2B2437] tracking-tight tabular-nums leading-none">
                ~{formatIN(reachablePeople)}
              </span>
              <span className="text-[13px] font-bold text-[#E39026]">
                स्थानीय पाठक
              </span>
            </div>

            {/* Active Parameters Pill */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4A4358] bg-[#F7F7F4] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full">
              <span>{radiusKm} किमी</span>
              <span className="text-[#D1D5DB]">·</span>
              <span>₹{dailyAmount}/दिन</span>
              <span className="text-[#D1D5DB]">·</span>
              <span>{days} दिन</span>
            </div>
          </div>
        </div>

        {/* Level 2: SECTION 1 - विज्ञापन का दायरा */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7E5E4] shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#2B2437]">
              <MapPin className="w-4 h-4 text-[#E39026]" />
              <span>1. विज्ञापन का दायरा</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[11px] font-bold text-[#B45309]">
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
                    : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-[#EFEFEA]'
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

        {/* Level 3: SECTION 2 - बजट और अवधि तय करें (CUSTOM BUDGET FIRST) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[14px] font-bold text-[#2B2437]">
              2. बजट और अवधि तय करें
            </span>
            {selectedPkgId === 'custom' ? (
              <span className="px-2 py-0.5 rounded-full bg-[#FFF9EE] border border-[#FDE68A] text-[10.5px] font-bold text-[#B45309]">
                कस्टम बजट
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[10.5px] font-bold text-[#4B5563]">
                {activePackage?.name || 'पैकेज'}
              </span>
            )}
          </div>

          {/* PRIMARY: CUSTOM BUDGET CONTROLS (Always visible & prioritized) */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E7E5E4] shadow-2xs flex flex-col gap-3">
            {/* Sub-section 1: Daily Spend Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#2B2437]">
                  दैनिक बजट (रोज़ का खर्च):
                </span>
                <span className="text-[16px] font-black text-[#2B2437] font-mono tabular-nums">
                  ₹{formatIN(dailyAmount)}
                  <span className="text-[11.5px] font-medium text-[#6B7280]">/दिन</span>
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

              {/* Quick Amount Chips */}
              <div className="flex items-center justify-between gap-1 pt-0.5">
                {DAILY_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleDailySliderChange(amt)}
                    className={`flex-1 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      dailyAmount === amt
                        ? 'bg-[#2B2437] text-white shadow-2xs'
                        : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-[#EFEFEA]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-[#F3F4F6]" />

            {/* Sub-section 2: Duration / Days */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-bold text-[#2B2437] block">
                    विज्ञापन की अवधि:
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    कितने दिन विज्ञापन चलेगा
                  </span>
                </div>
                <Stepper
                  value={days}
                  min={1}
                  max={90}
                  step={1}
                  onChange={handleDaysChange}
                  unit="दिन"
                />
              </div>

              {/* Quick Day Chips */}
              <div className="flex items-center justify-between gap-1 pt-0.5">
                {DAY_PRESETS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDaysChange(d)}
                    className={`flex-1 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      days === d
                        ? 'bg-[#2B2437] text-white shadow-2xs'
                        : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-[#EFEFEA]'
                    }`}
                  >
                    {d} दिन
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECONDARY: TEMPLATE PACKAGES (Compact 1-Tap Shortcuts) */}
          <div className="flex flex-col gap-1.5 pt-0.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-bold text-[#6B7280]">
                या तैयार पैकेज चुनें:
              </span>
              <span className="text-[11px] text-[#9CA3AF]">
                1-क्लिक शॉर्टकट
              </span>
            </div>

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
                        : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-2 right-1.5 px-1.5 py-0.2 rounded-full bg-[#E39026] text-white text-[9px] font-bold tracking-tight shadow-2xs">
                        {STRINGS.budget.recommendedBadge}
                      </span>
                    )}

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[13px] text-[#2B2437] leading-tight">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] text-white flex items-center justify-center text-[9px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#6B7280] font-medium mt-0.5">
                        ₹{pkg.dailyAmount}/दिन · {pkg.days} दिन
                      </span>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[#F3F4F6] flex items-baseline justify-between">
                      <span className="text-[13px] font-black text-[#2B2437] tabular-nums">
                        ₹{formatIN(pkgTotal)}
                      </span>
                      <span className="text-[9px] text-[#9CA3AF]">
                        कुल
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level 4: SECTION 3 - विज्ञापन कब शुरू करना है? */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7E5E4] shadow-2xs flex flex-col gap-2.5">
          <span className="text-[14px] font-bold text-[#2B2437]">
            3. विज्ञापन कब शुरू करना है?
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleStartModeChange('after_review')}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                startMode === 'after_review'
                  ? 'bg-white border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5E7EB] hover:bg-neutral-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  startMode === 'after_review' ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                }`}
              >
                {startMode === 'after_review' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[12.5px] font-bold text-[#2B2437] leading-tight flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#E39026]" />
                  {STRINGS.budget.startModeImmediate}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleStartModeChange('scheduled')}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                startMode === 'scheduled'
                  ? 'bg-white border-[#2B2437] ring-1.5 ring-[#2B2437] shadow-xs'
                  : 'bg-[#FAF9F5] border-[#E5E7EB] hover:bg-neutral-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  startMode === 'scheduled' ? 'border-[#2B2437] bg-[#2B2437]' : 'border-[#D1D5DB]'
                }`}
              >
                {startMode === 'scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[12.5px] font-bold text-[#2B2437] leading-tight flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#4A4358]" />
                  {STRINGS.budget.startModeScheduled}
                </span>
              </div>
            </button>
          </div>

          {startMode === 'scheduled' && (
            <div className="pt-2 border-t border-[#F3F4F6] flex flex-col gap-1.5 animate-fadeIn">
              <span className="text-[12px] font-semibold text-[#6B7280]">
                शुरू होने की तारीख चुनें:
              </span>
              <input
                type="date"
                min={tomorrowStr}
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-[13px] font-bold text-[#2B2437] bg-white focus:outline-none focus:ring-1 focus:ring-[#2B2437]"
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
