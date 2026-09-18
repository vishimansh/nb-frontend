import React from 'react';
import promoPoster from '../../assets/ads/self-promo-ad.png';

/**
 * Self-Promo Ad Banner (386px × 120px)
 * Renders the official promotion poster: "अपने व्यवसाय को अपने शहर में पहुँचाएं"
 */
export default function SelfPromoBanner() {
  const handleClick = () => {
    alert('नवभारत विज्ञापन पोर्टल: अपना स्थानीय विज्ञापन बुक करें');
  };

  return (
    <aside
      aria-label="विज्ञापन प्रचार"
      onClick={handleClick}
      className="mx-2 mt-3 mb-2 h-[120px] rounded-2xl border border-[#F3E2C8] overflow-hidden relative shadow-sm select-none cursor-pointer group active:scale-[0.99] transition-transform bg-[#FFF9EE]"
    >
      <img
        src={promoPoster}
        alt="अपने व्यवसाय को अपने शहर में पहुँचाएं - नवभारत पर विज्ञापन चलाएं"
        className="w-full h-full object-cover object-left"
        loading="eager"
      />
    </aside>
  );
}
