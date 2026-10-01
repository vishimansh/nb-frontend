import React, { useState } from 'react';
import { formatIN } from '../../utils/formatIN';

export default function RangeSlider({
  min = 5,
  max = 25,
  step = 1,
  value,
  onChange,
  landmarks = [],
  unit = '',
  prefix = '',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="w-full flex flex-col gap-2 select-none pt-4 pb-2">
      {/* Slider Track Container */}
      <div className="relative w-full flex items-center h-8">
        {/* Floating Tooltip during drag/hover */}
        {isDragging && (
          <div
            className="absolute -top-7 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#2B2437] text-white text-[12px] font-bold shadow-md pointer-events-none transition-all duration-75 z-10"
            style={{ left: `${percentage}%` }}
          >
            {prefix}{formatIN(value)}{unit ? ` ${unit}` : ''}
          </div>
        )}

        {/* Gray Background Track */}
        <div className="absolute left-0 right-0 h-3 rounded-full bg-[#E5E7EB] overflow-hidden">
          {/* Amber Fill */}
          <div
            className="h-full bg-[#E39026] rounded-full transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Landmark Dots if any */}
        {landmarks.map((lm) => {
          const pos = Math.min(100, Math.max(0, ((lm - min) / (max - min)) * 100));
          return (
            <div
              key={lm}
              className="absolute w-2 h-2 rounded-full bg-white border border-[#A6A4A9] pointer-events-none -translate-x-1/2"
              style={{ left: `${pos}%` }}
            />
          );
        })}

        {/* Native Range Input with custom appearance */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Custom Visible 28px Thumb */}
        <div
          className="absolute w-7 h-7 rounded-full bg-white border-[3.5px] border-[#E39026] shadow-md pointer-events-none -translate-x-1/2 transition-transform duration-75 z-10"
          style={{
            left: `${percentage}%`,
            transform: `translateX(-50%) ${isDragging ? 'scale(1.2)' : 'scale(1)'}`,
          }}
        />
      </div>
    </div>
  );
}
