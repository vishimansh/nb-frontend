import React from 'react';
import { useToastV2 } from '../../context/ToastV2Context';

export default function Toast() {
  const { toast } = useToastV2();

  if (!toast) return null;

  return (
    <div className="absolute bottom-[96px] left-4 right-4 z-40 flex justify-center pointer-events-none select-none">
      <div className="bg-[#2B2437] text-white px-4 py-2.5 rounded-full text-[13.5px] font-medium shadow-xl border border-white/10 flex items-center gap-2 max-w-[90%] text-center animate-fadeIn">
        <span>{toast}</span>
      </div>
    </div>
  );
}
