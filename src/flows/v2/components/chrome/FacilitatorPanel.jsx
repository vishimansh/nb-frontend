import React from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { useAdvertiserV2 } from '../../context/AdvertiserV2Context';
import { generateSampleImage } from '../../utils/imageTools';
import { downloadEventLog, clearEventLog } from '../../utils/track';
import { REJECTION_REASONS } from '../../data/rejectionReasons';
import { SCREENS } from '../../router/screens';
import { Download, RefreshCw, Sparkles, Trash2 } from 'lucide-react';

export default function FacilitatorPanel({ isOpen, onClose }) {
  const {
    state,
    navigateTo,
    updateAuth,
    updateShop,
    updateDraft,
    setIdentity,
    resetDraft,
    updateSim,
    resetAll,
  } = useAdvertiserV2();

  const sim = state.sim || {};

  const handleFillDemoData = () => {
    // Fill phone and verified status
    updateAuth({ phone: '9876543210', otpVerified: true });

    // Fill shop profile
    updateShop({
      name: 'शर्मा स्वीट्स',
      categoryId: 'restaurant',
      pincode: '452001',
      cityId: 'indore',
      city: 'इंदौर',
      state: 'मध्य प्रदेश',
      address: 'विजय नगर मेन रोड',
      ownerName: 'राजेश शर्मा',
      email: 'sharma@sweets.com',
      pin: { lat: 22.72, lng: 75.86 },
    });

    // Fill identity
    setIdentity({
      method: 'gst',
      valueMasked: '23AAAAA1234A1Z5',
      verified: true,
      verifiedAt: Date.now(),
    });

    // Fill draft
    const sampleImg = generateSampleImage('शर्मा स्वीट्स', 'दिवाली स्पेशल मिठाई');
    updateDraft('goal', 'engagement');
    updateDraft('ctaKey', 'whatsapp_us');
    updateDraft('format', 'feed_card_ad');
    updateDraft('headline', 'शर्मा स्वीट्स · दिवाली की मिठाई');
    updateDraft('description', 'शुद्ध घी की ताज़ा मिठाइयाँ और नमकीन. स्पेशल दिवाली ऑफ़र.');
    updateDraft('contactValue', '9876543210');
    updateDraft('media', { images: [sampleImg], video: null });
    updateDraft('area', { radiusKm: 10, manualCityIds: ['indore'], excludedCityIds: [] });
    updateDraft('audience', { gender: 'all', ages: ['18-27', '28-43', '44-59', '60+'] });
    updateDraft('budget', {
      packageId: 'standard',
      dailyAmount: 250,
      days: 7,
      startMode: 'after_review',
      startDate: null,
    });
  };

  const handleJumpToScreen = (screenId) => {
    // If screen requires auth or shop, ensure demo data is filled
    if (screenId !== 'intro' && screenId !== 'login') {
      if (!state.auth?.otpVerified) {
        handleFillDemoData();
      }
    }
    navigateTo(screenId);
    onClose();
  };

  const handleResetSession = () => {
    resetAll();
    clearEventLog();
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="फेसिलिटेटर पैनल (Simulation & Testing)"
      subtitle="परीक्षक एवं शोधकर्ता नियंत्रण"
    >
      <div className="flex flex-col gap-5 py-2 text-[14px] text-[#2B2437] select-none">
        {/* Quick Demo Data & Reset Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="amber"
            onClick={handleFillDemoData}
            className="text-[13px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>डेमो डेटा भरें</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              resetDraft();
              onClose();
            }}
            className="text-[13px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ड्राफ़्ट साफ़ करें</span>
          </Button>
        </div>

        {/* Jump to screen */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[13px] text-[#4A4358]">
            सीधे स्क्रीन पर जाएँ (Jump to Screen):
          </label>
          <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#F8F8F4] rounded-xl border border-[#E5E7EB]">
            {Object.keys(SCREENS).map((sId) => (
              <button
                key={sId}
                type="button"
                onClick={() => handleJumpToScreen(sId)}
                className={`py-1.5 px-2 rounded-lg text-[12px] font-semibold transition-all text-center truncate ${
                  state.nav?.current === sId
                    ? 'bg-[#2B2437] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] hover:bg-neutral-100 text-[#2B2437]'
                }`}
              >
                {sId}
              </button>
            ))}
          </div>
        </div>

        {/* Review Mode Control */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[13px] text-[#4A4358]">
            रिव्यू मोड (Review Mode):
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['auto_approve', 'reject_once', 'hold'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateSim({ reviewMode: mode })}
                className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all text-center ${
                  sim.reviewMode === mode
                    ? 'bg-[#2B2437] text-white border-[#2B2437]'
                    : 'bg-white border-[#E5E7EB] text-[#4A4358]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {sim.reviewMode === 'reject_once' && (
            <select
              value={sim.rejectReasonId || 'unprovable_claim'}
              onChange={(e) => updateSim({ rejectReasonId: e.target.value })}
              className="w-full h-9 rounded-xl px-2 text-[12px] bg-white border border-[#E5E7EB] mt-1 text-[#2B2437]"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.text}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Payment Outcome Control */}
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[13px] text-[#4A4358]">
            पेमेंट परिणाम (Payment Outcome):
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {['success', 'pending_then_success', 'failed', 'failed_once'].map((outcome) => (
              <button
                key={outcome}
                type="button"
                onClick={() => updateSim({ paymentOutcome: outcome })}
                className={`py-1.5 px-2 rounded-xl text-[12px] font-semibold border transition-all text-center ${
                  sim.paymentOutcome === outcome
                    ? 'bg-[#2B2437] text-white border-[#2B2437]'
                    : 'bg-white border-[#E5E7EB] text-[#4A4358]'
                }`}
              >
                {outcome}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Flags */}
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F8F8F4] border border-[#E5E7EB]">
          <label className="flex items-center justify-between text-[13px] cursor-pointer">
            <span>Upload fails simulation</span>
            <input
              type="checkbox"
              checked={!!sim.uploadFails}
              onChange={(e) => updateSim({ uploadFails: e.target.checked })}
              className="w-4 h-4 accent-[#E39026]"
            />
          </label>

          <label className="flex items-center justify-between text-[13px] cursor-pointer">
            <span>Sample data progression (growth engine)</span>
            <input
              type="checkbox"
              checked={!!sim.sampleData}
              onChange={(e) => updateSim({ sampleData: e.target.checked })}
              className="w-4 h-4 accent-[#E39026]"
            />
          </label>

          <label className="flex items-center justify-between text-[13px] cursor-pointer">
            <span>Show placeholder notes ("अनुमान", etc.)</span>
            <input
              type="checkbox"
              checked={!!sim.showPlaceholderNotes}
              onChange={(e) => updateSim({ showPlaceholderNotes: e.target.checked })}
              className="w-4 h-4 accent-[#E39026]"
            />
          </label>
        </div>

        {/* Hints */}
        <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] text-[12px] flex flex-col gap-1">
          <div>
            <strong>OTP Hint:</strong> कोई भी 6 अंक सही हैं, <code>000000</code> गलत है.
          </div>
          <div>
            <strong>Identity Hint:</strong> <code>AAAAA</code> से शुरू होने वाला नंबर फेल होगा.
          </div>
        </div>

        {/* Event Logs & Session Reset */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E7EB]">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadEventLog}
            className="text-[13px]"
          >
            <Download className="w-4 h-4" />
            <span>इवेंट लॉग डाउनलोड करें (JSON)</span>
          </Button>

          <Button
            size="sm"
            onClick={handleResetSession}
            className="bg-[#DC2626] text-white hover:bg-red-700 text-[13px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>सेशन पूरी तरह रीसेट करें (Reset All)</span>
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
