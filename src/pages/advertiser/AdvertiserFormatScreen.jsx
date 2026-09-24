import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VideoPlay, ArrowRight, VideoSquare, CardTick1, Gallery, Grid2, Cards } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserFormatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();
  const [selectedFormat, setSelectedFormat] = useState(draftCampaign.format || 'grid_ad');

  const REEL_FORMATS = [
    {
      id: 'video_ad',
      title: 'वीडियो विज्ञापन',
      desc: '9:16 वर्टिकल वीडियो (साउंड सहित)',
      type: 'video',
      icon: VideoPlay,
    },
    {
      id: 'grid_ad',
      title: 'ग्रिड विज्ञापन',
      desc: '2×2 फोटो ग्रिड',
      type: 'grid',
      icon: Grid2,
    },
    {
      id: 'carousel_ad',
      title: 'कैरौसेल रील',
      desc: '9:16 मल्टी-स्लाइड कार्ड',
      type: 'carousel',
      icon: Cards,
    },
  ];

  const FEED_FORMATS = [
    {
      id: 'feed_card_ad',
      title: 'फ़ीड कार्ड विज्ञापन',
      desc: 'सिंगल बैनर और कॉल बटन',
      type: 'feed_card',
      icon: CardTick1,
    },
    {
      id: 'sponsored_ad',
      title: 'प्रायोजित स्टोरी कार्ड',
      desc: 'न्यूज़ स्टोरी कार्ड प्रारूप',
      type: 'sponsored',
      icon: Gallery,
    },
  ];

  const handleProceed = () => {
    updateDraftCampaign({
      format: selectedFormat,
    });

    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/targeting');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="2"
        totalSteps="7"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/goal');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4 pb-8">
        <div className="space-y-4">
          {/* Gallery Hero Badge from iconsax */}
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center mx-auto mt-2 shadow-xs">
            <Gallery size={28} color="#E39026" variant="Bold" />
          </div>

          <h1 className="text-[20px] font-bold text-[#2B2437] text-center leading-tight">
            विज्ञापन का प्रकार चुनें
          </h1>
          <p className="text-[13px] text-[#6B7280] font-normal text-center -mt-2">
            आप अपने विज्ञापन को किस तरह दिखाना चाहते हैं?
          </p>

          {/* Group 1: रील विज्ञापन */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-[9px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                <VideoSquare size={16} color="#E39026" variant="Bold" />
              </div>
              <h2 className="text-[14px] font-bold text-[#2B2437] leading-none">
                रील विज्ञापन (Reel Ads)
              </h2>
            </div>

            <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-2 space-y-1.5 shadow-xs">
              {REEL_FORMATS.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                const IconComponent = fmt.icon;

                return (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3 rounded-[14px] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#F9FAFB] border border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                        : 'hover:bg-[#F9FAFB]/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-[12px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                        <IconComponent size={20} color="#2B2437" variant={isSelected ? 'Bold' : 'Linear'} />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[14.5px] font-bold text-[#2B2437] leading-tight">
                          {fmt.title}
                        </h3>
                        <p className="text-[12px] text-[#6B7280] font-normal mt-0.5 leading-tight">
                          {fmt.desc}
                        </p>
                      </div>
                    </div>

                    {/* Radio */}
                    <div className="shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#2B2437] bg-white'
                            : 'border-[#D1D5DB] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2B2437]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group 2: फ़ीड कार्ड */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-[9px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                <CardTick1 size={16} color="#E39026" variant="Bold" />
              </div>
              <h2 className="text-[14px] font-bold text-[#2B2437] leading-none">
                न्यूज़ फ़ीड विज्ञापन (Feed Ads)
              </h2>
            </div>

            <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-2 space-y-1.5 shadow-xs">
              {FEED_FORMATS.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                const IconComponent = fmt.icon;

                return (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3 rounded-[14px] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#F9FAFB] border border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                        : 'hover:bg-[#F9FAFB]/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-[12px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                        <IconComponent size={20} color="#2B2437" variant={isSelected ? 'Bold' : 'Linear'} />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[14.5px] font-bold text-[#2B2437] leading-tight">
                          {fmt.title}
                        </h3>
                        <p className="text-[12px] text-[#6B7280] font-normal mt-0.5 leading-tight">
                          {fmt.desc}
                        </p>
                      </div>
                    </div>

                    {/* Radio */}
                    <div className="shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#2B2437] bg-white'
                            : 'border-[#D1D5DB] bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2B2437]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action CTA matching MVP onboarding button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-colors"
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>
    </div>
  );
}
