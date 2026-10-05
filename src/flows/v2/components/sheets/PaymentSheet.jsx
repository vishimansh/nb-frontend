import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Spinner from '../ui/Spinner';
import CheckBurst from '../ui/CheckBurst';
import Button from '../ui/Button';
import { formatIN } from '../../utils/formatIN';
import { isValidUpi } from '../../utils/validators';
import { useAdvertiserV2 } from '../../context/AdvertiserV2Context';
import { track } from '../../utils/track';
import { STRINGS } from '../../strings/hi';
import { ChevronDown, AlertCircle, Lock } from 'lucide-react';

const UPI_APPS = [
  { id: 'gpay', name: 'गूगल पे', color: '#4285F4' },
  { id: 'phonepe', name: 'फ़ोनपे', color: '#5F259F' },
  { id: 'paytm', name: 'पेटीएम', color: '#00BAF2' },
  { id: 'bhim', name: 'भीम', color: '#00796B' },
];

export default function PaymentSheet({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess,
}) {
  const { state } = useAdvertiserV2();
  const sim = state.sim || {};

  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'pending' | 'failed' | 'success'
  const [selectedApp, setSelectedApp] = useState(null);
  const [showOtherUpi, setShowOtherUpi] = useState(false);
  const [upiInput, setUpiInput] = useState('');
  const [upiError, setUpiError] = useState(null);
  const [attemptsCount, setAttemptsCount] = useState(0);

  const timerRef = useRef(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle');
      setSelectedApp(null);
      setShowOtherUpi(false);
      setUpiInput('');
      setUpiError(null);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  const executeOutcome = (appName) => {
    const outcome = sim.paymentOutcome || 'success';
    const isRetry = attemptsCount > 0;

    if (outcome === 'failed') {
      setPaymentState('failed');
      track('payment_outcome', { state: 'failed', app: appName });
      return;
    }

    if (outcome === 'failed_once') {
      if (!isRetry) {
        setPaymentState('failed');
        setAttemptsCount((c) => c + 1);
        track('payment_outcome', { state: 'failed', app: appName });
        return;
      }
      // Retry succeeds
    }

    if (outcome === 'pending_then_success') {
      setPaymentState('pending');
      timerRef.current = setTimeout(() => {
        setPaymentState('success');
        track('payment_outcome', { state: 'success', app: appName });
        timerRef.current = setTimeout(() => {
          onPaymentSuccess();
        }, 1200);
      }, 3000);
      return;
    }

    // Default: success
    setPaymentState('success');
    track('payment_outcome', { state: 'success', app: appName });
    timerRef.current = setTimeout(() => {
      onPaymentSuccess();
    }, 1200);
  };

  const handleStartPayment = (app) => {
    setSelectedApp(app);
    setPaymentState('processing');
    track('payment_attempt', { method: app.id || 'custom_upi' });

    timerRef.current = setTimeout(() => {
      executeOutcome(app.name);
    }, 1500);
  };

  const handleCustomUpiPay = () => {
    if (!isValidUpi(upiInput)) {
      setUpiError(STRINGS.payment.upiInvalid);
      return;
    }
    setUpiError(null);
    handleStartPayment({ id: 'custom_upi', name: 'UPI' });
  };

  const isLocked = paymentState === 'processing' || paymentState === 'pending' || paymentState === 'success';

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={isLocked ? () => {} : onClose}
      title={STRINGS.payment.title}
    >
      <div className="flex flex-col items-center gap-4 py-1 select-none">
        {/* Total banner */}
        <div className="w-full text-center rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FDE9B8] border border-[#F6DFA8] py-3.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">भुगतान की राशि</span>
          <div className="text-[32px] leading-tight font-black text-[#2B2437] tabular-nums">
            ₹{formatIN(totalAmount)}
          </div>
          <span className="text-[12px] font-medium text-[#78350F]">{STRINGS.payment.subGst}</span>
        </div>

        {/* 1. IDLE STATE: App buttons & other UPI */}
        {paymentState === 'idle' && (
          <div className="w-full flex flex-col gap-3.5">
            <span className="text-[12px] font-bold text-[#8C8C94] uppercase tracking-wider">
              अपना UPI ऐप चुनें
            </span>
            {/* 2x2 UPI App Grid */}
            <div className="grid grid-cols-2 gap-2.5 w-full -mt-1.5">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleStartPayment(app)}
                  className="h-[56px] rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#E39026] hover:shadow-md flex items-center justify-center gap-2 font-bold text-[15px] text-[#2B2437] shadow-xs active:scale-[0.97] transition-all"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: app.color }}
                  />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>

            {/* Other UPI ID expander */}
            <div className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F8F8F4] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOtherUpi((prev) => !prev)}
                className="w-full p-3.5 flex items-center justify-between text-[13.5px] font-semibold text-[#4A4358] active:bg-neutral-100"
              >
                <span>{STRINGS.payment.otherUpiTitle}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showOtherUpi ? 'rotate-180' : ''}`}
                />
              </button>

              {showOtherUpi && (
                <div className="p-3.5 pt-0 flex flex-col gap-2 border-t border-[#E5E7EB]/60">
                  <input
                    type="text"
                    value={upiInput}
                    onChange={(e) => {
                      setUpiInput(e.target.value.trim());
                      if (upiError) setUpiError(null);
                    }}
                    placeholder={STRINGS.payment.upiPlaceholder}
                    className="w-full h-[46px] rounded-xl px-3 bg-white border border-[#E5E7EB] text-[14px] text-[#2B2437] outline-none focus:border-[#2B2437]"
                  />
                  {upiError && (
                    <span className="text-[12px] text-[#DC2626]">{upiError}</span>
                  )}
                  <Button size="sm" onClick={handleCustomUpiPay}>
                    {STRINGS.payment.payUpiBtn}
                  </Button>
                </div>
              )}
            </div>

            {/* Safety Line */}
            <span className="flex items-center justify-center gap-1.5 text-[12px] text-[#6B7280] text-center">
              <Lock className="w-3 h-3 text-[#16A34A]" />
              {STRINGS.payment.safetyLine}
            </span>
          </div>
        )}

        {/* 2. PROCESSING STATE */}
        {paymentState === 'processing' && (
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <Spinner size="lg" />
            <div className="font-bold text-[17px] text-[#2B2437]">
              {STRINGS.payment.processingTitle}
            </div>
            <span className="text-[13px] text-[#6B7280]">
              {STRINGS.payment.processingSubtitle}
            </span>
          </div>
        )}

        {/* 3. PENDING STATE */}
        {paymentState === 'pending' && (
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <Spinner size="lg" />
            <div className="font-bold text-[17px] text-[#2B2437]">
              {STRINGS.payment.pendingTitle(selectedApp?.name || 'UPI ऐप')}
            </div>
            <span className="text-[13px] text-[#6B7280]">
              {STRINGS.payment.pendingSubtitle} (01:58)
            </span>
          </div>
        )}

        {/* 4. FAILED STATE */}
        {paymentState === 'failed' && (
          <div className="py-4 flex flex-col items-center gap-3 text-center w-full">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="font-bold text-[18px] text-[#DC2626]">
              {STRINGS.payment.failedTitle}
            </div>
            <p className="text-[13px] text-[#6B7280] max-w-[280px]">
              {STRINGS.payment.failedSubtitle}
            </p>
            <div className="flex flex-col gap-2 w-full pt-2">
              <Button onClick={() => handleStartPayment(selectedApp || UPI_APPS[0])}>
                {STRINGS.payment.retryBtn}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPaymentState('idle')}
              >
                {STRINGS.payment.pickAnotherAppBtn}
              </Button>
            </div>
          </div>
        )}

        {/* 5. SUCCESS STATE */}
        {paymentState === 'success' && (
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <CheckBurst size={64} />
            <div className="font-extrabold text-[20px] text-[#2B2437] mt-2">
              {STRINGS.payment.successTitle}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
