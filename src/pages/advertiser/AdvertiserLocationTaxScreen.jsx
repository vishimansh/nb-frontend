import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldSecurity, Eye, EyeSlash, TickCircle, ArrowRight } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import CanonicalErrorBanner from '../../components/advertiser/CanonicalErrorBanner';
import { useAdvertiser } from '../../context/AdvertiserContext';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const isValidGstin = (val) => {
  if (!GSTIN_REGEX.test(val)) return false;
  const stateCode = parseInt(val.slice(0, 2), 10);
  return stateCode >= 1 && stateCode <= 37;
};

const formatAadhaar = (digits) => {
  if (!digits) return '';
  const clean = digits.replace(/\D/g, '').slice(0, 12);
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join(' ');
};

export default function AdvertiserLocationTaxScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const fromDashboard = location.state?.fromDashboard;
  const { draftCampaign, updateDraftCampaign, businessProfile, updateBusinessProfile, setIsBusinessProfileSaved } = useAdvertiser();

  const [rawId, setRawId] = useState(draftCampaign.idNumberRaw || businessProfile?.idNumberRaw || '');
  const [showId, setShowId] = useState(true);
  const [aadhaarError, setAadhaarError] = useState('');

  const [hasGstin, setHasGstin] = useState(draftCampaign.hasGstin ?? businessProfile?.hasGstin ?? false);
  const [gstin, setGstin] = useState(draftCampaign.gstin || businessProfile?.gstin || '');
  const [gstinError, setGstinError] = useState('');

  const handleIdChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setRawId(digitsOnly);

    if (aadhaarError && digitsOnly.length === 12) {
      setAadhaarError('');
    }
  };

  const handleGstinChange = (e) => {
    const uppercaseVal = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
    setGstin(uppercaseVal);

    if (gstinError) {
      if (isValidGstin(uppercaseVal)) {
        setGstinError('');
      }
    }
  };

  const handleGstinBlur = () => {
    if (hasGstin && gstin.length > 0) {
      if (!isValidGstin(gstin)) {
        setGstinError('अमान्य जीएसटी नंबर: कृपया 15 अक्षरों का सही प्रारूप दर्ज करें (उदा. 23AAAAA0000A1Z5)।');
      } else {
        setGstinError('');
      }
    }
  };

  const isIdValid = rawId.length === 12;
  const isGstinValid = isValidGstin(gstin);
  const isComplete = isIdValid && (!hasGstin || isGstinValid);

  const handleProceed = (e) => {
    e?.preventDefault();

    if (rawId.length !== 12) {
      setAadhaarError(`कृपया आधार कार्ड के पूरे 12 अंक दर्ज करें (${rawId.length}/12 अंक दर्ज)।`);
      return;
    }

    if (hasGstin && !isGstinValid) {
      setGstinError('अमान्य जीएसटी नंबर: कृपया 15 अक्षरों का सही प्रारूप दर्ज करें (उदा. 23AAAAA0000A1Z5)।');
      return;
    }

    const maskedFinal = `•••• •••• ${rawId.slice(8, 12)}`;

    const taxData = {
      idNumberRaw: rawId,
      idNumberMasked: maskedFinal,
      hasGstin,
      gstin: hasGstin ? gstin : '',
    };

    if (updateBusinessProfile) {
      updateBusinessProfile(taxData);
    }
    updateDraftCampaign(taxData);

    setIsBusinessProfileSaved(true);

    if (fromReview) {
      navigate('/advertise/review');
    } else if (fromDashboard) {
      navigate('/advertise/dashboard');
    } else {
      navigate('/advertise/goal');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="centered"
        title="पहचान और टैक्स जानकारी"
        subtitle="सुरक्षित वेरिफिकेशन और बिलिंग के लिए"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else if (fromDashboard) {
            navigate('/advertise/business-profile', { state: { fromDashboard: true } });
          } else {
            navigate('/advertise/business-profile');
          }
        }}
      />

      <form onSubmit={handleProceed} className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-4">
          {/* Section: आधार कार्ड */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#2B2437]">
                आधार नंबर <span className="text-[#DC2626]">*</span>
              </label>
              <span className="text-[11px] text-[#2B2437] font-semibold flex items-center gap-1">
                <ShieldSecurity size={13} color="#2B2437" variant="Bold" />
                सुरक्षित
              </span>
            </div>

            <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-4 flex items-center justify-between focus-within:border-[#2B2437] shadow-xs transition-all">
              <input
                type={showId ? 'text' : 'password'}
                inputMode="numeric"
                value={formatAadhaar(rawId)}
                onChange={handleIdChange}
                placeholder="0000 0000 0000"
                maxLength={14}
                className="text-[16px] font-semibold tracking-wider text-[#2B2437] placeholder:text-[#9CA3AF] bg-transparent outline-none flex-1 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowId(!showId)}
                className="text-[#6B7280] hover:text-[#2B2437] p-1 cursor-pointer"
              >
                {showId ? (
                  <EyeSlash size={16} color="#2B2437" />
                ) : (
                  <Eye size={16} color="#2B2437" />
                )}
              </button>
            </div>

            {/* Validation Feedback */}
            {rawId.length > 0 && rawId.length < 12 && (
              <p className="text-[12px] text-[#D97706] font-medium">
                कृपया {12 - rawId.length} अंक और दर्ज करें
              </p>
            )}

            {aadhaarError && (
              <p className="text-[12px] text-[#DC2626] font-medium">
                {aadhaarError}
              </p>
            )}

            {rawId.length === 12 && (
              <p className="text-[12px] text-[#2B2437] font-medium flex items-center gap-1">
                <TickCircle size={13} color="#2B2437" variant="Bold" />
                आधार के पूरे 12 अंक दर्ज हैं
              </p>
            )}
          </div>

          {/* Section: जीएसटी नंबर */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-semibold text-[#2B2437]">
                GST नंबर {hasGstin && <span className="text-[#DC2626]">*</span>}
              </label>
              <span className="text-[12px] text-[#6B7280] font-normal">
                {hasGstin ? 'ज़रूरी' : 'ऑप्शनल'}
              </span>
            </div>

            {/* Micro-business exemption checkbox */}
            <label className="flex items-start gap-2.5 bg-[#FFF9EE] p-3 rounded-[14px] border border-[#FDE68A] cursor-pointer active:scale-[0.99] transition-transform">
              <input
                type="checkbox"
                checked={!hasGstin}
                onChange={(e) => {
                  const isExempt = e.target.checked;
                  setHasGstin(!isExempt);
                  if (isExempt) setGstinError('');
                }}
                className="mt-0.5 w-4 h-4 rounded text-[#2B2437] accent-[#2B2437] cursor-pointer"
              />
              <div className="text-[12px] leading-snug">
                <span className="font-semibold text-[#2B2437] block">मेरे पास GST नंबर नहीं है</span>
                <span className="text-[#6B7280]">सालाना टर्नओवर कम होने पर GST ज़रूरी नहीं है</span>
              </div>
            </label>

            {hasGstin ? (
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  value={gstin}
                  onChange={handleGstinChange}
                  onBlur={handleGstinBlur}
                  placeholder="उदा. 23AAAAA0000A1Z5"
                  maxLength={15}
                  className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] px-4 uppercase text-[15px] font-semibold tracking-wider text-[#2B2437] placeholder:text-[#9CA3AF] w-full outline-none focus:border-[#2B2437] shadow-xs transition-all font-mono"
                />
              </div>
            ) : (
              <div className="p-3 bg-[#FFF9EE] rounded-[14px] border border-[#FDE68A] flex items-center gap-2 text-[12px] text-[#2B2437]">
                <TickCircle size={16} color="#E39026" variant="Bold" className="shrink-0" />
                <span>आधार वेरिफिकेशन के साथ आप सीधे विज्ञापन शुरू कर सकते हैं।</span>
              </div>
            )}
          </div>

          {/* Canonical Error Banner for GSTIN */}
          {hasGstin && gstinError && <CanonicalErrorBanner message={gstinError} />}
        </div>

        {/* Action CTA matching MVP */}
        <div className="pt-2 pb-2">
          <button
            type="submit"
            disabled={!isComplete}
            className={`w-full h-[56px] rounded-[16px] font-medium text-[18px] shadow-md transition-colors flex items-center justify-center gap-2 ${
              isComplete
                ? 'bg-[#2B2437] text-white active:scale-[0.99] cursor-pointer hover:bg-[#3D334E]'
                : 'bg-[#2B2437]/40 text-white/60 cursor-not-allowed'
            }`}
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </form>
    </div>
  );
}
