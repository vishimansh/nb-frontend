import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import { STRINGS } from '../../strings/hi';

export default function GstInfoSheet({ isOpen, onClose }) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.gstInfoSheet.title}
    >
      <div className="py-2 text-[15px] text-[#4A4358] leading-relaxed">
        <p>{STRINGS.gstInfoSheet.body}</p>
      </div>
    </BottomSheet>
  );
}
