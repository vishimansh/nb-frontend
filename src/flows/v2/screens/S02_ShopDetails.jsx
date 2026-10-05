import React, { useState, useRef } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import Field from '../components/ui/Field';
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
  const phone = state.auth?.phone || '9876543210';

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
      // Error handling
    }
  };

  const handleNameChange = (val) => {
    setName(val);
    if (val.trim()) setNameError(null);
    updateShop({ name: val });
  };

  const handleCategorySelect = (cId) => {
    setCategoryId(cId);
    updateShop({ categoryId: cId });
  };

  const handlePincodeChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 6);
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

  const handleEmailChange = (val) => {
    setEmail(val);
    if (!isValidEmail(val)) {
      setEmailError(STRINGS.shop.emailError);
    } else {
      setEmailError(null);
    }
    updateShop({ email: val });
  };

  // Missing fields helper for CTA
  let missingHint = null;
  const isNameValid = !!name.trim();
  const isCategoryValid = !!categoryId;
  const isCityValid = !!resolvedCity;

  if (!isNameValid) {
    missingHint = STRINGS.shop.missingNameHint;
  } else if (!isCategoryValid) {
    missingHint = STRINGS.shop.missingCategoryHint;
  } else if (!isCityValid) {
    missingHint = STRINGS.shop.missingPincodeHint;
  }

  const isFormValid = isNameValid && isCategoryValid && isCityValid && !emailError;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const shopData = {
      name,
      categoryId,
      pincode,
      cityId: resolvedCity.id || 'indore',
      city: resolvedCity.name,
      state: resolvedCity.state,
      address,
      ownerName,
      email,
      logoDataUrl: logoUrl,
      pin: resolvedCity.lat ? { lat: resolvedCity.lat, lng: resolvedCity.lng } : { lat: 22.72, lng: 75.86 },
    };

    // Sync context state
    updateShop(shopData);

    // Save to nb2_account
    saveAccount({
      shop: shopData,
      phone,
    });

    proceedNextStep();
  };

  const selectedCategory = getCategoryById(categoryId);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
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
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h2 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.shop.title}
          </h2>
          <p className="text-[12px] text-[#6B7280]">
            {STRINGS.shop.subtitle}
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF8F2] border border-[#2F8F5B]/20 text-[11px] font-bold text-[#2F8F5B] mt-1">
            <span>+91 {phone}</span>
            <span>•</span>
            <span>वेरिफाइड ✓</span>
          </div>
        </div>

        {/* Logo Avatar Upload */}
        <div className="flex flex-col items-center gap-1.5 py-0.5">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <div
            onClick={() => logoInputRef.current?.click()}
            className="w-[80px] h-[80px] rounded-full bg-white border-2 border-[#E5E7EB] hover:border-[#2B2437] flex items-center justify-center text-[#2B2437] relative cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-[28px] font-extrabold text-[#2B2437]">
                {(name.trim() || 'द').charAt(0)}
              </span>
            )}
            <div className="absolute bottom-0 right-0 w-6.5 h-6.5 rounded-full bg-[#E39026] text-white flex items-center justify-center shadow-xs border-2 border-white">
              <Camera className="w-3 h-3" />
            </div>
          </div>
          <span className="text-[12px] font-bold text-[#4A4358]">
            {STRINGS.shop.logoLabel}
          </span>
        </div>

        {/* Card 1: मुख्य जानकारी (Required) */}
        <div className="bg-white rounded-[22px] border border-[#E5E7EB] p-4 shadow-xs space-y-3.5">
          {/* 1. दुकान का नाम (Required) */}
          <Field
            label={STRINGS.shop.nameLabel}
            required
            maxLength={30}
            showCounter
            value={name}
            onChange={handleNameChange}
            placeholder={STRINGS.shop.namePlaceholder}
            error={nameError}
          />

          {/* 2. दुकान किस चीज़ की है? (Required) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-bold text-[#2B2437] flex items-center gap-1">
              <span>{STRINGS.shop.categoryLabel}</span>
              <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <div
              onClick={() => setShowCategorySheet(true)}
              className="w-full h-[48px] rounded-[14px] px-3.5 bg-[#F7F7F4] border border-[#E5E7EB] hover:border-[#2B2437] flex items-center justify-between cursor-pointer select-none active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#E39026]" />
                <span className="text-[14.5px] font-bold text-[#2B2437]">
                  {categoryId ? selectedCategory.label : STRINGS.shop.categoryPlaceholder}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>
          </div>

          {/* 3. पिन कोड (Required) */}
          <div className="flex flex-col gap-1.5">
            <Field
              label={STRINGS.shop.pincodeLabel}
              required
              maxLength={6}
              inputMode="numeric"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder={STRINGS.shop.pincodePlaceholder}
            />

            {/* Resolved City Line */}
            {resolvedCity && (
              <div className="flex items-center gap-1.5 text-[12.5px] text-[#2F8F5B] font-bold px-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>✓ {resolvedCity.name}, {resolvedCity.state}</span>
              </div>
            )}

            {/* Fallback when pincode not found */}
            {pincodeNotFound && (
              <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-between animate-fadeIn">
                <span className="text-[12px] text-[#4A4358] font-medium">
                  {STRINGS.shop.pincodeNotFound}
                </span>
                <button
                  type="button"
                  onClick={() => setShowCitySheet(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] font-bold text-[12px] text-[#E39026] shadow-xs active:scale-95 cursor-pointer"
                >
                  {STRINGS.shop.pickCityBtn}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: अन्य जानकारी (वैकल्पिक Collapsible Disclosure) */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="w-full py-3 px-4 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between text-left hover:bg-[#F9FAFB] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-[#2B2437]">
                अतिरिक्त जानकारी (पता, ईमेल, मालिक)
              </span>
              <span className="text-[11px] font-semibold text-[#6B7280] px-2 py-0.5 rounded-full bg-[#F3F4F6]">
                वैकल्पिक
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${showOptional ? 'rotate-180' : ''}`} />
          </button>

          {showOptional && (
            <div className="bg-white rounded-[22px] border border-[#E5E7EB] p-4 shadow-xs space-y-3.5 mb-2 animate-fadeIn">
              {/* 4. पता या इलाका (Optional) */}
              <Field
                label={STRINGS.shop.addressLabel}
                value={address}
                onChange={(val) => {
                  setAddress(val);
                  updateShop({ address: val });
                }}
                placeholder={STRINGS.shop.addressPlaceholder}
              />

              {/* 5. मालिक का नाम (Optional) */}
              <Field
                label={STRINGS.shop.ownerLabel}
                value={ownerName}
                onChange={(val) => {
                  setOwnerName(val);
                  updateShop({ ownerName: val });
                }}
                placeholder={STRINGS.shop.ownerPlaceholder}
              />

              {/* 6. ईमेल (Optional) */}
              <Field
                label={STRINGS.shop.emailLabel}
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={STRINGS.shop.emailPlaceholder}
                helper={STRINGS.shop.emailHelper}
                error={emailError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        disabled={!isFormValid}
        missingHint={missingHint}
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

      {/* City Picker fallback sheet (single select) */}
      <CitySheet
        isOpen={showCitySheet}
        onClose={() => setShowCitySheet(false)}
        singleSelect
        onSelectSingleCity={handleSingleCityPick}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
