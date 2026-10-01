import React from 'react';

export default function Badge({
  children,
  variant = 'amber', // 'amber' | 'ink' | 'success' | 'danger' | 'muted'
  className = '',
}) {
  let styleClasses = 'bg-[#FFF9EE] text-[#C97F1E] border border-[#FDE68A]';

  if (variant === 'ink') {
    styleClasses = 'bg-[#2B2437] text-white border border-[#2B2437]';
  } else if (variant === 'success') {
    styleClasses = 'bg-[#EEF8F2] text-[#2F8F5B] border border-[#A7F3D0]';
  } else if (variant === 'danger') {
    styleClasses = 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]';
  } else if (variant === 'muted') {
    styleClasses = 'bg-[#F7F7F4] text-[#6B7280] border border-[#E5E7EB]';
  }

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-bold tracking-tight inline-flex items-center gap-1 select-none shrink-0 ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
}
