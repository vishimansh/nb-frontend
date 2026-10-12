import React from 'react';
import adConcert from '../../assets/ads/feed-ad-concert.png';
import adCafe from '../../assets/ads/feed-ad-cafe.png';
import adHospital from '../../assets/ads/feed-ad-hospital.png';
import adBhopalHaat from '../../assets/ads/feed-ad-bhopal-haat.png';
import adLeRendezvous from '../../assets/ads/feed-ad-le-rendezvous.png';
import adPawsaath from '../../assets/ads/feed-ad-pawsaath.png';

export const AD_CARDS = {
  'ad-concert': {
    id: 'ad-concert',
    image: adConcert,
    title: "Bhopal's Biggest Music Concert (terra × SCENE)",
    brand: "terra × SCENE",
  },
  'ad-cafe': {
    id: 'ad-cafe',
    image: adCafe,
    title: "NFR - Art • Coffee • Culture Cafe",
    brand: "NFR Cafe",
  },
  'ad-hospital': {
    id: 'ad-hospital',
    image: adHospital,
    title: "Bhopal Children's Hospital",
    brand: "Bhopal Children's Hospital",
  },
  'ad-bhopal-haat': {
    id: 'ad-bhopal-haat',
    image: adBhopalHaat,
    title: "Bhopal Haat - Art • Craft • Culture",
    brand: "Bhopal Haat",
  },
  'ad-le-rendezvous': {
    id: 'ad-le-rendezvous',
    image: adLeRendezvous,
    title: "Le Rendez-Vous Bhopal - French Indian Art Festival",
    brand: "Le Rendez-Vous Bhopal",
  },
  'ad-pawsaath': {
    id: 'ad-pawsaath',
    image: adPawsaath,
    title: "PawSaath - Bhopal's Biggest Ever Food Drive",
    brand: "PawSaath",
  },
};

export const CATEGORY_ADS = {
  entertainment: 'ad-concert',
  lifestyle: 'ad-cafe',
  health: 'ad-hospital',
  business: 'ad-bhopal-haat',
  education: 'ad-bhopal-haat',
  tech: 'ad-le-rendezvous',
  astro: 'ad-le-rendezvous',
  sports: 'ad-pawsaath',
  auto: 'ad-concert',
  politics: 'ad-bhopal-haat',
};

const DEFAULT_ADS = [
  adConcert,
  adCafe,
  adHospital,
  adBhopalHaat,
  adLeRendezvous,
  adPawsaath,
];

/**
 * Native Feed Ad Card (386px × 128px, 3:1 aspect ratio)
 * Displays authentic, high-resolution sponsored banners:
 * 1. terra × SCENE: Bhopal's Biggest Music Concert
 * 2. NFR: Art • Coffee • Culture Cafe
 * 3. Bhopal Children's Hospital
 * 4. Bhopal Haat: Art • Craft • Culture
 * 5. Le Rendez-Vous Bhopal: French Indian Art Festival
 * 6. PawSaath: Bhopal's Biggest Ever Food Drive
 */
export default function NativeFeedAd({ ad, className = "", onClick, isHighlighted = false }) {
  const adId = ad?.id;
  const adInfo = AD_CARDS[adId] || {
    image: ad?.imageKey && AD_CARDS[`ad-${ad.imageKey}`]
      ? AD_CARDS[`ad-${ad.imageKey}`].image
      : DEFAULT_ADS[0],
    title: ad?.headline || "स्पॉन्सर्ड विज्ञापन",
    brand: ad?.brand || "विज्ञापन",
  };

  const adImage = adInfo.image || DEFAULT_ADS[0];

  const handleClick = (e) => {
    if (onClick) {
      onClick(adInfo, e);
    }
  };

  return (
    <div className="relative">
      {isHighlighted && (
        <div className="absolute -top-2.5 right-3 bg-[#E39026] text-[#2B2437] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm z-20 flex items-center gap-1 leading-none select-none">
          <span>★</span>
          <span>फ़ीड कार्ड विज्ञापन</span>
        </div>
      )}
      <aside
        data-ad-role="native-feed-ad"
        aria-label={adInfo.title}
        onClick={handleClick}
        className={`w-[386px] h-[128px] max-w-[386px] rounded-[16px] overflow-hidden shadow-xs relative border border-[#E5E7EB] select-none cursor-pointer group active:scale-[0.99] transition-transform bg-white ${
          isHighlighted ? 'ring-2 ring-[#E39026] shadow-md' : ''
        } ${className}`}
      >
        <img
          src={adImage}
          alt={adInfo.title}
          className="w-full h-full object-cover object-center pointer-events-none select-none"
          loading="lazy"
          draggable={false}
        />
      </aside>
    </div>
  );
}
