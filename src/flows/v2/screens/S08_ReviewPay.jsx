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
  Clock,
  RotateCcw,
  Download,
  Users,
} from 'lucide-react';
import { triggerPrototypeDownload } from '../components/ad/AdPreview';

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
    if (draft.area?.manualCityIds?.length) {
      return draft.area.manualCityIds.map((id) => getCityById(id)?.name || id);
    }
    if (shop.city) return [shop.city];
    if (shop.cityId) return [getCityById(shop.cityId)?.name || shop.cityId];
    return ['इंदौर'];
  }, [draft.area, shop.city, shop.cityId]);

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
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none">
      {/* Header (Step 6 of 6) */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={6}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Review Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col gap-3 scrollbar-none">
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center pt-1">
          <h1 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight leading-tight">
            {STRINGS.review.title}
          </h1>
        </div>

        {/* 1. Hero Reach & Impact Card: "आपका विज्ञापन इतने लोगों तक पहुँचेगा" */}
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#FFF9EE] via-[#FFF3D6] to-[#FDE8B3] border border-[#F6DFA8] shadow-[0_4px_16px_rgba(227,144,38,0.12)] p-4 flex flex-col gap-3">
          {/* Subtle Ambient Glow Watermarks */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#E39026]/12 pointer-events-none blur-sm" />
          <div className="absolute right-12 -bottom-8 w-20 h-20 rounded-full bg-[#F59E0B]/10 pointer-events-none blur-md" />

          {/* Header Row: Live Pulse Pill & Badge */}
          <div className="flex items-center justify-between z-10 gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#F6DFA8] text-[11px] font-bold text-[#854D0E] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
              <span>आपका विज्ञापन इतने लोगों तक पहुँचेगा</span>
            </div>
            <span className="text-[10.5px] font-bold text-[#B45309] bg-[#E39026]/15 px-2 py-0.5 rounded-full shrink-0">
              अनुमानित पहुँच
            </span>
          </div>

          {/* Hero Numbers Row */}
          <div className="flex items-baseline justify-between z-10 pt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[32px] sm:text-[34px] font-black text-[#2B2437] tabular-nums tracking-tight leading-none">
                ~{formatIN(reachablePeople)}
              </span>
              <span className="text-[14px] font-bold text-[#854D0E]">
                पाठक
              </span>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10.5px] font-semibold text-[#8C8C94] leading-tight">प्रतिदिन लगभग</span>
              <span className="text-[13px] font-bold text-[#2B2437] tabular-nums leading-snug">
                ~{formatIN(Math.round(reachablePeople / (money.days || 1)))} पाठक
              </span>
            </div>
          </div>

          {/* Parameters / Target Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-[#F6DFA8]/60 z-10">
            {/* Target Location */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs rounded-xl px-2.5 py-2 border border-[#F6DFA8]/60 shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-[#E39026]/15 flex items-center justify-center text-[#D97706] shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-[#8C8C94] leading-tight">इलाका व दायरा</span>
                <span className="text-[12px] font-bold text-[#2B2437] truncate leading-tight mt-0.5">
                  {cityNamesText} ({draft.area?.radiusKm || 10} किमी)
                </span>
              </div>
            </div>

            {/* Duration & Daily Budget */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs rounded-xl px-2.5 py-2 border border-[#F6DFA8]/60 shadow-2xs">
              <div className="w-6 h-6 rounded-lg bg-[#E39026]/15 flex items-center justify-center text-[#D97706] shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-[#8C8C94] leading-tight">अवधि व बजट</span>
                <span className="text-[12px] font-bold text-[#2B2437] truncate leading-tight mt-0.5">
                  {money.days} दिन · ₹{formatIN(money.daily)}/दिन
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Ad Preview Card */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-bold text-[#2B2437]">
              {STRINGS.review.previewCaption}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => triggerPrototypeDownload(formatObj.id, showToast)}
                className="text-[11.5px] font-bold text-[#2B2437] bg-[#F4F4F2] border border-[#E5E7EB] px-2.5 py-1 rounded-full hover:bg-[#EBEBE8] flex items-center gap-1 cursor-pointer transition-colors"
                title="प्रोटोटाइप इमेज डाउनलोड करें"
              >
                <Download className="w-3 h-3 text-[#2B2437]" />
                <span>डाउनलोड</span>
              </button>
              <button
                type="button"
                onClick={() => handleEditScreen('ad')}
                className="text-[11.5px] font-bold text-[#B45309] bg-[#FFF8E7] border border-[#F6DFA8] px-2.5 py-1 rounded-full hover:bg-[#FDEFC6] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Pencil className="w-3 h-3" />
                <span>विज्ञापन बदलें</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#EDEDEA] bg-white shadow-[0_6px_20px_rgba(43,36,55,0.07)] p-1.5">
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
        <div className="rounded-2xl bg-white border border-[#EDEDEA] shadow-[0_2px_10px_rgba(43,36,55,0.05)] overflow-hidden divide-y divide-[#F4F4F2]">
          {/* Row 1: उद्देश्य व प्रकार */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10.5px] font-semibold text-[#8C8C94]">
                  {STRINGS.review.rowGoalFormat}
                </span>
                <span className="text-[13px] font-bold text-[#2B2437] truncate">
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
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* Row 2: इलाका व ऑडियंस */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10.5px] font-semibold text-[#8C8C94]">
                  {STRINGS.review.rowAudience}
                </span>
                <span className="text-[13px] font-bold text-[#2B2437] truncate">
                  {audienceText}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('budget')}
              className="text-[#E39026] hover:text-[#C97F1E] p-1.5 rounded-lg hover:bg-amber-50 cursor-pointer shrink-0"
              aria-label="इलाका बदलें"
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* Row 3: दुकान */}
          <div className="p-3 flex items-center justify-between gap-2 hover:bg-neutral-50/50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] shrink-0">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10.5px] font-semibold text-[#8C8C94]">
                  {STRINGS.review.rowShop}
                </span>
                <span className="text-[13px] font-bold text-[#2B2437] truncate">
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
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* Row 4: बजट और बिल */}
          <div className="p-3 bg-[#FAF9F6] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] shrink-0">
                <Receipt className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10.5px] font-semibold text-[#8C8C94]">
                  {STRINGS.review.rowBudget}
                </span>
                <span className="text-[13px] font-bold text-[#2B2437] tabular-nums">
                  ₹{formatIN(money.daily)}/दिन × {money.days} दिन
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Compact Identity Verification (KYC) */}
        <div
          ref={identityCardRef}
          className={`p-3.5 rounded-2xl transition-all duration-300 border ${
            identity.verified
              ? 'bg-[#F0FDF4] border-[#86EFAC]'
              : flashCard
              ? 'bg-red-50 border-[#DC2626] ring-4 ring-red-200'
              : 'bg-white border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          }`}
        >
          {identity.verified ? (
            /* Verified State */
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#16A34A] shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[13px] text-[#14532D]">
                      {STRINGS.review.identityVerifiedLine(identity.valueMasked)}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                  </div>
                  <span className="text-[11px] font-medium text-[#166534]">
                    GST इनवॉइस पर 18% ITC टैक्स क्रेडिट मिलेगा
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIdentity({ verified: false, valueMasked: '', method: null });
                  setTypedIdValue('');
                }}
                className="text-[11.5px] font-bold text-emerald-700 hover:text-emerald-900 underline px-2 py-1 cursor-pointer shrink-0"
              >
                बदलें
              </button>
            </div>
          ) : (
            /* Unverified Input State */
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E39026]" />
                  <span className="font-bold text-[13px] text-[#2B2437]">
                    {STRINGS.review.identityTitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelpSheet(true)}
                  className="text-[11px] font-bold text-[#E39026] hover:underline"
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
                  className="flex-1 h-[42px] rounded-xl px-3 bg-[#FAF9F6] border border-[#EDEDEA] font-mono text-[13.5px] font-bold text-[#2B2437] uppercase tracking-wider outline-none focus:border-[#2B2437] focus:bg-white transition-all"
                />

                <button
                  type="button"
                  onClick={handleVerifyIdentity}
                  disabled={isVerifying || !typedIdValue.trim()}
                  className="h-[42px] px-3.5 rounded-xl bg-[#2B2437] hover:bg-[#3D334E] text-white font-bold text-[12.5px] disabled:opacity-40 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
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
                <div className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{idError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Minimal 1-Line Trust Reassurance */}
        <div className="grid grid-cols-3 gap-2 pb-1">
          {[
            { icon: Lock, t: '100% सुरक्षित भुगतान', s: 'UPI पेमेंट' },
            { icon: Clock, t: '24 घंटे में अप्रूवल', s: 'तेज़ रिव्यू' },
            { icon: RotateCcw, t: 'पूरा रिफंड', s: 'नामंज़ूर होने पर' },
          ].map(({ icon: Icon, t, s }) => (
            <div
              key={t}
              className="flex flex-col items-center text-center gap-0.5 rounded-xl bg-white border border-[#EDEDEA] py-2 px-1"
            >
              <Icon className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="text-[11.5px] font-bold text-[#2B2437]">{t}</span>
              <span className="text-[10px] text-[#8C8C94]">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Pay CTA */}
      <StickyCTA
        label={
          identity.verified
            ? `₹${formatIN(money.total)} पे करें`
            : 'पहचान जाँचकर पे करें'
        }
        onClick={handlePayClick}
        showArrow={false}
        summaryContent={
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-black text-[16px] text-[#2B2437] tabular-nums">
                ₹{formatIN(money.total)}
              </span>
              <span className="text-[10.5px] text-[#8C8C94]">
                GST सहित
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowBillSheet(true)}
              className="text-[12px] font-bold text-[#E39026] hover:underline cursor-pointer px-2 py-1 rounded-lg hover:bg-amber-50"
            >
              बिल देखें
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
