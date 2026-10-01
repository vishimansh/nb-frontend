import React from 'react';
import { Check } from 'lucide-react';

export default function ChoiceRow({
  title,
  description,
  selected = false,
  onClick,
  icon = null,
  badge = null,
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[18px] p-3.5 border transition-all duration-150 cursor-pointer select-none flex items-center gap-3.5 ${
        selected
          ? 'bg-[#F9FAFB] border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
          : 'bg-white border-[#E5E7EB] hover:bg-neutral-50/80 hover:border-neutral-300'
      } active:scale-[0.98] ${className}`}
    >
      {/* Icon tile if provided */}
      {icon && (
        <div
          className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
            selected ? 'bg-[#FFF9EE] text-[#E39026] border border-[#FDE68A]' : 'bg-[#F7F7F4] text-[#2B2437]'
          }`}
        >
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-[15px] font-bold text-[#2B2437] leading-tight">{title}</h4>
          {badge}
        </div>
        {description && (
          <p className="text-[12.5px] text-[#6B7280] leading-snug mt-0.5">{description}</p>
        )}
      </div>

      {/* Flow A Radio indicator */}
      <div className="shrink-0">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selected
              ? 'border-[#2B2437] bg-white'
              : 'border-[#D1D5DB] bg-white'
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#2B2437]" />
          )}
        </div>
      </div>
    </div>
  );
}
