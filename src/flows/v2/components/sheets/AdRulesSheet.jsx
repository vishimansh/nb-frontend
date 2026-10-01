import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import { AD_RULES } from '../../data/adRules';
import { STRINGS } from '../../strings/hi';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

/**
 * AdRulesSheet: Guidelines for ads.
 * NOTE: This is draft copy for legal and operations to approve.
 */
export default function AdRulesSheet({ isOpen, onClose }) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.adRules.title}
    >
      <div className="flex flex-col gap-4 py-1 select-none">
        {/* 1. OK Items */}
        <div className="p-3.5 rounded-2xl bg-[#EEF8F2] border border-[#A7F3D0] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#2F8F5B] font-bold text-[14.5px]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{STRINGS.adRules.okSection}</span>
          </div>
          <ul className="list-disc list-inside text-[13px] text-[#2F8F5B]/90 space-y-1">
            {AD_RULES.ok.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 2. Watch Items */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#C97F1E] font-bold text-[14.5px]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{STRINGS.adRules.watchSection}</span>
          </div>
          <ul className="list-disc list-inside text-[13px] text-[#C97F1E]/90 space-y-1">
            {AD_RULES.watch.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 3. Banned Items */}
        <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#DC2626] font-bold text-[14.5px]">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{STRINGS.adRules.bannedSection}</span>
          </div>
          <ul className="list-disc list-inside text-[13px] text-[#DC2626]/90 space-y-1">
            {AD_RULES.banned.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Footer Note */}
        <p className="text-[12px] text-[#6B7280] text-center pt-2 border-t border-[#E5E7EB]">
          {STRINGS.adRules.footerNote}
        </p>
      </div>
    </BottomSheet>
  );
}
