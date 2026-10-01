import React, { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import GstInfoSheet from './GstInfoSheet';
import { formatIN } from '../../utils/formatIN';
import { STRINGS } from '../../strings/hi';

export default function BillSheet({
  isOpen,
  onClose,
  daily,
  days,
  subtotal,
  gst,
  total,
}) {
  const [showGstInfo, setShowGstInfo] = useState(false);

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={STRINGS.billSheet.title}
      >
        <div className="flex flex-col gap-3 py-2">
          {/* Card breakdown */}
          <div className="p-4 rounded-2xl bg-[#F8F8F4] border border-[#E5E7EB] flex flex-col gap-2.5">
            {/* Subtotal line */}
            <div className="flex items-center justify-between text-[14.5px] text-[#4A4358]">
              <span>विज्ञापन बजट ({daily}/दिन × {days} दिन):</span>
              <span className="font-semibold text-[#2B2437]">₹{formatIN(subtotal)}</span>
            </div>

            {/* GST line */}
            <div className="flex items-center justify-between text-[14.5px] text-[#4A4358]">
              <div className="flex items-center gap-1.5">
                <span>+18% GST:</span>
                <button
                  type="button"
                  onClick={() => setShowGstInfo(true)}
                  className="text-[12px] font-semibold text-[#E39026] underline"
                >
                  {STRINGS.billSheet.whatIsGstLink}
                </button>
              </div>
              <span className="font-semibold text-[#2B2437]">₹{formatIN(gst)}</span>
            </div>

            <div className="w-full h-px bg-[#E5E7EB] my-1" />

            {/* Grand Total */}
            <div className="flex items-center justify-between text-[17px] font-extrabold text-[#2B2437]">
              <span>{STRINGS.billSheet.totalLine('')}</span>
              <span>₹{formatIN(total)}</span>
            </div>
          </div>

          {/* Footnote */}
          <span className="text-[12.5px] text-[#6B7280] text-center px-2">
            {STRINGS.billSheet.invoiceNote}
          </span>
        </div>
      </BottomSheet>

      <GstInfoSheet
        isOpen={showGstInfo}
        onClose={() => setShowGstInfo(false)}
      />
    </>
  );
}
