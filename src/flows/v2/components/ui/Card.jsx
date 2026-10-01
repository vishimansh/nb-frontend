import React from 'react';

export default function Card({
  children,
  className = '',
  onClick = null,
  selected = false,
  tint = false,
}) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`rounded-[20px] p-4 transition-all duration-150 border ${
        tint
          ? 'bg-[#FFF9EE] border-[#FDE68A]'
          : selected
          ? 'bg-white border-[#2B2437] border-2 shadow-sm'
          : 'bg-white border-[#E5E7EB] nb2-card-shadow'
      } ${
        isInteractive ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
