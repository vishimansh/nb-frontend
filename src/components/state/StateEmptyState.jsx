import React from 'react';
import { Location } from 'iconsax-react';

export default function StateEmptyState({ onSelectStateClick }) {
  return (
    <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center px-6 select-none">
      {/* Empty State Icon */}
      <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] mb-3">
        <Location size={32} color="#6B7280" variant="Linear" />
      </div>

      {/* Headline */}
      <h2 className="text-[17px] font-bold text-[#2B2437] text-center">
        आपने कोई राज्य नहीं चुना है
      </h2>

      {/* Description */}
      <p className="text-[13px] text-[#6B7280] text-center max-w-[260px] mt-1 mb-6 leading-relaxed">
        स्थानीय और प्रादेशिक खबरें देखने के लिए अपने पसंदीदा राज्य चुनें।
      </p>

      {/* Primary CTA Button */}
      <button
        type="button"
        onClick={onSelectStateClick}
        className="h-12 px-6 rounded-[16px] bg-[#2B2437] text-white font-bold text-[14px] shadow-md active:scale-95 hover:bg-[#3D334E] transition-all cursor-pointer"
      >
        राज्य चुनें
      </button>
    </div>
  );
}
