import React from 'react';
import {
  Heart as HeartIcon,
  Whatsapp as WhatsappIcon,
  VolumeHigh,
  ExportSquare,
  Speaker as SpeakerIcon,
} from 'iconsax-react';
import adBhopalHaat from '../../../../assets/ads/feed-ad-bhopal-haat.png';

/**
 * Authentic Miniature Phone previews rendered inside Format Selection Cards (S04)
 * Faithfully mirrors the 5 MVP ad formats at exact 9:16 miniature phone scale (118px × 210px):
 * 1. Video Reel Ad: Toyota video reel with top [वीडियो | पॉडकास्ट], right rail, bottom-left brand + CTA.
 * 2. Grid Reel Ad: Feather India 2×2 photo grid reel with ambient textured background, right rail, CTA.
 * 3. Carousel Reel Ad: Lumea India luxury carousel reel with top story dashes, right rail, CTA.
 * 4. Feed Card Ad: Bhopal Haat 3:1 native newsfeed banner card in authentic newsfeed context.
 * 5. Sponsored Article Ad: Authentic FeedCard with 'स्पॉन्सर्ड' badge, headline, and thumbnail.
 */
export default function FormatMiniPhone({
  formatId,
  shopName = 'आपकी दुकान',
}) {
  // ----------------------------------------------------
  // 1. VIDEO REEL AD (Toyota Video Reel from MVP)
  // ----------------------------------------------------
  if (formatId === 'video_ad') {
    return (
      <div className="w-[118px] h-[210px] rounded-[20px] border-[3.5px] border-[#1C1C1E] bg-black overflow-hidden flex flex-col justify-between relative shrink-0 shadow-md select-none mx-auto text-white group">
        {/* Dynamic Island */}
        <div className="w-8 h-2 rounded-full bg-black mx-auto mt-1 z-30 shrink-0 border border-white/10" />

        {/* Top Nav Mock */}
        <div className="w-full px-1.5 pt-0.5 z-20 flex items-center justify-between">
          <div className="w-3 h-3 rounded bg-black/40 backdrop-blur-xs flex items-center justify-center text-[7px] text-white">‹</div>
          <div className="px-1.5 py-0.2 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 text-[6px] font-bold flex items-center gap-0.5">
            <span className="px-1 py-0.2 rounded-full bg-white text-[#1C1C1E]">वीडियो</span>
            <span className="text-white/70">पॉडकास्ट</span>
          </div>
          <div className="w-3" />
        </div>

        {/* Background Video Poster from MVP */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
            alt="Toyota Video Ad"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />
        </div>

        {/* Right Rail Social Actions */}
        <div className="absolute right-1 bottom-8 z-20 flex flex-col items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <HeartIcon size={7} color="#FFFFFF" variant="Linear" />
            </div>
            <span className="text-[5px] font-medium text-white drop-shadow">234</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <WhatsappIcon size={7} color="#FFFFFF" variant="Bold" />
            </div>
            <span className="text-[4.5px] font-medium text-white drop-shadow">शेयर</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
            <VolumeHigh size={7} color="#FFFFFF" />
          </div>
        </div>

        {/* Bottom-Left Overlay Stack */}
        <div className="p-1.5 pb-2 z-20 flex flex-col gap-0.5 pr-5">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-white text-[#2B2437] font-bold text-[5.5px] flex items-center justify-center shrink-0">
              T
            </div>
            <span className="text-[6.5px] font-bold truncate max-w-[55px] drop-shadow">Toyota India</span>
          </div>
          <div className="text-[6px] font-medium leading-tight line-clamp-1 text-white drop-shadow">
            टोयोटा टैसर पर शानदार ऑफर
          </div>
          <div className="text-[5px] text-white/80 underline decoration-white/50">विज्ञापन</div>
          <div className="px-1.5 py-0.5 rounded-full bg-[#2B2437]/90 border border-white/25 text-[5.5px] font-medium text-white w-fit mt-0.5 flex items-center gap-0.5 shadow-xs">
            <span>और जानें</span>
            <ExportSquare size={5} color="#FFFFFF" variant="Linear" />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. GRID REEL AD (Feather India 2x2 Grid from MVP)
  // ----------------------------------------------------
  if (formatId === 'grid_ad') {
    return (
      <div className="w-[118px] h-[210px] rounded-[20px] border-[3.5px] border-[#1C1C1E] bg-[#2D2A26] overflow-hidden flex flex-col justify-between relative shrink-0 shadow-md select-none mx-auto text-white group">
        {/* Dynamic Island */}
        <div className="w-8 h-2 rounded-full bg-black mx-auto mt-1 z-30 shrink-0 border border-white/10" />

        {/* Top Nav Mock */}
        <div className="w-full px-1.5 pt-0.5 z-20 flex items-center justify-between">
          <div className="w-3 h-3 rounded bg-black/40 flex items-center justify-center text-[7px] text-white">‹</div>
          <div className="px-1.5 py-0.2 rounded-full bg-black/50 border border-white/15 text-[6px] font-bold flex items-center gap-0.5">
            <span className="px-1 py-0.2 rounded-full bg-white text-[#1C1C1E]">वीडियो</span>
            <span className="text-white/70">पॉडकास्ट</span>
          </div>
          <div className="w-3" />
        </div>

        {/* Ambient Texture Backdrop */}
        <img
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
          alt=""
          className="w-full h-full object-cover absolute inset-0 opacity-70 filter brightness-90 pointer-events-none"
        />

        {/* Authentic 2x2 Photo Grid with Feather India Shoes */}
        <div className="absolute inset-x-1.5 top-7 bottom-12 z-10 flex items-center justify-center">
          <div className="w-full aspect-square grid grid-cols-2 grid-rows-2 gap-1 p-0.5">
            <div className="rounded-[5px] overflow-hidden border border-white/20 shadow-xs bg-black/30">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[5px] overflow-hidden border border-white/20 shadow-xs bg-black/30">
              <img
                src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[5px] overflow-hidden border border-white/20 shadow-xs bg-black/30">
              <img
                src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[5px] overflow-hidden border border-white/20 shadow-xs bg-black/30">
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Rail Social Actions */}
        <div className="absolute right-1 bottom-8 z-20 flex flex-col items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <HeartIcon size={7} color="#FFFFFF" variant="Linear" />
            </div>
            <span className="text-[5px] font-medium text-white drop-shadow">234</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <WhatsappIcon size={7} color="#FFFFFF" variant="Bold" />
            </div>
            <span className="text-[4.5px] font-medium text-white drop-shadow">शेयर</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
            <VolumeHigh size={7} color="#FFFFFF" />
          </div>
        </div>

        {/* Bottom-Left Overlay Stack */}
        <div className="p-1.5 pb-2 z-20 flex flex-col gap-0.5 pr-5 bg-gradient-to-t from-black/95 to-transparent">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E5D7B7] text-[#2B2437] font-bold text-[5.5px] flex items-center justify-center shrink-0">
              F
            </div>
            <span className="text-[6.5px] font-bold truncate max-w-[55px] drop-shadow">Feather India</span>
          </div>
          <div className="text-[6px] font-medium leading-tight line-clamp-1 text-white drop-shadow">
            फेदर के साथ, हर कदम स्टाइल
          </div>
          <div className="text-[5px] text-white/80 underline decoration-white/50">विज्ञापन</div>
          <div className="px-1.5 py-0.5 rounded-full bg-[#2B2437]/90 border border-white/25 text-[5.5px] font-medium text-white w-fit mt-0.5 flex items-center gap-0.5 shadow-xs">
            <span>और जानें</span>
            <ExportSquare size={5} color="#FFFFFF" variant="Linear" />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. CAROUSEL REEL AD (Lumea India Carousel from MVP)
  // ----------------------------------------------------
  if (formatId === 'carousel_ad') {
    return (
      <div className="w-[118px] h-[210px] rounded-[20px] border-[3.5px] border-[#1C1C1E] bg-neutral-900 overflow-hidden flex flex-col justify-between relative shrink-0 shadow-md select-none mx-auto text-white group">
        {/* Top Story Segmented Progress Bars (4 Dashes) */}
        <div className="w-full px-1.5 pt-0.5 flex gap-0.5 z-30 absolute top-1 inset-x-0">
          <div className="h-0.5 flex-1 bg-white rounded-full shadow-xs" />
          <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
          <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
          <div className="h-0.5 flex-1 bg-white/40 rounded-full" />
        </div>

        {/* Top Nav Mock */}
        <div className="w-full px-1.5 pt-2 z-20 flex items-center justify-between">
          <div className="w-3 h-3 rounded bg-black/40 backdrop-blur-xs flex items-center justify-center text-[7px] text-white">‹</div>
          <div className="px-1.5 py-0.2 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 text-[6px] font-bold flex items-center gap-0.5">
            <span className="px-1 py-0.2 rounded-full bg-white text-[#1C1C1E]">वीडियो</span>
            <span className="text-white/70">पॉडकास्ट</span>
          </div>
          <div className="w-3" />
        </div>

        {/* Central Lumea Luxury Perfume Slide from MVP */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
            alt="Lumea Carousel Slide"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />
        </div>

        {/* Right Rail Social Actions */}
        <div className="absolute right-1 bottom-8 z-20 flex flex-col items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <HeartIcon size={7} color="#FFFFFF" variant="Linear" />
            </div>
            <span className="text-[5px] font-medium text-white drop-shadow">234</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
              <WhatsappIcon size={7} color="#FFFFFF" variant="Bold" />
            </div>
            <span className="text-[4.5px] font-medium text-white drop-shadow">शेयर</span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center border border-white/10">
            <VolumeHigh size={7} color="#FFFFFF" />
          </div>
        </div>

        {/* Bottom-Left Overlay Stack */}
        <div className="p-1.5 pb-2 z-20 flex flex-col gap-0.5 pr-5 bg-gradient-to-t from-black/95 to-transparent">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E5D7B7] text-[#2B2437] font-bold text-[5.5px] flex items-center justify-center shrink-0">
              L
            </div>
            <span className="text-[6.5px] font-bold truncate max-w-[55px] drop-shadow">Lumea India</span>
          </div>
          <div className="text-[6px] font-medium leading-tight line-clamp-1 text-white drop-shadow">
            प्रकृति से प्रेरित पहचान
          </div>
          <div className="text-[5px] text-white/80 underline decoration-white/50">विज्ञापन</div>
          <div className="px-1.5 py-0.5 rounded-full bg-[#2B2437]/90 border border-white/25 text-[5.5px] font-medium text-white w-fit mt-0.5 flex items-center gap-0.5 shadow-xs">
            <span>और जानें</span>
            <ExportSquare size={5} color="#FFFFFF" variant="Linear" />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. FEED AD CARD (Bhopal Haat 3:1 Banner from MVP)
  // ----------------------------------------------------
  if (formatId === 'feed_card_ad') {
    return (
      <div className="w-[118px] h-[210px] rounded-[20px] border-[3.5px] border-[#2B2437] bg-[#F7F7F4] overflow-hidden flex flex-col relative shrink-0 shadow-md select-none mx-auto justify-between p-1.5">
        <div className="w-8 h-1.5 rounded-full bg-[#2B2437] mx-auto shrink-0" />

        {/* News Feed Top Item */}
        <div className="p-1 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-1 opacity-70 shadow-2xs">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="w-6 h-1 rounded-full bg-[#9CA3AF]" />
            <div className="w-full h-1.5 rounded-full bg-[#D1D5DB]" />
          </div>
          <div className="w-4 h-4 rounded bg-[#E5E7EB] shrink-0" />
        </div>

        {/* The 3:1 Bhopal Haat Banner Card itself */}
        <div className="flex flex-col gap-0.5 my-auto">
          <div className="w-full aspect-[3/1] rounded-md overflow-hidden border border-[#D1D5DB] shadow-xs relative bg-[#FBF7ED]">
            <img
              src={adBhopalHaat}
              alt="Bhopal Haat Banner"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-0.5 right-0.5 z-10">
              <span className="px-1 py-0.1 rounded-full bg-black/70 text-white text-[4px] font-bold">
                विज्ञापन
              </span>
            </div>
          </div>
          <div className="px-0.5 flex items-center justify-between text-[5px] text-[#6B7280]">
            <span className="font-bold text-[#E39026]">पूरा कार्ड लिंक ↗</span>
            <span className="font-semibold text-[#2B2437]">3:1 बैनर</span>
          </div>
        </div>

        {/* News Feed Bottom Item */}
        <div className="p-1 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-1 opacity-70 shadow-2xs">
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="w-8 h-1 rounded-full bg-[#9CA3AF]" />
            <div className="w-full h-1.5 rounded-full bg-[#D1D5DB]" />
          </div>
          <div className="w-4 h-4 rounded bg-[#E5E7EB] shrink-0" />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 5. SPONSORED ARTICLE AD FORMAT (FeedCard with 'स्पॉन्सर्ड')
  // ----------------------------------------------------
  return (
    <div className="w-[118px] h-[210px] rounded-[20px] border-[3.5px] border-[#2B2437] bg-[#F7F7F4] overflow-hidden flex flex-col relative shrink-0 shadow-md select-none mx-auto justify-between p-1.5">
      <div className="w-8 h-1.5 rounded-full bg-[#2B2437] mx-auto shrink-0" />

      {/* News Feed Top Item */}
      <div className="p-1 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-1 opacity-60 shadow-2xs">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="w-6 h-1 rounded-full bg-[#9CA3AF]" />
          <div className="w-full h-1.5 rounded-full bg-[#D1D5DB]" />
        </div>
        <div className="w-4 h-4 rounded bg-[#E5E7EB] shrink-0" />
      </div>

      {/* Authentic Sponsored Article Card (Matching MVP FeedCard) */}
      <div className="p-1 rounded-lg bg-white border border-[#CBD5E1] shadow-2xs flex flex-col gap-0.5 relative my-auto">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#2B2437] flex items-center justify-center shrink-0">
            <SpeakerIcon size={5} color="#FFFFFF" variant="Bold" />
          </span>
          <span className="text-[5px] font-bold text-[#2B2437]">
            स्पॉन्सर्ड
          </span>
          <span className="text-[4.5px] text-[#6B7280] truncate max-w-[40px]">• रेस्टोरेंट</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex-1 min-w-0">
            <h5 className="text-[5.5px] font-medium text-[#2B2437] leading-[7px] line-clamp-2">
              भोपाल में खुला नया फैमिली रेस्टोरेंट, खास स्वाद
            </h5>
            <span className="text-[4.5px] text-[#9CA3AF] mt-0.5 block">20 मिनट पहले</span>
          </div>
          <div className="w-6 h-6 rounded overflow-hidden shrink-0 border border-[#E5E7EB]">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full pt-0.5 border-t border-[#F3F4F6] flex items-center justify-between text-[4.5px] text-[#6B7280]">
          <span className="text-[#E39026] font-bold">आर्टिकल पढ़ें ↗</span>
          <span>3 मिनट</span>
        </div>
      </div>

      {/* News Feed Bottom Item */}
      <div className="p-1 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-1 opacity-60 shadow-2xs">
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="w-8 h-1 rounded-full bg-[#9CA3AF]" />
          <div className="w-full h-1.5 rounded-full bg-[#D1D5DB]" />
        </div>
        <div className="w-4 h-4 rounded bg-[#E5E7EB] shrink-0" />
      </div>
    </div>
  );
}
