import React from 'react';
import nbLogo from '../../assets/nb-logo.png';

/**
 * Nava Bharat Official Brand Logo Component
 */
export default function NavaBharatLogo({ className = "h-[38px] w-auto", showTagline = false }) {
  return (
    <div className="inline-flex flex-col items-center select-none">
      <img
        src={nbLogo}
        alt="नवभारत"
        className={`object-contain ${className}`}
        draggable={false}
      />
      {showTagline && (
        <span className="text-[11px] tracking-wider text-[#6B7280] font-medium mt-1">
          1934 से जनविश्वास की आवाज़
        </span>
      )}
    </div>
  );
}
