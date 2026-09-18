import React from 'react';
import LandmarkArtwork from './LandmarkArtwork';

/**
 * StateCard Component
 * Image container: 1:1 square, rounded-[28px], top-2.5 right-2.5 26px priority badge.
 * State label: centered below image, text-[16px] font-bold #1E213D.
 */
export default function StateCard({ state, isSelected, priority, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer select-none group"
    >
      {/* Image & Badge Wrapper: relative container so badge can overlap top-right corner without clipping */}
      <div className="relative">
        {/* 148px x 148px Artwork Frame with 28px rounded corners */}
        <div 
          className={`w-[148px] h-[148px] rounded-[28px] overflow-hidden relative bg-[#E5E7EB] border transition-all duration-200 ${
            isSelected 
              ? 'border-[#1E213D] shadow-md ring-2 ring-[#1E213D]/20 scale-[1.01]' 
              : 'border-[#E5E7EB] hover:border-gray-400'
          }`}
        >
          <LandmarkArtwork stateId={state.id} isSelected={isSelected} />
        </div>

        {/* Priority Badge: 32px x 32px numbering icon overlapping the top right corner without any border */}
        {isSelected && priority && (
          <div className="absolute -top-2 -right-2 w-[32px] h-[32px] rounded-full bg-[#EEEBDA] text-white flex items-center justify-center text-[16px] font-bold leading-none select-none shadow-md animate-in fade-in zoom-in duration-150 z-20">
            <span className="flex items-center justify-center leading-none">{priority}</span>
          </div>
        )}
      </div>

      {/* State Label: 20px font size, medium weight */}
      <span className="mt-2 text-[20px] font-medium text-[#1E213D] text-center tracking-tight leading-tight">
        {state.name}
      </span>
    </div>
  );
}
