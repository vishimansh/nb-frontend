import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, People, MoneyChange } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

const BUDGET_PRESETS = [250, 500, 1000, 1500];

export default function AdvertiserBudgetScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();

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

  const baseReach = draftCampaign.baseReach || 7631;
  const estimatedReach = Math.min(
    Math.round(baseReach * 3.5),
    Math.max(1200, Math.round(dailyBudget * 28.5 * (durationDays / 7)))
  );

  const subtotal = dailyBudget * durationDays;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handleProceed = () => {
    updateDraftCampaign({
      dailyBudget,
      durationDays,
      startDate,
      estimatedReach,
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

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="6"
        totalSteps="7"
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
          {/* Top Card: बजट और अवधि */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
              <MoneyChange size={22} color="#E39026" variant="Bold" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#2B2437] leading-tight">
                बजट और दिन चुनें
              </h1>
              <p className="text-[13px] text-[#6B7280] font-normal mt-0.5 leading-snug">
                रोज़ का बजट और विज्ञापन के दिन तय करें
              </p>
            </div>
          </div>

          {/* Daily Budget Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[12px] font-semibold text-[#6B7280] tracking-wider block">
                  रोज़ का बजट
                </span>
                <span className="text-[12px] text-[#2B2437] font-medium mt-0.5 block">
                  कम से कम <span className="font-bold text-[#2B2437]">₹100/दिन</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[26px] font-black text-[#2B2437] leading-none">
                  ₹{dailyBudget}
                </span>
                <span className="text-[13px] font-medium text-[#6B7280] ml-0.5">/दिन</span>
              </div>
            </div>

            {/* Refined and Smooth Price Selector Track */}
            <div className="pt-7 pb-2 relative">
              {/* Floating Price Tooltip above Drag Point */}
              <div
                className={`absolute -top-1 -translate-x-1/2 bg-[#2B2437] text-white text-[11.5px] font-extrabold px-3 py-0.5 rounded-full shadow-md pointer-events-none transition-transform duration-100 ease-out flex items-center gap-1 z-30 select-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#2B2437] ${
                  isDragging ? 'scale-110 shadow-lg' : ''
                }`}
                style={{ left: `${tooltipLeft}%` }}
              >
                <span>₹{dailyBudget.toLocaleString('en-IN')}</span>
              </div>

              {/* Slider Track & Line System */}
              <div className="relative h-7 flex items-center">
                {/* Background Line Track */}
                <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden relative">
                  {/* Smooth Filled Line Portion */}
                  <div
                    className="h-full bg-gradient-to-r from-[#E39026] via-[#F5B55C] to-[#E39026] rounded-full transition-[width] duration-75 ease-out shadow-2xs"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>

                {/* Subtle Landmark Indicator Dots along the Line */}
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

                {/* Smooth Custom Interactive Range Input */}
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
                  className="custom-budget-range absolute inset-0 w-full h-full z-20"
                  aria-label="दैनिक विज्ञापन बजट चुनें"
                />
              </div>

              {/* Line Boundary Min / Max Legend */}
              <div className="flex justify-between items-center mt-1 px-0.5 text-[11px] font-semibold text-[#9CA3AF]">
                <span>₹{minBudget} (न्यूनतम)</span>
                <span>₹{maxBudget.toLocaleString('en-IN')} (अधिकतम)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {BUDGET_PRESETS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDailyBudget(amt)}
                  className={`flex-1 h-[36px] rounded-full text-[13px] font-medium border transition-all cursor-pointer ${
                    dailyBudget === amt
                      ? 'border-[#2B2437] bg-[#2B2437] text-white shadow-xs'
                      : 'border-[#D1D5DB] bg-white text-[#2B2437] hover:border-[#2B2437]'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Reach Estimation Box */}
            <div className="bg-[#FFFBF0] border border-[#FDE68A] rounded-[16px] p-3 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-[#FDF5E8] flex items-center justify-center text-[#E39026] shrink-0">
                <People size={18} color="#E39026" variant="Bold" />
              </div>
              <p className="text-[12.5px] text-[#2B2437] font-medium leading-snug">
                ₹{dailyBudget}/दिन पर, आपका विज्ञापन लगभग{' '}
                <span className="font-bold text-[#E39026]">
                  ~{estimatedReach.toLocaleString('en-IN')}
                </span>{' '}
                स्थानीय लोगों तक पहुंचेगा।
              </p>
            </div>
          </div>

          {/* Campaign Schedule Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                <Calendar size={18} color="#E39026" variant="Bold" />
              </div>
              <div>
                <h2 className="text-[15.5px] font-bold text-[#2B2437] leading-tight">
                  विज्ञापन के दिन
                </h2>
                <p className="text-[12px] text-[#6B7280] font-normal mt-0.5">
                  कब से शुरू करना है और कितने दिन चलाना है
                </p>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
                शुरू होने की तारीख
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] flex items-center px-3.5 shadow-2xs">
                <Calendar size={18} color="#4B5563" className="mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full text-[14px] font-medium text-[#2B2437] outline-none font-mono"
                />
              </div>
            </div>

            {/* Number of Days with Stepper */}
            <div>
              <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
                कितने दिन चलाना है
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] flex items-center justify-between px-3 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrementDays}
                  className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] hover:bg-[#E5E7EB] flex items-center justify-center font-bold text-[18px] text-[#2B2437] cursor-pointer active:scale-95 transition-transform"
                >
                  −
                </button>
                <span className="text-[16px] font-bold text-[#2B2437] font-mono">
                  {durationDays} <span className="font-medium text-[13px] text-[#6B7280]">दिन</span>
                </span>
                <button
                  type="button"
                  onClick={handleIncrementDays}
                  className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] hover:bg-[#E5E7EB] flex items-center justify-center font-bold text-[18px] text-[#2B2437] cursor-pointer active:scale-95 transition-transform"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* TOTAL INVESTMENT Card (NB App Purple #2B2437) */}
          <div className="bg-[#2B2437] text-white rounded-[20px] p-4 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#F5B55C] uppercase block">
                  कुल खर्च ({durationDays} दिन)
                </span>
                <span className="text-[12px] text-[#E2E8F0] font-normal mt-0.5 block">
                  विज्ञापन बजट: ₹{dailyBudget} × {durationDays} दिन = ₹{subtotal.toLocaleString('en-IN')}
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

        {/* Action Button: आगे बढ़ें */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <span>आगे बढ़ें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
