import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Notification } from 'iconsax-react';
import { useOnboarding } from '../../context/OnboardingContext';
import cardBusiness from '../../assets/cards/card-1.png';
import cardEntertainment from '../../assets/cards/card-2.png';
import cardPolitics from '../../assets/cards/card-3.png';

const CARDS = [
  { id: 'entertainment', img: cardEntertainment, label: 'मनोरंजन' },
  { id: 'business', img: cardBusiness, label: 'बिज़नेस' },
  { id: 'politics', img: cardPolitics, label: 'राजनीति' },
];

/**
 * Screen 2: Notifications Permission
 * Layer Hierarchy:
 * - z-0: Text content (Eyebrow capsule, Headline, Subtext)
 * - z-10: Pulsating concentric circles animation loop (placed ABOVE all text/stuff, ripples over headline/subtext)
 * - z-20: News cards stack (placed ABOVE the concentric circles)
 * - z-30: Bottom CTA buttons & top header (placed ABOVE everything at the bottom/top)
 */
export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { setNotificationsEnabled } = useOnboarding();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleEnable = () => {
    setNotificationsEnabled(true);
    navigate('/onboarding/login');
  };

  const handleSkip = () => {
    setNotificationsEnabled(false);
    navigate('/onboarding/login');
  };

  const cycleCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % CARDS.length);
  };

  const frontCard = CARDS[activeCardIndex];
  const middleCard = CARDS[(activeCardIndex + 1) % CARDS.length];
  const backCard = CARDS[(activeCardIndex + 2) % CARDS.length];

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col justify-between pt-[64px] relative overflow-hidden select-none">
      {/* Top Header Row with Skip Action: z-30 */}
      <div className="w-full flex justify-end px-6 py-2 relative z-30">
        <button
          onClick={handleSkip}
          className="text-[16px] font-medium text-[#1E213D] cursor-pointer hover:opacity-75 transition-opacity"
        >
          स्किप
        </button>
      </div>

      {/* Main Viewport Area with Layered Stacking */}
      <div className="flex-1 flex flex-col items-center justify-center relative -mt-3">
        {/* Layer 0: Text Content Block (Headline, Subtext, Eyebrow) */}
        <div className="w-full flex flex-col items-center relative z-0">
          {/* Eyebrow Capsule Badge: 16px Semibold */}
          <div className="bg-[#1E213D] text-white p-2 rounded-full flex items-center gap-2 shadow-xs">
            <div className="w-5 h-5 bg-[#EEEBDA] rounded-full flex items-center justify-center text-white flex-shrink-0">
              <Notification size={14} color="#FFFFFF" variant="Linear" />
            </div>
            <span className="text-[16px] font-semibold tracking-wide">नवभारत अपडेट</span>
          </div>

          {/* Display Headline: 32px, Semibold, leading-[1.15] */}
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.15] text-[#1E213D] text-center whitespace-pre-line px-6">
            {"खबर आते ही,\nआपको पता चले।"}
          </h1>

          {/* Supporting Subtext: 16px, Medium, leading-[1.5], #374151 */}
          <p className="mt-2 text-[16px] font-medium leading-[1.5] text-[#374151] text-center px-6 whitespace-pre-line">
            {"बड़ी खबरों और ज़रूरी अपडेट के लिए\nनोटिफिकेशन चालू करें।"}
          </p>
        </div>

        {/* Cards & Concentric Circles Container */}
        <div className="relative w-full h-[250px] flex items-center justify-center mt-3">
          {/* Layer 10: Pulsating Concentric Circles Loop Animation
              Placed ABOVE the text/headline/eyebrow (z-10), ripples out over the copy */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-visible">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="absolute rounded-full border border-[#94A3B8]/60 pointer-events-none"
                style={{
                  width: '320px',
                  height: '320px',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
                initial={{ scale: 0.05, opacity: 0 }}
                animate={{
                  scale: [0.05, 0.45, 2.1],
                  opacity: [0, 0.75, 0],
                }}
                transition={{
                  duration: 4.4,
                  repeat: Infinity,
                  ease: [0.25, 0.1, 0.25, 1],
                  times: [0, 0.2, 1],
                  delay: index * 1.1,
                }}
              />
            ))}
          </div>

          {/* Layer 20: Overlapping Article Cards Stack (Placed ABOVE the concentric circles) */}
          <div 
            className="relative w-[386px] h-[119px] z-20 flex flex-col items-center cursor-pointer"
            onClick={cycleCard}
            title="टैप करके कार्ड बदलें"
          >
            {/* Back Card: 386px x 119px */}
            <div 
              className="w-[386px] h-[119px] min-w-[386px] min-h-[119px] -mb-[119px] transform scale-[0.92] -translate-y-4 opacity-55 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs transition-all duration-300 pointer-events-none bg-white shrink-0"
              style={{ width: '386px', height: '119px' }}
            >
              <img
                src={backCard.img}
                alt={backCard.label}
                className="w-full h-full object-fill select-none"
                draggable={false}
              />
            </div>

            {/* Middle Card: 386px x 119px */}
            <div 
              className="w-[386px] h-[119px] min-w-[386px] min-h-[119px] -mb-[119px] transform scale-[0.96] -translate-y-2 opacity-80 rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs z-10 transition-all duration-300 pointer-events-none bg-white shrink-0"
              style={{ width: '386px', height: '119px' }}
            >
              <img
                src={middleCard.img}
                alt={middleCard.label}
                className="w-full h-full object-fill select-none"
                draggable={false}
              />
            </div>

            {/* Front Elevated Card: Strictly 386px x 119px */}
            <motion.div
              key={frontCard.id}
              initial={{ opacity: 0.85, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[386px] h-[119px] min-w-[386px] min-h-[119px] max-w-[386px] max-h-[119px] rounded-2xl overflow-hidden border border-[#D1D5DB] shadow-card-soft z-20 bg-white transition-transform active:scale-[0.99] shrink-0"
              style={{ width: '386px', height: '119px' }}
            >
              <img
                src={frontCard.img}
                alt={frontCard.label}
                className="w-full h-full object-fill select-none"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Layer 30: Bottom Sticky Actions (Placed ABOVE the concentric circles at the bottom) */}
      <div className="px-6 pb-9 pt-1 bg-[#F7F7F4] relative z-30">
        <button
          onClick={handleEnable}
          className="w-full h-[56px] rounded-[16px] bg-[#1E213D] text-white text-[20px] font-medium shadow-md active:scale-[0.99] flex items-center justify-center transition-all cursor-pointer hover:bg-[#1f304d]"
        >
          नोटिफिकेशन चालू करें
        </button>

        <button
          onClick={handleSkip}
          className="w-full mt-2.5 text-[16px] font-medium text-[#1E213D] cursor-pointer text-center hover:opacity-75 transition-opacity"
        >
          अभी नहीं
        </button>
      </div>
    </div>
  );
}
