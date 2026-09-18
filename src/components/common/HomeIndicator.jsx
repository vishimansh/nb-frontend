import React from 'react';

/**
 * iOS Home Indicator bar floating 8px above bottom edge
 */
export default function HomeIndicator() {
  return (
    <div className="w-full absolute bottom-[6px] left-0 right-0 z-50 pointer-events-none flex justify-center">
      <div className="w-[64px] h-[4px] bg-black/30 rounded-full" />
    </div>
  );
}
