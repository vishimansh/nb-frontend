import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, Wallet2 } from 'iconsax-react';

export default function BudgetEditSheet({
  isOpen,
  onClose,
  campaign,
  onSaveBudget,
}) {
  const [budget, setBudget] = useState(campaign?.dailyBudget || 500);

  useEffect(() => {
    if (campaign?.dailyBudget) {
      setBudget(campaign.dailyBudget);
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  const durationDays = campaign.durationDays || 7;
  const subtotal = budget * durationDays;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const handleSave = () => {
    if (onSaveBudget) {
      onSaveBudget(campaign.id, budget);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] cursor-pointer"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-[402px] bg-white rounded-t-[28px] z-50 flex flex-col shadow-2xl overflow-hidden border-t border-[#E5E7EB]"
        >
          {/* Header */}
          <div className="px-5 pt-3 pb-3 border-b border-[#F1F3F5] flex items-center justify-between bg-white relative shrink-0">
            <div className="w-10 h-1 bg-[#D1D5DB] rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />

            <div className="mt-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EE] flex items-center justify-center text-[#E39026]">
                <Wallet2 size={18} color="#E39026" variant="Bold" />
              </div>
              <h2 className="text-[17px] font-bold text-[#2B2437]">
                रोज़ का बजट बदलें
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="बंद करें"
              className="mt-2 text-[#6B7280] hover:text-[#2B2437] cursor-pointer active:scale-90 transition-transform p-1"
            >
              <CloseCircle size={22} color="#6B7280" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#6B7280]">
                  नया बजट
                </span>
                <span className="text-[22px] font-bold text-[#2B2437]">
                  ₹{budget.toLocaleString('en-IN')}{' '}
                  <span className="text-[13px] font-medium text-[#6B7280]">/ दिन</span>
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full mt-3 h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#2B2437]"
              />

              <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1 font-mono">
                <span>₹200</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Recalculated Spend Card */}
            <div className="bg-[#F7F7F4] rounded-[16px] p-4 border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>विज्ञापन के दिन ({durationDays} दिन):</span>
                <span className="font-semibold text-[#2B2437] font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>18% GST:</span>
                <span className="font-semibold text-[#2B2437] font-mono">₹{gst.toFixed(2)}</span>
              </div>
              <div className="h-[1px] bg-[#E5E7EB] my-1" />
              <div className="flex justify-between text-[15px] font-bold text-[#2B2437]">
                <span>कुल खर्च:</span>
                <span className="text-[#E39026] font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full h-[56px] rounded-[16px] bg-[#2B2437] text-white font-medium text-[18px] shadow-md active:scale-[0.99] cursor-pointer hover:bg-[#3D334E] transition-all flex items-center justify-center"
            >
              बजट सेव करें
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
