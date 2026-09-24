import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shop, User, Call, Sms, Camera, Location, TickCircle, ArrowRight, Category } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import CanonicalErrorBanner from '../../components/advertiser/CanonicalErrorBanner';
import { useAdvertiser } from '../../context/AdvertiserContext';

const BUSINESS_CATEGORIES = [
  'किराना / जनरल स्टोर',
  'कपड़े / फैशन',
  'इलेक्ट्रॉनिक्स',
  'रेस्टोरंट / खान-पान',
  'मेडिकल / दवाई',
  'शिक्षा / कोचिंग',
  'हार्डवेयर / निर्माण',
  'ज्वेलरी / सोना-चाँदी',
  'मोबाइल / टेलीकॉम',
  'ब्यूटी / सैलून',
  'ऑटो / गाड़ी',
  'कृषि / बीज-खाद',
  'अन्य',
];

export default function AdvertiserBusinessProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const fromDashboard = location.state?.fromDashboard;
  const { advertiserAuth, draftCampaign, updateDraftCampaign, businessProfile, updateBusinessProfile } = useAdvertiser();

  const [businessName, setBusinessName] = useState(draftCampaign.businessName || businessProfile?.businessName || '');
  const [ownerName, setOwnerName] = useState(draftCampaign.ownerName || businessProfile?.ownerName || '');
  const [businessCategory, setBusinessCategory] = useState(draftCampaign.businessCategory || businessProfile?.businessCategory || '');
  const [phone, setPhone] = useState(draftCampaign.phone || businessProfile?.phone || advertiserAuth.phone || '9826012345');
  const [email, setEmail] = useState(draftCampaign.email || businessProfile?.email || '');
  const [logoUrl, setLogoUrl] = useState(draftCampaign.businessLogoUrl || businessProfile?.businessLogoUrl || null);
  const [address, setAddress] = useState(draftCampaign.storeAddress || businessProfile?.storeAddress || '');
  const [pincode, setPincode] = useState(draftCampaign.pincode || businessProfile?.pincode || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceed = (e) => {
    e?.preventDefault();
    if (!businessName.trim()) {
      setErrorMessage('कृपया अपने बिज़नेस का नाम दर्ज करें।');
      return;
    }

    if (!businessCategory) {
      setErrorMessage('कृपया अपने बिज़नेस की श्रेणी चुनें।');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('कृपया एक मान्य ईमेल पता दर्ज करें (उदा. info@business.com)।');
      return;
    }

    if (pincode.trim() && pincode.trim().length !== 6) {
      setErrorMessage('कृपया 6 अंकों का मान्य पिन कोड दर्ज करें।');
      return;
    }

    const profileData = {
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      businessCategory,
      phone: phone.trim(),
      email: email.trim(),
      businessLogoUrl: logoUrl,
      storeAddress: address.trim(),
      pincode: pincode.trim(),
    };

    if (updateBusinessProfile) {
      updateBusinessProfile(profileData);
    }
    updateDraftCampaign(profileData);

    if (fromReview) {
      navigate('/advertise/review');
    } else if (fromDashboard) {
      navigate('/advertise/location-tax', { state: { fromDashboard: true } });
    } else {
      navigate('/advertise/location-tax');
    }
  };

  const initialLetter = businessName.trim()
    ? businessName.trim().charAt(0).toUpperCase()
    : 'S';

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="centered"
        title="बिज़नेस प्रोफ़ाइल बनाएँ"
        subtitle="अपने बिज़नेस की जानकारी भरें"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else if (fromDashboard) {
            navigate('/advertise/dashboard');
          } else {
            navigate('/advertise/otp');
          }
        }}
      />

      <form onSubmit={handleProceed} className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-4">
          {/* Logo / Avatar Section */}
          <div className="flex flex-col items-center justify-center pt-1 pb-1">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#2B2437] flex items-center justify-center ring-4 ring-[#FDE68A]/60 shadow-md overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="लोगो"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[36px] font-black text-white font-sans">
                    {initialLetter}
                  </span>
                )}
              </div>

              {/* Camera Badge Trigger */}
              <label className="w-8 h-8 rounded-full bg-[#E39026] text-white flex items-center justify-center shadow-md absolute -bottom-1 -right-1 cursor-pointer active:scale-95 transition-transform hover:bg-[#D97706]">
                <Camera size={16} color="#FFFFFF" variant="Bold" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[13px] font-bold text-[#2B2437] mt-2 block text-center">
              लोगो जोड़ें
            </span>
          </div>

          {/* Card 1: बिज़नेस की जानकारी */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-[10px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                <User size={18} color="#E39026" variant="Bold" />
              </div>
              <h2 className="text-[16px] font-bold text-[#2B2437]">
                बिज़नेस की जानकारी
              </h2>
            </div>

            {/* Field: बिज़नेस का नाम */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                बिज़नेस का नाम <span className="text-[#DC2626]">*</span>
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs">
                <Shop size={18} color="#6B7280" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="अपने बिज़नेस का नाम डालें"
                  className="text-[14px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1"
                />
              </div>
            </div>

            {/* Field: मालिक का नाम */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                मालिक का नाम
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs">
                <User size={18} color="#6B7280" />
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="जैसे: राजेश शर्मा"
                  className="text-[14px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1"
                />
              </div>
            </div>

            {/* Field: बिज़नेस श्रेणी */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                बिज़नेस श्रेणी <span className="text-[#DC2626]">*</span>
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs relative">
                <Category size={18} color="#6B7280" />
                <select
                  value={businessCategory}
                  onChange={(e) => { setBusinessCategory(e.target.value); if (errorMessage) setErrorMessage(''); }}
                  className="text-[14px] font-medium text-[#2B2437] bg-transparent outline-none flex-1 appearance-none cursor-pointer pr-6"
                >
                  <option value="">श्रेणी चुनें</option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field: मोबाइल नंबर with Verified Badge */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                मोबाइल नंबर
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center justify-between focus-within:border-[#2B2437] transition-all shadow-xs">
                <div className="flex items-center gap-2.5 flex-1">
                  <Call size={18} color="#6B7280" />
                  <span className="text-[14px] font-bold text-[#2B2437] font-mono">
                    +91 {phone}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  <TickCircle size={13} color="#D97706" variant="Bold" />
                  <span>वेरिफाइड</span>
                </div>
              </div>
            </div>

            {/* Field: ईमेल पता */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                ईमेल (ऑप्शनल)
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs">
                <Sms size={18} color="#6B7280" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="अपना ईमेल पता डालें"
                  className="text-[14px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1"
                />
              </div>
            </div>
          </div>

          {/* Card 2: दुकान / ऑफ़िस का पता */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-[10px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                <Location size={18} color="#E39026" variant="Bold" />
              </div>
              <h2 className="text-[16px] font-bold text-[#2B2437]">
                दुकान / ऑफ़िस का पता
              </h2>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                पता या इलाका
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs">
                <Location size={18} color="#6B7280" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="दुकान / ऑफ़िस का पता या इलाका डालें"
                  className="text-[14px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2B2437] mb-1">
                पिन कोड
              </label>
              <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-3.5 flex items-center gap-2.5 focus-within:border-[#2B2437] transition-all shadow-xs">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6 अंकों का पिन कोड डालें"
                  className="text-[14px] font-medium text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 font-mono tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* Canonical Error Banner */}
          {errorMessage && <CanonicalErrorBanner message={errorMessage} />}
        </div>

        {/* Action CTA matching MVP onboarding button */}
        <div className="pt-2 pb-2">
          <button
            type="submit"
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-colors"
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </form>
    </div>
  );
}
