import React, { useState, useRef, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import AdPreview from '../components/ad/AdPreview';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import PaymentSheet from '../components/sheets/PaymentSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import AmountText from '../components/ui/AmountText';
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
import { CONFIG } from '../config';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { Pencil, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

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
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const identityCardRef = useRef(null);

  // Formatting summary data
  const goalObj = getGoalById(draft.goal || 'engagement');
  const formatObj = getFormatById(draft.format || 'feed_card_ad');
  const ctaText = getLabelForCta(draft.goal, draft.ctaKey);

  const money = useMemo(() => {
    return getMoneyBreakdown(draft.budget?.dailyAmount || 250, draft.budget?.days || 7);
  }, [draft.budget]);

  // Cities string
  const cityNamesText = useMemo(() => {
    const ids = draft.area?.manualCityIds || [shop.cityId || 'indore'];
    const names = ids.map((id) => getCityById(id)?.name || id);
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
  }, [draft.area, shop.cityId]);

  // Audience string
  const audienceText = useMemo(() => {
    const aud = draft.audience || { gender: 'all', ages: ['18-27', '28-43', '44-59', '60+'] };
    const gText = aud.gender === 'all' ? 'सभी पाठक' : aud.gender === 'male' ? 'पुरुष' : 'महिला';
    const isAllAges = aud.ages.length === 4;
    return `${gText} · ${isAllAges ? 'सभी उम्र' : aud.ages.join(', ')}`;
  }, [draft.audience]);

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
    }, 1200);
  };

  const handlePayClick = () => {
    if (!identity.verified) {
      // Scroll to card, flash border, show toast
      showToast(STRINGS.review.verifyIdentityFirstToast);
      setFlashCard(true);
      identityCardRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setFlashCard(false), 1200);
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
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={7}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Review Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-1 pt-1">
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shadow-xs">
            <ShieldCheck className="w-7 h-7 text-[#E39026]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#2B2437] tracking-tight mt-1">
            {STRINGS.review.title}
          </h2>
        </div>

        {/* 1. Summary Banner */}
        <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] text-[13px] font-bold text-[#2B2437] text-center shadow-2xs">
          {STRINGS.review.banner(cityNamesText, money.days)}
        </div>

        {/* 2. Full Ad Preview */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-bold text-[#6B7280] px-1">
            {STRINGS.review.previewCaption}:
          </span>
          <AdPreview
            format={formatObj.id}
            shop={shop}
            headline={draft.headline}
            description={draft.description}
            ctaLabel={ctaText}
            media={draft.media}
          />
        </div>

        {/* 3. Five Stacked Summary Rows in One Card */}
        <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-xs flex flex-col divide-y divide-[#E5E7EB]/60">
          {/* Row 1: उद्देश्य व प्रकार */}
          <div className="py-3 first:pt-0 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[#6B7280]">
                {STRINGS.review.rowGoalFormat}
              </span>
              <span className="text-[14px] font-bold text-[#2B2437]">
                {goalObj.title} · {formatObj.title}
              </span>
              <div className="flex items-center gap-3 pt-1 text-[12px] font-bold text-[#E39026]">
                <button
                  type="button"
                  onClick={() => handleEditScreen('goal')}
                  className="hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  <span>{STRINGS.review.editGoal}</span>
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleEditScreen('format')}
                  className="hover:underline flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  <span>{STRINGS.review.editFormat}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: इलाका */}
          <div className="py-3 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[#6B7280]">
                {STRINGS.review.rowArea}
              </span>
              <span className="text-[14px] font-bold text-[#2B2437]">
                {cityNamesText} · {draft.area?.radiusKm || 10} किमी
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('area')}
              className="text-[#E39026] p-1 hover:opacity-80"
              aria-label="इलाका बदलें"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 3: किन लोगों को */}
          <div className="py-3 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-semibold text-[#6B7280]">
                {STRINGS.review.rowAudience}
              </span>
              <span className="text-[14.5px] font-bold text-[#2B2437]">
                {audienceText}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('area')}
              className="text-[#E39026] p-1 hover:opacity-80"
              aria-label="ऑडियंस बदलें"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 4: बजट और दिन */}
          <div className="py-3 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-semibold text-[#6B7280]">
                {STRINGS.review.rowBudget}
              </span>
              <span className="text-[14px] text-[#4A4358]">
                ₹{formatIN(money.daily)}/दिन × {money.days} दिन = ₹{formatIN(money.subtotal)}
              </span>
              <span className="text-[14.5px] font-extrabold text-[#2B2437]">
                + GST ₹{formatIN(money.gst)} = ₹{formatIN(money.total)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('budget')}
              className="text-[#E39026] p-1 hover:opacity-80"
              aria-label="बजट बदलें"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Row 5: दुकान */}
          <div className="py-3 last:pb-0 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-semibold text-[#6B7280]">
                {STRINGS.review.rowShop}
              </span>
              <span className="text-[14.5px] font-bold text-[#2B2437]">
                {shop.name || 'दुकान'} · {shop.city || 'शहर'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleEditScreen('shop')}
              className="text-[#E39026] p-1 hover:opacity-80"
              aria-label="दुकान बदलें"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. One-Time Identity Verification Card */}
        <div
          ref={identityCardRef}
          className={`p-4 rounded-[22px] transition-all duration-300 border ${
            identity.verified
              ? 'bg-[#EEF8F2] border-[#A7F3D0]'
              : flashCard
              ? 'bg-red-50 border-[#DC2626] ring-4 ring-red-200'
              : 'bg-white border-[#E5E7EB] nb2-card-shadow'
          }`}
        >
          {identity.verified ? (
            /* Collapsed Verified State */
            <div className="flex items-center justify-between text-[#2F8F5B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2F8F5B]" />
                <span className="font-bold text-[14.5px]">
                  {STRINGS.review.identityVerifiedLine(identity.valueMasked)}
                </span>
              </div>
              <ShieldCheck className="w-5 h-5 opacity-80" />
            </div>
          ) : (
            /* Open Form State */
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="font-extrabold text-[15px] text-[#2B2437]">
                  {STRINGS.review.identityTitle}
                </h4>
                <p className="text-[12.5px] text-[#6B7280] mt-0.5">
                  {STRINGS.review.identitySubtitle}
                </p>
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

              {/* Input for GSTIN or PAN */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={typedIdValue}
                    onChange={(e) => {
                      setTypedIdValue(e.target.value.toUpperCase());
                      if (idError) setIdError(null);
                    }}
                    placeholder={idTab === 'gst' ? '27AAAAA1234A1Z5' : 'ABCDE1234F'}
                    maxLength={idTab === 'gst' ? 15 : 10}
                    className="flex-1 h-[48px] rounded-xl px-3 bg-[#F7F7F4] border border-[#E5E7EB] font-mono text-[15px] text-[#2B2437] uppercase tracking-wider outline-none focus:border-[#2B2437] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyIdentity}
                    disabled={isVerifying || !typedIdValue.trim()}
                    className="h-[48px] px-4 rounded-xl bg-[#2B2437] text-white font-bold text-[14px] disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                  >
                    {isVerifying ? STRINGS.review.checkingIdentity : STRINGS.review.checkIdentityBtn}
                  </button>
                </div>

                {idError && (
                  <div className="flex items-center gap-1.5 text-[12px] text-[#DC2626] font-medium px-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{idError}</span>
                  </div>
                )}
              </div>

              {/* Disabled DigiLocker Row */}
              <div className="text-[12px] text-[#A6A4A9] bg-[#F8F8F4] p-2 rounded-xl border border-[#E5E7EB] text-center">
                {STRINGS.review.aadhaarDisabledTab}
              </div>

              {/* Help Link */}
              <button
                type="button"
                onClick={() => setShowHelpSheet(true)}
                className="self-start text-[12.5px] font-semibold text-[#E39026] hover:underline"
              >
                {STRINGS.review.neitherHelpLink}
              </button>
            </div>
          )}
        </div>

        {/* 5. Footnote */}
        <p className="text-[12px] text-[#6B7280] text-center px-4 leading-relaxed">
          {STRINGS.review.footnote}
          {CONFIG.PLACEHOLDER_REVIEW_ETA_TEXT && ` (${CONFIG.PLACEHOLDER_REVIEW_ETA_TEXT})`}
        </p>
      </div>

      {/* Sticky Bottom Pay CTA */}
      <StickyCTA
        label={STRINGS.review.payBtn(formatIN(money.total))}
        onClick={handlePayClick}
        showArrow={false}
        summaryContent={
          <div className="w-full flex items-center justify-between">
            <span className="font-extrabold text-[15px] text-[#2B2437]">
              कुल ₹{formatIN(money.total)}
            </span>
            <span className="text-[12.5px] text-[#6B7280]">
              {STRINGS.common.totalWithGst}
            </span>
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

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
