import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import AdPreview from './AdPreview';
import Button from '../ui/Button';
import { STRINGS } from '../../strings/hi';
import { generateSampleImage } from '../../utils/imageTools';

export default function SampleAdSheet({ isOpen, onClose, onStartCreating }) {
  const sampleMedia = {
    images: [generateSampleImage('ब्रू बैठक', 'ताज़ा चाय और नाश्ता')],
    video: null,
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.intro.sampleSheetTitle}
      footer={
        <Button onClick={onStartCreating} showArrow>
          {STRINGS.intro.sampleCloseAndCreate}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* News skeleton item above */}
        <div className="p-3 rounded-2xl bg-white border border-[#E5E7EB] opacity-60 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E5E7EB]" />
            <div className="w-24 h-2.5 rounded-full bg-[#E5E7EB]" />
          </div>
          <div className="w-full h-3 rounded-full bg-[#E5E7EB]" />
          <div className="w-4/5 h-3 rounded-full bg-[#E5E7EB]" />
        </div>

        {/* Real-looking AdPreview in the feed */}
        <div className="py-1">
          <AdPreview
            format="feed_card_ad"
            shop={{ name: STRINGS.intro.sampleShopName, city: 'इंदौर' }}
            headline={STRINGS.intro.sampleHeadline}
            description="प्रीमियम चाय, कॉफ़ी और स्वादिष्ट स्नैक्स का आनंद लें. आज ही ऑर्डर करें."
            ctaLabel={STRINGS.intro.sampleBtnLabel}
            media={sampleMedia}
          />
        </div>

        {/* News skeleton item below */}
        <div className="p-3 rounded-2xl bg-white border border-[#E5E7EB] opacity-60 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#E5E7EB]" />
            <div className="w-20 h-2.5 rounded-full bg-[#E5E7EB]" />
          </div>
          <div className="w-full h-3 rounded-full bg-[#E5E7EB]" />
          <div className="w-2/3 h-3 rounded-full bg-[#E5E7EB]" />
        </div>
      </div>
    </BottomSheet>
  );
}
