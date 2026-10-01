import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { STRINGS } from '../../strings/hi';

export default function LogoutConfirm({
  isOpen,
  onClose,
  onConfirmLogout,
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={STRINGS.dashboard.logoutConfirmTitle}
      footer={
        <div className="flex gap-2.5">
          <Button variant="outline" onClick={onClose}>
            {STRINGS.common.cancel}
          </Button>
          <Button
            onClick={() => {
              onConfirmLogout();
              onClose();
            }}
            className="bg-[#DC2626] hover:bg-red-700 text-white"
          >
            {STRINGS.dashboard.logoutConfirmBtn}
          </Button>
        </div>
      }
    >
      <div className="py-2 text-[14.5px] text-[#6B7280]">
        लॉगआउट करने पर आपकी दुकान और पहचान की जानकारी सुरक्षित रहेगी.
      </div>
    </BottomSheet>
  );
}
