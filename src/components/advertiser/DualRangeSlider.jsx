import React, { useState } from 'react';

export default function DualRangeSlider({
  min = 18,
  max = 65,
  value = [18, 65],
  onChange,
}) {
  const [minVal, maxVal] = value;
  const [activeThumb, setActiveThumb] = useState('min');

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 2);
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 2);
    onChange([minVal, val]);
  };

  const minPercent = Math.max(0, Math.min(100, ((minVal - min) / (max - min)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxVal - min) / (max - min)) * 100));

  return (
    <div className="w-full select-none py-3">
      {/* Slider Track Container */}
      <div className="relative h-8 flex items-center touch-none">
        {/* Base Inactive Track */}
        <div className="absolute w-full h-2.5 bg-[#E5E7EB] rounded-full" />

        {/* Selected Range Active Track */}
        <div
          className="absolute h-2.5 bg-[#2B2437] rounded-full transition-all"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onPointerDown={() => setActiveThumb('min')}
          onChange={handleMinChange}
          className={`absolute w-full h-8 appearance-none bg-transparent pointer-events-none cursor-pointer ${
            activeThumb === 'min' ? 'z-30' : 'z-20'
          }
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:w-7
            [&::-webkit-slider-thumb]:h-7
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#2B2437]
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:appearance-none
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:w-7
            [&::-moz-range-thumb]:h-7
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#2B2437]
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-lg`}
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onPointerDown={() => setActiveThumb('max')}
          onChange={handleMaxChange}
          className={`absolute w-full h-8 appearance-none bg-transparent pointer-events-none cursor-pointer ${
            activeThumb === 'max' ? 'z-30' : 'z-20'
          }
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:w-7
            [&::-webkit-slider-thumb]:h-7
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#2B2437]
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:appearance-none
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:w-7
            [&::-moz-range-thumb]:h-7
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#2B2437]
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-lg`}
        />
      </div>

      {/* Numerical Indicators and Legend */}
      <div className="flex justify-between text-[11px] font-semibold text-[#6B7280] mt-1 px-1">
        <span>18 वर्ष</span>
        <span>25 वर्ष</span>
        <span>35 वर्ष</span>
        <span>50 वर्ष</span>
        <span>65+ वर्ष</span>
      </div>
    </div>
  );
}
