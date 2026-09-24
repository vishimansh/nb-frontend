import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Location,
  Category,
  Calendar,
  Edit2,
  VolumeHigh,
  ArrowRight2,
  Radar,
  Card,
  DocumentText,
  Shop,
} from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';
import defaultAdThumb from '../../assets/cards/supreme-court.jpg';
import cafeImg from '../../assets/ads/feed-ad-cafe.png';

export default function AdvertiserReviewScreen() {
  const navigate = useNavigate();
  const { draftCampaign } = useAdvertiser();
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0);

  const subtotal = (draftCampaign.dailyBudget || 300) * (draftCampaign.durationDays || 7);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const format = draftCampaign.format || 'video_ad';
  const goal = draftCampaign.goal || 'reach';

  const getFormatLabel = (fmt) => {
    switch (fmt) {
      case 'video_ad':
        return 'वीडियो रील';
      case 'grid_ad':
        return '2×2 ग्रिड विज्ञापन';
      case 'carousel_ad':
        return 'कैरौसेल रील';
      case 'feed_card_ad':
        return 'फ़ीड कार्ड विज्ञापन';
      case 'sponsored_ad':
        return 'प्रायोजित स्टोरी कार्ड';
      default:
        return 'वीडियो रील';
    }
  };

  const getGoalLabel = (g) => {
    switch (g) {
      case 'reach':
        return 'अधिकतम पहुंच';
      case 'engagement':
        return 'ग्राहकों का जुड़ाव';
      case 'ctrs':
        return 'वेबसाइट व लिंक क्लिक्स';
      default:
        return 'ग्राहकों का जुड़ाव';
    }
  };

  const targetingLabel =
    draftCampaign.targetingType === 'radius'
      ? `दुकान के आसपास ${draftCampaign.radiusKm || 10} किमी दायरा`
      : `${(draftCampaign.selectedDistricts || []).length} चयनित शहर / राज्य`;

  const audienceLabel =
    draftCampaign.selectedCategories && draftCampaign.selectedCategories.length > 0
      ? `${draftCampaign.selectedCategories.length} श्रेणी फ़िल्टर`
      : 'सभी स्थानीय पाठक';

  const startDate = draftCampaign.startDate || '24-09-2026';

  const carouselImages = (draftCampaign.carouselImages || []).filter(Boolean);
  const displayCarousel = carouselImages.length > 0 ? carouselImages : [cafeImg, defaultAdThumb];

  const gridImages = draftCampaign.gridImages || [];
  const displayGrid = [
    gridImages[0] || cafeImg,
    gridImages[1] || defaultAdThumb,
    gridImages[2] || cafeImg,
    gridImages[3] || defaultAdThumb,
  ];

  const mediaUrl = draftCampaign.uploadedCreativeUrl || cafeImg;
  const businessName = draftCampaign.businessName || 'मेरा बिज़नेस';

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="7"
        totalSteps="7"
        onBack={() => navigate('/advertise/budget', { state: { fromReview: true } })}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-3.5">
          {/* Top Card: विज्ञापन जांचें */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] shrink-0">
              <DocumentText size={24} color="#E39026" variant="Bold" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#2B2437] leading-tight">
                विज्ञापन जांचें (Review)
              </h1>
              <p className="text-[13px] text-[#6B7280] font-normal mt-0.5">
                पेमेंट करने से पहले अपनी सभी जानकारियां देख लें
              </p>
            </div>
          </div>

          {/* Dynamic Summary Notification Banner */}
          <div className="bg-[#FFFBF0] border border-[#FDE68A] rounded-[20px] p-4 shadow-2xs text-[13px] text-[#2B2437] leading-relaxed">
            आपका विज्ञापन <span className="font-bold text-[#2B2437]">{targetingLabel}</span> में,{' '}
            <span className="font-bold text-[#2B2437]">{draftCampaign.durationDays || 7} दिनों</span> तक दिखाया जाएगा।
            कुल खर्च: <span className="font-extrabold text-[#E39026]">₹{grandTotal.toLocaleString('en-IN')}</span> (बजट ₹{subtotal.toLocaleString('en-IN')} + 18% GST ₹{gst.toLocaleString('en-IN')})।
          </div>

          {/* Live Ad Preview Section */}
          <div className="space-y-2">
            <span className="text-[12px] font-semibold tracking-wider text-[#6B7280] uppercase pl-1 block">
              विज्ञापन ऐसा दिखेगा (Preview)
            </span>

            <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3">
              {/* Ad Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2B2437] text-white flex items-center justify-center font-bold text-[13px] shrink-0 shadow-xs">
                  {businessName.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#2B2437] leading-tight">
                    {businessName}
                  </h4>
                  <span className="text-[11.5px] text-[#6B7280] font-normal leading-none block mt-0.5">
                    प्रायोजित • नवभारत
                  </span>
                </div>
              </div>

              {/* Format-aware Ad Creative Container */}
              <div className="relative rounded-[16px] overflow-hidden bg-black flex items-center justify-center shadow-inner">
                {format === 'grid_ad' ? (
                  <div className="w-full aspect-[4/3] grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-black">
                    {displayGrid.map((img, idx) => (
                      <div key={idx} className="relative overflow-hidden rounded-[8px]">
                        <img
                          src={img}
                          alt="ग्रिड"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : format === 'carousel_ad' ? (
                  <div className="w-full aspect-[16/10] relative flex items-center justify-center bg-[#2B2437]">
                    <img
                      src={displayCarousel[activeCarouselSlide]}
                      alt="कैरौसेल"
                      className="w-full h-full object-cover"
                    />
                    {displayCarousel.length > 1 && (
                      <div className="absolute bottom-2 flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded-full">
                        {displayCarousel.map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveCarouselSlide(idx)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                              activeCarouselSlide === idx ? 'bg-[#E39026] w-4' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] relative flex items-center justify-center bg-black">
                    <img
                      src={mediaUrl}
                      alt="विज्ञापन"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#2B2437] border-b-[6px] border-b-transparent ml-0.5" />
                    </div>

                    <div className="absolute bottom-2 left-2 text-white text-[11px] font-medium drop-shadow-md">
                      {draftCampaign.headline || 'दुकान का विज्ञापन'}
                    </div>
                  </div>
                )}
              </div>

              {/* Call-to-action Button */}
              <button
                type="button"
                className="w-full h-11 rounded-[12px] bg-[#2B2437] text-white font-medium text-[14px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
              >
                <span>{draftCampaign.ctaText || 'अभी कॉल करें'}</span>
                <span className="text-[13px]">↗</span>
              </button>
            </div>
          </div>

          {/* 5 Summary Edit Rows */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-2xs divide-y divide-[#F3F4F6] overflow-hidden">
            {/* Row 1: उद्देश्य व प्रकार */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                  <Radar size={18} color="#2B2437" variant="Bold" />
                </div>
                <div>
                  <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                    विज्ञापन का उद्देश्य और प्रकार
                  </span>
                  <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5">
                    {getGoalLabel(goal)} • {getFormatLabel(format)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/advertise/goal', { state: { fromReview: true } })}
                className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 size={13} color="#E39026" />
                <span>बदलें</span>
              </button>
            </div>

            {/* Row 2: इलाका (लोकेशन) */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                  <Location size={18} color="#2B2437" variant="Bold" />
                </div>
                <div>
                  <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                    विज्ञापन का इलाका (लोकेशन)
                  </span>
                  <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5">
                    {targetingLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/advertise/targeting', { state: { fromReview: true } })}
                className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 size={13} color="#E39026" />
                <span>बदलें</span>
              </button>
            </div>

            {/* Row 3: किन लोगों को दिखेगा */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                  <Category size={18} color="#2B2437" variant="Bold" />
                </div>
                <div>
                  <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                    किन लोगों को दिखेगा (Audience)
                  </span>
                  <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5">
                    {audienceLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/advertise/audience', { state: { fromReview: true } })}
                className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 size={13} color="#E39026" />
                <span>बदलें</span>
              </button>
            </div>

            {/* Row 4: बजट और दिन */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                  <Calendar size={18} color="#2B2437" variant="Bold" />
                </div>
                <div>
                  <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                    बजट और दिन
                  </span>
                  <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5">
                    ₹{draftCampaign.dailyBudget || 300}/दिन × {draftCampaign.durationDays || 7} दिन = ₹{subtotal.toLocaleString('en-IN')} + 18% GST = <span className="font-semibold text-[#2B2437]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/advertise/budget', { state: { fromReview: true } })}
                className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 size={13} color="#E39026" />
                <span>बदलें</span>
              </button>
            </div>

            {/* Row 5: बिज़नेस और टैक्स विवरण */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                  <Shop size={18} color="#2B2437" variant="Bold" />
                </div>
                <div>
                  <span className="text-[13.5px] font-semibold text-[#2B2437] block leading-tight">
                    बिज़नेस और टैक्स विवरण
                  </span>
                  <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5">
                    {businessName} • {draftCampaign.hasGstin && draftCampaign.gstin ? `GST: ${draftCampaign.gstin}` : (draftCampaign.idNumberMasked || 'पहचान वेरिफाइड')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/advertise/business-profile', { state: { fromReview: true } })}
                className="text-[12px] font-semibold text-[#E39026] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit2 size={13} color="#E39026" />
                <span>बदलें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button: ₹... पेमेंट करें */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={() => navigate('/advertise/payment')}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
          >
            <Card size={20} color="#FFFFFF" variant="Bold" />
            <span>₹{grandTotal.toLocaleString('en-IN')} पेमेंट करें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
