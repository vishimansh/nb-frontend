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
  Man,
  Woman,
  Shop,
  ShieldSecurity,
  Eye,
  EyeSlash,
  Edit2,
  Logout,
} from 'iconsax-react';
import { useOnboarding } from '../context/OnboardingContext';
import { useAdvertiser } from '../context/AdvertiserContext';
import CategorySheet, { CATEGORY_ICON_MAP } from '../flows/v2/components/sheets/CategorySheet';
import CitySheet from '../flows/v2/components/sheets/CitySheet';
import { lookupCityByPincode, PINCODE_MAP } from '../flows/v2/data/pincodes';
import { getCategoryById, CATEGORIES } from '../flows/v2/data/categories';
import { getCityById } from '../flows/v2/data/cities';
import { loadSavedAccount, saveAccount, loadSavedState, saveState } from '../flows/v2/utils/autosave';
import { processImageFile } from '../flows/v2/utils/imageTools';
import { Store } from 'lucide-react';


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
  const {
    draftCampaign = {},
    updateDraftCampaign,
    setIsBusinessProfileSaved,
    businessProfile = {},
    updateBusinessProfile,
    campaigns = [],
    advertiserAuth = {},
    setAdvertiserAuth,
    logoutAdvertiser,
  } = useAdvertiser();

  const [profileType, setProfileType] = useState(
    location.state?.tab === 'business' ? 'business' : 'user'
  );

  // Baseline verified phone snapshot
  const initialVerifiedPhone = userProfile.phone || '';

  // User Form states
  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [isPhoneVerified, setIsPhoneVerified] = useState(
    userProfile.isPhoneVerified ?? false
  );
  const [dob, setDob] = useState(userProfile.dob || '');
  const [gender, setGender] = useState(userProfile.gender || '');
  const [city, setCity] = useState(userProfile.city || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || null);

  // Business Profile Form states (Flow B Shop Concept)
  const flowBAccount = loadSavedAccount() || {};
  const flowBState = loadSavedState() || {};
  const flowBShop = flowBAccount.shop || flowBState.shop || {};

  const [businessName, setBusinessName] = useState(
    flowBShop.name || draftCampaign.businessName || businessProfile.businessName || ''
  );
  const [businessOwnerName, setBusinessOwnerName] = useState(
    flowBShop.ownerName || draftCampaign.ownerName || businessProfile.ownerName || ''
  );

  const initialCatId = (() => {
    if (flowBShop.categoryId) return flowBShop.categoryId;
    const existingCat = flowBShop.category || draftCampaign.businessCategory || businessProfile.businessCategory;
    if (existingCat) {
      const match = CATEGORIES.find((c) => c.id === existingCat || c.label === existingCat);
      if (match) return match.id;
    }
    return 'grocery';
  })();
  const [businessCategory, setBusinessCategory] = useState(initialCatId);

  const [businessPhone, setBusinessPhone] = useState(
    flowBAccount.phone || flowBShop.phone || draftCampaign.phone || businessProfile.phone || advertiserAuth.phone || userProfile.phone || ''
  );
  const [businessEmail, setBusinessEmail] = useState(
    flowBShop.email || draftCampaign.email || businessProfile.email || ''
  );
  const [businessLogoUrl, setBusinessLogoUrl] = useState(
    flowBShop.logoDataUrl || draftCampaign.businessLogoUrl || businessProfile.businessLogoUrl || null
  );
  const [storeAddress, setStoreAddress] = useState(
    flowBShop.address || draftCampaign.storeAddress || businessProfile.storeAddress || ''
  );

  const initialPincode = flowBShop.pincode || draftCampaign.pincode || businessProfile.pincode || '';
  const [pincode, setPincode] = useState(initialPincode);

  const initialResolvedCity = (() => {
    if (initialPincode && initialPincode.length === 6) {
      const found = lookupCityByPincode(initialPincode);
      if (found) return found;
    }
    if (flowBShop.cityId) {
      const found = getCityById(flowBShop.cityId);
      if (found) return found;
    }
    if (flowBShop.city) {
      return { id: flowBShop.cityId || '', name: flowBShop.city, state: flowBShop.state || 'मध्य प्रदेश' };
    }
    return null;
  })();
  const [resolvedCity, setResolvedCity] = useState(initialResolvedCity);
  const [pincodeNotFound, setPincodeNotFound] = useState(false);

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isShopCitySheetOpen, setIsShopCitySheetOpen] = useState(false);

  const [errors, setErrors] = useState({});

  const businessFileInputRef = useRef(null);

  const handleBusinessLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const processed = await processImageFile(file, 256, 0.85);
        setBusinessLogoUrl(processed.dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBusinessLogoUrl(event.target?.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePincodeChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(digits);
    if (errors.pincode) {
      setErrors((prev) => ({ ...prev, pincode: null }));
    }
    if (digits.length === 6) {
      const foundCity = lookupCityByPincode(digits);
      if (foundCity) {
        setResolvedCity(foundCity);
        setPincodeNotFound(false);
      } else {
        setResolvedCity(null);
        setPincodeNotFound(true);
      }
    } else {
      setResolvedCity(null);
      setPincodeNotFound(false);
    }
  };

  const handleSingleCityPick = (cId) => {
    const cityObj = getCityById(cId);
    if (cityObj) {
      setResolvedCity(cityObj);
      setPincodeNotFound(false);
      const matchingPin = Object.entries(PINCODE_MAP).find(([, id]) => id === cId)?.[0];
      if (matchingPin) {
        setPincode(matchingPin);
      }
      if (errors.pincode) {
        setErrors((prev) => ({ ...prev, pincode: null }));
      }
      setToastMessage(`शहर चुना गया: ${cityObj.name || cityObj.nameHi}`);
    }
  };

  // Phone input change -> marks unverified if modified & clears phone error
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
    if (digits.trim() !== initialVerifiedPhone.trim()) {
      setIsPhoneVerified(false);
    } else {
      setIsPhoneVerified(true);
    }
  };

  // Input Validation for User Profile
  const validateUserForm = () => {
    const errs = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = 'कृपया अपना पूरा नाम दर्ज करें';
    } else if (trimmedName.length < 2) {
      errs.name = 'नाम में कम से कम 2 अक्षर होने चाहिए';
    } else if (!/^[\p{L}\s.'-]+$/u.test(trimmedName)) {
      errs.name = 'नाम में केवल अक्षर और स्पेस मान्य हैं';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'कृपया अपना मोबाइल नंबर दर्ज करें';
    } else if (cleanPhone.length !== 10) {
      errs.phone = `कृपया 10-अंकों का नंबर दर्ज करें (${cleanPhone.length}/10 अंक)`;
    } else if (!/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'कृपया एक मान्य ईमेल पता दर्ज करें (उदा. name@example.com)';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setToastMessage(Object.values(errs)[0]);
      return false;
    }
    return true;
  };

  // Input Validation for Business Profile (Flow B Shop Model)
  const validateBusinessForm = () => {
    const errs = {};
    const trimmedBName = businessName.trim();
    if (!trimmedBName) {
      errs.businessName = 'कृपया व्यापार / दुकान का नाम दर्ज करें';
    } else if (trimmedBName.length < 2) {
      errs.businessName = 'दुकान के नाम में कम से कम 2 अक्षर होने चाहिए';
    }

    if (!businessCategory) {
      errs.businessCategory = 'कृपया दुकान की श्रेणी चुनें';
    }

    const cleanBPhone = businessPhone.replace(/\D/g, '');
    if (!cleanBPhone) {
      errs.businessPhone = 'कृपया संपर्क मोबाइल नंबर दर्ज करें';
    } else if (cleanBPhone.length !== 10) {
      errs.businessPhone = `कृपया पूरे 10 अंक दर्ज करें (${cleanBPhone.length}/10 अंक)`;
    } else if (!/^[6-9]/.test(cleanBPhone)) {
      errs.businessPhone = 'मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए';
    }

    const trimmedPin = pincode.trim();
    if (!trimmedPin) {
      errs.pincode = 'कृपया 6-अंकों का पिनकोड दर्ज करें';
    } else if (!/^[1-9][0-9]{5}$/.test(trimmedPin)) {
      errs.pincode = 'कृपया 6-अंकों का मान्य भारतीय पिनकोड दर्ज करें';
    } else if (!resolvedCity) {
      errs.pincode = 'कृपया पिनकोड जांचें या सूची से शहर चुनें';
    }

    if (businessEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail.trim())) {
      errs.businessEmail = 'कृपया एक मान्य ईमेल पता दर्ज करें (उदा. info@business.com)';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setToastMessage(Object.values(errs)[0]);
      return false;
    }
    return true;
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

  const activePhone = profileType === 'user' ? phone : businessPhone;

  const handleInitiateSave = () => {
    if (profileType === 'user') {
      const isValid = validateUserForm();
      if (!isValid) return;
    } else {
      const isValid = validateBusinessForm();
      if (!isValid) return;
    }

    setOtpValues(['', '', '', '']);
    setOtpTimer(30);
    setIsOtpModalOpen(true);
    setToastMessage(`OTP +91 ${activePhone} पर भेजा गया है`);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 250);
  };

  const handleVerifyOtp = () => {
    const entered = otpValues.join('');
    if (entered.length < 4) {
      setToastMessage('कृपया 4-अंकों का OTP दर्ज करें');
      return;
    }

    if (profileType === 'user') {
      const updatedProfile = {
        ...userProfile,
        name: name.trim(),
        phone: phone.trim(),
        isPhoneVerified: true,
        dob,
        gender,
        city,
        email: email.trim(),
        avatarUrl,
      };
      setUserProfile(updatedProfile);
    } else {
      const selectedCategoryObj = getCategoryById(businessCategory);
      const categoryLabel = selectedCategoryObj?.label || 'किराना';
      const cityName = resolvedCity?.name || resolvedCity?.nameHi || '';
      const stateName = resolvedCity?.state || '';

      const shopData = {
        name: businessName.trim(),
        categoryId: businessCategory,
        category: categoryLabel,
        pincode: pincode.trim(),
        cityId: resolvedCity?.id || '',
        city: cityName,
        state: stateName,
        address: storeAddress.trim(),
        ownerName: businessOwnerName.trim(),
        email: businessEmail.trim(),
        phone: businessPhone.trim(),
        logoDataUrl: businessLogoUrl,
        pin: resolvedCity?.lat ? { lat: resolvedCity.lat, lng: resolvedCity.lng } : null,
      };

      // 1. Save to Flow B storage (nb2_account and nb2_state)
      saveAccount({
        shop: shopData,
        phone: businessPhone.trim(),
      });
      const currentSavedState = loadSavedState();
      if (currentSavedState) {
        saveState({
          ...currentSavedState,
          shop: {
            ...currentSavedState.shop,
            ...shopData,
          },
        });
      }

      // 2. Synchronize with Flow A AdvertiserContext for backward compatibility
      const bData = {
        businessName: businessName.trim(),
        ownerName: businessOwnerName.trim(),
        businessCategory: categoryLabel,
        phone: businessPhone.trim(),
        email: businessEmail.trim(),
        businessLogoUrl,
        storeAddress: storeAddress.trim(),
        pincode: pincode.trim(),
        city: cityName,
      };
      if (updateBusinessProfile) {
        updateBusinessProfile(bData);
      }
      if (updateDraftCampaign) {
        updateDraftCampaign(bData);
      }
      if (setIsBusinessProfileSaved) {
        setIsBusinessProfileSaved(true);
      }
    }

    setIsPhoneVerified(true);
    setIsOtpModalOpen(false);
    setToastMessage(
      profileType === 'user'
        ? 'उपयोगकर्ता प्रोफाइल सफलतापूर्वक अपडेट हो गई'
        : 'दुकान की जानकारी सफलतापूर्वक सेव हो गई'
    );

    setTimeout(() => {
      handleBack();
    }, 900);
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

  // Avatar initial letter or fallback icon
  const getAvatarInitial = () => {
    if (name && name.trim().length > 0) {
      return name.trim().charAt(0).toUpperCase();
    }
    return <User size={38} color="#FFFFFF" variant="Bold" />;
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
      navigate('/menu', {
        state: {
          from: location.state?.originPath || '/feed',
          returnedFromChild: true,
        },
      });
    } else if (from === 'tab') {
      navigate(previousRoute || '/feed');
    } else {
      navigate(-1);
    }
  };


  const filteredCities = TOP_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearchQuery.trim().toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Status Bar Clearance */}
      <div className="h-[54px] w-full shrink-0 bg-[#F7F7F4]" />

      {/* Floating Success / Feedback Toast: Centered vertically and horizontally */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#2B2437] text-white text-[13px] font-bold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 pointer-events-auto"
            >
              <TickCircle size={17} color="#F5B55C" variant="Bold" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1. Fixed Header Bar */}
      <header className="px-4 py-3 bg-[#F7F7F4] flex items-center justify-between border-b border-[#E5E7EB]/80 shrink-0 z-10">
        <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />

        <h1 className="text-[18px] font-bold text-[#2B2437] tracking-tight text-center flex-1 pr-[46px]">
          {profileType === 'user' ? 'उपयोगकर्ता प्रोफ़ाइल' : 'बिज़नेस प्रोफ़ाइल'}
        </h1>
      </header>

      {/* 2. Scrollable Middle Body */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-0 py-2 space-y-4">
        {/* Toggle Switch between User Profile and Business Profile */}
        <div className="px-4 pt-2 shrink-0">
          <div className="bg-[#EBECEF] p-1 rounded-[16px] flex items-center gap-1 border border-[#E2E4E9]">
            <button
              type="button"
              onClick={() => {
                setProfileType('user');
                setErrors({});
              }}
              className={`flex-1 h-[42px] rounded-[13px] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none ${
                profileType === 'user'
                  ? 'bg-[#2B2437] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2B2437]'
              }`}
            >
              <User size={16} color={profileType === 'user' ? '#FFFFFF' : '#6B7280'} variant={profileType === 'user' ? 'Bold' : 'Linear'} />
              <span>उपयोगकर्ता प्रोफ़ाइल</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setProfileType('business');
                setErrors({});
              }}
              className={`flex-1 h-[42px] rounded-[13px] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none ${
                profileType === 'business'
                  ? 'bg-[#2B2437] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2B2437]'
              }`}
            >
              <Shop size={16} color={profileType === 'business' ? '#FFFFFF' : '#6B7280'} variant={profileType === 'business' ? 'Bold' : 'Linear'} />
              <span>बिज़नेस प्रोफ़ाइल</span>
            </button>
          </div>
        </div>

        {/* ================= USER PROFILE VIEW ================= */}
        {profileType === 'user' && (
          <>
            {/* Introductory Subtext */}
            <div className="pt-2 pb-1 px-6 text-center shrink-0">
              <p className="text-[13px] font-normal text-[#6B7280] leading-relaxed">
                अपनी व्यक्तिगत जानकारी भरें ताकि हम आपको ज़्यादा<br />
                पसंद की खबरें दिखा सकें
              </p>
            </div>

            {/* Avatar Upload & Update Stack */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-[110px] h-[110px] rounded-full p-1 ring-8 ring-[#F5B55C]/25 bg-gradient-to-b from-[#F5B55C]/40 to-[#F5B55C]/10 relative flex items-center justify-center shadow-inner">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[96px] h-[96px] rounded-full bg-[#2B2437] border-2 border-[#F5B55C] overflow-hidden flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
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
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#F5B55C] text-[#2B2437] flex items-center justify-center border-2 border-white shadow-md cursor-pointer active:scale-95 z-10"
                  title="फ़ोटो बदलें"
                >
                  <Camera size={16} color="#FFFFFF" variant="Bold" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[13px] font-bold text-[#2B2437] mt-2.5 cursor-pointer hover:underline"
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
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
                  <User size={16} color="#F5B55C" variant="Bold" />
                </div>
                <h2 className="text-[16px] font-bold text-[#2B2437]">व्यक्तिगत जानकारी</h2>
              </div>

              <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
                {/* Field: पूरा नाम */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    पूरा नाम *
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center gap-2.5 shadow-2xs transition-all ${
                    errors.name
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <User size={18} color={errors.name ? '#EF4444' : '#9CA3AF'} />
                    <input
                      type="text"
                      placeholder="अपना नाम डालें"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                      }}
                      className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Field: मोबाइल नंबर */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    मोबाइल नंबर *
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center justify-between shadow-2xs transition-all ${
                    errors.phone
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <Call size={18} color={errors.phone ? '#EF4444' : '#9CA3AF'} />
                      <span className="text-[14px] font-semibold text-[#6B7280] select-none">+91</span>
                      <input
                        type="tel"
                        placeholder="10-अंकों का नंबर"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        className="text-[14px] font-semibold text-[#2B2437] outline-none bg-transparent w-full placeholder:text-[#9CA3AF]"
                      />
                    </div>

                    {isPhoneVerified ? (
                      <div className="bg-[#FFF9EE] border border-[#F5B55C] text-[#F5B55C] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-2xs shrink-0 select-none">
                        <TickCircle size={13} color="#F5B55C" variant="Bold" />
                        <span className="text-[11px] font-bold">वेरिफाइड</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleInitiateSave}
                        className="bg-[#FFF4E5] border border-[#F6C38A] text-[#C25E00] hover:bg-[#FFEBD4] rounded-full px-2.5 py-1 flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer active:scale-95 transition-all"
                        title="OTP प्राप्त करके नंबर वेरिफाई करें"
                      >
                        <Warning2 size={13} color="#C25E00" variant="Bold" />
                        <span className="text-[11px] font-bold">वेरिफाइड नहीं</span>
                      </button>
                    )}
                  </div>
                  {errors.phone && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Field: जन्मतिथि */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    जन्मतिथि
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenDobModal}
                    className="w-full h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-400 active:scale-[0.985] active:bg-[#F9FAFB] transition-all duration-150 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar size={18} color={dob ? '#F5B55C' : '#9CA3AF'} />
                      <span
                        className={`text-[14px] ${
                          dob ? 'text-[#2B2437] font-semibold' : 'text-[#9CA3AF] font-medium'
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
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
                  <People size={16} color="#F5B55C" variant="Bold" />
                </div>
                <h2 className="text-[16px] font-bold text-[#2B2437]">आपके बारे में</h2>
              </div>

              <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
                {/* Field: जेंडर */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    जेंडर
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                        gender === 'male'
                          ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-sm font-bold'
                          : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#2B2437]/40'
                      }`}
                    >
                      <Man
                        size={17}
                        color={gender === 'male' ? '#FFFFFF' : '#4B5563'}
                      />
                      <span>पुरुष</span>
                      {gender === 'male' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F5B55C] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                        gender === 'female'
                          ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-sm font-bold'
                          : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#2B2437]/40'
                      }`}
                    >
                      <Woman
                        size={17}
                        color={gender === 'female' ? '#FFFFFF' : '#4B5563'}
                      />
                      <span>महिला</span>
                      {gender === 'female' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F5B55C] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('other')}
                      className={`h-[46px] rounded-[14px] flex items-center justify-center gap-1.5 text-[14px] cursor-pointer transition-all active:scale-95 relative ${
                        gender === 'other'
                          ? 'bg-[#2B2437] text-white border border-[#2B2437] shadow-sm font-bold'
                          : 'bg-white text-[#4B5563] border border-[#D1D5DB] font-medium hover:border-[#2B2437]/40'
                      }`}
                    >
                      <User
                        size={17}
                        color={gender === 'other' ? '#FFFFFF' : '#4B5563'}
                      />
                      <span>अन्य</span>
                      {gender === 'other' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F5B55C] absolute -top-1 -right-1 border-2 border-white shadow-2xs" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Field: शहर */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
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
                      <Location size={20} color="#2B2437" variant="Bold" />
                      <motion.span
                        key={city}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`text-[15px] ${
                          city ? 'font-semibold text-[#2B2437]' : 'font-medium text-[#9CA3AF]'
                        }`}
                      >
                        {city || 'अपना शहर चुनें'}
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
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    ईमेल आईडी
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center gap-2.5 shadow-2xs transition-all ${
                    errors.email
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <Sms size={18} color={errors.email ? '#EF4444' : '#9CA3AF'} />
                    <input
                      type="email"
                      placeholder="ईमेल आईडी डालें (उदा. name@example.com)"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                      }}
                      className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= BUSINESS PROFILE VIEW (FLOW B) ================= */}
        {profileType === 'business' && (
          <>
            {/* Introductory Subtext */}
            <div className="pt-2 pb-1 px-6 text-center shrink-0">
              <p className="text-[13px] font-normal text-[#6B7280] leading-relaxed">
                अपनी दुकान या व्यवसाय का विवरण भरें ताकि ग्राहक<br />
                आपकी दुकान को आसानी से खोज और पहचान सकें
              </p>
            </div>

            {/* Shop Logo / Store Photo Stack */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-[110px] h-[110px] rounded-full p-1 ring-8 ring-[#F5B55C]/25 bg-gradient-to-b from-[#F5B55C]/40 to-[#F5B55C]/10 relative flex items-center justify-center shadow-inner">
                <div
                  onClick={() => businessFileInputRef.current?.click()}
                  className="w-[96px] h-[96px] rounded-full bg-[#2B2437] border-2 border-[#F5B55C] overflow-hidden flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform"
                >
                  {businessLogoUrl ? (
                    <img
                      src={businessLogoUrl}
                      alt="Shop Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white px-2">
                      <Shop size={32} color="#FFFFFF" variant="Bold" />
                      <span className="text-[10px] font-bold text-[#F5B55C] mt-1 truncate max-w-[80px] text-center">
                        {businessName.trim() ? businessName.slice(0, 10) : 'दुकान का लोगो'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera / Action Badge */}
                <button
                  type="button"
                  onClick={() => businessFileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#F5B55C] text-[#2B2437] flex items-center justify-center border-2 border-white shadow-md cursor-pointer active:scale-95 z-10"
                  title="दुकान का लोगो / फ़ोटो बदलें"
                >
                  <Camera size={16} color="#FFFFFF" variant="Bold" />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-2.5">
                <button
                  type="button"
                  onClick={() => businessFileInputRef.current?.click()}
                  className="text-[13px] font-bold text-[#2B2437] cursor-pointer hover:underline"
                >
                  {businessLogoUrl ? 'लोगो बदलें' : 'दुकान का लोगो अपलोड करें'}
                </button>
                {businessLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setBusinessLogoUrl(null)}
                    className="text-[12px] font-semibold text-[#EF4444] hover:underline cursor-pointer"
                  >
                    हटाएं
                  </button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={businessFileInputRef}
                onChange={handleBusinessLogoChange}
                className="hidden"
              />
            </div>

            {/* Master Card 1: आपकी दुकान की जानकारी */}
            <div className="mx-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#FFF3DC] border border-[#F5B55C]/50 flex items-center justify-center text-[#F5B55C] shrink-0">
                  <Shop size={16} color="#F5B55C" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#2B2437]">दुकान का विवरण</h2>
                  <p className="text-[11px] text-[#6B7280]">मुख्य जानकारी जो विज्ञापनों में दिखेगी</p>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
                {/* 1. दुकान / व्यापार का नाम */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    दुकान / व्यापार का नाम *
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center justify-between shadow-2xs transition-all ${
                    errors.businessName
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <Shop size={18} color={errors.businessName ? '#EF4444' : '#9CA3AF'} />
                      <input
                        type="text"
                        placeholder="उदा. शर्मा किराना एवं जनरल स्टोर"
                        value={businessName}
                        maxLength={40}
                        onChange={(e) => {
                          setBusinessName(e.target.value);
                          if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: null }));
                        }}
                        className="text-[14px] font-semibold text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF] placeholder:font-normal"
                      />
                    </div>
                    {businessName && (
                      <button
                        type="button"
                        onClick={() => {
                          setBusinessName('');
                          if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: null }));
                        }}
                        className="text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer p-1"
                      >
                        <CloseCircle size={16} color="#9CA3AF" />
                      </button>
                    )}
                  </div>
                  {errors.businessName && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.businessName}</span>
                    </p>
                  )}
                </div>

                {/* 2. दुकान की श्रेणी (CategorySheet selector) */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    दुकान की श्रेणी *
                  </label>
                  {(() => {
                    const selCat = getCategoryById(businessCategory);
                    const CatIcon = (selCat?.icon && CATEGORY_ICON_MAP[selCat.icon]) || Store;
                    return (
                      <button
                        type="button"
                        onClick={() => setIsCategorySheetOpen(true)}
                        className={`w-full h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-[#2B2437]/40 active:scale-[0.99] transition-all text-left ${
                          errors.businessCategory ? 'border-[#EF4444]' : 'border-[#E5E7EB]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-[8px] bg-[#FFF3DC] flex items-center justify-center text-[#D97706] shrink-0">
                            <CatIcon className="w-4 h-4 text-[#D97706]" />
                          </div>
                          <span className="text-[14px] font-bold text-[#2B2437]">
                            {selCat?.label || 'श्रेणी चुनें'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] font-bold text-[#D97706]">
                          <span>बदलें</span>
                          <ArrowDown2 size={14} color="#D97706" />
                        </div>
                      </button>
                    );
                  })()}
                  {errors.businessCategory && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.businessCategory}</span>
                    </p>
                  )}
                </div>

                {/* 3. पिनकोड एवं स्वतः शहर चयन */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-bold text-[#2B2437]">
                      दुकान का पिनकोड *
                    </label>
                    <span className="text-[11px] font-medium text-[#6B7280]">
                      6-अंक डालते ही शहर स्वतः सेट होगा
                    </span>
                  </div>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center justify-between shadow-2xs transition-all ${
                    errors.pincode
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <Location size={18} color={errors.pincode ? '#EF4444' : '#9CA3AF'} />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="पिनकोड दर्ज करें (उदा. 462001)"
                        value={pincode}
                        onChange={handlePincodeChange}
                        className="text-[14px] font-bold tracking-wider text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF] placeholder:font-normal placeholder:tracking-normal"
                      />
                    </div>
                    {pincode && (
                      <button
                        type="button"
                        onClick={() => {
                          setPincode('');
                          setResolvedCity(null);
                          setPincodeNotFound(false);
                          if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: null }));
                        }}
                        className="text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer p-1"
                      >
                        <CloseCircle size={16} color="#9CA3AF" />
                      </button>
                    )}
                  </div>
                  {errors.pincode && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.pincode}</span>
                    </p>
                  )}

                  {/* Detected City Badge or Manual City Selector */}
                  {resolvedCity ? (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 bg-white border border-[#10B981]/30 rounded-[14px] p-2.5 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0">
                          <TickCircle size={16} color="#059669" variant="Bold" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#1F2937]">
                            {resolvedCity.name || resolvedCity.nameHi}
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            {resolvedCity.state || 'मध्य प्रदेश'} • स्थानीय लक्षित क्षेत्र
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShopCitySheetOpen(true)}
                        className="text-[12px] font-bold text-[#D97706] hover:underline px-2 py-1 cursor-pointer"
                      >
                        बदलें
                      </button>
                    </motion.div>
                  ) : pincodeNotFound ? (
                    <div className="mt-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-[12px] p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Warning2 size={16} color="#D97706" variant="Bold" />
                        <span className="text-[12px] font-semibold text-[#92400E]">
                          पिनकोड से शहर नहीं मिला
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShopCitySheetOpen(true)}
                        className="text-[12px] font-bold text-[#D97706] underline cursor-pointer"
                      >
                        शहर चुनें
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between px-1">
                      <span className="text-[11.5px] text-[#6B7280]">
                        पिनकोड याद नहीं?
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsShopCitySheetOpen(true)}
                        className="text-[12px] font-bold text-[#2B2437] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>सूची से शहर चुनें</span>
                        <span>›</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Master Card 2: संपर्क एवं अतिरिक्त पता */}
            <div className="mx-4 bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-4">
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#FFF3DC] border border-[#F5B55C]/50 flex items-center justify-center text-[#F5B55C] shrink-0">
                  <Call size={16} color="#F5B55C" variant="Bold" />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#2B2437]">संपर्क एवं पता</h2>
                  <p className="text-[11px] text-[#6B7280]">ग्राहकों के संपर्क हेतु विवरण</p>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-[20px] p-4 space-y-4 border border-[#F1F3F5]">
                {/* संपर्क मोबाइल नंबर */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    संपर्क मोबाइल नंबर *
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center gap-2.5 shadow-2xs transition-all ${
                    errors.businessPhone
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <Call size={18} color={errors.businessPhone ? '#EF4444' : '#9CA3AF'} />
                    <span className="text-[14px] font-bold text-[#6B7280] select-none">+91</span>
                    <input
                      type="tel"
                      placeholder="10-अंकों का नंबर"
                      maxLength={10}
                      value={businessPhone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setBusinessPhone(digits);
                        if (errors.businessPhone) setErrors((prev) => ({ ...prev, businessPhone: null }));
                      }}
                      className="text-[14px] font-bold text-[#2B2437] outline-none bg-transparent flex-1 placeholder:text-[#9CA3AF] placeholder:font-normal"
                    />
                  </div>
                  {errors.businessPhone && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.businessPhone}</span>
                    </p>
                  )}
                </div>

                {/* दुकान / कार्यालय का पूरा पता */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    दुकान / कार्यालय का पता (वैकल्पिक)
                  </label>
                  <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-3 flex items-start gap-2.5 shadow-2xs focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 transition-all">
                    <Location size={18} color="#9CA3AF" className="mt-0.5 shrink-0" />
                    <textarea
                      rows={2}
                      placeholder="दुकान नं., बाज़ार का नाम, इलाका या मुख्य लैंडमार्क"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF] resize-none"
                    />
                  </div>
                </div>

                {/* व्यापारी / मालिक का नाम */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    व्यापारी / प्रोपराइटर का नाम (वैकल्पिक)
                  </label>
                  <div className="h-[52px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 transition-all">
                    <User size={18} color="#9CA3AF" />
                    <input
                      type="text"
                      placeholder="मालिक का पूरा नाम दर्ज करें"
                      value={businessOwnerName}
                      onChange={(e) => setBusinessOwnerName(e.target.value)}
                      className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                {/* बिज़नेस ईमेल आईडी */}
                <div>
                  <label className="text-[13px] font-bold text-[#2B2437] block mb-1.5">
                    ईमेल आईडी (वैकल्पिक)
                  </label>
                  <div className={`h-[52px] bg-white rounded-[14px] border px-3.5 flex items-center gap-2.5 shadow-2xs transition-all ${
                    errors.businessEmail
                      ? 'border-[#EF4444] bg-[#FEF2F2]/40 focus-within:border-[#EF4444] focus-within:ring-2 focus-within:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10'
                  }`}>
                    <Sms size={18} color={errors.businessEmail ? '#EF4444' : '#9CA3AF'} />
                    <input
                      type="email"
                      placeholder="business@example.com"
                      value={businessEmail}
                      onChange={(e) => {
                        setBusinessEmail(e.target.value);
                        if (errors.businessEmail) setErrors((prev) => ({ ...prev, businessEmail: null }));
                      }}
                      className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  {errors.businessEmail && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626] mt-1 pl-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{errors.businessEmail}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Flow B Advertiser Banner */}
            <div className="mx-4 bg-gradient-to-br from-[#2B2437] to-[#1C1724] rounded-[24px] p-4 text-white shadow-md border border-[#3D334E] flex items-center justify-between">
              <div className="space-y-1 pr-3">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF3DC]/15 border border-[#F5B55C]/30 text-[#F5B55C] text-[10.5px] font-bold">
                  <span>⚡ 2 मिनट में विज्ञापन</span>
                </div>
                <h3 className="text-[15px] font-bold text-white tracking-tight">
                  नवभारत पर विज्ञापन चलाएं
                </h3>
                <p className="text-[11.5px] text-[#D1D5DB] leading-snug">
                  बिना किसी झंझट के अपने शहर के लाखों पाठकों तक पहुंचें
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/?flow=b';
                }}
                className="h-[42px] px-4 rounded-[14px] bg-[#F5B55C] hover:bg-[#E5A74E] text-[#2B2437] text-[13px] font-bold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>शुरू करें</span>
                <span>›</span>
              </button>
            </div>
          </>
        )}

        {/* Scroll bottom clearance spacer */}
        <div className="h-10 shrink-0" />
      </div>

      {/* 3. Pinned Bottom Save Button Bar */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] pt-3 pb-8 px-4 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={handleInitiateSave}
          className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white text-[18px] font-bold shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer hover:bg-[#3D334E] transition-colors"
        >
          {profileType === 'user' ? 'उपयोगकर्ता प्रोफ़ाइल सहेजें' : 'बिज़नेस प्रोफ़ाइल सहेजें'}
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

              <div className="w-12 h-12 rounded-full bg-[#FFF9EE] border border-[#F5B55C] flex items-center justify-center text-[#F5B55C] mb-3">
                <ShieldTick size={24} color="#F5B55C" variant="Bold" />
              </div>

              <h3 className="text-[18px] font-bold text-[#2B2437] text-center">
                OTP सत्यापन
              </h3>
              <p className="text-[13px] text-[#6B7280] text-center mt-1 max-w-[280px]">
                हमने <span className="font-bold text-[#2B2437]">+91 {activePhone}</span> पर 4-अंकों का सत्यापन कोड भेजा है
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
                    className="w-12 h-13 rounded-[14px] bg-[#F9FAFB] border-2 border-[#E5E7EB] text-center text-[20px] font-bold text-[#2B2437] outline-none focus:border-[#F5B55C] focus:bg-white shadow-2xs transition-all"
                  />
                ))}
              </div>

              {/* Quick test autofill helper */}
              <button
                type="button"
                onClick={() => setOtpValues(['1', '2', '3', '4'])}
                className="text-xs text-[#F5B55C] font-semibold mb-4 hover:underline cursor-pointer"
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
                    className="text-[#F5B55C] font-bold cursor-pointer hover:underline"
                  >
                    OTP फिर से भेजें
                  </button>
                )}
              </div>

              {/* Verify CTA */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-[50px] rounded-[16px] bg-[#2B2437] text-white text-[15px] font-bold active:scale-[0.99] cursor-pointer hover:bg-[#3D334E] shadow-md transition-all"
              >
                सत्यापित करें एवं सहेजें
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
                  <h3 className="text-[17px] font-bold text-[#2B2437]">
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
                                ? 'bg-[#2B2437] text-white font-bold shadow-xs'
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
                                ? 'bg-[#2B2437] text-white font-bold shadow-xs'
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
                                ? 'bg-[#2B2437] text-white font-bold shadow-xs'
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
                  <span className="text-[15px] font-bold text-[#F5B55C]">
                    {draftDay} {draftMonth} {draftYear}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmDob}
                  className="w-full h-[50px] rounded-[16px] bg-[#2B2437] text-white text-[15px] font-bold active:scale-[0.99] cursor-pointer hover:bg-[#3D334E] shadow-md transition-all"
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
                  <h3 className="text-[17px] font-bold text-[#2B2437]">
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
                <div className="h-[46px] bg-white rounded-[14px] border border-[#E5E7EB] px-3.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#2B2437] focus-within:ring-2 focus-within:ring-[#2B2437]/10 transition-all">
                  <SearchNormal1 size={17} color="#9CA3AF" />
                  <input
                    type="text"
                    placeholder="शहर खोजें..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="text-[14px] font-medium text-[#2B2437] outline-none flex-1 bg-transparent placeholder:text-[#9CA3AF]"
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
                                ? 'bg-[#2B2437] text-white font-bold shadow-xs'
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
                            ? 'bg-[#2B2437] text-white font-bold border border-[#2B2437] shadow-2xs'
                            : 'hover:bg-gray-50 text-[#2B2437] font-medium border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#9CA3AF]'
                            }`}
                          >
                            <Location
                              size={16}
                              color={isSelected ? '#FFFFFF' : '#9CA3AF'}
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
                            <span className="text-[11px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                              चुना हुआ
                            </span>
                            <TickCircle size={18} color="#FFFFFF" variant="Bold" />
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

      {/* Category Bottom Sheet (Flow B) */}
      <CategorySheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        selectedCategoryId={businessCategory}
        onSelectCategory={(catId) => {
          setBusinessCategory(catId);
          if (errors.businessCategory) {
            setErrors((prev) => ({ ...prev, businessCategory: null }));
          }
        }}
      />

      {/* City Bottom Sheet for Flow B Shop (Single Selection) */}
      <CitySheet
        isOpen={isShopCitySheetOpen}
        onClose={() => setIsShopCitySheetOpen(false)}
        singleSelect={true}
        onSelectSingleCity={handleSingleCityPick}
      />
    </div>
  );
}
