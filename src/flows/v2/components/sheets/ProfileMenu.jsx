import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import { STRINGS } from '../../strings/hi';
import { Store, Receipt, LogOut, Smartphone } from 'lucide-react';

export default function ProfileMenu({
  isOpen,
  onClose,
  onEditShop,
  onOpenBilling,
  onTriggerLogout,
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="प्रोफ़ाइल व सेटिंग्स"
    >
      <div className="flex flex-col gap-2 py-1">
        <button
          type="button"
          onClick={() => {
            onClose();
            onEditShop();
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:bg-neutral-50 flex items-center gap-3 text-[14.5px] font-semibold text-[#2B2437] active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F7F7F4] flex items-center justify-center text-[#E39026]">
            <Store className="w-5 h-5" />
          </div>
          <span>{STRINGS.dashboard.profileMenuShop}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenBilling();
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:bg-neutral-50 flex items-center gap-3 text-[14.5px] font-semibold text-[#2B2437] active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F7F7F4] flex items-center justify-center text-[#E39026]">
            <Receipt className="w-5 h-5" />
          </div>
          <span>{STRINGS.dashboard.profileMenuBilling}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = '/';
          }}
          className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:bg-neutral-50 flex items-center gap-3 text-[14.5px] font-semibold text-[#2B2437] active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-[#F7F7F4] flex items-center justify-center text-[#4A4358]">
            <Smartphone className="w-5 h-5" />
          </div>
          <span>मुख्य ऐप पर वापस जाएँ</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onTriggerLogout();
          }}
          className="w-full p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] hover:bg-red-100/70 flex items-center gap-3 text-[14.5px] font-semibold text-[#DC2626] active:scale-[0.98] transition-all mt-2"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#DC2626]">
            <LogOut className="w-5 h-5" />
          </div>
          <span>{STRINGS.dashboard.profileMenuLogout}</span>
        </button>
      </div>
    </BottomSheet>
  );
}
