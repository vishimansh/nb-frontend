import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TickCircle } from 'iconsax-react';
import BackButton from '../components/common/BackButton';
import epaperEditions from '../data/epaperEditions.json';
import EPaperCard from '../components/epaper/EPaperCard';
import DatePickerModal from '../components/epaper/DatePickerModal';
import BottomTabBar from '../components/home/BottomTabBar';

const PRIMARY_CITIES = [
  { id: 'bhopal', name: 'भोपाल' },
  { id: 'indore', name: 'इंदौर' },
  { id: 'nagpur', name: 'नागपुर' },
  { id: 'raipur', name: 'रायपुर' },
];

const SECONDARY_CITIES = [
  { id: 'jabalpur', name: 'जबलपुर' },
  { id: 'gwalior', name: 'ग्वालियर' },
];

const CITY_NAME_MAP = {
  bhopal: 'भोपाल',
  indore: 'इंदौर',
  nagpur: 'नागपुर',
  raipur: 'रायपुर',
  jabalpur: 'जबलपुर',
  gwalior: 'ग्वालियर',
};

export default function EPaperPage() {
  const navigate = useNavigate();

  // State setup (Step 0)
  const [selectedCity, setSelectedCity] = useState('bhopal');
  const [isCityRowExpanded, setIsCityRowExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('28 अगस्त');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Active city name in Hindi
  const activeCityName = CITY_NAME_MAP[selectedCity] || 'भोपाल';

  // Visible cities list depending on expand state
  const visibleCities = isCityRowExpanded
    ? [...PRIMARY_CITIES, ...SECONDARY_CITIES]
    : PRIMARY_CITIES;

  // Trigger floating toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleDateSelect = (formattedDate) => {
    setSelectedDate(formattedDate);
    setIsDatePickerOpen(false);
    showToast(`${formattedDate} का ई-पेपर चुना गया`);
  };

  const handleRead = () => {
    // Toast removed on clicking padhein button
  };

  const handleShare = () => {
    showToast('ई-पेपर लिंक शेयर करें');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

      {/* Floating Action / Confirmation Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-[#18253B] text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10"
          >
            <TickCircle size={17} color="#E39026" variant="Bold" />
            <span className="leading-none">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Fixed Top Shell & Date-Picker Header */}
      <header className="px-4 py-3 bg-[#F7F7F4] border-b border-[#E5E7EB] sticky top-[54px] z-30 flex items-center justify-between shrink-0">
        {/* Left Group */}
        <div className="flex items-center gap-2.5">
          <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
          <div>
            <h1 className="text-[20px] font-bold text-[#18253B] leading-tight">
              ई-पेपर
            </h1>
            <p className="text-[11px] font-medium text-[#6B7280] mt-0.5 leading-none">
              आज का ई-पेपर पढ़ें
            </p>
          </div>
        </div>

        {/* Right Group (Date Picker Trigger) */}
        <button
          type="button"
          onClick={() => setIsDatePickerOpen(true)}
          className="h-9 px-3 bg-[#18253B] rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-transform hover:bg-[#101927]"
        >
          <Calendar size={15} color="#FFFFFF" variant="Linear" />
          <span className="text-[12px] font-bold text-white leading-none">
            {selectedDate}
          </span>
        </button>
      </header>

      {/* Step 3: Collapsible City Chip Filter Bar */}
      <div className="px-3 py-2.5 bg-[#F7F7F4] border-b border-[#E5E7EB]/80 flex flex-wrap gap-2 items-center justify-center transition-all duration-200 shrink-0">
        {visibleCities.map((city) => {
          const isActive = selectedCity === city.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => setSelectedCity(city.id)}
              className={`h-[38px] px-3.5 rounded-[12px] text-[13px] font-medium flex items-center justify-center relative transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-[#18253B] text-white border-2 border-[#18253B] font-bold shadow-xs'
                  : 'bg-white text-[#4B5563] border border-[#D1D5DB] hover:border-[#18253B]/40'
              }`}
            >
              {/* Active Dot Badge */}
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[#E39026] absolute top-1.5 left-1.5 border border-[#18253B]" />
              )}
              <span>{city.name}</span>
            </button>
          );
        })}

        {/* Trailing Expand / Collapse Toggle Chip */}
        {!isCityRowExpanded ? (
          <button
            type="button"
            onClick={() => setIsCityRowExpanded(true)}
            className="bg-[#FFF4E6] text-[#E39026] border border-[#FCD9B6] h-[38px] px-3 rounded-[12px] text-[13px] font-bold cursor-pointer active:scale-95 transition-transform"
          >
            और +
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsCityRowExpanded(false)}
            className="bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] h-[38px] px-3 rounded-[12px] text-[13px] font-bold cursor-pointer active:scale-95 transition-transform"
          >
            कम करें −
          </button>
        )}
      </div>

      {/* Step 4: 2-Column Edition Grid & Card Anatomy */}
      <main className="flex-1 overflow-y-auto scrollbar-none px-[15px] py-4 grid grid-cols-2 gap-[12px] justify-items-center pb-28 max-h-[660px]">
        {epaperEditions.map((edition) => (
          <EPaperCard
            key={edition.id}
            edition={edition}
            cityName={activeCityName}
            dateText={selectedDate}
            onRead={handleRead}
            onShare={handleShare}
          />
        ))}
      </main>

      {/* Step 2: 30-Day Archive Modal Sheet */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
      />

      {/* Step 5: Persistent Bottom Navigation Integration */}
      <BottomTabBar activeTab="epaper" />
    </div>
  );
}
