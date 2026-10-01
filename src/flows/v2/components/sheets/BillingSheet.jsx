import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import { downloadInvoice } from '../../utils/invoice';
import { formatIN } from '../../utils/formatIN';
import { STRINGS } from '../../strings/hi';
import { Download, FileText } from 'lucide-react';

export default function BillingSheet({
  isOpen,
  onClose,
  campaigns = [],
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.billingSheet.title}
    >
      <div className="flex flex-col gap-3 py-1">
        {campaigns.length === 0 ? (
          <div className="py-8 text-center text-[#6B7280] text-[14px]">
            {STRINGS.billingSheet.noInvoices}
          </div>
        ) : (
          campaigns.map((camp) => {
            const dateStr = new Date(camp.createdAt).toLocaleDateString('hi-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={camp.id}
                className="p-3.5 rounded-2xl bg-[#F8F8F4] border border-[#E5E7EB] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2B2437]">
                    <FileText className="w-5 h-5 text-[#E39026]" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#2B2437]">
                      {camp.orderId}
                    </h4>
                    <span className="text-[12px] text-[#6B7280]">
                      {dateStr} · ₹{formatIN(camp.money?.total)} (GST सहित)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => downloadInvoice(camp)}
                  className="h-9 px-3 rounded-xl bg-white border border-[#E5E7EB] text-[12.5px] font-semibold text-[#2B2437] flex items-center gap-1.5 hover:bg-neutral-50 active:scale-95 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#4A4358]" />
                  <span>डाउनलोड</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </BottomSheet>
  );
}
