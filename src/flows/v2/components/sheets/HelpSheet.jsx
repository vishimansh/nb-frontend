import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { openWhatsAppSupport } from '../../utils/whatsapp';
import { STRINGS } from '../../strings/hi';
import { MessageCircle } from 'lucide-react';

export default function HelpSheet({ isOpen, onClose }) {
  const handleOpenWhatsApp = () => {
    openWhatsAppSupport();
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.helpSheet.title}
      footer={
        <Button onClick={handleOpenWhatsApp} variant="amber">
          <MessageCircle className="w-5 h-5 text-white" />
          <span>{STRINGS.helpSheet.openWhatsapp}</span>
        </Button>
      }
    >
      <div className="py-2 flex flex-col gap-3 text-center">
        <p className="text-[14.5px] text-[#4A4358] leading-relaxed">
          {STRINGS.helpSheet.body}
        </p>
      </div>
    </BottomSheet>
  );
}
