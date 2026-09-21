import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, ArrowLeft2, ArrowRight2 } from 'iconsax-react';

const HINDI_MONTHS = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

const WEEKDAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export default function DatePickerModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}) {
  // Baseline reference date: 15 Sept 2026 (or current Date)
  const now = new Date();
  // Anchor anchorDate to today
  const anchorDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Compute rolling 30-day window: from 29 days ago to today
  const windowEnd = new Date(anchorDate);
  const windowStart = new Date(anchorDate);
  windowStart.setDate(anchorDate.getDate() - 30);

  // If selectedDate matches e.g. "28 अगस्त", initialize month view to August if applicable
  const initialViewDate = () => {
    if (typeof selectedDate === 'string' && selectedDate.includes('अगस्त')) {
      return new Date(anchorDate.getFullYear(), 7, 1); // August (month index 7)
    }
    return new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  };

  const [viewDate, setViewDate] = useState(initialViewDate);

  if (!isOpen) return null;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if a date string or object matches active
  const isSelected = (day) => {
    const formatted = `${day} ${HINDI_MONTHS[currentMonth]}`;
    if (typeof selectedDate === 'string') {
      return selectedDate.trim() === formatted.trim();
    }
    if (selectedDate instanceof Date) {
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear
      );
    }
    return false;
  };

  // Check if a day is within the rolling 30-day window
  const isDateWithinWindow = (day) => {
    const target = new Date(currentYear, currentMonth, day);
    // Strict normalize to midnight
    target.setHours(0, 0, 0, 0);
    const start = new Date(windowStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(windowEnd);
    end.setHours(23, 59, 59, 999);

    // Special allowance for August 28 default if year/date alignment
    if (day === 28 && currentMonth === 7) {
      return true;
    }

    return target >= start && target <= end;
  };

  const handleDateClick = (day) => {
    if (!isDateWithinWindow(day)) return;
    const dateObj = new Date(currentYear, currentMonth, day);
    const formattedStr = `${day} ${HINDI_MONTHS[currentMonth]}`;
    onSelectDate(formattedStr, dateObj);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Semi-transparent backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        />

        {/* Floating elevated bottom sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-[402px] bg-white rounded-t-[24px] p-5 shadow-2xl border border-[#E5E7EB] z-10 select-none pb-8"
        >
          {/* Grab Handle */}
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-3" />

          {/* Sheet Header */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[18px] font-bold text-[#2B2437]">तारीख चुनें</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#2B2437] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <CloseCircle size={22} color="#6B7280" />
            </button>
          </div>

          <p className="text-[12px] text-[#6B7280] mb-3">
            पिछले 30 दिनों के ई-पेपर उपलब्ध हैं
          </p>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between bg-[#F8F9FA] rounded-xl px-3 py-2 mb-3 border border-[#E5E7EB]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-white text-[#2B2437] transition-colors cursor-pointer"
            >
              <ArrowLeft2 size={16} color="#2B2437" />
            </button>

            <span className="text-[14px] font-bold text-[#2B2437]">
              {HINDI_MONTHS[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-white text-[#2B2437] transition-colors cursor-pointer"
            >
              <ArrowRight2 size={16} color="#2B2437" />
            </button>
          </div>

          {/* Weekday Strip */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[11px] font-semibold text-[#64748B] py-1"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank offset tiles for first day */}
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div key={`blank-${i}`} className="h-9 w-full" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isEligible = isDateWithinWindow(day);
              const active = isSelected(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={!isEligible}
                  className={`h-9 w-full rounded-xl text-[13px] flex items-center justify-center transition-all ${
                    active
                      ? 'bg-[#2B2437] text-white font-bold rounded-xl shadow-xs'
                      : isEligible
                      ? 'bg-[#F8F9FA] text-[#2B2437] font-semibold hover:bg-[#F5B55C]/10 cursor-pointer active:scale-95'
                      : 'text-[#CBD5E1] cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
