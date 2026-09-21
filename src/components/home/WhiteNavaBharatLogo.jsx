import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import whiteLogo from '../../assets/nb-logo-white.png';
import { useOnboarding } from '../../context/OnboardingContext';

/**
 * Calculates dynamic greeting based on Indian festivals, special national days,
 * and current time of day (Morning, Afternoon, Evening, Night), personalized with user's complete name.
 */
function getGreetingData(userName) {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const date = now.getDate();
  const hour = now.getHours();

  // Only first name
  const firstName = userName && userName.trim() ? userName.trim().split(' ')[0] : null;

  // 1. National & Festive Greetings (Clean text, no icons)
  if (month === 1 && date === 1) {
    return { title: 'नव वर्ष की हार्दिक शुभकामनाएं' };
  }
  if (month === 1 && (date === 14 || date === 15)) {
    return { title: 'मकर संक्रांति की हार्दिक शुभकामनाएं' };
  }
  if (month === 1 && date === 26) {
    return { title: 'गणतंत्र दिवस की हार्दिक शुभकामनाएं' };
  }
  if (month === 3 && date === 8) {
    return { title: 'अंतर्राष्ट्रीय महिला दिवस की बधाई' };
  }
  if (month === 8 && date === 15) {
    return { title: 'स्वतंत्रता दिवस की हार्दिक शुभकामनाएं' };
  }
  if (month === 10 && date === 2) {
    return { title: 'गांधी जयंती की हार्दिक शुभकामनाएं' };
  }
  if (month === 12 && date === 25) {
    return { title: 'क्रिसमस की हार्दिक शुभकामनाएं' };
  }

  // 2. Dynamic Time of Day Greetings with First Name (Single line, generous matras)
  if (hour >= 5 && hour < 12) {
    return {
      title: firstName ? `सुप्रभात, ${firstName}!` : 'सुप्रभात!',
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: firstName ? `दोपहर की खबरें पढ़ें, ${firstName}!` : 'दोपहर की खबरें पढ़ें!',
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      title: firstName ? `शुभ संध्या, ${firstName}!` : 'शुभ संध्या!',
    };
  }
  return {
    title: firstName ? `नमस्कार, ${firstName}!` : 'नमस्कार!',
  };
}

/**
 * Animated Nava Bharat Header Brand (Times of India style)
 * Smoothly transitions from the official Nava Bharat white logo to a dynamic,
 * time-and-festival aware greeting, then returns seamlessly to the logo.
 * Features generous line-height to ensure no matras get cut off, clean bold typography,
 * complete user name, and no emojis/icons.
 */
export default function WhiteNavaBharatLogo({ className = "w-[164px] h-[40px]" }) {
  const { userProfile } = useOnboarding() || {};
  const location = useLocation();

  // Initially show welcome message when user enters app or lands from another screen
  const [showingGreeting, setShowingGreeting] = useState(true);

  // Compute greeting data
  const greeting = useMemo(() => {
    return getGreetingData(userProfile?.name);
  }, [userProfile?.name]);

  useEffect(() => {
    let hideTimer = null;
    let loopInterval = null;

    // 1. When user lands or navigates to screen: immediately show welcome message
    setShowingGreeting(true);

    // 2. For a few seconds (3.5s) only show the welcome message, then show the logo
    hideTimer = setTimeout(() => {
      setShowingGreeting(false);
    }, 3500);

    // 3. Optional periodic gentle transition every 36 seconds
    loopInterval = setInterval(() => {
      setShowingGreeting(true);
      setTimeout(() => {
        setShowingGreeting(false);
      }, 3500);
    }, 36000);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(loopInterval);
    };
  }, [location.pathname]);

  // Manual toggle on user click / tap
  const handleToggle = () => {
    setShowingGreeting((prev) => !prev);
  };

  return (
    <div
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      aria-label={showingGreeting ? greeting.title : "नवभारत"}
      title="टैप करके संदेश या लोगो देखें"
      className="relative w-full min-w-[164px] max-w-[260px] h-[48px] overflow-hidden flex items-center justify-start select-none cursor-pointer group"
    >
      {/* 1. Official Nava Bharat White Logo */}
      <div
        className={`absolute inset-0 flex items-center justify-start transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showingGreeting
            ? '-translate-y-full opacity-0 scale-95 pointer-events-none'
            : 'translate-y-0 opacity-100 scale-100'
        }`}
      >
        <img
          src={whiteLogo}
          alt="नवभारत"
          className={`object-contain object-left ${className}`}
          draggable={false}
        />
      </div>

      {/* 2. Dynamic Times-of-India style Greeting (Clean single line, no icons, no yellow subtitle) */}
      <div
        className={`absolute inset-0 flex items-center justify-start transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showingGreeting
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-full opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-start text-left w-full">
          {/* Main Greeting: bold white with leading-normal so matras are never clipped */}
          <span className="text-[16px] sm:text-[17px] font-bold text-white leading-normal tracking-tight truncate max-w-full drop-shadow-xs select-none">
            {greeting.title}
          </span>
        </div>
      </div>
    </div>
  );
}
