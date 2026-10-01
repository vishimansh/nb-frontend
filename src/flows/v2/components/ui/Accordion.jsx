import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({
  title,
  summary = null,
  children,
  defaultOpen = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-[20px] bg-white border border-[#E5E7EB] overflow-hidden transition-all duration-200 ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-4 flex items-center justify-between text-left select-none active:bg-neutral-50"
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[15.5px] font-bold text-[#2B2437]">{title}</span>
          {summary && !isOpen && (
            <span className="text-[13px] text-[#6B7280] font-normal">{summary}</span>
          )}
        </div>
        <div
          className={`w-7 h-7 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#4A4358] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-[#E5E7EB]/60 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
