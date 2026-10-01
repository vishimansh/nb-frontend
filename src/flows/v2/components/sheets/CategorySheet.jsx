import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import { CATEGORIES } from '../../data/categories';
import { STRINGS } from '../../strings/hi';
import {
  ShoppingBag,
  Shirt,
  Tv,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Wrench,
  Sparkles,
  Smartphone,
  Scissors,
  Car,
  Sprout,
  Store,
  Check,
} from 'lucide-react';

const ICON_MAP = {
  ShoppingBag,
  Shirt,
  Tv,
  UtensilsCrossed,
  Stethoscope,
  GraduationCap,
  Wrench,
  Sparkles,
  Smartphone,
  Scissors,
  Car,
  Sprout,
  Store,
};

export default function CategorySheet({
  isOpen,
  onClose,
  selectedCategoryId,
  onSelectCategory,
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.shop.categorySheetTitle}
    >
      <div className="grid grid-cols-3 gap-2.5 py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          const IconComp = ICON_MAP[cat.icon] || Store;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.id);
                onClose();
              }}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all relative border ${
                isSelected
                  ? 'border-[#2B2437] border-2 bg-[#FFF9EE] shadow-xs'
                  : 'border-[#E5E7EB] bg-white hover:bg-neutral-50'
              } active:scale-95`}
            >
              {/* Selected check badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#2B2437] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-white text-[#E39026]' : 'bg-[#F7F7F4] text-[#4A4358]'
                }`}
              >
                <IconComp className="w-5 h-5" />
              </div>

              <span className="text-[13px] font-semibold text-[#2B2437] text-center leading-tight">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
