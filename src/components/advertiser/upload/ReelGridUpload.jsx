import React, { useRef } from 'react';
import { Gallery, Add, Trash, Link2 } from 'iconsax-react';

const CTA_OPTIONS = [
  'व्हाट्सएप करें',
  'कॉल करें',
  'अधिक जानें',
  'दुकान पर आएं',
  'ऑर्डर करें',
];

export default function ReelGridUpload({
  headline,
  setHeadline,
  description,
  setDescription,
  ctaText,
  setCtaText,
  destinationUrl,
  setDestinationUrl,
  gridImages,
  setGridImages,
  aspectRatioError,
  setAspectRatioError,
}) {
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleGridFileChange = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setAspectRatioError('कृपया 8MB से कम आकार की फ़ोटो अपलोड करें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const updated = [...gridImages];
      updated[index] = dataUrl;
      setGridImages(updated);
      setAspectRatioError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlot = (index, e) => {
    e.stopPropagation();
    const updated = [...gridImages];
    updated[index] = '';
    setGridImages(updated);
    if (fileInputRefs[index].current) fileInputRefs[index].current.value = '';
  };

  const uploadedCount = gridImages.filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Format Header */}
      <div className="bg-[#FFF9EE] border border-[#FDE68A] rounded-[16px] p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#E39026] text-white flex items-center justify-center">
            <Gallery size={18} color="#FFFFFF" variant="Bold" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#2B2437] leading-none">
              ग्रिड विज्ञापन (2x2)
            </h3>
            <span className="text-[11px] text-[#B45309] font-medium leading-none">
              4 फोटो कोलाज
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#2B2437] font-mono">
          {uploadedCount}/4 अपलोड
        </span>
      </div>

      {/* 2x2 Grid Photo Slots */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-bold text-[#2B2437]">
            4 फोटो जोड़ें
          </span>
          <span className="text-[12px] text-[#6B7280]">
            कम से कम 2 फोटो जरूरी
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-w-[320px] mx-auto">
          {[0, 1, 2, 3].map((slotIdx) => {
            const hasImage = Boolean(gridImages[slotIdx]);
            return (
              <div
                key={slotIdx}
                onClick={() => !hasImage && fileInputRefs[slotIdx].current?.click()}
                className={`relative aspect-square rounded-[14px] overflow-hidden border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  hasImage
                    ? 'border-[#E5E7EB] bg-black'
                    : 'border-dashed border-[#CBD5E1] bg-[#F7F7F4] hover:border-[#E39026] hover:bg-[#FFF9EE]/40'
                }`}
              >
                <input
                  ref={fileInputRefs[slotIdx]}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGridFileChange(slotIdx, e)}
                  className="hidden"
                />

                {hasImage ? (
                  <>
                    <img
                      src={gridImages[slotIdx]}
                      alt={`फ़ोटो ${slotIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSlot(slotIdx, e)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 shadow-md cursor-pointer transition-transform"
                    >
                      <Trash size={12} color="#FFFFFF" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      #{slotIdx + 1}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#E39026] mb-1 shadow-2xs">
                      <Add size={16} />
                    </div>
                    <span className="text-[12px] font-medium text-[#6B7280]">
                      फ़ोटो {slotIdx + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ad Headline & Details */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3.5">
        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
            विज्ञापन का शीर्षक (हेडलाइन) *
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="जैसे: त्योहारों पर विशेष ऑफर!"
            maxLength={60}
            className="w-full h-[50px] px-3.5 bg-white border border-[#D1D5DB] rounded-[14px] text-[14px] font-medium text-[#2B2437] focus:border-[#2B2437] outline-none transition-all"
          />
          <div className="flex justify-end text-[11px] text-[#9CA3AF] mt-1 font-mono">
            <span>{headline.length}/60</span>
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
            विवरण (ऑप्शनल)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={120}
            placeholder="ऑफर या सर्विस के बारे में बताएं..."
            className="w-full p-3 bg-white border border-[#D1D5DB] rounded-[14px] text-[13px] font-medium text-[#2B2437] focus:border-[#2B2437] outline-none transition-all resize-none"
          />
        </div>

        {/* Call to Action selection */}
        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1.5">
            बटन चुनें (Call to action)
          </label>
          <div className="flex flex-wrap gap-2">
            {CTA_OPTIONS.map((cta) => (
              <button
                key={cta}
                type="button"
                onClick={() => setCtaText(cta)}
                className={`h-[34px] px-3.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                  ctaText === cta
                    ? 'bg-[#2B2437] text-white shadow-xs'
                    : 'bg-white text-[#2B2437] border border-[#D1D5DB] hover:border-[#2B2437]'
                }`}
              >
                {cta}
              </button>
            ))}
          </div>
        </div>

        {/* Destination link or phone */}
        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
            लिंक या फोन नंबर
          </label>
          <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] flex items-center px-3.5 focus-within:border-[#2B2437] transition-all">
            <Link2 size={18} color="#6B7280" className="mr-2.5 shrink-0" />
            <input
              type="text"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="उदा. 9826012345 या https://yourbusiness.com"
              className="w-full text-[14px] font-medium text-[#2B2437] bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
