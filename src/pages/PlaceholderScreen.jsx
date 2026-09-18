import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';

export default function PlaceholderScreen({ title = 'विवरण', subtitle = 'यह पृष्ठ जल्द ही उपलब्ध होगा' }) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0" />

      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center gap-3 bg-[#F7F7F4] border-b border-[#E5E7EB] shrink-0">
        <BackButton ariaLabel="वापस जाएं" />
        <h1 className="text-[20px] font-bold text-[#18253B] tracking-tight">{title}</h1>
      </div>

      {/* Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center mb-4 text-[#E39026]">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-[17px] font-bold text-[#18253B] mb-1">{title}</h2>
        <p className="text-[13px] text-[#6B7280] leading-relaxed max-w-[260px]">{subtitle}</p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 px-6 h-[44px] rounded-full bg-[#18253B] text-white text-[14px] font-semibold active:scale-95 transition-transform cursor-pointer shadow-sm"
        >
          वापस जाएं
        </button>
      </div>
    </div>
  );
}
