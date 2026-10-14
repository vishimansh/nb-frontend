import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavaBharatLogo from '../../components/common/NavaBharatLogo';

/**
 * Screen 1: Splash Screen
 * 1.4s comfortable display for brand recognition, smooth fade-out to /onboarding/notifications
 */
export default function SplashScreen() {
  const navigate = useNavigate();
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    // Screen stays static for 1.4s (1400ms) to allow brand recognition without feeling sluggish
    const timer = setTimeout(() => {
      setStartFadeOut(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    if (startFadeOut) {
      navigate('/onboarding/notifications');
    }
  };

  return (
    <motion.div
      className="w-full h-full bg-[#F7F7F4] bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#F7F7F4_72%)] flex flex-col items-center justify-center px-6 relative cursor-default select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: startFadeOut ? 0 : 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div className="flex flex-col items-center">
        {/* Centered Brand Logo with smooth scale entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <NavaBharatLogo className="h-[46px] w-auto drop-shadow-xs" />
        </motion.div>

        {/* 16px vertical space below logo */}
        <div className="h-4" />

        {/* Tagline: 20px, Medium 500, #2B2437 */}
        <motion.p 
          className="text-[20px] font-medium text-[#2B2437] text-center tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
        >
          1934 से जनविश्वास की आवाज़
        </motion.p>
      </div>
    </motion.div>
  );
}
