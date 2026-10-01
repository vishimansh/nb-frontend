import React from 'react';
import { CONFIG } from '../../config';

export default function AdTag({ className = '' }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full bg-white/95 border border-[#E5E7EB] text-[11px] font-semibold text-[#4A4358] tracking-wider select-none shrink-0 inline-flex items-center shadow-xs ${className}`}
      aria-label="विज्ञापन पहचान"
    >
      {CONFIG.AD_LABEL_TEXT}
    </span>
  );
}
