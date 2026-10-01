import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-10 h-10 border-4',
  }[size] || 'w-6 h-6 border-3';

  return (
    <div
      className={`rounded-full border-neutral-300 border-t-[#2B2437] animate-spin ${sizeClasses} ${className}`}
      role="status"
      aria-label="लोड हो रहा है"
    />
  );
}
