import React, { useState, useEffect } from 'react';

function HardwareStatusBar() {
  return (
    <div className="status-bar-container w-full absolute top-0 left-0 right-0 z-50 pointer-events-none flex items-center justify-between px-[48px] pt-[24px] pb-[24px]">
      {/* Left Time */}
      <span className="text-[18px] font-semibold tracking-tight text-black leading-none">
        9:41
      </span>

      {/* Center Dynamic Island */}
      <div className="w-[125px] h-[35px] bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-end px-3 shadow-xs">
        <div className="w-3 h-3 rounded-full bg-[#111827] border border-[#1F2937]/50 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#1E3A8A]/40" />
        </div>
      </div>

      {/* Right Icons: Cellular Signal, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 text-black">
        {/* Cellular Signal Bars */}
        <svg className="w-4 h-3 fill-current" viewBox="0 0 17 12">
          <rect x="0" y="9" width="2.8" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="2.8" height="6" rx="0.5" />
          <rect x="9" y="3" width="2.8" height="9" rx="0.5" />
          <rect x="13.5" y="0" width="2.8" height="12" rx="0.5" />
        </svg>

        {/* Wi-Fi Icon */}
        <svg className="w-3.5 h-3 fill-current" viewBox="0 0 16 12">
          <path d="M8 3.5C5.2 3.5 2.7 4.7 1 6.6L0 5.4C2 3.2 4.9 1.8 8 1.8C11.1 1.8 14 3.2 16 5.4L15 6.6C13.3 4.7 10.8 3.5 8 3.5ZM8 7C6.4 7 5 7.7 4 8.8L3 7.7C4.3 6.3 6.1 5.4 8 5.4C9.9 5.4 11.7 6.3 13 7.7L12 8.8C11 7.7 9.6 7 8 7ZM8 10.5C7.2 10.5 6.5 11.2 6.5 12H9.5C9.5 11.2 8.8 10.5 8 10.5Z" />
        </svg>

        {/* Battery Icon */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 border border-black rounded-[4px] p-[1px] flex items-center">
            <div className="w-full h-full bg-black rounded-[2px]" />
          </div>
          <div className="w-[1px] h-1 bg-black rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="w-full absolute bottom-[6px] left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div className="w-[64px] h-[4px] bg-black/30 rounded-full" />
    </div>
  );
}

/**
 * iPhone 17 Pro Device Shell for Flow B
 * Self-contained device frame with Dynamic Island status bar and Home Indicator
 * so Flow B matches Flow A's high-fidelity mobile presentation with 0 coupling.
 */
export default function PhoneFrame({ children }) {
  const [scale, setScale] = useState(1);

  // Automatically compute ideal scale to fit window height AND width seamlessly
  useEffect(() => {
    const updateScale = () => {
      const availableHeight = window.innerHeight - 48;
      const availableWidth = window.innerWidth - 32;
      const scaleByHeight = availableHeight / 886;
      const scaleByWidth = availableWidth / 410;
      const calculatedScale = Math.min(scaleByHeight, scaleByWidth);
      setScale(Math.min(1, Math.max(0.45, Number(calculatedScale.toFixed(3)))));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#E5E7EB] flex flex-col items-center justify-center select-none font-sans overflow-hidden nb2-root" lang="hi">
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
            <HardwareStatusBar />

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
