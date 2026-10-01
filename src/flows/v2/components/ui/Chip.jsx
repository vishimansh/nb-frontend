import React from 'react';
import { X, Lock } from 'lucide-react';

export default function Chip({
  label,
  selected = false,
  onClick = null,
  onRemove = null,
  isLocked = false,
  className = '',
  size = 'default', // 'default' (40px) | 'sm' (32px)
}) {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full flex items-center justify-center gap-1.5 font-medium transition-all select-none active:scale-[0.96] shrink-0 border ${
        isSm ? 'h-[32px] px-3 text-[12.5px]' : 'h-[40px] px-4 text-[14px]'
      } ${
        selected
          ? 'bg-[#2B2437] text-white border-[#2B2437] shadow-sm'
          : 'bg-white text-[#4A4358] border-[#E5E7EB] hover:bg-neutral-50'
      } ${className}`}
    >
      {isLocked && <Lock className="w-3.5 h-3.5 opacity-70" />}
      <span>{label}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 active:scale-90"
        >
          <X className="w-3.5 h-3.5" />
        </span>
      )}
    </button>
  );
}
