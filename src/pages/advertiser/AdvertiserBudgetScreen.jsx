import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Location, Shop, Buildings, Calendar, People, MoneyChange, TickCircle, ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

const BUDGET_PRESETS = [250, 500, 1000, 1500];
const RADIUS_PRESETS = [5, 10, 15, 20, 25];

const POPULAR_CITIES = [
  { id: 'bhopal', name: 'भोपाल', state: 'MP' },
  { id: 'indore', name: 'इंदौर', state: 'MP' },
  { id: 'jabalpur', name: 'जबलपुर', state: 'MP' },
  { id: 'gwalior', name: 'ग्वालियर', state: 'MP' },
  { id: 'raipur', name: 'रायपुर', state: 'CG' },
  { id: 'bilaspur', name: 'बिलासपुर', state: 'CG' },
  { id: 'mumbai', name: 'मुंबई', state: 'MH' },
  { id: 'pune', name: 'पुणे', state: 'MH' },
  { id: 'nagpur', name: 'नागपुर', state: 'MH' },
  { id: 'jaipur', name: 'जयपुर', state: 'RJ' },
  { id: 'delhi', name: 'दिल्ली NCR', state: 'NCR' },
  { id: 'lucknow', name: 'लखनऊ', state: 'UP' },
];

/**
 * Unified Reach Formula:
 * - Budget is the primary engine (0.85 power elasticity: 10x budget -> ~7x-8x reach).
 * - Location is the market boundary/inventory pool (0.90 to 1.30 multiplier: 5x radius -> ~1.4x reach).
 */
export function calculateUnifiedReach(dailyBudget, durationDays, targetingType, radiusKm, selectedCities) {
  let locationFactor = 1.0;
  if (targetingType === 'radius') {
    const r = radiusKm || 10;
    locationFactor = 0.90 + ((r - 5) / 20) * 0.40; // 5km = 0.90, 10km = 1.00, 25km = 1.30
  } else {
    const count = Array.isArray(selectedCities) ? selectedCities.length : 1;
    locationFactor = Math.min(1.32, 1.00 + Math.max(0, count - 1) * 0.08); // 1 city = 1.0, 2 = 1.08, 5+ = 1.32
  }

  const BASELINE_REACH = 5800; // 7 days @ ₹300 baseline
  const budgetRatio = Math.max(100, dailyBudget) / 300;
  const durationRatio = Math.max(1, durationDays) / 7;

  const rawReach = BASELINE_REACH * Math.pow(budgetRatio, 0.85) * Math.pow(durationRatio, 0.75) * locationFactor;
  return Math.max(1200, Math.round(rawReach));
}

