import React, { useState } from 'react';
import { ChevronLeft, Download, X, ExternalLink, ShieldCheck } from 'lucide-react';
import {
  Speaker as SpeakerIcon,
  Whatsapp as WhatsappIcon,
  Bank as BankIcon,
  ExportSquare,
} from 'iconsax-react';
import { MdSportsCricket } from 'react-icons/md';
import { useToastV2 } from '../context/ToastV2Context';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { triggerPrototypeDownload, PROTOTYPE_DOWNLOADS } from '../components/ad/AdPreview';
import adBhopalHaat from '../../../assets/ads/feed-ad-bhopal-haat.png';
import exampleFeedBanner from '../assets/examples/example_feed_banner.png';
import exampleSponsoredArticle from '../assets/examples/example_sponsored_article.png';

export default function S12_PreviewScreen({ onBack, defaultFormat = 'feed_card_ad' }) {
  const { showToast } = useToastV2();
  const { state } = useAdvertiserV2();

  // Read format from URL or props or draft
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialFormat = urlParams?.get('format') || urlParams?.get('preview') || defaultFormat;

  const [activeFormat, setActiveFormat] = useState(initialFormat);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const isFeedBanner = activeFormat === 'feed_card_ad';
  const isSponsored = activeFormat === 'sponsored_ad';

  const shopName = state.shop?.name || 'फैमिली डाइनिंग';
  const headline =
    state.draft?.headline?.trim() ||
    (isFeedBanner
      ? 'भोपाल हाट - आर्ट • क्राफ्ट • कल्चर'
      : 'भोपाल में खुला नया फैमिली रेस्टोरेंट, स्वाद, माहौल और खास ऑफ़र्स के साथ ज़रूर करें विज़िट');

  const bannerImg = state.draft?.media?.images?.[0]?.dataUrl || adBhopalHaat;
  const articleImg =
    state.draft?.media?.images?.[0]?.dataUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

  const handleDownload = () => {
    triggerPrototypeDownload(activeFormat, showToast);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Top App Header */}
      <header className="h-14 bg-white border-b border-[#E5E7EB] px-3.5 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] active:scale-95 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-[#2B2437]" />
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-[14.5px] font-extrabold text-[#2B2437] leading-tight">
              {isFeedBanner ? 'फ़ीड बैनर विज्ञापन प्रीव्यू' : 'स्पॉन्सर्ड आर्टिकल विज्ञापन प्रीव्यू'}
            </h1>
            <span className="text-[10.5px] text-[#6B7280]">
              {isFeedBanner ? '3:1 न्यूज़ फ़ीड बैनर कार्ड' : 'न्यूज़ फ़ीड स्पॉन्सर्ड स्टोरी कार्ड'}
            </span>
          </div>
        </div>

        {/* Quick Format Toggle Pill */}
        <div className="flex items-center gap-1 bg-[#F4F4F2] p-1 rounded-full border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveFormat('feed_card_ad')}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all ${
              isFeedBanner
                ? 'bg-[#2B2437] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#2B2437]'
            }`}
          >
            फ़ीड बैनर
          </button>
          <button
            type="button"
            onClick={() => setActiveFormat('sponsored_ad')}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all ${
              isSponsored
                ? 'bg-[#2B2437] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#2B2437]'
            }`}
          >
            स्पॉन्सर्ड
          </button>
        </div>
      </header>

      {/* Main Preview Chassis Surface */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col items-center gap-3 scrollbar-none">
        {/* Authentic Mobile Newsfeed Container */}
        <div className="w-full max-w-[390px] bg-white rounded-[24px] border border-[#E5E7EB] shadow-md overflow-hidden flex flex-col">
          {/* Navbharat App Header Simulation */}
          <div className="bg-[#2B2437] text-white px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black tracking-wider text-white">नवभारत</span>
              <span className="px-1.5 py-0.2 rounded bg-[#E39026] text-white text-[9px] font-bold">
                लाइव
              </span>
            </div>
            <div className="text-[10px] text-white/80 font-medium">भोपाल संस्करण</div>
          </div>

          {/* Sub-Header Category Scroller */}
          <div className="bg-[#FAF9F6] border-b border-[#E5E7EB] px-3 py-1.5 flex items-center gap-3 overflow-x-auto scrollbar-none text-[11.5px] font-bold text-[#6B7280]">
            <span className="text-[#2B2437] border-b-2 border-[#2B2437] pb-0.5">प्रमुख</span>
            <span>राजनीति</span>
            <span>खेल</span>
            <span>शहर</span>
            <span>व्यापार</span>
          </div>

          {/* Feed Content Area */}
          <div className="p-3 flex flex-col gap-2.5 bg-[#F9F9F8]">
            {/* Story 1: Editorial Politics */}
            <div className="w-full bg-white rounded-[12px] p-2.5 border border-[#E5E7EB] shadow-2xs flex flex-col justify-between select-none">
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex-1 min-w-0 flex flex-col justify-start">
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#B6783A] flex items-center justify-center text-white shrink-0">
                      <BankIcon size={9} color="#FFFFFF" />
                    </span>
                    <span className="text-[11px] font-semibold text-[#B6783A] leading-normal pt-[1px] shrink-0">
                      राजनीति
                    </span>
                    <span className="text-[10px] text-[#6B7280]">• 15 मिनट पहले</span>
                  </div>
                  <p className="text-[12.5px] font-medium text-[#111827] leading-[17px] line-clamp-2">
                    विधानसभा के विशेष सत्र में जनहित के कई महत्वपूर्ण प्रस्ताव पारित
                  </p>
                </div>
                <div className="w-[88px] h-[58px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full my-1.5 h-[0.64px] bg-[#18253B]/10" />
              <div className="flex items-center justify-between w-full text-[10px] text-[#6B7280]">
                <span>15 मिनट पहले • 3 मिनट पढ़ें</span>
                <div className="flex items-center gap-2">
                  <WhatsappIcon size={13} color="#000000" variant="Bold" />
                  <span className="text-black font-bold tracking-widest text-[9px]">•••</span>
                </div>
              </div>
            </div>

            {/* THE AD ITSELF */}
            {isFeedBanner ? (
              /* 1. Feed Banner Card Ad (3:1 Native Banner) */
              <div className="flex flex-col gap-1">
                <aside
                  aria-label={headline}
                  className="w-full aspect-[3/1] rounded-[16px] overflow-hidden shadow-xs relative border border-[#E5E7EB] bg-white cursor-pointer select-none group active:scale-[0.99] transition-transform"
                >
                  <img
                    src={bannerImg}
                    alt={headline}
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />
                </aside>
                <div className="px-1 flex items-center justify-between text-[10.5px] text-[#6B7280]">
                  <span className="font-semibold text-[#E39026] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E39026]" />
                    पूरा 3:1 कार्ड लिंक है
                  </span>
                  <span className="font-bold text-[#2B2437]">और जानें ↗</span>
                </div>
              </div>
            ) : (
              /* 2. Sponsored Article Ad (FeedCard with 'प्रायोजित' in Hindi) */
              <div className="flex flex-col gap-1">
                <article
                  onClick={() => setShowArticleModal(true)}
                  className="w-full bg-white rounded-[12px] p-2.5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between select-none cursor-pointer transition-all hover:border-[#2B2437] active:scale-[0.99] relative"
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <div className="flex-1 min-w-0 flex flex-col justify-start">
                      {/* Category Badge Row with HINDI 'प्रायोजित' */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap mb-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                          <SpeakerIcon size={8} color="#FFFFFF" variant="Bold" />
                        </span>

                        <span className="text-[11px] font-bold text-[#2B2437] leading-normal pt-[1px] shrink-0">
                          स्पॉन्सर्ड
                        </span>

                        <span className="text-[10.5px] font-medium text-[#6B7280] leading-normal shrink-0 truncate max-w-[120px]">
                          • {shopName}
                        </span>
                      </div>

                      {/* Headline */}
                      <h3 className="text-[13px] font-medium text-black leading-[18px] line-clamp-2 pt-0.5">
                        {headline}
                      </h3>
                    </div>

                    {/* Right Thumbnail */}
                    <div className="w-[88px] h-[58px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
                      <img
                        src={articleImg}
                        alt={headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="w-full my-1.5 h-[0.64px] bg-[#18253B]/10" />

                  <div className="flex items-center justify-between w-full text-[10px] text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <span>20 मिनट पहले</span>
                      <span>•</span>
                      <span>3 मिनट पढ़ें</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <WhatsappIcon size={13} color="#000000" variant="Bold" />
                      <span className="text-black font-bold tracking-widest text-[9px]">•••</span>
                    </div>
                  </div>
                </article>

                <div className="px-1 flex items-center justify-between text-[10.5px] text-[#6B7280]">
                  <span
                    onClick={() => setShowArticleModal(true)}
                    className="font-bold text-[#E39026] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>आर्टिकल खोलें ↗</span>
                  </span>
                  <span className="text-[#6B7280]">टैप करने पर पूरी स्टोरी खुलेगी</span>
                </div>
              </div>
            )}

            {/* Story 2: Editorial Sports */}
            <div className="w-full bg-white rounded-[12px] p-2.5 border border-[#E5E7EB] shadow-2xs flex flex-col justify-between select-none">
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex-1 min-w-0 flex flex-col justify-start">
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap mb-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#557E63] flex items-center justify-center text-white shrink-0">
                      <MdSportsCricket size={9} color="#FFFFFF" />
                    </span>
                    <span className="text-[11px] font-semibold text-[#557E63] leading-normal pt-[1px] shrink-0">
                      खेल
                    </span>
                    <span className="text-[10px] text-[#6B7280]">• 25 मिनट पहले</span>
                  </div>
                  <p className="text-[12.5px] font-medium text-[#111827] leading-[17px] line-clamp-2">
                    राष्ट्रीय खेलों में प्रदेश के खिलाड़ियों ने जीते कई स्वर्ण व रजत पदक
                  </p>
                </div>
                <div className="w-[88px] h-[58px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100 border border-[#E5E7EB]">
                  <img
                    src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&w=120&q=80"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full my-1.5 h-[0.64px] bg-[#18253B]/10" />
              <div className="flex items-center justify-between w-full text-[10px] text-[#6B7280]">
                <span>25 मिनट पहले • 2 मिनट पढ़ें</span>
                <div className="flex items-center gap-2">
                  <WhatsappIcon size={13} color="#000000" variant="Bold" />
                  <span className="text-black font-bold tracking-widest text-[9px]">•••</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Download & Action Bar */}
      <footer className="p-3 bg-white border-t border-[#E5E7EB] flex items-center justify-between gap-3 shadow-lg shrink-0 z-20">
        <div className="min-w-0">
          <div className="text-[12.5px] font-bold text-[#2B2437] truncate">
            {isFeedBanner ? '3:1 फ़ीड बैनर प्रोटोटाइप' : 'प्रायोजित आर्टिकल प्रोटोटाइप'}
          </div>
          <div className="text-[11px] text-[#16A34A] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
            <span>ऐप प्रोटोटाइप जैसा सटीक</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2.5 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white font-bold text-[12.5px] shadow-md flex items-center gap-2 active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-white" />
          <span>इमेज डाउनलोड करें</span>
        </button>
      </footer>

      {/* Full-Screen Article Reader Modal for Sponsored format */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] h-[82vh] bg-[#F7F7F4] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative border border-[#E5E7EB]">
            <div className="h-13 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] active:scale-95 transition-transform cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#2B2437]" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#2B2437] flex items-center justify-center text-white shrink-0">
                    <SpeakerIcon size={8} color="#FFFFFF" variant="Bold" />
                  </span>
                  <span className="text-[11.5px] font-bold text-[#2B2437]">
                    प्रायोजित स्टोरी • {shopName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowArticleModal(false)}
                className="w-7 h-7 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#6B7280] active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left scrollbar-none pb-28">
              <div className="w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-black shadow-inner">
                <img src={articleImg} alt={headline} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <h1 className="text-[17px] font-bold text-[#2B2437] leading-[23px] pt-1">
                  {headline}
                </h1>
                <p className="text-[11.5px] text-[#6B7280] pt-0.5">
                  20 मिनट पहले • 3 मिनट पढ़ें • विशेष फीचर
                </p>
              </div>

              <div className="p-3 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] text-[12.5px] text-[#B45309] leading-relaxed">
                ✨ <strong>विशेष पेशकश:</strong> नवभारत पाठकों के लिए विशेष छूट एवं प्राथमिकता सेवा उपलब्ध है।
              </div>

              <div className="text-[13.5px] text-[#374151] leading-[21px] space-y-2.5 font-normal pt-1">
                <p>
                  राजधानी के नागरिकों और ग्राहकों के लिए यह एक विशेष अवसर है। यहां आपको गुणवत्ता, आधुनिक सुविधाएं और उत्कृष्ट सेवा का अनूठा संगम मिलेगा। उद्घाटन के उपलक्ष्य में विशेष छूट दी जा रही है।
                </p>
                <p>
                  अधिक जानकारी, बुकिंग या विशेष ऑफ़र्स का लाभ उठाने के लिए नीचे दिए गए बटन पर टैप करें और सीधे संपर्क करें।
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] flex items-center justify-between gap-3 shadow-lg z-20">
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#2B2437] truncate">{shopName}</div>
                <div className="text-[10.5px] text-[#6B7280]">सीधे संपर्क करें</div>
              </div>

              <button
                type="button"
                onClick={() => showToast(`${shopName} से संपर्क किया जा रहा है...`)}
                className="px-4.5 py-2 rounded-full bg-[#2B2437] hover:bg-[#3D334E] text-white font-bold text-[12.5px] shadow-md flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
              >
                <span>और जानें</span>
                <ExportSquare size={13} color="#FFFFFF" variant="Linear" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
