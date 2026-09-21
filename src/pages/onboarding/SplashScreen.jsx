import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavaBharatLogo from '../../components/common/NavaBharatLogo';

/**
 * Screen 1: Splash Screen
 * 1.0s static display, 250ms fade-out to /onboarding/notifications
 */
export default function SplashScreen() {
  const navigate = useNavigate();
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    // Screen stays static for exactly 1.0s (1000ms)
    const timer = setTimeout(() => {
      setStartFadeOut(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    if (startFadeOut) {
      navigate('/onboarding/notifications');
    }
  };

  return (
    <motion.div
      className="w-full h-full bg-[#F7F7F4] flex flex-col items-center justify-center px-6 relative cursor-default select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: startFadeOut ? 0 : 1 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div className="flex flex-col items-center">
        {/* Centered Brand Logo */}
        <NavaBharatLogo className="h-[44px] w-auto" />

        {/* 16px vertical space below logo */}
        <div className="h-4" />

        {/* Tagline: 20px, Medium 500, #2B2437 */}
        <motion.p 
          className="text-[20px] font-medium text-[#2B2437] text-center tracking-tight"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          1934 से जनविश्वास की आवाज़
        </motion.p>
      </div>
    </motion.div>
  );
}
