import React, { useState, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import RangeSlider from '../components/ui/RangeSlider';
import Stepper from '../components/ui/Stepper';
import BillSheet from '../components/sheets/BillSheet';
import AmountText from '../components/ui/AmountText';
import Badge from '../components/ui/Badge';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { PACKAGES } from '../data/packages';
import { calculateSubtotal, calculateGst, calculateTotal, getMoneyBreakdown } from '../utils/money';
import { areaReaders, peopleReached, reachRange, limitedBy, recommendedDaily } from '../utils/reach';
import { formatIN } from '../utils/formatIN';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { ChevronRight, Calendar, Sparkles } from 'lucide-react';

const DAY_PRESETS = [3, 7, 15, 30];

export default function S07_Budget({ onOpenFacilitator }) {
  const { state, updateDraft } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();

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

  // Money calculations
  const money = useMemo(() => {
    return getMoneyBreakdown(dailyAmount, days);
  }, [dailyAmount, days]);

  // Reach calculations
  const totalAreaReaders = useMemo(() => {
    return areaReaders(
      state.draft?.area?.manualCityIds || ['indore'],
      state.draft?.audience
    );
  }, [state.draft?.area, state.draft?.audience]);

  const reachablePeople = useMemo(() => {
    return peopleReached(totalAreaReaders, dailyAmount, days);
  }, [totalAreaReaders, dailyAmount, days]);

  const reachBounds = useMemo(() => {
    return reachRange(reachablePeople);
  }, [reachablePeople]);

  const limitType = useMemo(() => {
    return limitedBy(totalAreaReaders, dailyAmount, days);
  }, [totalAreaReaders, dailyAmount, days]);

  const recDaily = useMemo(() => {
    return recommendedDaily(totalAreaReaders, days);
  }, [totalAreaReaders, days]);

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
    // Check if matches an existing package
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

  // Tomorrow's date string for input min attribute
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
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={6}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center text-center gap-1 pt-1">
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs font-bold text-[24px]">
            ₹
          </div>
          <h2 className="text-[20px] font-bold text-[#2B2437] tracking-tight mt-1">
            {STRINGS.budget.title}
          </h2>
          <p className="text-[13px] text-[#6B7280]">
            {STRINGS.budget.subtitle}
          </p>
        </div>

        {/* 1. Packages Stack */}
        <div className="flex flex-col gap-2.5">
          {PACKAGES.map((pkg) => {
            const isSelected = selectedPkgId === pkg.id;

            if (pkg.id === 'custom') {
              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`p-3.5 rounded-[18px] border flex items-center justify-between cursor-pointer select-none transition-all ${
                    isSelected
                      ? 'bg-white border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14.5px] text-[#2B2437]">
                      {pkg.name}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      ({pkg.tagline})
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                </div>
              );
            }

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                className={`p-3.5 rounded-[18px] border flex flex-col gap-1.5 cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'bg-white border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                    : 'bg-white border-[#E5E7EB] hover:border-neutral-300'
                } active:scale-[0.98]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[16px] text-[#2B2437]">
                      {pkg.name}
                    </span>
                    {pkg.badge && (
                      <Badge variant="amber">
                        <Sparkles className="w-3 h-3 text-[#E39026]" />
                        <span>{pkg.badge}</span>
                      </Badge>
                    )}
                  </div>
                  <span className="font-extrabold text-[17px] text-[#2B2437] tabular-nums">
                    ₹{formatIN(pkg.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12.5px] text-[#6B7280]">
                  <span>
                    ₹{pkg.dailyAmount}/दिन · {pkg.days} दिन
                  </span>
                  <span>(GST सहित)</span>
                </div>

                <p className="text-[12px] text-[#C97F1E] font-medium pt-0.5">
                  {pkg.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2. Custom Block (Open if custom chosen or changed) */}
        {selectedPkgId === 'custom' && (
          <div className="p-4 rounded-[22px] bg-white border border-[#2B2437] shadow-sm flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#2B2437]">
                रोज़ का बजट
              </span>
              <span className="font-extrabold text-[16px] text-[#E39026] tabular-nums">
                ₹{formatIN(dailyAmount)}/दिन
              </span>
            </div>

            <RangeSlider
              min={100}
              max={2500}
              step={25}
              value={dailyAmount}
              onChange={handleDailySliderChange}
              landmarks={[500, 1000, 1500, 2000]}
              prefix="₹"
              unit="/दिन"
            />

            <div className="w-full h-px bg-[#E5E7EB] my-1" />

            {/* Days Selection */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-[#2B2437]">
                  विज्ञापन की अवधि
                </span>
                <span className="font-bold text-[14px] text-[#2B2437] tabular-nums">
                  {days} दिन
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-1.5">
                  {DAY_PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDaysChange(d)}
                      className={`h-9 px-3 rounded-xl text-[13px] font-bold transition-all ${
                        days === d
                          ? 'bg-[#2B2437] text-white shadow-xs'
                          : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-neutral-100'
                      }`}
                    >
                      {d} दिन
                    </button>
                  ))}
                </div>

                <Stepper
                  value={days}
                  onChange={handleDaysChange}
                  min={1}
                  max={90}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Daily Cap Line */}
        <div className="text-[13px] text-[#4A4358] font-medium px-1">
          {STRINGS.budget.dailyCapLine(dailyAmount)}
        </div>

        {/* 4. Reach Estimation Card */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex flex-col gap-1.5">
          <span className="text-[12.5px] font-semibold text-[#6B7280]">
            {STRINGS.budget.reachWillDeliver}:
          </span>
          <div className="text-[16px] font-bold text-[#2B2437] tabular-nums">
            {STRINGS.budget.reachRangeLine(
              formatIN(reachBounds.lo),
              formatIN(reachBounds.hi)
            )}
          </div>

          {/* Condition notice & chip */}
          {limitType === 'audience' ? (
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[12px] text-[#C97F1E] font-medium leading-snug">
                {STRINGS.budget.audienceLimitedNote}
              </span>
              {recDaily && recDaily < dailyAmount && (
                <button
                  type="button"
                  onClick={() => handleDailySliderChange(recDaily)}
                  className="self-start px-2.5 py-1 rounded-full bg-white border border-[#FDE68A] text-[11.5px] font-bold text-[#E39026] shadow-xs active:scale-95"
                >
                  {STRINGS.budget.audienceLimitedChip(recDaily)}
                </button>
              )}
            </div>
          ) : (
            <span className="text-[12px] text-[#6B7280] pt-1">
              {STRINGS.budget.budgetLimitedNote}
            </span>
          )}
        </div>

        {/* 5. Start Options */}
        <div className="p-4 rounded-[20px] bg-white border border-[#E5E7EB] flex flex-col gap-2.5">
          <label className="text-[14px] font-bold text-[#2B2437]">
            विज्ञापन कब शुरू होगा?
          </label>

          <label className="flex items-center gap-2.5 text-[14px] text-[#2B2437] cursor-pointer">
            <input
              type="radio"
              name="startMode"
              checked={startMode === 'after_review'}
              onChange={() => handleStartModeChange('after_review')}
              className="w-4 h-4 accent-[#2B2437]"
            />
            <span>{STRINGS.budget.startModeImmediate}</span>
          </label>

          <label className="flex items-center gap-2.5 text-[14px] text-[#2B2437] cursor-pointer">
            <input
              type="radio"
              name="startMode"
              checked={startMode === 'scheduled'}
              onChange={() => handleStartModeChange('scheduled')}
              className="w-4 h-4 accent-[#2B2437]"
            />
            <span>{STRINGS.budget.startModeScheduled}</span>
          </label>

          {startMode === 'scheduled' && (
            <div className="pt-2 flex flex-col gap-1.5 pl-6 animate-fadeIn">
              <div className="relative">
                <input
                  type="date"
                  min={tomorrowStr}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full h-11 rounded-xl px-3 border border-[#E5E7EB] bg-[#F7F7F4] text-[14px] text-[#2B2437] outline-none"
                />
              </div>
              {formattedHindiDate && (
                <span className="text-[12.5px] font-semibold text-[#E39026]">
                  चयनित तारीख: {formattedHindiDate}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Total & CTA Bar */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={handleSubmit}
        showArrow={!isFromReview}
        summaryContent={
          <div className="w-full flex items-center justify-between">
            <div
              onClick={() => setShowBillSheet(true)}
              className="flex items-center gap-1 cursor-pointer select-none active:opacity-70"
            >
              <span className="font-extrabold text-[15px] text-[#2B2437]">
                कुल <AmountText amount={money.total} />
              </span>
              <span className="text-[12px] text-[#6B7280]">
                {STRINGS.common.totalWithGst}
              </span>
              <ChevronRight className="w-4 h-4 text-[#E39026]" />
            </div>

            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="text-[12px] font-semibold text-[#E39026] underline"
            >
              {STRINGS.budget.viewBill}
            </button>
          </div>
        }
      />

      {/* Bill Sheet */}
      <BillSheet
        isOpen={showBillSheet}
        onClose={() => setShowBillSheet(false)}
        daily={money.daily}
        days={money.days}
        subtotal={money.subtotal}
        gst={money.gst}
        total={money.total}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