export default function AdvertiserBudgetScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();

  // Location State
  const [targetingType, setTargetingType] = useState(draftCampaign.targetingType || 'radius');
  const [radiusKm, setRadiusKm] = useState(draftCampaign.radiusKm || 10);

  // Normalize selected cities
  const rawDistricts = draftCampaign.selectedDistricts;
  const initialCities = Array.isArray(rawDistricts) && rawDistricts.length > 0
    ? rawDistricts.map((item) => (typeof item === 'object' && item !== null ? item.id : String(item)))
    : ['bhopal'];
  const [selectedCities, setSelectedCities] = useState(initialCities);

  // Budget & Schedule State
  const [dailyBudget, setDailyBudget] = useState(draftCampaign.dailyBudget || 300);
  const [durationDays, setDurationDays] = useState(draftCampaign.durationDays || 7);
  const [isDragging, setIsDragging] = useState(false);

  const getTodayFormatted = () => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const [startDate, setStartDate] = useState(draftCampaign.startDate || getTodayFormatted());

  // Dynamic Reach Calculation (Unified Model)
  const estimatedReach = calculateUnifiedReach(
    dailyBudget,
    durationDays,
    targetingType,
    radiusKm,
    selectedCities
  );

  // Billing calculation
  const subtotal = dailyBudget * durationDays;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const toggleCity = (cityId) => {
    setSelectedCities((prev) => {
      if (prev.includes(cityId)) {
        if (prev.length === 1) return prev; // Keep at least one city selected
        return prev.filter((id) => id !== cityId);
      }
      return [...prev, cityId];
    });
  };

  const handleProceed = () => {
    updateDraftCampaign({
      targetingType,
      radiusKm,
      selectedDistricts: selectedCities,
      selectedStates: targetingType === 'district' ? ['mp'] : [],
      isWholeStateSelected: false,
      dailyBudget,
      durationDays,
      startDate,
      estimatedReach,
      baseReach: Math.round(7631 * (radiusKm / 10)),
      subtotal,
      grandTotal,
    });
    navigate('/advertise/review');
  };

  const handleDecrementDays = () => {
    if (durationDays > 1) {
      setDurationDays((prev) => prev - 1);
    }
  };

  const handleIncrementDays = () => {
    if (durationDays < 90) {
      setDurationDays((prev) => prev + 1);
    }
  };

  const minBudget = 100;
  const maxBudget = 2500;
  const sliderPercent = Math.min(
    100,
    Math.max(0, ((dailyBudget - minBudget) / (maxBudget - minBudget)) * 100)
  );
  const tooltipLeft = Math.min(92, Math.max(8, sliderPercent));

  const businessLabel = draftCampaign.businessName?.trim() || 'आपकी दुकान';

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="5"
        totalSteps="6"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/creative');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4 pb-8">
        <div className="space-y-3.5">
          {/* Top Title Banner */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
              <MoneyChange size={24} color="#E39026" variant="Bold" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#2B2437] leading-tight">
                इलाका और बजट चुनें
              </h1>
              <p className="text-[12.5px] text-[#6B7280] font-normal mt-0.5 leading-snug">
                दायरा, बजट और दिन तय करें
              </p>
            </div>
          </div>

          {/* TOP HERO: Live Unified Estimated Reach Card (अनुमानित पाठक संख्या) */}
          <div className="bg-gradient-to-br from-[#FFFBF0] via-[#FFFDF5] to-[#FFF6E5] border border-[#FDE68A] rounded-[20px] p-4 shadow-2xs space-y-2.5 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FDF5E8] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                  <People size={18} color="#E39026" variant="Bold" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider block">
                    अनुमानित पाठक संख्या
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-[24px] font-black text-[#2B2437] tracking-tight">
                      ~ {estimatedReach.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[13px] font-bold text-[#E39026]">
                      स्थानीय पाठक
                    </span>
                  </div>
                </div>
              </div>
              <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                लाइव अनुमान
              </span>
            </div>

            <p className="text-[12px] text-[#78350F] leading-snug border-t border-[#FDE68A]/60 pt-2">
              💡 <strong>₹{dailyBudget}/दिन</strong> के बजट और{' '}
              <strong>{targetingType === 'radius' ? `${radiusKm} किमी दायरे` : `${selectedCities.length} शहरों`}</strong>{' '}
              में {durationDays} दिनों में लगभग इतने स्थानीय पाठक विज्ञापन देखेंगे।
            </p>
          </div>

          {/* SECTION 1: विज्ञापन का इलाका (Location Selection) */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Location size={18} color="#E39026" variant="Bold" />
                <span className="text-[14px] font-bold text-[#2B2437]">
                  1. विज्ञापन का इलाका (Location)
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9EE] text-[#E39026] border border-[#FDE68A]">
                {targetingType === 'radius' ? `${radiusKm} किमी दायरा` : `${selectedCities.length} शहर`}
              </span>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="bg-[#F3F4F6] p-1 rounded-[14px] flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTargetingType('radius')}
                className={`flex-1 py-2 rounded-[10px] text-[12.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetingType === 'radius'
                    ? 'bg-[#2B2437] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#2B2437]'
                }`}
              >
                <Shop size={16} variant={targetingType === 'radius' ? 'Bold' : 'Linear'} />
                <span>दुकान के आसपास</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetingType('district')}
                className={`flex-1 py-2 rounded-[10px] text-[12.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetingType === 'district'
                    ? 'bg-[#2B2437] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#2B2437]'
                }`}
              >
                <Buildings size={16} variant={targetingType === 'district' ? 'Bold' : 'Linear'} />
                <span>प्रमुख शहर</span>
              </button>
            </div>

            {/* Mode A: Radius Slider & Presets */}
            {targetingType === 'radius' ? (
              <div className="pt-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-[#6B7280] font-medium">
                    दुकान से कवरेज दूरी:
                  </span>
                  <span className="text-[14px] font-extrabold text-[#2B2437] font-mono">
                    {radiusKm} किमी
                  </span>
                </div>

                {/* Radius Slider Input */}
                <div className="relative pt-1 pb-1">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="5"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                    className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#2B2437]"
                    aria-label="विज्ञापन का दायरा चुनें"
                  />
                  <div
                    className="absolute top-2.5 left-0 h-2 bg-[#2B2437] rounded-lg pointer-events-none"
                    style={{ width: `${((radiusKm - 5) / 20) * 100}%` }}
                  />
                </div>

                {/* Radius Preset Pills */}
                <div className="flex gap-1.5">
                  {RADIUS_PRESETS.map((val) => {
                    const isSelected = radiusKm === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRadiusKm(val)}
                        className={`flex-1 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#2B2437] text-white border-[#2B2437] shadow-2xs font-semibold'
                            : 'bg-white text-[#2B2437] border-[#D1D5DB] hover:border-[#2B2437]'
                        }`}
                      >
                        {val} किमी
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11.5px] text-[#6B7280] bg-[#F9FAFB] rounded-[10px] px-3 py-1.5 border border-[#E5E7EB] flex items-center gap-1.5">
                  <span className="text-[#E39026] text-[13px]">📍</span>
                  <span><strong>{businessLabel}</strong> के चारों तरफ {radiusKm} किमी क्षेत्र के पाठकों को दिखेगा।</span>
                </div>
              </div>
            ) : (
              /* Mode B: Popular Cities Multi-Select */
              <div className="pt-1 space-y-2">
                <span className="text-[12px] text-[#6B7280] block font-medium">
                  जिन शहरों में विज्ञापन दिखाना चाहते हैं उन्हें चुनें:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {POPULAR_CITIES.map((c) => {
                    const isChecked = selectedCities.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCity(c.id)}
                        className={`py-2 px-2 rounded-[12px] text-[12px] font-medium border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#2B2437] bg-[#2B2437] text-white shadow-2xs'
                            : 'border-[#E5E7EB] bg-white text-[#2B2437] hover:border-[#2B2437]/40'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isChecked && <span className="text-[11px] font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: रोज़ का बजट (Daily Budget) */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[14px] font-bold text-[#2B2437] block leading-tight">
                  2. रोज़ का बजट (Daily Budget)
                </span>
                <span className="text-[11.5px] text-[#6B7280] font-normal mt-0.5 block">
                  कम से कम ₹100/दिन
                </span>
              </div>
              <div className="text-right">
                <span className="text-[24px] font-black text-[#2B2437] leading-none">
                  ₹{dailyBudget}
                </span>
                <span className="text-[12.5px] font-medium text-[#6B7280] ml-0.5">/दिन</span>
              </div>
            </div>

            {/* Price Selector Slider Track */}
            <div className="pt-6 pb-1 relative">
              {/* Floating Price Tooltip */}
              <div
                className={`absolute -top-1 -translate-x-1/2 bg-[#2B2437] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md pointer-events-none transition-transform duration-100 ease-out flex items-center gap-1 z-30 select-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#2B2437] ${
                  isDragging ? 'scale-110 shadow-lg' : ''
                }`}
                style={{ left: `${tooltipLeft}%` }}
              >
                <span>₹{dailyBudget.toLocaleString('en-IN')}</span>
              </div>

              {/* Slider Track Line */}
              <div className="relative h-7 flex items-center">
                <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#E39026] via-[#F5B55C] to-[#E39026] rounded-full transition-[width] duration-75 ease-out shadow-2xs"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>

                {/* Milestone Dots */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 pointer-events-none z-10">
                  {[500, 1000, 1500, 2000].map((dotVal) => {
                    const dotPct = ((dotVal - minBudget) / (maxBudget - minBudget)) * 100;
                    const isPassed = dailyBudget >= dotVal;
                    return (
                      <div
                        key={dotVal}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isPassed ? 'bg-white shadow-xs' : 'bg-[#D1D5DB]'
                        }`}
                        style={{ position: 'absolute', left: `${dotPct}%`, transform: 'translateX(-50%)' }}
                      />
                    );
                  })}
                </div>

                <input
                  type="range"
                  min={minBudget}
                  max={maxBudget}
                  step={25}
                  value={dailyBudget}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onChange={(e) => setDailyBudget(Number(e.target.value))}
                  className="custom-budget-range absolute inset-0 w-full h-full z-20 cursor-pointer"
                  aria-label="दैनिक विज्ञापन बजट चुनें"
                />
              </div>

              <div className="flex justify-between items-center mt-1 px-0.5 text-[11px] font-semibold text-[#9CA3AF]">
                <span>₹{minBudget}</span>
                <span>₹{maxBudget.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              {BUDGET_PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDailyBudget(amt)}
                  className={`flex-1 h-[34px] rounded-full text-[12.5px] font-medium border transition-all cursor-pointer ${
                    dailyBudget === amt
                      ? 'border-[#2B2437] bg-[#2B2437] text-white shadow-xs font-semibold'
                      : 'border-[#D1D5DB] bg-white text-[#2B2437] hover:border-[#2B2437]'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: विज्ञापन के दिन (Schedule & Duration) */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
            <span className="text-[14px] font-bold text-[#2B2437] block leading-tight">
              3. विज्ञापन अवधि (Duration)
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Date */}
              <div>
                <label className="text-[12px] font-medium text-[#6B7280] block mb-1">
                  शुरू होने की तारीख
                </label>
                <div className="h-[46px] bg-white rounded-[12px] border border-[#D1D5DB] flex items-center px-3 shadow-2xs">
                  <Calendar size={16} color="#6B7280" className="mr-2 shrink-0" />
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="DD-MM-YYYY"
                    className="w-full text-[13px] font-medium text-[#2B2437] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Number of Days Stepper */}
              <div>
                <label className="text-[12px] font-medium text-[#6B7280] block mb-1">
                  कुल दिन
                </label>
                <div className="h-[46px] bg-white rounded-[12px] border border-[#D1D5DB] flex items-center justify-between px-2.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrementDays}
                    className="w-8 h-8 rounded-[8px] bg-[#F7F7F4] hover:bg-[#E5E7EB] flex items-center justify-center font-bold text-[16px] text-[#2B2437] cursor-pointer active:scale-95 transition-transform"
                  >
                    −
                  </button>
                  <span className="text-[14.5px] font-bold text-[#2B2437] font-mono">
                    {durationDays} <span className="font-normal text-[11.5px] text-[#6B7280]">दिन</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementDays}
                    className="w-8 h-8 rounded-[8px] bg-[#F7F7F4] hover:bg-[#E5E7EB] flex items-center justify-center font-bold text-[16px] text-[#2B2437] cursor-pointer active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Total Investment & GST Card */}
          <div className="bg-[#2B2437] text-white rounded-[20px] p-4 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#F5B55C] uppercase block">
                  कुल खर्च ({durationDays} दिन)
                </span>
                <span className="text-[12px] text-[#E2E8F0] font-normal mt-0.5 block">
                  बजट: ₹{dailyBudget} × {durationDays} दिन = ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[24px] font-black text-[#F5B55C] tracking-tight">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[12px] text-[#CBD5E1]">
              <span>+ 18% GST</span>
              <span className="font-semibold text-white font-mono">₹{gst.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* World-Class Floating Dynamic Value Dock */}
      <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] p-3.5 px-4 shadow-[0_-6px_25px_rgba(0,0,0,0.07)] z-30 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Financial & Live Reach Telemetry */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-black text-[#2B2437] tracking-tight leading-none">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-medium text-[#6B7280]">
              (GST सहित)
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E39026] animate-pulse shrink-0" />
            <span className="text-[11.5px] font-semibold text-[#854D0E] truncate max-w-[145px]">
              ~{estimatedReach.toLocaleString('en-IN')} स्थानीय पाठक
            </span>
          </div>
        </div>

        {/* Right: High-Intent Primary CTA */}
        <button
          type="button"
          onClick={handleProceed}
          className="h-[48px] px-5 rounded-[15px] bg-gradient-to-r from-[#2B2437] via-[#3D334E] to-[#2B2437] hover:from-[#3D334E] hover:to-[#2B2437] text-white font-bold text-[15px] shadow-md shadow-[#2B2437]/20 flex items-center gap-2 cursor-pointer active:scale-[0.97] transition-all group shrink-0"
        >
          <span>विज्ञापन जांचें</span>
          <ArrowRight size={17} color="#FFFFFF" variant="Linear" className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
