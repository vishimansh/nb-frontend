import React from 'react';
import { SearchNormal1 } from 'iconsax-react';

export default function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[360px] px-6 text-center select-none animate-fadeIn">
      <div className="relative w-16 h-16 rounded-full bg-[#F3F4F6] text-[#9CA3AF] flex items-center justify-center mb-3 shadow-2xs">
        <SearchNormal1 size={28} className="text-[#9CA3AF]" />
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] text-[10px] font-bold shadow-xs">
          ✕
        </div>
      </div>
      <h3 className="text-[16px] font-bold text-[#18253B]">कोई परिणाम नहीं मिला</h3>
      <p className="text-[13px] text-[#6B7280] mt-1.5 max-w-[240px] leading-relaxed">
        कृपया अलग कीवर्ड डालकर देखें या शब्दों की स्पेलिंग जांचें।
      </p>
    </div>
  );
}
