import React from 'react';
import { Check } from 'lucide-react';

export default function CheckBurst({ size = 56, className = '' }) {
  return (
    <div
      className={`rounded-full bg-[#2F8F5B] text-white flex items-center justify-center nb2-check-burst-anim shadow-lg shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Check
        className="stroke-[3] animate-fadeIn"
        style={{ width: `${size * 0.55}px`, height: `${size * 0.55}px` }}
      />
    </div>
  );
}
