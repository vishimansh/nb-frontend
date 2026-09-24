import React, { useState, useRef } from 'react';
import { Gallery, Add, Trash, ArrowLeft2, ArrowRight2, Link2 } from 'iconsax-react';

const CTA_OPTIONS = [
  'अभी देखें',
  'व्हाट्सएप करें',
  'कॉल करें',
  'ऑर्डर करें',
  'अधिक जानें',
];

export default function ReelCarouselUpload({
  headline,
  setHeadline,
  description,
  setDescription,
  ctaText,
  setCtaText,
  destinationUrl,
  setDestinationUrl,
  carouselImages,
  setCarouselImages,
  aspectRatioError,
  setAspectRatioError,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const fileInputRef = useRef(null);

  const handleAddSlide = () => {
    if (carouselImages.length >= 6) {
      setAspectRatioError('अधिकतम 6 कार्ड स्लाइड्स की अनुमति है।');
      return;
    }
    setCarouselImages([...carouselImages, '']);
    setActiveSlide(carouselImages.length);
  };

  const handleRemoveSlide = (index, e) => {
    e.stopPropagation();
    if (carouselImages.length <= 2) {
      setAspectRatioError('कम से कम 2 कार्ड आवश्यक हैं।');
      return;
    }
    const updated = carouselImages.filter((_, i) => i !== index);
    setCarouselImages(updated);
    setActiveSlide((prev) => Math.max(0, Math.min(prev, updated.length - 1)));
  };

  const handleSlideImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAspectRatioError('कृपया 10MB से कम आकार की फ़ाइल अपलोड करें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const updated = [...carouselImages];
      updated[activeSlide] = dataUrl;
      setCarouselImages(updated);
      setAspectRatioError('');
    };
    reader.readAsDataURL(file);
  };

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
              कैरौसेल रील विज्ञापन
            </h3>
            <span className="text-[11px] text-[#B45309] font-medium leading-none">
              स्वाइप करने योग्य कार्ड्स
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#2B2437] font-mono">
          {carouselImages.filter(Boolean).length}/{carouselImages.length} तैयार
        </span>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-bold text-[#2B2437]">
            कार्ड स्लाइड्स ({carouselImages.length}/6)
          </span>
          {carouselImages.length < 6 && (
            <button
              type="button"
              onClick={handleAddSlide}
              className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Add size={14} />
              <span>+ स्लाइड जोड़ें</span>
            </button>
          )}
        </div>

        {/* Slide Indicator Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {carouselImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-[34px] px-3.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                activeSlide === idx
                  ? 'bg-[#2B2437] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] border border-[#D1D5DB]'
              }`}
            >
              <span>स्लाइड {idx + 1}</span>
              {img && <span className="text-[10px] text-[#22C55E]">●</span>}
            </button>
          ))}
        </div>

        {/* Active Slide Image Upload Area */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSlideImageUpload}
            className="hidden"
          />

          {carouselImages[activeSlide] ? (
            <div className="relative rounded-[16px] overflow-hidden border border-[#E5E7EB] bg-black aspect-[9/16] max-h-[260px] mx-auto flex items-center justify-center shadow-inner">
              <img
                src={carouselImages[activeSlide]}
                alt={`स्लाइड ${activeSlide + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => handleRemoveSlide(activeSlide, e)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 shadow-md cursor-pointer transition-transform"
                title="हटाएं"
              >
                <Trash size={14} color="#FFFFFF" />
              </button>
              <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                कार्ड {activeSlide + 1}
              </span>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#CBD5E1] rounded-[16px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#E39026] hover:bg-[#FFF9EE]/30 transition-all active:scale-[0.99] max-w-[280px] mx-auto"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-2 shadow-2xs">
                <Add size={20} color="#E39026" />
              </div>
              <span className="text-[14px] font-semibold text-[#2B2437] leading-tight">
                स्लाइड {activeSlide + 1} के लिए फ़ोटो अपलोड करें
              </span>
              <span className="text-[12px] text-[#6B7280] font-normal mt-0.5">
                9:16 खड़ा प्रारूप (वर्टिकल)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Headline & Details */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3.5">
        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
            विज्ञापन का शीर्षक (हेडलाइन) *
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="जैसे: नए कलेक्शन पर 30% छूट!"
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

        {/* CTA */}
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

        {/* Destination link */}
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
