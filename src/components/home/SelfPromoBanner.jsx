import React from 'react';
import { useNavigate } from 'react-router-dom';
import promoPoster from '../../assets/ads/self-promo-ad.png';
import { useAdvertiser } from '../../context/AdvertiserContext';

/**
 * Self-Promo Ad Banner (386px × 120px)
 * Renders the official promotion poster: "अपने व्यवसाय को अपने शहर में पहुँचाएं"
 *
 * Smart routing logic:
 *  - Not logged in → /advertise/intro  (onboarding: phone → OTP)
 *  - Logged in + no business profile → /advertise/business-profile  (mandatory setup)
 *  - Logged in + profile saved → /advertise/dashboard  (returning advertiser)
 */
export default function SelfPromoBanner() {
  const navigate = useNavigate();
  const { advertiserAuth, isBusinessProfileSaved } = useAdvertiser();

  const handleClick = () => {
    const isAuthenticated = advertiserAuth?.isAuthenticated && advertiserAuth?.otpVerified;
    if (!isAuthenticated) {
      navigate('/advertise/intro');
    } else if (!isBusinessProfileSaved) {
      navigate('/advertise/business-profile');
    } else {
      navigate('/advertise/dashboard');
    }
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
