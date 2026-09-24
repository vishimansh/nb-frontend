import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseCircle, TickCircle, Bag2, Coffee, Heart, Teacher, Car, Buildings, Cpu } from 'iconsax-react';

export const BUSINESS_CATEGORIES = [
  { id: 'retail', label: 'दुकान व परिधान', subtitle: 'कपड़े, जूते, आभूषण एवं दैनिक सामान की दुकानें', icon: Bag2 },
  { id: 'food', label: 'रेस्तरां एवं खान-पान', subtitle: 'होटल, कैफे, बेकरी, मिठाई एवं फास्ट फूड', icon: Coffee },
  { id: 'health', label: 'स्वास्थ्य एवं चिकित्सा', subtitle: 'क्लिनिक, अस्पताल, दवाइयां, पैथोलॉजी एवं योग', icon: Heart },
  { id: 'education', label: 'शिक्षा एवं कोचिंग', subtitle: 'स्कूल, कॉलेज, कोचिंग क्लासेस एवं ट्यूशन सेंटर', icon: Teacher },
  { id: 'auto', label: 'ऑटोमोबाइल एवं वर्कशॉप', subtitle: 'वाहन शोरूम, सर्विस सेंटर एवं स्पेयर पार्ट्स', icon: Car },
  { id: 'realestate', label: 'रियल एस्टेट एवं निर्माण', subtitle: 'प्रॉपर्टी, प्लॉट, मकान, बिल्डर्स एवं इंटीरियर', icon: Buildings },
  { id: 'electronics', label: 'इलेक्ट्रॉनिक्स एवं उपकरण', subtitle: 'मोबाइल, टीवी, कंप्यूटर एवं घरेलू इलेक्ट्रॉनिक्स', icon: Cpu },
];

export default function BusinessCategorySheet({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
        {/* Backdrop Scrim */}
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
          className="relative w-full max-w-[402px] bg-white rounded-t-[28px] z-50 flex flex-col shadow-2xl overflow-hidden border-t border-[#E5E7EB] max-h-[82%]"
        >
          {/* Header */}
          <div className="px-5 pt-3 pb-3 border-b border-[#F1F3F5] flex items-center justify-between bg-white relative shrink-0">
            {/* Centered Drag Handle */}
            <div className="w-10 h-1 bg-[#D1D5DB] rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />

            <div className="mt-2">
              <h2 className="text-[17px] font-bold text-[#2B2437] leading-normal pt-[1px]">
                बिज़नेस की कैटेगरी चुनें
              </h2>
              <p className="text-[12px] text-[#6B7280]">
                अपनी दुकान या बिज़नेस की कैटेगरी चुनें
              </p>
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

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-none">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.label || selectedCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.label);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-[16px] border flex items-center justify-between transition-all cursor-pointer text-left active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#FFF9EE] border-[#E39026] shadow-xs'
                      : 'bg-white border-[#E5E7EB] hover:border-[#2B2437]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2">
                    <div
                      className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#E39026] text-white'
                          : 'bg-[#F7F7F4] text-[#2B2437]'
                      }`}
                    >
                      <Icon size={20} variant={isSelected ? 'Bold' : 'Linear'} />
                    </div>
                    <div>
                      <span className="text-[15px] font-bold text-[#2B2437] block leading-tight pt-[1px]">
                        {cat.label}
                      </span>
                      <span className="text-[11.5px] text-[#6B7280] font-medium leading-snug mt-0.5 block">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <TickCircle size={22} color="#E39026" variant="Bold" className="shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
