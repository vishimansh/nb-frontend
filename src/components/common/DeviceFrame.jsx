import React, { useState, useEffect } from 'react';
import StatusBar from './StatusBar';
import HomeIndicator from './HomeIndicator';

/**
 * iPhone 17 Pro Device Shell
 * Automatically scales to fit the laptop/desktop screen height seamlessly
 * so the entire phone (from Dynamic Island down to the bottom CTA and Home Indicator)
 * is always 100% visible with comfortable desktop padding and zero vertical scrolling.
 * Internal rendering canvas is locked to authentic 402px × 874px resolution.
 */
export default function DeviceFrame({ children }) {
  const [scale, setScale] = useState(1);

  // Automatically compute the ideal scale to fit the viewport height
  useEffect(() => {
    const updateScale = () => {
      // Reserve 48px for top and bottom desktop breathing room
      const availableHeight = window.innerHeight - 48;
      // 882px is total chassis height including 4px titanium bezel
      const calculatedScale = availableHeight / 886;
      // Cap scale between 0.45 and 1.0
      setScale(Math.min(1, Math.max(0.45, Number(calculatedScale.toFixed(3)))));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#E5E7EB] flex flex-col items-center justify-center select-none font-sans overflow-hidden">
      {/* Sized Container: adapts to scaled phone dimensions */}
      <div
        className="flex items-center justify-center transition-all duration-200"
        style={{
          width: `${410 * scale}px`,
          height: `${882 * scale}px`,
        }}
      >
        {/* Outer Titanium Chassis */}
        <div
          className="rounded-[58px] p-[4px] bg-[#1C1C1E] shadow-device relative flex items-center justify-center shrink-0 origin-center transition-transform duration-200"
          style={{
            transform: `scale(${scale})`,
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Active Screen Viewport: Strictly 402px × 874px */}
          <div
            id="iphone-screen"
            className="w-[402px] h-[874px] min-w-[402px] min-h-[874px] max-w-[402px] max-h-[874px] rounded-[50px] bg-[#F7F7F4] overflow-hidden relative flex flex-col shrink-0"
            style={{ width: '402px', height: '874px' }}
          >
            {/* Hardware Status Bar with Dynamic Island */}
            <StatusBar />

            {/* Active Screen Content Area */}
            <div className="w-full h-full relative flex flex-col overflow-hidden">
              {children}
            </div>

            {/* Floating iOS Home Indicator */}
            <HomeIndicator />
          </div>
        </div>
      </div>
    </div>
  );
}
