import React, { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import RangeSlider from '../ui/RangeSlider';
import Button from '../ui/Button';
import { formatIN } from '../../utils/formatIN';
import { calculateSubtotal, calculateTotal } from '../../utils/money';
import { CONFIG } from '../../config';
import { STRINGS } from '../../strings/hi';

export default function EditBudgetSheet({
  isOpen,
  onClose,
  campaign,
  onSaveNewBudget,
  onRequestPayDifference,
}) {
  const currentDaily = campaign?.money?.daily || 250;
  const daysRemaining = 5; // e.g. remaining days
  const [newDaily, setNewDaily] = useState(currentDaily);

  if (!campaign) return null;

  const isIncrease = newDaily > currentDaily;
  const isDecrease = newDaily < currentDaily;

  const currentRemSub = calculateSubtotal(currentDaily, daysRemaining);
  const newRemSub = calculateSubtotal(newDaily, daysRemaining);
  const diffSub = Math.max(0, newRemSub - currentRemSub);
  const diffTotal = calculateTotal(diffSub);

  const handleAction = () => {
    if (isIncrease) {
      if (onRequestPayDifference) {
        onRequestPayDifference(diffTotal, newDaily);
      }
    } else {
      if (onSaveNewBudget) {
        onSaveNewBudget(campaign.id, newDaily);
      }
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.editBudget.title}
      footer={
        <Button onClick={handleAction}>
          {isIncrease
            ? STRINGS.editBudget.payDifferenceBtn(formatIN(diffTotal))
            : STRINGS.editBudget.saveBudgetBtn}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 py-1">
        <p className="text-[14px] text-[#4A4358]">
          {STRINGS.editBudget.remainingDaysCopy(daysRemaining)}
        </p>

        {/* Current vs New Budget Pill */}
        <div className="p-3 rounded-2xl bg-[#F8F8F4] border border-[#E5E7EB] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#6B7280]">वर्तमान बजट:</span>
            <span className="font-bold text-[15px] text-[#2B2437]">
              ₹{formatIN(currentDaily)}/दिन
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[12px] text-[#6B7280]">नया बजट:</span>
            <span className="font-bold text-[16px] text-[#E39026]">
              ₹{formatIN(newDaily)}/दिन
            </span>
          </div>
        </div>

        {/* Range Slider for new daily */}
        <div className="pt-2">
          <RangeSlider
            min={100}
            max={2500}
            step={25}
            value={newDaily}
            onChange={setNewDaily}
            prefix="₹"
            unit="/दिन"
          />
        </div>

        {/* Notes depending on increase or decrease */}
        <div className="text-[13px] text-[#6B7280]">
          {isIncrease ? (
            <span className="text-[#2B2437] font-medium">
              {STRINGS.editBudget.additionalCostNotice(formatIN(diffTotal))}
            </span>
          ) : isDecrease ? (
            <span>
              {STRINGS.editBudget.effectiveTomorrow}
              {CONFIG.PLACEHOLDER_UNSPENT_POLICY_TEXT && ` · ${CONFIG.PLACEHOLDER_UNSPENT_POLICY_TEXT}`}
            </span>
          ) : (
            <span>{STRINGS.editBudget.effectiveTomorrow}</span>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
