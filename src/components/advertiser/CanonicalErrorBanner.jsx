import React from 'react';
import { Danger } from 'iconsax-react';

/**
 * Canonical Warning / Error Banner Design Pattern
 * Standardized across all advertiser validation states
 */
export default function CanonicalErrorBanner({ message, className = '' }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`p-3 rounded-[14px] bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 my-2 ${className}`}
    >
      <Danger size={18} color="#DC2626" variant="Bold" className="flex-shrink-0 mt-0.5" />
      <p className="text-[12px] font-medium text-[#B91C1C] leading-snug">
        {message}
      </p>
    </div>
  );
}
