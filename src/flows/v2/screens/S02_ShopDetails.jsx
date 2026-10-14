import React, { useState, useRef } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import CategorySheet, { CATEGORY_ICON_MAP } from '../components/sheets/CategorySheet';
import CitySheet from '../components/sheets/CitySheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { lookupCityByPincode } from '../data/pincodes';
import { getCategoryById } from '../data/categories';
import { getCityById } from '../data/cities';
import { isValidEmail } from '../utils/validators';
import { processImageFile } from '../utils/imageTools';
import { saveAccount } from '../utils/autosave';
import { STRINGS } from '../strings/hi';
import profileSkyline from '../../../assets/illustrations/profile_skyline_bhopal.png';
import {
  Camera,
  Trash2,
  ChevronDown,
  Store,
  ShieldCheck,
  AlertCircle,
  X,
  Mail,
  User,
} from 'lucide-react';
import {
  Shop,
  Location,
  Setting2,
  ArrowRight2,
} from 'iconsax-react';

export default function S02_ShopDetails({ onOpenFacilitator }) {
  const { state, updateShop } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();

  const shop = state.shop || {};
  const phone = state.auth?.phone || '8765432456';

  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showCitySheet, setShowCitySheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [showOptional, setShowOptional] = useState(() => !!(shop.address || shop.ownerName || shop.email));

  const [name, setName] = useState(shop.name || '');
  const [nameError, setNameError] = useState(null);
  const [categoryId, setCategoryId] = useState(shop.categoryId || '');
  const [pincode, setPincode] = useState(shop.pincode || '');
  const [pincodeNotFound, setPincodeNotFound] = useState(false);
  const [resolvedCity, setResolvedCity] = useState(
    shop.city ? { id: shop.cityId || 'indore', name: shop.city, state: shop.state } : null
  );
  const [address, setAddress] = useState(shop.address || '');
  const [ownerName, setOwnerName] = useState(shop.ownerName || '');
  const [email, setEmail] = useState(shop.email || '');
  const [emailError, setEmailError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(shop.logoDataUrl || null);
  const [logoError, setLogoError] = useState(null);

  const logoInputRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLogoError(null);
      const processed = await processImageFile(file, 256, 0.85);
      setLogoUrl(processed.dataUrl);
      updateShop({ logoDataUrl: processed.dataUrl });
    } catch {
      setLogoError(STRINGS.shop.logoUploadError);
    }
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setLogoUrl(null);
    setLogoError(null);
    updateShop({ logoDataUrl: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 30);
    setName(val);
    if (val.trim()) setNameError(null);
    updateShop({ name: val });
  };

  const handleClearName = () => {
    setName('');
    setNameError(null);
    updateShop({ name: '' });
  };

  const handleCategorySelect = (cId) => {
    setCategoryId(cId);
    updateShop({ categoryId: cId });
  };

  const handlePincodeChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(digits);
    updateShop({ pincode: digits });

    if (digits.length === 6) {
      const foundCity = lookupCityByPincode(digits);
      if (foundCity) {
        setPincodeNotFound(false);
        setResolvedCity(foundCity);
        updateShop({
          cityId: foundCity.id,
          city: foundCity.name,
          state: foundCity.state,
          pin: { lat: foundCity.lat, lng: foundCity.lng },
        });
      } else {
        setPincodeNotFound(true);
        setResolvedCity(null);
        updateShop({ cityId: '', city: '', state: '', pin: { lat: null, lng: null } });
      }
    } else {
      setPincodeNotFound(false);
      setResolvedCity(null);
    }
  };

  const handleClearPincode = () => {
    setPincode('');
    setPincodeNotFound(false);
    setResolvedCity(null);
    updateShop({ pincode: '', cityId: '', city: '', state: '' });
  };

  const handleSingleCityPick = (cId) => {
    const cityObj = getCityById(cId);
    if (cityObj) {
      setResolvedCity(cityObj);
      setPincodeNotFound(false);
      updateShop({
        cityId: cityObj.id,
        city: cityObj.name,
        state: cityObj.state,
        pin: { lat: cityObj.lat, lng: cityObj.lng },
      });
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    if (val && !isValidEmail(val)) {
      setEmailError(STRINGS.shop.emailError);
    } else {
      setEmailError(null);
    }
    updateShop({ email: val });
  };

  const isNameValid = !!name.trim();
  const isCategoryValid = !!categoryId;
  const isCityValid = !!resolvedCity;
  const isEmailValid = !email.trim() || isValidEmail(email);
  const isFormValid = isNameValid && isCategoryValid && isCityValid && isEmailValid;

  const getMissingHint = () => {
    if (!isNameValid) return STRINGS.shop.missingNameHint;
    if (!isCategoryValid) return STRINGS.shop.missingCategoryHint;
    if (!isCityValid) {
      return pincode.length === 6 ? 'कृपया सूची से अपना शहर चुनें' : STRINGS.shop.missingPincodeHint;
    }
    if (!isEmailValid) return STRINGS.shop.emailError;
    return null;
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      if (!isNameValid) setNameError(STRINGS.shop.nameError);
      return;
    }

    const shopData = {
      name: name.trim(),
      categoryId,
      pincode,
      cityId: resolvedCity?.id || 'indore',
      city: resolvedCity?.name || 'इंदौर',
      state: resolvedCity?.state || 'मध्य प्रदेश',
      address: address.trim(),
      ownerName: ownerName.trim(),
      email: email.trim(),
      logoDataUrl: logoUrl,
      pin: resolvedCity?.lat ? { lat: resolvedCity.lat, lng: resolvedCity.lng } : { lat: 22.72, lng: 75.86 },
    };

    updateShop(shopData);
    saveAccount({
      shop: shopData,
      phone,
    });

    proceedNextStep();
  };

  const selectedCategory = getCategoryById(categoryId);
  const CategoryIconComp = (selectedCategory?.icon && CATEGORY_ICON_MAP[selectedCategory.icon]) || Store;
  const displayInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : null;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none font-sans">
      {/* Header (Step 1 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={1}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Hidden file input */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6 flex flex-col gap-3.5 scrollbar-none">
        {/* Screen Title */}
        <div className="flex flex-col items-center text-center pt-0.5">
          <h1 className="text-[20px] font-bold text-[#2B2437] tracking-tight">
            {STRINGS.shop.title}
          </h1>
        </div>

        {/* 1. Signature Profile Card with Heritage Skyline Silhouette (MenuScreen signature) */}
        <div className="p-3.5 rounded-[22px] bg-white border border-[#E2E6EE] shadow-sm relative overflow-hidden flex items-center justify-between">
          {/* Heritage Cityscape Artwork */}
          <img
            src={profileSkyline}
            alt="Heritage Cityscape"
            className="pointer-events-none absolute right-0 bottom-0 h-full w-auto max-w-[80%] object-contain object-right-bottom select-none z-0 opacity-35 mix-blend-multiply -translate-x-[15%]"
          />

          {/* Left Identity Stack */}
          <div className="flex items-center relative z-10">
            <div
              onClick={() => logoInputRef.current?.click()}
              className="w-14 h-14 rounded-full ring-[2.5px] ring-[#F5B55C] ring-offset-2 overflow-hidden bg-gradient-to-br from-[#2B2437] to-[#1E1927] shrink-0 mr-3.5 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
              title="दुकान की फ़ोटो जोड़ें"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Shop Logo" className="w-full h-full object-cover" />
              ) : displayInitial ? (
                <span className="text-[22px] font-black text-[#F5B55C]">{displayInitial}</span>
              ) : (
                <Shop size={24} color="#F5B55C" variant="Bold" />
              )}
            </div>

            <div>
              <span className="text-[17px] font-bold text-[#2B2437] block leading-tight">
                {name.trim() || 'आपकी दुकान की जानकारी'}
              </span>
              <span className="text-[12.5px] text-[#059669] font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>+91 {phone} · वेरिफाइड</span>
              </span>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-1.5 relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-10 h-10 rounded-[12px] bg-[#2B2437]/[0.86] hover:bg-[#2B2437] text-white flex items-center justify-center cursor-pointer active:scale-95 shadow-xs transition-all"
              title="फ़ोटो जोड़ें या बदलें"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 text-[#DC2626] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                title="हटाएँ"
              >
                <Trash2 className="w-4 h-4 text-[#DC2626]" />
              </button>
            )}
          </div>
        </div>

        {logoError && (
          <span className="text-[11.5px] font-bold text-[#DC2626] px-1 animate-fadeIn">
            {logoError}
          </span>
        )}

        {/* 2. Main Details Card (Menu/Settings card architecture) */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm flex flex-col gap-3.5">
          {/* Section Header with Golden Badge */}
          <div className="flex items-center gap-2.5 pb-1 border-b border-[#F5F5F4]">
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF3DC] border border-[#F5B55C]/50 flex items-center justify-center text-[#E39026] shrink-0">
              <Shop size={16} color="#E39026" variant="Bold" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#2B2437] leading-snug">दुकान का विवरण</h2>
              <p className="text-[11px] text-[#9CA3AF] font-medium leading-none mt-0.5">नाम, श्रेणी और पिन कोड</p>
            </div>
          </div>

          {/* Field 1: दुकान का नाम */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-[13px] font-bold text-[#2B2437]">
                {STRINGS.shop.nameLabel} <span className="text-[#DC2626]">*</span>
              </label>
              <span className="text-[11.5px] font-medium text-[#9CA3AF] tabular-nums">
                {name.length}/30
              </span>
            </div>

            <div className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[16px] border border-[#F0F1F3] focus-within:border-[#2B2437] focus-within:bg-white flex items-center gap-3 transition-all">
              <div className="w-9 h-9 rounded-[10px] bg-[#2B2437]/[0.86] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Shop size={18} color="#FFFFFF" variant="Bold" />
              </div>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder={STRINGS.shop.namePlaceholder}
                className="w-full bg-transparent text-[14.5px] font-semibold text-[#2B2437] placeholder:text-[#A8A29E] outline-none"
              />
              {name.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearName}
                  className="w-6 h-6 rounded-full bg-[#E5E7EB] hover:bg-[#D1D5DB] flex items-center justify-center text-[#6B7280] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {nameError && (
              <span className="text-[11.5px] font-bold text-[#DC2626] px-1 animate-fadeIn">
                {nameError}
              </span>
            )}
          </div>

          {/* Field 2: दुकान की श्रेणी (Category Action Row) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2B2437] px-1">
              {STRINGS.shop.categoryLabel} <span className="text-[#DC2626]">*</span>
            </label>
            <div
              onClick={() => setShowCategorySheet(true)}
              className={`h-[56px] px-3.5 rounded-[16px] border flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all ${
                categoryId
                  ? 'bg-[#FFFBF0] border-[#FDE68A] hover:bg-[#FFF8E6]'
                  : 'bg-[#F9FAFB] border-[#F0F1F3] hover:bg-gray-100/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 shadow-xs transition-colors ${
                    categoryId ? 'bg-[#E39026] text-white' : 'bg-[#2B2437]/[0.86] text-white'
                  }`}
                >
                  <CategoryIconComp className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-[14px] font-bold truncate ${
                    categoryId ? 'text-[#2B2437]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {selectedCategory ? selectedCategory.label : STRINGS.shop.categoryPlaceholder}
                </span>
              </div>
              <ArrowRight2 size={16} color={categoryId ? '#E39026' : '#9CA3AF'} />
            </div>
          </div>

          {/* Field 3: पिन कोड */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-[#2B2437] px-1">
              {STRINGS.shop.pincodeLabel} <span className="text-[#DC2626]">*</span>
            </label>
            <div className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[16px] border border-[#F0F1F3] focus-within:border-[#2B2437] focus-within:bg-white flex items-center gap-3 transition-all">
              <div className="w-9 h-9 rounded-[10px] bg-[#2B2437]/[0.86] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Location size={18} color="#FFFFFF" variant="Bold" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={handlePincodeChange}
                placeholder={STRINGS.shop.pincodePlaceholder}
                className="w-full bg-transparent text-[14.5px] font-semibold text-[#2B2437] placeholder:text-[#A8A29E] outline-none"
              />
              {pincode.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearPincode}
                  className="w-6 h-6 rounded-full bg-[#E5E7EB] hover:bg-[#D1D5DB] flex items-center justify-center text-[#6B7280] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Resolved City Card (Signature Menu amber featured row style) */}
            {resolvedCity && (
              <div className="h-[54px] px-3.5 bg-[#FFFBF0] rounded-[14px] border border-[#FDE68A] flex items-center justify-between mt-1 animate-fadeIn">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-[8px] bg-[#E39026] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Location size={16} color="#FFFFFF" variant="Bold" />
                  </div>
                  <span className="text-[13.5px] font-bold text-[#2B2437] truncate">
                    {resolvedCity.name}, {resolvedCity.state}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCitySheet(true)}
                  className="text-[12px] font-bold text-[#E39026] hover:underline px-2.5 py-1 rounded-md bg-white border border-[#FDE68A] cursor-pointer shadow-2xs"
                >
                  बदलें
                </button>
              </div>
            )}

            {/* Pincode not found banner */}
            {pincodeNotFound && (
              <div className="p-3 rounded-[14px] bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between mt-1 animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span className="text-[12px] font-medium text-[#92400E] truncate">
                    {STRINGS.shop.pincodeNotFound}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCitySheet(true)}
                  className="px-2.5 py-1 rounded-[8px] bg-white border border-[#FDE68A] text-[12px] font-bold text-[#D97706] hover:bg-[#FEF3C7] active:scale-95 transition-all shadow-2xs cursor-pointer shrink-0 ml-2"
                >
                  {STRINGS.shop.pickCityBtn}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Additional Details Section Card (Collapsible) */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center justify-between w-full text-left cursor-pointer active:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
                <Setting2 size={16} color="#F5B55C" variant="Bold" />
              </div>
              <h2 className="text-[15px] font-bold text-[#2B2437]">और जानकारी (वैकल्पिक)</h2>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                showOptional ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showOptional && (
            <div className="flex flex-col gap-3 pt-2 border-t border-[#F5F5F4] animate-fadeIn">
              {/* Field 4: पता या इलाका */}
              <div className="flex flex-col gap-1">
                <label className="text-[12.5px] font-bold text-[#2B2437] px-1">
                  {STRINGS.shop.addressLabel}
                </label>
                <div className="h-[52px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] focus-within:border-[#2B2437] focus-within:bg-white flex items-center gap-3 transition-all">
                  <div className="w-8 h-8 rounded-[8px] bg-[#2B2437]/[0.86] flex items-center justify-center text-white shrink-0">
                    <Location size={16} color="#FFFFFF" variant="Bold" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      updateShop({ address: e.target.value });
                    }}
                    placeholder={STRINGS.shop.addressPlaceholder}
                    className="w-full bg-transparent text-[14px] font-medium text-[#2B2437] placeholder:text-[#A8A29E] outline-none"
                  />
                  {address.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAddress('');
                        updateShop({ address: '' });
                      }}
                      className="w-5 h-5 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 5: मालिक का नाम */}
              <div className="flex flex-col gap-1">
                <label className="text-[12.5px] font-bold text-[#2B2437] px-1">
                  {STRINGS.shop.ownerLabel}
                </label>
                <div className="h-[52px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] focus-within:border-[#2B2437] focus-within:bg-white flex items-center gap-3 transition-all">
                  <div className="w-8 h-8 rounded-[8px] bg-[#2B2437]/[0.86] flex items-center justify-center text-white shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      updateShop({ ownerName: e.target.value });
                    }}
                    placeholder={STRINGS.shop.ownerPlaceholder}
                    className="w-full bg-transparent text-[14px] font-medium text-[#2B2437] placeholder:text-[#A8A29E] outline-none"
                  />
                  {ownerName.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setOwnerName('');
                        updateShop({ ownerName: '' });
                      }}
                      className="w-5 h-5 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Field 6: ईमेल */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[12.5px] font-bold text-[#2B2437]">
                    {STRINGS.shop.emailLabel}
                  </label>
                  <span className="text-[11px] font-medium text-[#9CA3AF]">
                    {STRINGS.shop.emailReason}
                  </span>
                </div>
                <div className="h-[52px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] focus-within:border-[#2B2437] focus-within:bg-white flex items-center gap-3 transition-all">
                  <div className="w-8 h-8 rounded-[8px] bg-[#2B2437]/[0.86] flex items-center justify-center text-white shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={STRINGS.shop.emailPlaceholder}
                    className="w-full bg-transparent text-[14px] font-medium text-[#2B2437] placeholder:text-[#A8A29E] outline-none"
                  />
                  {email.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('');
                        setEmailError(null);
                        updateShop({ email: '' });
                      }}
                      className="w-5 h-5 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {emailError && (
                  <span className="text-[11px] font-bold text-[#DC2626] px-1 animate-fadeIn">
                    {emailError}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Button */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        disabled={!isFormValid}
        missingHint={getMissingHint()}
        onClick={handleSubmit}
        showArrow={!isFromReview}
      />

      {/* Category Sheet */}
      <CategorySheet
        isOpen={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        selectedCategoryId={categoryId}
        onSelectCategory={handleCategorySelect}
      />

      {/* City Picker Sheet */}
      <CitySheet
        isOpen={showCitySheet}
        onClose={() => setShowCitySheet(false)}
        singleSelect
        selectedCityIds={resolvedCity?.id ? [resolvedCity.id] : []}
        onSelectSingleCity={handleSingleCityPick}
      />

      {/* Help Sheet */}
      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
