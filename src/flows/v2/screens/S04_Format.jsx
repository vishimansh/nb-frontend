import React, { useState, useMemo } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
import SegmentedTabs from '../components/ui/SegmentedTabs';
import FormatMiniPhone from '../components/ad/FormatMiniPhone';
import Badge from '../components/ui/Badge';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { useToastV2 } from '../context/ToastV2Context';
import { FORMATS, getFormatById } from '../data/formats';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { Check, Star } from 'lucide-react';

export default function S04_Format({ onOpenFacilitator }) {
  const { state, updateDraft } = useAdvertiserV2();
  const { goBack, proceedNextStep, getCtaLabel, isFromReview } = useFlowNav();
  const { showToast } = useToastV2();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState(state.draft?.format || 'feed_card_ad');
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const shopName = state.shop?.name || 'आपकी दुकान';

  const tabs = [
    { id: 'all', label: 'सभी (5)' },
    { id: 'reel', label: 'रील (3)' },
    { id: 'newsFeed', label: 'फ़ीड (2)' },
  ];

  const filteredFormats = useMemo(() => {
    if (activeTab === 'all') return FORMATS;
    return FORMATS.filter((f) => f.category === activeTab);
  }, [activeTab]);

  const handleSelectFormat = (formatId) => {
    if (formatId === selectedFormat) return;

    const oldFormat = getFormatById(selectedFormat);
    const newFormat = getFormatById(formatId);

    // Check media transition rules
    const hadImages = (state.draft?.media?.images || []).length > 0;
    const hadVideo = !!state.draft?.media?.video;

    if (oldFormat.mediaType === 'image' && newFormat.mediaType === 'video') {
      if (hadImages) {
        updateDraft('media', { images: [], video: null });
        showToast(STRINGS.format.toastFormatChanged);
      }
    } else if (oldFormat.mediaType === 'video' && newFormat.mediaType === 'image') {
      if (hadVideo) {
        updateDraft('media', { images: [], video: null });
        showToast(STRINGS.format.toastFormatChanged);
      }
    }

    setSelectedFormat(formatId);
    updateDraft('format', formatId);
    track('format_changed', { id: formatId, isDefault: formatId === 'feed_card_ad' });
  };

  const handleProceed = () => {
    updateDraft('format', selectedFormat);
    proceedNextStep();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        stepNumber={3}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center gap-3 scrollbar-none">
        {/* Minimal Screen Title */}
        <div className="flex flex-col items-center text-center gap-0.5 pt-0.5">
          <h2 className="text-[19px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.format.title}
          </h2>
          <p className="text-[12px] text-[#6B7280]">
            {STRINGS.format.subtitle}
          </p>
        </div>

        {/* Category Tabs: सभी · रील · न्यूज़ फ़ीड */}
        <div className="w-full max-w-[340px]">
          <SegmentedTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Horizontal Scroll-Snap Carousel of Cards */}
        <div className="w-full overflow-x-auto flex gap-3 pb-2 pt-1 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none">
          {filteredFormats.map((fmt) => {
            const isSelected = fmt.id === selectedFormat;

            return (
              <div
                key={fmt.id}
                onClick={() => handleSelectFormat(fmt.id)}
                className={`w-[250px] shrink-0 snap-center rounded-[22px] p-3.5 flex flex-col gap-3 transition-all duration-150 cursor-pointer select-none bg-white border ${
                  isSelected
                    ? 'border-[#2B2437] ring-2 ring-[#2B2437]/15 shadow-sm'
                    : 'border-[#E5E7EB] hover:border-neutral-300 shadow-2xs'
                } active:scale-[0.99]`}
              >
                {/* Format Mini Phone Preview */}
                <div className="w-full flex justify-center py-1">
                  <FormatMiniPhone
                    formatId={fmt.id}
                    shopName={shopName}
                  />
                </div>

                {/* Card Title & Star Badge */}
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-[15.5px] text-[#2B2437] leading-snug">
                    {fmt.title}
                  </h3>
                  {fmt.isDefault && (
                    <Badge variant="amber">
                      <Star className="w-3 h-3 fill-[#E39026] text-[#E39026]" />
                      <span>{STRINGS.format.easiestBadge}</span>
                    </Badge>
                  )}
                </div>

                {/* Three Tag Chips: Where, Need, Effort */}
                <div className="flex flex-wrap gap-1.5 text-[11.5px]">
                  <span className="px-2 py-0.5 rounded-full bg-[#F7F7F4] text-[#4A4358] font-medium border border-[#E5E7EB]">
                    {fmt.where}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF9EE] text-[#C97F1E] font-medium border border-[#FDE68A]">
                    {fmt.need}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#F7F7F4] text-[#4A4358] font-medium border border-[#E5E7EB]">
                    {fmt.effort}
                  </span>
                </div>

                {/* Placement Explanation */}
                <p className="text-[12px] text-[#6B7280] leading-snug line-clamp-2">
                  {fmt.description}
                </p>

                {/* Selection Radio Bar */}
                <div
                  className={`w-full py-2.5 rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-[#2B2437] text-white shadow-xs'
                      : 'bg-[#F7F7F4] text-[#4A4358] hover:bg-[#ECECE8] border border-[#E5E7EB]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>चुना गया</span>
                    </>
                  ) : (
                    <span>चुनें</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 py-0.5">
          {filteredFormats.map((fmt) => (
            <div
              key={fmt.id}
              className={`rounded-full transition-all ${
                fmt.id === selectedFormat
                  ? 'w-5 h-1.5 bg-[#E39026]'
                  : 'w-1.5 h-1.5 bg-[#E5E7EB]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCTA
        label={getCtaLabel(STRINGS.common.next)}
        onClick={handleProceed}
        showArrow={!isFromReview}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
