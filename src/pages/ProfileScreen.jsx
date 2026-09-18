import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/common/BackButton';
import {
  Camera,
  User,
  Call,
  TickCircle,
  Calendar,
  People,
  Location,
  ArrowDown2,
  Sms,
  SearchNormal1,
  CloseCircle,
  Warning2,
  ShieldTick,
} from 'iconsax-react';
import { useOnboarding } from '../context/OnboardingContext';

// Clean SVG Gender Symbols
function MaleSymbol({ size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="10" cy="14" r="5" />
      <path d="M19 5l-5.4 5.4" />
      <path d="M19 5h-5" />
      <path d="M19 5v5" />
    </svg>
  );
}

function FemaleSymbol({ size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7" />
      <path d="M9 18h6" />
    </svg>
  );
}

const TOP_CITIES = [
  'भोपाल',
  'इंदौर',
  'ग्वालियर',
  'जबलपुर',
  'उज्जैन',
  'रायपुर',
  'जयपुर',
  'नागपुर',
  'दमोह',
  'छिंदवाड़ा',
  'सागर',
  'रीवा',
  'सतना',
  'बिलासपुर',
  'दुर्ग',
  'भिलाई',
];

const POPULAR_CITY_CHIPS = [
  'भोपाल',
  'इंदौर',
  'ग्वालियर',
  'जबलपुर',
  'उज्जैन',
  'रायपुर',
  'जयपुर',
  'नागपुर',
];

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

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from({ length: 65 }, (_, i) => String(2015 - i));

