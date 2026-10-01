import React, { useState, useRef, useEffect } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import Field from '../components/ui/Field';
import Chip from '../components/ui/Chip';
import MediaSlot from '../components/ad/MediaSlot';
import AdPreview from '../components/ad/AdPreview';
import BottomSheet from '../components/ui/BottomSheet';
import AdRulesSheet from '../components/sheets/AdRulesSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { useScrollCollapse } from '../hooks/useScrollCollapse';
import { getFormatById } from '../data/formats';
import { CTA_OPTIONS, getCtaConfig, getCtaLabel as getLabelForCta } from '../data/ctaOptions';
import { checkBlockedWords, checkClaimWords } from '../data/policyWords';
import { isValidPhone, isValidUrl } from '../utils/validators';
import { STRINGS } from '../strings/hi';
import { AlertCircle, AlertTriangle, Plus, Eye, Sparkles, ExternalLink, Link2 } from 'lucide-react';
import exampleGridReel from '../assets/examples/example_grid_reel.png';
import exampleCarouselReel from '../assets/examples/example_carousel_reel.png';
import exampleFeedBanner from '../assets/examples/example_feed_banner.png';
import exampleSponsoredArticle from '../assets/examples/example_sponsored_article.png';

export default function S05_YourAd({ onOpenFacilitator }) {
  const { state, updateDraft, setCampaignStatus } = useAdvertiserV2();
  const {
    goBack,
    proceedNextStep,
    getCtaLabel,
    isFromReview,
    isResubmitting,
    focusField,
    navigateTo,
  } = useFlowNav();

  const draft = state.draft || {};
  const shop = state.shop || {};
  const format = getFormatById(draft.format || 'feed_card_ad');
  const isFeedCard = format.id === 'feed_card_ad';
  const goalId = draft.goal || 'engagement';

  const [headline, setHeadline] = useState(draft.headline || '');
  const [description, setDescription] = useState(draft.description || '');
  const [selectedCtaKey, setSelectedCtaKey] = useState(draft.ctaKey || 'whatsapp_us');
  const [contactValue, setContactValue] = useState(draft.contactValue || state.auth?.phone || '');
  const [linkUrl, setLinkUrl] = useState(draft.linkUrl || '');

  const [images, setImages] = useState(
    Array.isArray(draft.media?.images) ? draft.media.images : []
  );
  const [video, setVideo] = useState(draft.media?.video || null);

  const [showFullPreviewSheet, setShowFullPreviewSheet] = useState(false);
  const [showRulesSheet, setShowRulesSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const scrollContainerRef = useRef(null);
  const headlineInputRef = useRef(null);
  const mediaSectionRef = useRef(null);
  const isCollapsed = useScrollCollapse(scrollContainerRef, 120);

  // Focus rejection field if redirected from rejection
  useEffect(() => {
    if (focusField === 'headline') {
      headlineInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (focusField === 'media') {
      mediaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [focusField]);

  const handleHeadlineChange = (val) => {
    setHeadline(val);
    updateDraft('headline', val);
  };

  const handleDescChange = (val) => {
    setDescription(val);
    updateDraft('description', val);
  };

  const handleCtaKeyChange = (key) => {
    setSelectedCtaKey(key);
    updateDraft('ctaKey', key);
  };

  const handleContactChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setContactValue(digits);
    updateDraft('contactValue', digits);
  };

  const handleLinkChange = (val) => {
    setLinkUrl(val);
    updateDraft('linkUrl', val);
  };

  // Media management
  const handleAddImage = (newImg, index = null) => {
    let next;
    if (index !== null) {
      next = [...images];
      next[index] = newImg;
    } else {
      next = [...images, newImg];
    }
    setImages(next);
    updateDraft('media.images', next);
  };

  const handleRemoveImage = (index) => {
    const next = images.filter((_, i) => i !== index);
    setImages(next);
    updateDraft('media.images', next);
  };

  const handleVideoUploaded = (videoMeta) => {
    setVideo(videoMeta);
    updateDraft('media.video', videoMeta);
  };

  const handleFillSampleData = () => {
    let sampleHeadline = `${shop.name || 'शर्मा स्वीट्स'} · विशेष ऑफर`;
    let sampleDesc = 'ताज़ा उत्पादों और बेहतरीन सेवाओं पर विशेष छूट. आज ही संपर्क करें.';
    let sampleImages = [];
    let sampleVideo = null;

    if (format.id === 'video_ad') {
      sampleHeadline = 'टोयोटा टैसर पर शानदार ऑफर';
      sampleDesc = 'आसान ईएमआई और तुरंत डिलीवरी के साथ आज ही बुक करें.';
      sampleVideo = { name: 'toyota_taisor_demo.mp4', isDemo: true, durationSec: 15 };
      setVideo(sampleVideo);
      updateDraft('media.video', sampleVideo);
    } else if (format.id === 'grid_ad') {
      sampleHeadline = 'फेदर के साथ, हर कदम बने स्टाइल स्टेटमेंट';
      sampleDesc = 'नए ट्रेंडी स्नीकर्स का शानदार कलेक्शन.';
      sampleImages = [
        { dataUrl: exampleGridReel, name: 'sneaker_red.png' },
        { dataUrl: exampleGridReel, name: 'sneaker_yellow.png' },
        { dataUrl: exampleGridReel, name: 'sneaker_white.png' },
        { dataUrl: exampleGridReel, name: 'sneaker_blue.png' },
      ];
      setImages(sampleImages);
      updateDraft('media.images', sampleImages);
    } else if (format.id === 'carousel_ad') {
      sampleHeadline = 'प्रकृति से प्रेरित, आपकी पहचान के लिए';
      sampleDesc = 'प्रीमियम खुशबुओं और परफ्यूम का विशेष संग्रह.';
      sampleImages = [
        { dataUrl: exampleCarouselReel, name: 'perfume_slide_1.png' },
        { dataUrl: exampleCarouselReel, name: 'perfume_slide_2.png' },
      ];
      setImages(sampleImages);
      updateDraft('media.images', sampleImages);
    } else if (format.id === 'feed_card_ad') {
      sampleHeadline = '';
      sampleDesc = '';
      sampleImages = [{ dataUrl: exampleFeedBanner, name: 'bhopal_haat_banner.png' }];
      setImages(sampleImages);
      updateDraft('media.images', sampleImages);
    } else if (format.id === 'sponsored_ad') {
      sampleHeadline = 'विशेष रिपोर्ट: शहर के प्रमुख कारीगरों की नई पहल';
      sampleDesc = 'स्थानीय कारीगरों और नए उद्यमियों के साथ विशेष बातचीत.';
      sampleImages = [{ dataUrl: exampleSponsoredArticle, name: 'artisan_story.png' }];
      setImages(sampleImages);
      updateDraft('media.images', sampleImages);
    }

    handleHeadlineChange(sampleHeadline);
    handleDescChange(sampleDesc);
  };

  // Policy Checks
  const blockedHeadline = checkBlockedWords(headline);
  const blockedDesc = checkBlockedWords(description);
  const hasBlockedWord = !!(blockedHeadline || blockedDesc);

  const claimHeadline = checkClaimWords(headline);
  const claimDesc = checkClaimWords(description);
  const hasClaimWord = !!(claimHeadline || claimDesc);

  // Validation
  const ctaConfig = getCtaConfig(goalId, selectedCtaKey);
  const contactNeeded = ctaConfig.contactNeeded; // 'none' | 'whatsapp' | 'phone' | 'link'

  let isContactValid = true;
  if (contactNeeded === 'whatsapp' || contactNeeded === 'phone') {
    isContactValid = isValidPhone(contactValue);
  } else if (contactNeeded === 'link') {
    isContactValid = isValidUrl(linkUrl);
  }

  // Media requirements check
  let isMediaValid = false;
  if (format.id === 'video_ad') {
    isMediaValid = !!video;
  } else {
    isMediaValid = images.length >= (format.minImages || 1);
  }

  const isHeadlineValid = isFeedCard ? true : (!!headline.trim() && !hasBlockedWord);
  // Keep form valid so user can seamlessly proceed with sample/default media
  const isFormValid = isHeadlineValid && isContactValid;

  // Missing Hint explanation
  let missingHint = null;
  if (!isFeedCard && !headline.trim()) {
    missingHint = STRINGS.ad.missingHeadline;
  } else if (!isFeedCard && hasBlockedWord) {
    missingHint = STRINGS.ad.policyBlockedError;
  } else if (!isContactValid) {
    missingHint = STRINGS.ad.missingContact;
  }

  const currentCtaLabel = getLabelForCta(goalId, selectedCtaKey);
  const currentMedia = { images, video };

  const handleSubmit = () => {
    if (!isFeedCard && !isHeadlineValid) {
      headlineInputRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!isContactValid) return;

    // Gracefully provide sample media if user didn't upload custom media
    if (!isMediaValid) {
      handleFillSampleData();
    }

    if (isResubmitting) {
      // In resubmit mode: update campaign status back to in_review without new payment
      const campaignId = state.nav.resubmitFor;
      setCampaignStatus(campaignId, 'in_review', { rejection: null });
      navigateTo('status');
      return;
    }

    proceedNextStep();
  };

  const availableCtaOptions = CTA_OPTIONS[goalId] || CTA_OPTIONS.engagement;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={4}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Sleek Compact Live Preview Bar at Top - Always neat & never takes over screen */}
      <div className="px-4 py-2 bg-[#F7F7F4]/95 backdrop-blur-xs border-b border-[#E5E7EB]/60 z-10 shrink-0">
        <AdPreview
          format={format.id}
          shop={shop}
          headline={headline}
          description={description}
          ctaLabel={currentCtaLabel}
          media={currentMedia}
          compact={true}
          onCompactTap={() => setShowFullPreviewSheet(true)}
        />
      </div>

      {/* Scrollable Ad Builder Fields */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 scrollbar-none"
      >
        {/* Title & Subtitle */}
        <div className="text-center">
          <h2 className="text-[22px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.ad.title}
          </h2>
          <p className="text-[13.5px] text-[#6B7280]">
            {STRINGS.ad.subtitle}
          </p>
        </div>

        {/* Card 1: Media Upload Block */}
        <div ref={mediaSectionRef} className="w-full bg-white rounded-[22px] border border-[#E5E7EB] p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-bold text-[#2B2437] flex items-center gap-1">
              <span>मीडिया ({format.title})</span>
              <span className="text-[#DC2626] font-bold">*</span>
            </label>
            <span className="text-[12px] text-[#6B7280]">
              {format.id === 'video_ad'
                ? '1 वीडियो'
                : `${images.length}/${format.maxImages || 4}`}
            </span>
          </div>

          {/* Media Slots by Format */}
          {format.id === 'video_ad' ? (
            <MediaSlot
              isVideo
              aspectRatio="9/16"
              mediaItem={video}
              onUploaded={handleVideoUploaded}
              onRemove={() => {
                setVideo(null);
                updateDraft('media.video', null);
              }}
              slotLabel="खड़ा वीडियो जोड़ें (9:16)"
            />
          ) : format.id === 'grid_ad' ? (
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-[#6B7280]">
                {STRINGS.ad.gridMediaHint}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((slotIdx) => (
                  <MediaSlot
                    key={slotIdx}
                    aspectRatio="1/1"
                    mediaItem={images[slotIdx]}
                    onUploaded={(img) => handleAddImage(img, slotIdx)}
                    onRemove={images[slotIdx] ? () => handleRemoveImage(slotIdx) : null}
                    slotLabel={`फोटो ${slotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : format.id === 'carousel_ad' ? (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <MediaSlot
                    key={i}
                    aspectRatio="16/10"
                    mediaItem={img}
                    onUploaded={(newImg) => handleAddImage(newImg, i)}
                    onRemove={() => handleRemoveImage(i)}
                    slotLabel={`स्लाइड ${i + 1}`}
                  />
                ))}
                {images.length < 6 && (
                  <MediaSlot
                    aspectRatio="16/10"
                    onUploaded={(img) => handleAddImage(img)}
                    slotLabel={STRINGS.ad.carouselAddSlide}
                  />
                )}
              </div>
            </div>
          ) : format.id === 'feed_card_ad' ? (
            /* Single Banner Card Slot (3:1 ratio) */
            <MediaSlot
              aspectRatio="3/1"
              mediaItem={images[0]}
              onUploaded={(img) => handleAddImage(img, 0)}
              onRemove={() => {
                setImages([]);
                updateDraft('media.images', []);
              }}
              slotLabel="बैनर फोटो जोड़ें (3:1 अनुपात)"
            />
          ) : (
            /* Sponsored Article Thumbnail Slot */
            <MediaSlot
              aspectRatio="16/9"
              mediaItem={images[0]}
              onUploaded={(img) => handleAddImage(img, 0)}
              onRemove={() => {
                setImages([]);
                updateDraft('media.images', []);
              }}
              slotLabel="आर्टिकल थंबनेल फोटो जोड़ें (16:9)"
            />
          )}

          <span className="text-[11.5px] text-[#6B7280]">
            {STRINGS.ad.uploadTip}
          </span>
        </div>

        {/* Card 2: Ad Copy & Action Controls */}
        <div className="w-full bg-white rounded-[22px] border border-[#E5E7EB] p-4 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
            <h3 className="text-[15px] font-bold text-[#2B2437]">
              {isFeedCard ? 'बैनर का लिंक व बटन' : 'विज्ञापन की बातें व बटन'}
            </h3>
            <button
              type="button"
              onClick={handleFillSampleData}
              className="text-[12px] font-bold text-[#E39026] flex items-center gap-1 hover:underline active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>नमूना डेटा भरें</span>
            </button>
          </div>

          {/* Feed Card Notice: Banner itself is the link */}
          {isFeedCard && (
            <div className="p-3.5 rounded-[18px] bg-[#FFF9EE] border border-[#FDE68A] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E39026]/15 flex items-center justify-center text-[#E39026] shrink-0 mt-0.5">
                <Link2 className="w-4 h-4 text-[#E39026]" />
              </div>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[13.5px] font-bold text-[#2B2437]">
                  पूरा बैनर कार्ड ही सीधा लिंक है
                </span>
                <p className="text-[12px] text-[#6B7280] leading-snug">
                  फ़ीड बैनर में अलग से हेडलाइन या विवरण की ज़रूरत नहीं है. ऊपर जोड़े गए बैनर पर पाठक कहीं भी टैप करेंगे, तो वे सीधे आपके लिंक/नंबर पर पहुँचेंगे.
                </p>
              </div>
            </div>
          )}

          {/* HeadLine (Starts EMPTY - Only for non-feedCard formats) */}
          {!isFeedCard && (
            <div ref={headlineInputRef} className="flex flex-col gap-1.5">
              <Field
                label={STRINGS.ad.headlineLabel}
                required
                maxLength={60}
                showCounter
                value={headline}
                onChange={handleHeadlineChange}
                placeholder={STRINGS.ad.headlinePlaceholder}
                error={
                  blockedHeadline ? STRINGS.ad.policyBlockedError : null
                }
              />

              {/* Tap-suggestion chip */}
              {shop.name && (
                <button
                  type="button"
                  onClick={() =>
                    handleHeadlineChange(
                      `${shop.name} · ${shop.city || 'ताज़ा पेशकश'}`
                    )
                  }
                  className="self-start text-[12px] text-[#E39026] font-semibold hover:underline"
                >
                  {STRINGS.ad.headlineSuggestion(shop.name, shop.city || 'शहर')}
                </button>
              )}

              {/* Claim warning notice */}
              {claimHeadline && !blockedHeadline && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#C97F1E] font-medium px-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{STRINGS.ad.policyClaimWarn}</span>
                </div>
              )}
            </div>
          )}

          {/* Description (Starts EMPTY, Optional - Only for video & sponsored formats) */}
          {!isFeedCard && format.id !== 'grid_ad' && format.id !== 'carousel_ad' && (
            <div className="flex flex-col gap-1.5">
              <Field
                label={STRINGS.ad.descLabel}
                maxLength={120}
                showCounter
                value={description}
                onChange={handleDescChange}
                placeholder={STRINGS.ad.descPlaceholder}
                error={blockedDesc ? STRINGS.ad.policyBlockedError : null}
              />
              {claimDesc && !blockedDesc && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#C97F1E] font-medium px-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{STRINGS.ad.policyClaimWarn}</span>
                </div>
              )}
            </div>
          )}

          {/* Sponsored Ad Sponsor Row */}
          {format.id === 'sponsored_ad' && (
            <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-between text-[13.5px]">
              <span className="text-[#6B7280]">{STRINGS.ad.sponsorLabel}:</span>
              <span className="font-bold text-[#2B2437]">{shop.name || 'आपकी दुकान'}</span>
            </div>
          )}

          {/* Button Options by Goal */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-semibold text-[#2B2437]">
              {STRINGS.ad.buttonLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCtaOptions.map((opt) => (
                <Chip
                  key={opt.key}
                  label={opt.label}
                  selected={opt.key === selectedCtaKey}
                  onClick={() => handleCtaKeyChange(opt.key)}
                />
              ))}
            </div>
          </div>

          {/* Dynamic Contact Field based on button requirements */}
          {(contactNeeded === 'whatsapp' || contactNeeded === 'phone') && (
            <Field
              label={
                contactNeeded === 'whatsapp'
                  ? STRINGS.ad.whatsappLabel
                  : STRINGS.ad.phoneFieldLabel
              }
              required
              maxLength={10}
              inputMode="numeric"
              value={contactValue}
              onChange={handleContactChange}
              placeholder="98765 43210"
              error={
                contactValue && !isValidPhone(contactValue)
                  ? 'कृपया 10 अंकों का मान्य नंबर डालें'
                  : null
              }
            />
          )}

          {contactNeeded === 'link' && (
            <Field
              label={STRINGS.ad.linkLabel}
              required
              value={linkUrl}
              onChange={handleLinkChange}
              placeholder={STRINGS.ad.linkPlaceholder}
              error={
                linkUrl && !isValidUrl(linkUrl)
                  ? 'कृपया मान्य लिंक डालें (https:// से शुरू)'
                  : null
              }
            />
          )}

          {/* Ad Rules Link */}
          <button
            type="button"
            onClick={() => setShowRulesSheet(true)}
            className="self-center text-[13px] font-semibold text-[#E39026] hover:underline pt-2"
          >
            {STRINGS.ad.viewRulesLink}
          </button>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        disabled={!isFormValid}
        missingHint={missingHint}
        onClick={handleSubmit}
        showArrow={!isFromReview && !isResubmitting}
      />

      {/* Full Preview Sheet (opened from compact preview tap) */}
      <BottomSheet
        isOpen={showFullPreviewSheet}
        onClose={() => setShowFullPreviewSheet(false)}
        title="विज्ञापन का लाइव प्रीव्यू"
      >
        <div className="pt-2 pb-10 flex flex-col items-center">
          <AdPreview
            format={format.id}
            shop={shop}
            headline={headline}
            description={description}
            ctaLabel={currentCtaLabel}
            media={currentMedia}
          />
        </div>
      </BottomSheet>

      {/* Ad Rules Sheet */}
      <AdRulesSheet
        isOpen={showRulesSheet}
        onClose={() => setShowRulesSheet(false)}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
