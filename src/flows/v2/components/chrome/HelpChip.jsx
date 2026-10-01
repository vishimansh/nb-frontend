import React from 'react';
import { Headset } from 'lucide-react';
import { STRINGS } from '../../strings/hi';

export default function HelpChip({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[36px] px-3 rounded-full bg-white border border-[#E5E7EB] flex items-center gap-1.5 text-[13px] font-medium text-[#4A4358] active:scale-[0.97] transition-all hover:bg-neutral-50 shadow-sm shrink-0"
      aria-label="मदद प्राप्त करें"
    >
      <Headset className="w-4 h-4 text-[#E39026]" />
      <span>{STRINGS.common.help}</span>
    </button>
  );
}
