import React, { useRef } from 'react';
import { Gallery, Call, DocumentUpload, Trash, Link2 } from 'iconsax-react';

const CTA_OPTIONS = [
  'कॉल करें',
  'व्हाट्सएप करें',
  'ऑफर पाएं',
  'दुकान पर आएं',
  'अधिक जानें',
];

export default function FeedCardUpload({
  headline,
  setHeadline,
  description,
  setDescription,
  ctaText,
  setCtaText,
  destinationUrl,
  setDestinationUrl,
  uploadedMediaUrl,
  setUploadedMediaUrl,
  fileName,
  setFileName,
  fileSize,
  setFileSize,
  aspectRatioError,
  setAspectRatioError,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAspectRatioError('कृपया 10MB से कम आकार की फ़ाइल अपलोड करें।');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFileName(file.name);
    setFileSize(formattedSize);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        setAspectRatioError('');
        setUploadedMediaUrl(dataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadedMediaUrl(null);
    setFileName('');
    setFileSize('');
    setAspectRatioError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Format Header */}
      <div className="bg-[#FFF9EE] border border-[#FDE68A] rounded-[16px] p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#E39026] text-white flex items-center justify-center">
            <Call size={18} color="#FFFFFF" variant="Bold" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#2B2437] leading-none">
              फ़ीड कार्ड विज्ञापन
            </h3>
            <span className="text-[11px] text-[#B45309] font-medium leading-none">
              बैनर एवं कॉल बटन
            </span>
          </div>
        </div>
      </div>

      {/* Banner Upload Box */}
      <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-2xs space-y-3">
        <span className="text-[14px] font-bold text-[#2B2437] block">
          विज्ञापन का बैनर अपलोड करें (16:9 या 4:3)
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploadedMediaUrl ? (
          <div className="relative rounded-[16px] overflow-hidden border border-[#E5E7EB] bg-black aspect-[16/9] max-h-[220px] mx-auto flex items-center justify-center shadow-inner">
            <img
              src={uploadedMediaUrl}
              alt="बैनर"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 shadow-md cursor-pointer transition-transform"
              title="हटाएं"
            >
              <Trash size={16} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#CBD5E1] rounded-[16px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#E39026] hover:bg-[#FFF9EE]/30 transition-all active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mb-2 shadow-2xs">
              <DocumentUpload size={24} color="#E39026" />
            </div>
            <span className="text-[14px] font-semibold text-[#2B2437] leading-tight">
              बैनर फोटो चुनें
            </span>
            <span className="text-[12px] text-[#6B7280] font-normal mt-1">
              JPG, PNG फोटो (अधिकतम 10MB)
            </span>
          </div>
        )}

        {fileName && (
          <div className="flex items-center justify-between text-[11.5px] text-[#6B7280] pt-1">
            <span className="truncate max-w-[200px] font-medium">📄 {fileName}</span>
            <span className="font-mono">{fileSize}</span>
          </div>
        )}
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
            placeholder="जैसे: आज ही संपर्क करें या दुकान पधारें!"
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

        {/* Destination link or phone */}
        <div>
          <label className="text-[13px] font-semibold text-[#2B2437] block mb-1">
            फोन नंबर या वेबसाइट लिंक
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
