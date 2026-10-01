import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle = null,
  children,
  footer = null,
}) {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2B2437]/45 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content Container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-h-[85%] rounded-t-[28px] bg-white border-t border-[#E5E7EB] nb2-sheet-shadow flex flex-col overflow-hidden z-10 transition-transform duration-280 ease-out"
        style={{ animation: 'nb2-slide-up 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Drag handle */}
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0 cursor-grab" onClick={onClose}>
          <div className="w-10 h-1.2 rounded-full bg-[#D1D5DB]" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[17px] font-bold text-[#2B2437] leading-tight">{title}</h3>
            {subtitle && (
              <p className="text-[13px] text-[#6B7280] leading-snug mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F4] flex items-center justify-center text-[#4A4358] hover:bg-neutral-200 active:scale-90 transition-all"
            aria-label="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-none overscroll-contain">
          {children}
        </div>

        {/* Optional Sticky Footer inside Sheet */}
        {footer && (
          <div className="p-4 border-t border-[#E5E7EB] bg-[#F8F8F4] shrink-0">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes nb2-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
