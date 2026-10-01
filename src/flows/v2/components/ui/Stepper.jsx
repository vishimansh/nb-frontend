import React, { useRef } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function Stepper({
  value,
  onChange,
  min = 1,
  max = 90,
  step = 1,
  unit = 'दिन',
}) {
  const repeatTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const increment = () => {
    onChange(Math.min(max, (Number(value) || 0) + step));
  };

  const decrement = () => {
    onChange(Math.max(min, (Number(value) || 0) - step));
  };

  const startHold = (action) => {
    action();
    repeatTimerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 80);
    }, 400);
  };

  const stopHold = () => {
    if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="flex items-center gap-3 bg-[#F7F7F4] border border-[#E5E7EB] rounded-2xl p-1.5 select-none shrink-0">
      <button
        type="button"
        onMouseDown={() => startHold(decrement)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(decrement)}
        onTouchEnd={stopHold}
        disabled={value <= min}
        className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2B2437] hover:bg-neutral-50 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        aria-label="कम करें"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <span className="min-w-[64px] text-center font-bold text-[16px] text-[#2B2437] tabular-nums">
        {value} {unit}
      </span>

      <button
        type="button"
        onMouseDown={() => startHold(increment)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(increment)}
        onTouchEnd={stopHold}
        disabled={value >= max}
        className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2B2437] hover:bg-neutral-50 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        aria-label="बढ़ाएं"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