export default function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile = {}, setUserProfile } = useOnboarding();

  // Baseline verified phone snapshot
  const initialVerifiedPhone = userProfile.phone || '+91 3425895426';

  // Form states
  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '+91 3425895426');
  const [isPhoneVerified, setIsPhoneVerified] = useState(
    userProfile.isPhoneVerified ?? true
  );
  const [dob, setDob] = useState(userProfile.dob || '');
  const [gender, setGender] = useState(userProfile.gender || 'male');
  const [city, setCity] = useState(userProfile.city || 'भोपाल');
  const [email, setEmail] = useState(userProfile.email || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || null);

  // Phone input change -> marks unverified if modified
  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    if (val.trim() !== initialVerifiedPhone.trim()) {
      setIsPhoneVerified(false);
    } else {
      setIsPhoneVerified(true);
    }
  };

  // OTP Verification Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    let timerInterval = null;
    if (isOtpModalOpen && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isOtpModalOpen, otpTimer]);

  const handleOpenOtpModal = () => {
    setOtpValues(['', '', '', '']);
    setOtpTimer(30);
    setIsOtpModalOpen(true);
    setToastMessage(`OTP ${phone} पर भेजा गया है`);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 250);
  };

  const handleOtpChange = (index, value) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    const newOtp = [...otpValues];
    newOtp[index] = char;
    setOtpValues(newOtp);

    if (char && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otpValues.join('');
    if (entered.length < 4) {
      setToastMessage('कृपया 4-अंकों का OTP दर्ज करें');
      return;
    }
    setIsPhoneVerified(true);
    setIsOtpModalOpen(false);
    setToastMessage('नंबर सफलतापूर्वक वेरिफाइड हो गया!');
  };

  // Date of Birth Modal State
  const [isDobModalOpen, setIsDobModalOpen] = useState(false);
  const [draftDay, setDraftDay] = useState('15');
  const [draftMonth, setDraftMonth] = useState('अगस्त');
  const [draftYear, setDraftYear] = useState('1998');

  // Month & Day refs for scroll positioning
  const dayListRef = useRef(null);
  const monthListRef = useRef(null);
  const yearListRef = useRef(null);

  const handleOpenDobModal = () => {
    if (dob) {
      const parts = dob.split(' ');
      if (parts.length === 3) {
        setDraftDay(parts[0]);
        setDraftMonth(parts[1]);
        setDraftYear(parts[2]);
      }
    }
    setIsDobModalOpen(true);
  };

  const handleConfirmDob = () => {
    const formatted = `${draftDay} ${draftMonth} ${draftYear}`;
    setDob(formatted);
    setIsDobModalOpen(false);
    setToastMessage(`जन्मतिथि सेट: ${formatted}`);
  };

  // City modal & search state with smooth selection transition
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isSelectingCity, setIsSelectingCity] = useState(false);

  const handleSelectCity = (chosenCity) => {
    if (isSelectingCity) return;
    setIsSelectingCity(true);
    setCity(chosenCity);

    // Delightful visual feedback delay so the user clearly perceives the active highlight & checkmark before the sheet smoothly slides down
    setTimeout(() => {
      setIsCityModalOpen(false);
      setIsSelectingCity(false);
      setToastMessage(`शहर चुना गया: ${chosenCity}`);
    }, 280);
  };

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);

  // Avatar initial letter
  const getAvatarInitial = () => {
    if (name && name.trim().length > 0) {
      return name.trim().charAt(0).toUpperCase();
    }
    return 'S';
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleBack = () => {
    const from = location.state?.from;
    const previousRoute = location.state?.previousRoute;

    if (from === 'menu') {
      navigate('/menu');
    } else if (from === 'tab') {
      navigate(previousRoute || '/feed');
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      ...userProfile,
      name,
      phone,
      isPhoneVerified,
      dob,
      gender,
      city,
      email,
      avatarUrl,
    };

    setUserProfile(updatedProfile);
    setToastMessage('प्रोफाइल सफलतापूर्वक अपडेट हो गई');

    setTimeout(() => {
      handleBack();
    }, 800);
  };

  const filteredCities = TOP_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearchQuery.trim().toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Status Bar Clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

      {/* Floating Success / Feedback Toast */}
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
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Fixed Header Bar */}
      <header className="px-4 py-3 bg-[#F7F7F4] flex items-center justify-between border-b border-[#E5E7EB]/80 shrink-0 z-10">
        <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />

        <h1 className="text-[18px] font-bold text-[#18253B] tracking-tight text-center flex-1 pr-[46px]">
          प्रोफाइल एडिट करें
        </h1>
      </header>

      {/* 2. Scrollable Middle Body (Zero overlap, ample bottom clearance) */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-0 py-2 space-y-4">
        {/* Introductory Subtext */}
        <div className="pt-3 pb-1 px-6 text-center shrink-0">
          <p className="text-[13px] font-normal text-[#6B7280] leading-relaxed">
            अपनी जानकारी भरें ताकि हम आपको ज़्यादा<br />
            पसंद की खबरें दिखा सकें
          </p>
        </div>

        {/* Avatar Upload & Update Stack */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-[110px] h-[110px] rounded-full p-1 ring-8 ring-[#F7C873]/25 bg-gradient-to-b from-[#F7C873]/40 to-[#E39026]/10 relative flex items-center justify-center shadow-inner">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[96px] h-[96px] rounded-full bg-[#18253B] border-2 border-[#E39026] overflow-hidden flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[42px] font-bold text-white tracking-wider">
                  {getAvatarInitial()}
                </span>
              )}
            </div>

            {/* Camera Action Badge (at 4 o'clock) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E39026] text-white flex items-center justify-center border-2 border-white shadow-md cursor-pointer active:scale-95 z-10"
              title="फ़ोटो बदलें"
            >
              <Camera size={16} color="#FFFFFF" variant="Bold" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[13px] font-bold text-[#18253B] mt-2.5 cursor-pointer hover:underline"
          >
            फ़ोटो बदलें
          </button>

          {/* Hidden File Picker */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Section 1: "व्यक्तिगत जानकारी" (Personal Info) */}
        <div className="mx-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
          {/* Header with Unified Amber Squircle Badge */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
              <User size={16} color="#D48E28" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B]">व्यक्तिगत जानकारी</h2>
          </div>

          {/* Inner Gray Container */}
          <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
            {/* Field: पूरा नाम */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                पूरा नाम
              </label>
              <div className="h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center gap-2.5 focus-within:border-[#18253B] focus-within:ring-2 focus-within:ring-[#18253B]/10 shadow-2xs transition-all">
                <User size={18} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="अपना नाम डालें"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-[14px] font-medium text-[#18253B] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Field: मोबाइल नंबर with Dynamic Verification Badge */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                मोबाइल नंबर
              </label>
              <div className="h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center justify-between shadow-2xs focus-within:border-[#18253B] transition-all">
                <div className="flex items-center gap-2.5 flex-1 mr-2">
                  <Call size={18} color="#9CA3AF" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="text-[14px] font-semibold text-[#18253B] outline-none bg-transparent w-full"
                  />
                </div>

                {/* Verification Badge Status */}
                {isPhoneVerified ? (
                  <div className="bg-[#FFF9EE] border border-[#F7C873] text-[#E39026] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-2xs shrink-0 select-none">
                    <TickCircle size={13} color="#E39026" variant="Bold" />
                    <span className="text-[11px] font-bold">वेरिफाइड</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenOtpModal}
                    className="bg-[#FFF4E5] border border-[#F6C38A] text-[#C25E00] hover:bg-[#FFEBD4] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer active:scale-95 transition-all"
                    title="OTP प्राप्त करके नंबर वेरिफाई करें"
                  >
                    <Warning2 size={13} color="#C25E00" variant="Bold" />
                    <span className="text-[11px] font-bold">वेरिफाइड नहीं</span>
                  </button>
                )}
              </div>
            </div>

            {/* Field: जन्मतिथि (Interactive & Smooth Trigger Box) */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                जन्मतिथि
              </label>
              <button
                type="button"
                onClick={handleOpenDobModal}
                className="w-full h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-400 active:scale-[0.985] active:bg-[#F9FAFB] transition-all duration-150 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} color={dob ? '#D48E28' : '#9CA3AF'} />
                  <span
                    className={`text-[14px] ${
                      dob ? 'text-[#18253B] font-semibold' : 'text-[#9CA3AF] font-medium'
                    }`}
                  >
                    {dob || 'अपनी जन्मतिथि चुनें'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: "आपके बारे में" (About You) */}
        <div className="mx-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
          {/* Header with Unified Amber Squircle Badge */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
              <People size={16} color="#D48E28" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B]">आपके बारे में</h2>
          </div>

          {/* Inner Gray Container */}
          <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
            {/* Field: जेंडर */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                जेंडर
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Male Option */}
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                    gender === 'male'
                      ? 'bg-[#18253B] text-white border border-[#18253B] shadow-sm font-bold'
                      : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#18253B]/40'
                  }`}
                >
                  <MaleSymbol
                    size={17}
                    color={gender === 'male' ? '#FFFFFF' : '#4B5563'}
                  />
                  <span>पुरुष</span>
                  {gender === 'male' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E39026] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                  )}
                </button>

                {/* Female Option */}
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                    gender === 'female'
                      ? 'bg-[#18253B] text-white border border-[#18253B] shadow-sm font-bold'
                      : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#18253B]/40'
                  }`}
                >
                  <FemaleSymbol
                    size={17}
                    color={gender === 'female' ? '#FFFFFF' : '#4B5563'}
                  />
                  <span>महिला</span>
                  {gender === 'female' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E39026] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                  )}
                </button>

                {/* Other Option */}
                <button
                  type="button"
                  onClick={() => setGender('other')}
                  className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                    gender === 'other'
                      ? 'bg-[#18253B] text-white border border-[#18253B] shadow-sm font-bold'
                      : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#18253B]/40'
                  }`}
                >
                  <User
                    size={17}
                    color={gender === 'other' ? '#FFFFFF' : '#4B5563'}
                  />
                  <span>अन्य</span>
                  {gender === 'other' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E39026] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                  )}
                </button>
              </div>
            </div>

            {/* Field: शहर (Interactive Trigger Box with Animated Chevron) */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                शहर
              </label>
              <button
                type="button"
                onClick={() => {
                  setCitySearchQuery('');
                  setIsCityModalOpen(true);
                }}
                className="w-full h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-400 active:scale-[0.985] active:bg-[#F9FAFB] transition-all duration-150 text-left"
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <Location size={20} color="#18253B" variant="Bold" />
                  <motion.span
                    key={city}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="text-[15px] font-semibold text-[#18253B]"
                  >
                    {city}
                  </motion.span>
                </div>
                <motion.div
                  animate={{ rotate: isCityModalOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowDown2 size={16} color="#9CA3AF" />
                </motion.div>
              </button>
            </div>

            {/* Field: ईमेल आईडी */}
            <div>
              <label className="text-[13px] font-bold text-[#18253B] block mb-1.5">
                ईमेल आईडी
              </label>
              <div className="h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#18253B] focus-within:ring-2 focus-within:ring-[#18253B]/10 transition-all">
                <Sms size={18} color="#9CA3AF" />
                <input
                  type="email"
                  placeholder="ईमेल आईडी डालें (वैकल्पिक)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-[14px] font-medium text-[#18253B] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll bottom clearance spacer */}
        <div className="h-10 shrink-0" />
      </div>

      {/* 3. Pinned Bottom Save Button Bar */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] pt-3 pb-8 px-4 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[56px] rounded-[16px] bg-[#18253B] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#233550] transition-colors"
        >
          सेव करें
        </button>
      </div>

      {/* 4. OTP Verification Bottom Sheet Modal */}
      <AnimatePresence>
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOtpModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
              className="relative z-10 bg-white rounded-t-[28px] p-6 shadow-2xl flex flex-col items-center"
            >
              {/* Drag Handle */}
              <div className="w-10 h-1 rounded-full bg-gray-300 mb-4" />

              <div className="w-12 h-12 rounded-full bg-[#FFF9EE] border border-[#F7C873] flex items-center justify-center text-[#E39026] mb-3">
                <ShieldTick size={24} color="#E39026" variant="Bold" />
              </div>

              <h3 className="text-[18px] font-bold text-[#18253B] text-center">
                मोबाइल नंबर वेरिफाई करें
              </h3>
              <p className="text-[13px] text-[#6B7280] text-center mt-1 max-w-[280px]">
                हमने <span className="font-bold text-[#18253B]">{phone}</span> पर 4-अंकों का कोड भेजा है
              </p>

              {/* 4-Cell OTP Input */}
              <div className="flex items-center gap-3 my-5">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-13 rounded-[14px] bg-[#F9FAFB] border-2 border-[#E5E7EB] text-center text-[20px] font-bold text-[#18253B] outline-none focus:border-[#E39026] focus:bg-white shadow-2xs transition-all"
                  />
                ))}
              </div>

              {/* Quick test autofill helper */}
              <button
                type="button"
                onClick={() => setOtpValues(['1', '2', '3', '4'])}
                className="text-xs text-[#E39026] font-semibold mb-4 hover:underline cursor-pointer"
              >
                OTP भरें (1234)
              </button>

              {/* Resend Timer */}
              <div className="text-[13px] text-[#6B7280] mb-5">
                {otpTimer > 0 ? (
                  <span>{otpTimer} सेकंड बाद दोबारा भेजें</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOtpTimer(30)}
                    className="text-[#E39026] font-bold cursor-pointer hover:underline"
                  >
                    OTP फिर से भेजें
                  </button>
                )}
              </div>

              {/* Verify CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-[50px] rounded-[16px] bg-[#18253B] text-white text-[15px] font-bold active:scale-[0.99] cursor-pointer hover:bg-[#233550] shadow-md transition-all"
              >
                वेरिफाई करें
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Refined Date of Birth Picker Bottom Sheet Modal (Tactile Wheel-Style Columns) */}
      <AnimatePresence>
        {isDobModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setIsDobModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                y: {
                  duration: 0.36,
                  ease: [0.32, 0.72, 0, 1],
                },
              }}
              className="relative z-10 bg-white rounded-t-[28px] max-h-[75vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h3 className="text-[17px] font-bold text-[#18253B]">
                    अपनी जन्मतिथि चुनें
                  </h3>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">
                    दिन, माह और वर्ष का चयन करें
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDobModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer rounded-full active:bg-gray-100 transition-colors"
                >
                  <CloseCircle size={22} color="#9CA3AF" />
                </button>
              </div>

              {/* Tactile Column Picker Container */}
              <div className="px-4 py-3 bg-[#F9FAFB] border-b border-gray-100">
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Column 1: दिन (Day) */}
                  <div className="bg-white rounded-[16px] p-2 border border-[#E5E7EB] shadow-2xs">
                    <span className="text-[11px] font-bold text-[#6B7280] block text-center mb-1">
                      दिन
                    </span>
                    <div
                      ref={dayListRef}
                      className="h-[150px] overflow-y-auto scrollbar-none divide-y divide-gray-50"
                    >
                      {DAYS.map((d) => {
                        const isSelected = draftDay === d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDraftDay(d)}
                            className={`w-full h-[36px] flex items-center justify-center rounded-[8px] text-[14px] cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#18253B] text-white font-bold shadow-xs'
                                : 'text-[#4B5563] hover:bg-gray-50 font-medium'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: माह (Month) */}
                  <div className="bg-white rounded-[16px] p-2 border border-[#E5E7EB] shadow-2xs">
                    <span className="text-[11px] font-bold text-[#6B7280] block text-center mb-1">
                      माह
                    </span>
                    <div
                      ref={monthListRef}
                      className="h-[150px] overflow-y-auto scrollbar-none divide-y divide-gray-50"
                    >
                      {HINDI_MONTHS.map((m) => {
                        const isSelected = draftMonth === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setDraftMonth(m)}
                            className={`w-full h-[36px] flex items-center justify-center rounded-[8px] text-[13px] cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#18253B] text-white font-bold shadow-xs'
                                : 'text-[#4B5563] hover:bg-gray-50 font-medium'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 3: वर्ष (Year) */}
                  <div className="bg-white rounded-[16px] p-2 border border-[#E5E7EB] shadow-2xs">
                    <span className="text-[11px] font-bold text-[#6B7280] block text-center mb-1">
                      वर्ष
                    </span>
                    <div
                      ref={yearListRef}
                      className="h-[150px] overflow-y-auto scrollbar-none divide-y divide-gray-50"
                    >
                      {YEARS.map((y) => {
                        const isSelected = draftYear === y;
                        return (
                          <button
                            key={y}
                            type="button"
                            onClick={() => setDraftYear(y)}
                            className={`w-full h-[36px] flex items-center justify-center rounded-[8px] text-[14px] cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#18253B] text-white font-bold shadow-xs'
                                : 'text-[#4B5563] hover:bg-gray-50 font-medium'
                            }`}
                          >
                            {y}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Preview & Confirm CTA */}
              <div className="p-4 bg-white flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[13px] text-[#6B7280] font-medium">चुनी गई तिथि</span>
                  <span className="text-[15px] font-bold text-[#D48E28]">
                    {draftDay} {draftMonth} {draftYear}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmDob}
                  className="w-full h-[50px] rounded-[16px] bg-[#18253B] text-white text-[15px] font-bold active:scale-[0.99] cursor-pointer hover:bg-[#233550] shadow-md transition-all"
                >
                  पुष्टि करें
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Refined City Selection Bottom Sheet Modal (Quick Chips + Fluid Search) */}
      <AnimatePresence>
        {isCityModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => {
                if (!isSelectingCity) setIsCityModalOpen(false);
              }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                y: {
                  duration: 0.38,
                  ease: [0.32, 0.72, 0, 1], // Apple iOS bottom sheet dismissal curve
                },
              }}
              className="relative z-10 bg-white rounded-t-[28px] max-h-[78vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="pt-3 pb-2 flex justify-center">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              {/* Header */}
              <div className="px-5 pb-3 pt-1 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h3 className="text-[17px] font-bold text-[#18253B]">
                    अपना शहर चुनें
                  </h3>
                  <p className="text-[12px] text-[#6B7280]">
                    स्थानीय समाचारों के लिए अपना प्राथमिक शहर चुनें
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isSelectingCity) setIsCityModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer rounded-full active:bg-gray-100 transition-colors"
                >
                  <CloseCircle size={22} color="#9CA3AF" />
                </button>
              </div>

              {/* Search Bar with Instant Clear */}
              <div className="p-4 border-b border-gray-100 bg-[#F9FAFB]">
                <div className="h-[46px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#18253B] focus-within:ring-2 focus-within:ring-[#18253B]/10 transition-all">
                  <SearchNormal1 size={17} color="#9CA3AF" />
                  <input
                    type="text"
                    placeholder="शहर खोजें..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="text-[14px] font-medium text-[#18253B] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                    autoFocus
                  />
                  {citySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCitySearchQuery('')}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                      <CloseCircle size={16} color="#9CA3AF" />
                    </button>
                  )}
                </div>

                {/* Quick Popular Cities Horizontal Pill Strip */}
                {!citySearchQuery && (
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-[#6B7280] block mb-2">
                      लोकप्रिय शहर
                    </span>
                    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                      {POPULAR_CITY_CHIPS.map((chip) => {
                        const isSelected = city === chip;
                        return (
                          <motion.button
                            key={chip}
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleSelectCity(chip)}
                            className={`px-3.5 py-1.5 rounded-[12px] text-[13px] whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#18253B] text-white font-bold shadow-xs'
                                : 'bg-white border border-[#E5E7EB] text-[#4B5563] font-medium hover:border-[#D1D5DB]'
                            }`}
                          >
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                              >
                                <TickCircle size={14} color="#FFFFFF" variant="Bold" />
                              </motion.span>
                            )}
                            <span>{chip}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Alphabetical Cities List */}
              <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-100">
                {filteredCities.length > 0 ? (
                  filteredCities.map((cityName) => {
                    const isSelected = city === cityName;
                    return (
                      <motion.button
                        key={cityName}
                        type="button"
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectCity(cityName)}
                        className={`w-full h-[52px] px-3 rounded-[14px] flex items-center justify-between cursor-pointer transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-[#FFF9EE] text-[#D48E28] font-bold border border-[#F6E0BB]/70 shadow-2xs'
                            : 'hover:bg-gray-50 text-[#18253B] font-medium border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                              isSelected ? 'bg-[#FDF5E8]' : 'bg-gray-100'
                            }`}
                          >
                            <Location
                              size={16}
                              color={isSelected ? '#D48E28' : '#9CA3AF'}
                              variant={isSelected ? 'Bold' : 'Linear'}
                            />
                          </div>
                          <span className="text-[15px]">{cityName}</span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="flex items-center gap-1.5"
                          >
                            <span className="text-[11px] font-bold text-[#D48E28] bg-[#FDF5E8] px-2 py-0.5 rounded-full border border-[#F6E0BB]">
                              चुना हुआ
                            </span>
                            <TickCircle size={18} color="#D48E28" variant="Bold" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-[14px] text-gray-400">
                    कोई शहर नहीं मिला
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
