import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Checks if a route path natively has a dark background at the top status bar.
 * - Dark screens: /feed, /city, /state, /home, /category/*, /videos
 * - White / light-shade screens: /, /onboarding/*, /search, /menu, /profile, /settings, /epaper, /notifications, /article/*, /city/select, /city/localities, /edit/*
 */
function isDarkRoute(pathname) {
  // Light selection / edit sub-routes take precedence
  if (
    pathname === '/city/select' ||
    pathname === '/city/localities' ||
    pathname.startsWith('/edit/')
  ) {
    return false;
  }

  // Screens with dark navy (#18253B) or black headers at the top
  if (
    pathname === '/feed' ||
    pathname === '/city' ||
    pathname === '/state' ||
    pathname === '/home' ||
    pathname.startsWith('/category') ||
    pathname === '/videos'
  ) {
    return true;
  }

  return false;
}

/**
 * Authentic iPhone 17 Pro Dynamic Island & Status Bar component
 * - Fixed 64px clearance with 9:41 time, hardware island, and system status indicators.
 * - Dynamically adapts: Black text & icons for white or light-shade backgrounds (#FFFFFF, #FDFDFD, #F7F7F4, #F7F7F8).
 * - White text & icons for dark background screens (#18253B, #000000, #0F172A).
 */
export default function StatusBar({ dark, className = "" }) {
  const location = useLocation();
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (dark !== undefined) return dark;
    return isDarkRoute(location.pathname);
  });

  useEffect(() => {
    if (dark !== undefined) {
      setIsDarkTheme(dark);
      return;
    }

    // 1. Instantaneous synchronous route-based default (zero flicker)
    setIsDarkTheme(isDarkRoute(location.pathname));

    // 2. Dynamic DOM sampling of the background color directly under the status bar
    const checkBgColor = () => {
      try {
        const screenEl = document.getElementById('iphone-screen');
        if (!screenEl) return;

        const rect = screenEl.getBoundingClientRect();
        // Sample 20px below the top of the phone screen, offset from left to avoid Dynamic Island
        const sampleX = rect.left + 50;
        const sampleY = rect.top + 20;

        const elements = document.elementsFromPoint(sampleX, sampleY);
        for (const el of elements) {
          if (el.closest('.status-bar-container')) continue;
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              const r = parseInt(match[1], 10);
              const g = parseInt(match[2], 10);
              const b = parseInt(match[3], 10);
              // Perceived brightness formula (ITU-R BT.601 standard)
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              // If brightness > 150, background is white or light shade -> dark theme is false (black icons)
              setIsDarkTheme(brightness <= 150);
              return;
            }
          }
        }
      } catch {
        // Fallback to route-based state on any sampling restriction
      }
    };

    const timer = setTimeout(checkBgColor, 50);
    window.addEventListener('scroll', checkBgColor, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkBgColor, true);
    };
  }, [location.pathname, dark]);

  const isDark = dark !== undefined ? dark : isDarkTheme;

  const textColor = isDark ? 'text-white' : 'text-black';
  const batteryBorder = isDark ? 'border-white' : 'border-black';
  const batteryFill = isDark ? 'bg-white' : 'bg-black';

  return (
    <div className={`status-bar-container w-full absolute top-0 left-0 right-0 z-50 pointer-events-none flex items-center justify-between px-[48px] pt-[24px] pb-[24px] transition-colors duration-200 ${className}`}>
      {/* Left Time */}
      <span className={`text-[18px] font-semibold tracking-tight ${textColor} leading-none transition-colors duration-200`}>
        9:41
      </span>

      {/* Center Dynamic Island */}
      <div className="w-[125px] h-[35px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-end px-3 shadow-xs">
        {/* Subtle camera lens reflection */}
        <div className="w-3 h-3 rounded-full bg-[#111827] border border-[#1F2937]/50 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#1E3A8A]/40" />
        </div>
      </div>

      {/* Right Icons: Cellular Signal, Wi-Fi, Battery */}
      <div className={`flex items-center gap-1.5 ${textColor} transition-colors duration-200`}>
        {/* Cellular Signal Bars */}
        <svg className="w-4 h-3 fill-current transition-colors duration-200" viewBox="0 0 17 12">
          <rect x="0" y="9" width="2.8" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="2.8" height="6" rx="0.5" />
          <rect x="9" y="3" width="2.8" height="9" rx="0.5" />
          <rect x="13.5" y="0" width="2.8" height="12" rx="0.5" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg className="w-3.5 h-3 fill-current transition-colors duration-200" viewBox="0 0 16 12">
          <path d="M8 3.5C5.2 3.5 2.7 4.7 1 6.6L0 5.4C2 3.2 4.9 1.8 8 1.8C11.1 1.8 14 3.2 16 5.4L15 6.6C13.3 4.7 10.8 3.5 8 3.5ZM8 7C6.4 7 5 7.7 4 8.8L3 7.7C4.3 6.3 6.1 5.4 8 5.4C9.9 5.4 11.7 6.3 13 7.7L12 8.8C11 7.7 9.6 7 8 7ZM8 10.5C7.2 10.5 6.5 11.2 6.5 12H9.5C9.5 11.2 8.8 10.5 8 10.5Z" />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center gap-0.5">
          <div className={`w-5 h-2.5 border ${batteryBorder} rounded-[4px] p-[1px] flex items-center transition-colors duration-200`}>
            <div className={`w-full h-full ${batteryFill} rounded-[2px] transition-colors duration-200`} />
          </div>
          <div className={`w-[1px] h-1 ${batteryFill} rounded-r-sm transition-colors duration-200`} />
        </div>
      </div>
    </div>
  );
}
