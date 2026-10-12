import React, { useState, useRef } from 'react';
import V2Header from '../components/chrome/V2Header';
import CategorySheet from '../components/sheets/CategorySheet';
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
import { Camera, ChevronRight, ChevronDown, CheckCircle2, Store } from 'lucide-react';

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
  const [resolvedCity, setResolvedCity] = useState(shop.city ? { name: shop.city, state: shop.state } : null);
  const [address, setAddress] = useState(shop.address || '');
  const [ownerName, setOwnerName] = useState(shop.ownerName || '');
  const [email, setEmail] = useState(shop.email || '');
  const [emailError, setEmailError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(shop.logoDataUrl || null);

  const logoInputRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await processImageFile(file, 256, 0.85);
      setLogoUrl(processed.dataUrl);
      updateShop({ logoDataUrl: processed.dataUrl });
    } catch {
      // Ignore or handle upload error
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value.slice(0, 30);
    setName(val);
    if (val.trim()) setNameError(null);
    updateShop({ name: val });
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
    const val = e.target.value;
    setEmail(val);
    if (val.trim() && !isValidEmail(val)) {
      setEmailError(STRINGS.shop.emailError);
    } else {
      setEmailError(null);
    }
    updateShop({ email: val });
  };

  const isNameValid = !!name.trim();
  const isCategoryValid = !!categoryId;
  const isCityValid = !!resolvedCity;
  const isFormValid = isNameValid && isCategoryValid && isCityValid && !emailError;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const shopData = {
      name,
      categoryId,
      pincode,
      cityId: resolvedCity?.id || 'indore',
      city: resolvedCity?.name || 'इंदौर',
      state: resolvedCity?.state || 'मध्य प्रदेश',
      address,
      ownerName,
      email,
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
  // Initial letter displayed in avatar: "S" if empty or matching name
  const displayInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none font-sans">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={1}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 scrollbar-none">
        {/* Title & Verified Phone Pill */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-0.5">
          <h2 className="text-[20px] font-extrabold text-[#1E2538] tracking-tight">
            आपकी दुकान की जानकारी
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[12px] font-bold text-[#10B981] shadow-2xs">
            <span>+91 {phone}</span>
            <span>•</span>
            <span>वेरिफाइड</span>
          </div>
        </div>

        {/* Avatar with Ambient Warm Golden Glow */}
        <div className="relative flex flex-col items-center justify-center my-0.5">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />

          <div className="relative flex items-center justify-center">
            {/* Ambient Warm Amber Glow */}
            <div
              className="absolute w-[100px] h-[100px] rounded-full pointer-events-none transition-all duration-300"
              style={{
                background: 'radial-gradient(circle, rgba(227, 144, 38, 0.42) 0%, rgba(245, 181, 92, 0.22) 55%, transparent 75%)',
                filter: 'blur(10px)',
                transform: 'scale(1.22)',
              }}
            />

            {/* Circular Avatar */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className="relative w-[86px] h-[86px] rounded-full bg-[#1E2538] flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all select-none border border-amber-500/15"
              style={{
                boxShadow: '0 0 28px 5px rgba(227, 144, 38, 0.26), 0 4px 14px rgba(0,0,0,0.12)',
              }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Shop Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-[36px] font-bold text-white tracking-wide leading-none select-none">
                  {displayInitial}
                </span>
              )}

              {/* Floating Camera Badge */}
              <div className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#C97F1E] border-2 border-white flex items-center justify-center text-white shadow-xs">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="text-[13px] font-bold text-[#2B2437] mt-2 cursor-pointer hover:underline"
          >
            फ़ोटो बदलें
          </button>
        </div>

        {/* Card 1: मुख्य आवश्यक जानकारी (Required Fields) */}
        <div className="bg-white rounded-[22px] border border-[#E5E7EB] p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3.5">
          {/* Field 1: दुकान का नाम * */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13.5px] font-bold text-[#2B2437] flex items-center gap-0.5">
                <span>दुकान का नाम</span>
                <span className="text-[#DC2626] font-bold">*</span>
              </label>
              <span className="text-[12.5px] font-bold text-[#2B2437]/75">
                {name.length}/30
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="जैसे: शर्मा स्वीट्स"
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[14.5px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] focus:border-[#2B2437] focus:ring-1 focus:ring-[#2B2437]/20 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />
            {nameError && (
              <span className="text-[11.5px] font-bold text-[#DC2626] px-1">
                {nameError}
              </span>
            )}
          </div>

          {/* Field 2: दुकान किस चीज़ की है? * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-bold text-[#2B2437] flex items-center gap-0.5">
              <span>दुकान किस चीज़ की है?</span>
              <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <div
              onClick={() => setShowCategorySheet(true)}
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] flex items-center justify-between cursor-pointer select-none active:scale-[0.99] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Store className="w-4.5 h-4.5 text-[#E39026] shrink-0" />
                <span className="text-[14px] font-medium text-[#2B2437] truncate">
                  {selectedCategory ? selectedCategory.label : 'श्रेणी चुनें'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280] shrink-0" />
            </div>
          </div>

          {/* Field 3: पिन कोड * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-bold text-[#2B2437] flex items-center gap-0.5">
              <span>पिन कोड</span>
              <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="6 अंकों का पिन कोड"
              className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[14.5px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] focus:border-[#2B2437] focus:ring-1 focus:ring-[#2B2437]/20 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />

            {/* Resolved City Line */}
            {resolvedCity && (
              <div className="flex items-center gap-1.5 text-[12.5px] text-[#10B981] font-bold px-1 mt-0.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>{resolvedCity.name}, {resolvedCity.state}</span>
              </div>
            )}

            {/* Pincode not found fallback */}
            {pincodeNotFound && (
              <div className="p-2.5 rounded-xl bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-between mt-0.5 animate-fadeIn">
                <span className="text-[11.5px] text-[#854D0E] font-medium">
                  शहर नहीं मिला, सूची से चुनें
                </span>
                <button
                  type="button"
                  onClick={() => setShowCitySheet(true)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#F6DFA8] font-bold text-[11.5px] text-[#E39026] shadow-2xs active:scale-95 cursor-pointer"
                >
                  शहर चुनें
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: अतिरिक्त जानकारी (वैकल्पिक Collapsible Disclosure) */}
        <div className="flex flex-col gap-1.5 mb-2">
          {/* Collapsible Trigger Bar */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="w-full h-[52px] px-4 rounded-[16px] bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between text-left hover:bg-neutral-50/70 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="text-[13.5px] font-bold text-[#2B2437]">
              अतिरिक्त जानकारी (वैकल्पिक)
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                showOptional ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Expanded Fields Card */}
          {showOptional && (
            <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-3.5 mt-1 animate-fadeIn">
              {/* Field 4: पता या इलाका */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2B2437]">
                  पता या इलाका (बाद में भी भर सकते हैं)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    updateShop({ address: e.target.value });
                  }}
                  placeholder="जैसे: विजय नगर"
                  className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[14.5px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] focus:border-[#2B2437] focus:ring-1 focus:ring-[#2B2437]/20 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Field 5: मालिक का नाम */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2B2437]">
                  मालिक का नाम (बाद में भी भर सकते हैं)
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value);
                    updateShop({ ownerName: e.target.value });
                  }}
                  placeholder="जैसे: राजेश शर्मा"
                  className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[14.5px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] focus:border-[#2B2437] focus:ring-1 focus:ring-[#2B2437]/20 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Field 6: ईमेल */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#2B2437]">
                  ईमेल (बाद में भी भर सकते हैं)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="जैसे: info@dukaan.com"
                  className="w-full h-[48px] px-3.5 rounded-[12px] bg-white border border-[#E5E7EB] text-[14.5px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] focus:border-[#2B2437] focus:ring-1 focus:ring-[#2B2437]/20 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
                {emailError && (
                  <span className="text-[11.5px] font-bold text-[#DC2626] px-1">
                    {emailError}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="sticky bottom-0 left-0 right-0 w-full z-20 px-4 pt-2 pb-5 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/95 to-transparent backdrop-blur-xs">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full h-[50px] rounded-[16px] bg-[#1E2538] hover:bg-[#2A334B] active:scale-[0.99] text-white text-[16px] font-bold shadow-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed select-none"
        >
          {getCtaLabel('सेव करें')}
        </button>
      </div>

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
