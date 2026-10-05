import React, { useState, useRef, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import AdPreview from '../components/ad/AdPreview';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import PaymentSheet from '../components/sheets/PaymentSheet';
import BillSheet from '../components/sheets/BillSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { useToastV2 } from '../context/ToastV2Context';
import { getGoalById } from '../data/goals';
import { getFormatById } from '../data/formats';
import { getCtaLabel as getLabelForCta } from '../data/ctaOptions';
import { getCityById } from '../data/cities';
import { getMoneyBreakdown } from '../utils/money';
import { isValidGstin, isValidPan, maskIdentity } from '../utils/validators';
import { formatIN } from '../utils/formatIN';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import {
  Pencil,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Lock,
  MapPin,
  Store,
  Sparkles,
  Receipt,
} from 'lucide-react';

export default function S08_ReviewPay({ onOpenFacilitator }) {
  const { state, setIdentity, commitCampaign } = useAdvertiserV2();
  const { goBack, navigateTo } = useFlowNav();
  const { showToast } = useToastV2();

  const draft = state.draft || {};
  const shop = state.shop || {};
  const identity = state.identity || {};

  const [idTab, setIdTab] = useState('gst'); // 'gst' | 'pan'
  const [typedIdValue, setTypedIdValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [idError, setIdError] = useState(null);
  const [flashCard, setFlashCard] = useState(false);

  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showBillSheet, setShowBillSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const identityCardRef = useRef(null);

  // Formatting summary data
  const goalObj = getGoalById(draft.goal || 'engagement');
  const formatObj = getFormatById(draft.format || 'feed_card_ad');
  const ctaText = getLabelForCta(draft.goal, draft.ctaKey);

  const money = useMemo(() => {
    return getMoneyBreakdown(draft.budget?.dailyAmount || 250, draft.budget?.days || 7);
  }, [draft.budget]);

  // Cities string & list
  const cityList = useMemo(() => {
    const ids = draft.area?.manualCityIds?.length
      ? draft.area.manualCityIds
      : [shop.cityId || 'indore'];
    return ids.map((id) => getCityById(id)?.name || id);
  }, [draft.area, shop.cityId]);

  const cityNamesText = useMemo(() => {
    if (cityList.length <= 2) return cityList.join(', ');
    return `${cityList.slice(0, 2).join(', ')} +${cityList.length - 2} अन्य`;
  }, [cityList]);

  // Audience string
  const audienceText = useMemo(() => {
    const aud = draft.audience || { gender: 'all', ages: ['18-27', '28-43', '44-59', '60+'] };
    const gText = aud.gender === 'all' ? 'सभी पाठक' : aud.gender === 'male' ? 'पुरुष' : 'महिला';
    const isAllAges = aud.ages.length === 4;
    return `${gText} · ${isAllAges ? '18+ उम्र' : aud.ages.join(', ')}`;
  }, [draft.audience]);

  // Unified Reach Formula for executive banner
  const reachablePeople = useMemo(() => {
    const radiusKm = draft.area?.radiusKm || 10;
    const dailyAmount = draft.budget?.dailyAmount || 250;
    const days = draft.budget?.days || 7;
    const locationFactor = 0.90 + ((radiusKm - 5) / 20) * 0.40;
    const budgetRatio = Math.max(100, dailyAmount) / 300;
    const durationRatio = Math.max(1, days) / 7;
    const baseReach = 5800;
    const raw = baseReach * Math.pow(budgetRatio, 0.85) * Math.pow(durationRatio, 0.75) * locationFactor;
    return Math.max(1200, Math.round(raw));
  }, [draft.budget, draft.area]);

  // Check identity verification
  const handleVerifyIdentity = () => {
    const clean = typedIdValue.trim().toUpperCase();

    if (idTab === 'gst') {
      if (!isValidGstin(clean)) {
        setIdError('कृपया मान्य 15 अंकों का GST नंबर डालें');
        return;
      }
    } else {
      if (!isValidPan(clean)) {
        setIdError('कृपया मान्य 10 अंकों का PAN नंबर डालें');
        return;
      }
    }

    // Prototype rule: values starting with AAAAA fail
    if (clean.startsWith('AAAAA')) {
      setIdError(STRINGS.review.identityInvalidError);
      track('identity_failed', { reason: 'mock_rejection' });
      return;
    }

    setIdError(null);
    setIsVerifying(true);
    track('identity_start', { method: idTab });

    setTimeout(() => {
      setIsVerifying(false);
      const masked = maskIdentity(clean);
      setIdentity({
        method: idTab,
        valueMasked: masked,
        verified: true,
        verifiedAt: Date.now(),
      });
      track('identity_verified', { method: idTab });
    }, 1100);
  };

  const handlePayClick = () => {
    if (!identity.verified) {
      showToast(STRINGS.review.verifyIdentityFirstToast);
      setFlashCard(true);
      identityCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setFlashCard(false), 1400);
      return;
    }

    setShowPaymentSheet(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentSheet(false);
    commitCampaign();
    navigateTo('status');
  };

  const handleEditScreen = (screenId) => {
    track('edit_from_review', { target: screenId });
    navigateTo(screenId, { fromReview: true });
  };

  const identityTabs = [
    { id: 'gst', label: STRINGS.review.gstTab },
    { id: 'pan', label: STRINGS.review.panTab },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F8F8F6] overflow-hidden select-none">
      {/* Header (Step 6 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={6}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Review Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h1 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.review.title}
          </h1>
          <p className="text-[12px] text-[#6B7280]">
            विवरण जांचें और सुरक्षित भुगतान करें
          </p>
        </div>

        {/* 1. Sleek Compact Telemetry Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-[12.5px]">
          <div className="flex items-center gap-1.5 font-bold text-[#2B2437]">
            <span className="w-2 h-2 rounded-full bg-[#2F8F5B] animate-pulse shrink-0" />
            <span className="tabular-nums">~{formatIN(reachablePeople)} पाठक</span>
          </div>
          <span className="text-[#E5E7EB]">|</span>
          <span className="font-semibold text-[#4A4358] truncate max-w-[130px]">
            {cityNamesText} ({draft.area?.radiusKm || 10} किमी)
          </span>
          <span className="text-[#E5E7EB]">|</span>
          <span className="font-bold text-[#2B2437]">{money.days} दिन</span>
        </div>

        {/* 2. Interactive Ad Preview Card */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-bold text-[#6B7280]">
              {STRINGS.review.previewCaption} ({formatObj.title}):
            </span>
            <button
              type="button"
              onClick={() => handleEditScreen('ad')}
              className="text-[12px] font-bold text-[#E39026] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span>बदलें</span>
            </button>
          </div>

          <div className="rounded-[20px] overflow-hidden border border-[#E5E7EB] bg-white shadow-2xs p-1">
            <AdPreview
              format={formatObj.id}
              shop={shop}
              headline={draft.headline}
              description={draft.description}
              ctaLabel={ctaText}
              media={draft.media}
            />
          </div>
        </div>

        {/* 3. Single Unified Summary Card */}
        <div className="rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs overflow-hidden divide-y divide-[#E5E7EB]/70">
          {/* Row 1: उद्देश्य व प्रकार */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  {STRINGS.review.rowGoalFormat}
                </span>
                <span className="text-[13.5px] font-bold text-[#2B2437] truncate">
                  {goalObj.title} · {formatObj.title} ({ctaText})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('goal')}
              className="text-[#E39026] hover:text-[#C97F1E] p-1.5 rounded-lg hover:bg-amber-50 cursor-pointer shrink-0"
              aria-label="उद्देश्य बदलें"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 2: इलाका व ऑडियंस */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  {STRINGS.review.rowArea} व {STRINGS.review.rowAudience}
                </span>
                <span className="text-[13.5px] font-bold text-[#2B2437] truncate">
                  {cityNamesText} · {draft.area?.radiusKm || 10} किमी ({audienceText})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('budget')}
              className="text-[#E39026] hover:text-[#C97F1E] p-1.5 rounded-lg hover:bg-amber-50 cursor-pointer shrink-0"
              aria-label="इलाका बदलें"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 3: दुकान */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  {STRINGS.review.rowShop}
                </span>
                <span className="text-[13.5px] font-bold text-[#2B2437] truncate">
                  {shop.name || 'दुकान'} · {shop.city || 'इंदौर'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('shop')}
              className="text-[#E39026] hover:text-[#C97F1E] p-1.5 rounded-lg hover:bg-amber-50 cursor-pointer shrink-0"
              aria-label="दुकान बदलें"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 4: बजट और बिल */}
          <div className="p-3 bg-[#FBFBFA] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#6B7280]">
                  {STRINGS.review.rowBudget} (GST सहित)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[16px] font-black text-[#2B2437] tabular-nums">
                    ₹{formatIN(money.total)}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    (₹{formatIN(money.daily)}/दिन × {money.days} दिन + 18% GST)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="text-[12px] font-bold text-[#E39026] hover:underline cursor-pointer shrink-0 px-2 py-1"
            >
              बिल देखें
            </button>
          </div>
        </div>

        {/* 4. Compact Identity Verification (KYC) */}
        <div
          ref={identityCardRef}
          className={`p-3.5 rounded-[20px] transition-all duration-300 border ${
            identity.verified
              ? 'bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] border-[#86EFAC]'
              : flashCard
              ? 'bg-red-50 border-[#DC2626] ring-4 ring-red-200'
              : 'bg-white border-[#E5E7EB] shadow-2xs'
          }`}
        >
          {identity.verified ? (
            /* Verified State */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#2F8F5B] shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[13.5px] text-[#14532D]">
                      {STRINGS.review.identityVerifiedLine(identity.valueMasked)}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#2F8F5B]" />
                  </div>
                  <span className="text-[11.5px] font-medium text-[#166534]">
                    18% ITC इनपुट टैक्स क्रेडिट के लिए मान्य
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIdentity({ verified: false, valueMasked: '', method: null });
                  setTypedIdValue('');
                }}
                className="text-[12px] font-bold text-emerald-700 hover:text-emerald-900 underline px-2 py-1 cursor-pointer shrink-0"
              >
                बदलें
              </button>
            </div>
          ) : (
            /* Unverified Input State */
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E39026]" />
                  <span className="font-bold text-[13.5px] text-[#2B2437]">
                    {STRINGS.review.identityTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelpSheet(true)}
                  className="text-[11.5px] font-bold text-[#E39026] hover:underline"
                >
                  {STRINGS.review.neitherHelpLink}
                </button>
              </div>

              {/* GST vs PAN segmented control */}
              <SegmentedTabs
                tabs={identityTabs}
                activeTab={idTab}
                onChange={(tab) => {
                  setIdTab(tab);
                  setIdError(null);
                  setTypedIdValue('');
                }}
              />

              {/* Single Input Row with verify button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={typedIdValue}
                  onChange={(e) => {
                    setTypedIdValue(e.target.value.toUpperCase());
                    if (idError) setIdError(null);
                  }}
                  placeholder={idTab === 'gst' ? '15 अंकों का GST नंबर' : '10 अंकों का PAN नंबर'}
                  maxLength={idTab === 'gst' ? 15 : 10}
                  className="flex-1 h-[44px] rounded-xl px-3 bg-[#F7F7F4] border border-[#E5E7EB] font-mono text-[14px] font-bold text-[#2B2437] uppercase tracking-wider outline-none focus:border-[#2B2437] focus:bg-white transition-all shadow-inner-xs"
                />

                <button
                  type="button"
                  onClick={handleVerifyIdentity}
                  disabled={isVerifying || !typedIdValue.trim()}
                  className="h-[44px] px-4 rounded-xl bg-[#2B2437] hover:bg-[#3D334E] text-white font-bold text-[13px] disabled:opacity-40 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isVerifying ? (
                    <span>जाँच हो रही है…</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E39026]" />
                      <span>{STRINGS.review.checkIdentityBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {idError && (
                <div className="flex items-center gap-1.5 text-[11.5px] text-[#DC2626] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{idError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Minimal 1-Line Trust Reassurance */}
        <div className="flex items-center justify-center gap-2.5 text-[11.5px] text-[#6B7280] py-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#2F8F5B]" />
            100% सुरक्षित भुगतान
          </span>
          <span>•</span>
          <span>24 घंटे में अप्रूवल</span>
          <span>•</span>
          <span>अस्वीकृत पर पूरा रिफंड</span>
        </div>
      </div>

      {/* Sticky Bottom Pay CTA */}
      <StickyCTA
        label={
          identity.verified
            ? `₹${formatIN(money.total)} पे करें`
            : 'पहचान सत्यापित करके पे करें'
        }
        onClick={handlePayClick}
        showArrow={false}
        summaryContent={
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-black text-[17px] text-[#2B2437] tabular-nums">
                ₹{formatIN(money.total)}
              </span>
              <span className="text-[11px] text-[#6B7280]">
                कुल राशि (GST सहित) · {money.days} दिन
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="text-[12px] font-bold text-[#E39026] hover:underline cursor-pointer px-2 py-1 rounded-lg hover:bg-amber-50"
            >
              बिल ब्यौरा
            </button>
          </div>
        }
      />

      {/* Payment Sheet */}
      <PaymentSheet
        isOpen={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        totalAmount={money.total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Detailed Bill Breakdown Sheet */}
      <BillSheet
        isOpen={showBillSheet}
        onClose={() => setShowBillSheet(false)}
        daily={money.daily}
        days={money.days}
        subtotal={money.subtotal}
        gst={money.gst}
        total={money.total}
      />

      {/* Help Sheet */}
      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
        topic="review"
      />
    </div>
  );
}


