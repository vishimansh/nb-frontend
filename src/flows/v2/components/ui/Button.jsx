import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary' | 'amber' | 'outline' | 'ghost'
  size = 'default',   // 'default' (52px) | 'sm' (40px)
  showArrow = false,
  className = '',
  type = 'button',
  fullWidth = true,
}) {
  const isPrimary = variant === 'primary';
  const isAmber = variant === 'amber';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isSm = size === 'sm';

  const baseClasses = `rounded-[18px] font-semibold flex items-center justify-center gap-2 transition-all duration-150 select-none ${
    fullWidth ? 'w-full' : 'w-auto px-5'
  } ${isSm ? 'h-[40px] text-[14px]' : 'h-[52px] text-[16px]'}`;

  let variantClasses = '';
  if (disabled) {
    variantClasses = 'bg-[#A6A4A9] text-white/70 cursor-not-allowed shadow-none';
  } else if (isPrimary) {
    variantClasses = 'bg-[#2B2437] text-white hover:bg-[#1E1927] active:scale-[0.97] nb2-btn-shadow';
  } else if (isAmber) {
    variantClasses = 'bg-[#E39026] text-white hover:bg-[#C97F1E] active:scale-[0.97] shadow-md';
  } else if (isOutline) {
    variantClasses = 'bg-white border-2 border-[#2B2437] text-[#2B2437] hover:bg-neutral-50 active:scale-[0.97]';
  } else if (isGhost) {
    variantClasses = 'bg-transparent text-[#4A4358] hover:bg-black/5 active:scale-[0.97]';
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <span>{children}</span>
      {showArrow && !disabled && <ArrowRight className="w-4 h-4" />}
    </button>
  );
}
