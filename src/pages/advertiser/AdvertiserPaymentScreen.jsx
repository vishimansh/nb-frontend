import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft2,
  ShieldSecurity,
  TickCircle,
  Mobile,
  ArrowRight,
  Card,
} from 'iconsax-react';
import { useAdvertiser } from '../../context/AdvertiserContext';

const UPI_APPS = [
  {
    id: 'gpay',
    name: 'गूगल पे',
  },
  {
    id: 'phonepe',
    name: 'फ़ोनपे',
  },
  {
    id: 'paytm',
    name: 'पेटीएम',
  },
  {
    id: 'bhim',
    name: 'भीम यूपीआई',
  },
];

export default function AdvertiserPaymentScreen() {
  const navigate = useNavigate();
  const { draftCampaign, commitCampaign } = useAdvertiser();

  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [vpaId, setVpaId] = useState('shopkeeper@upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  const subtotal = (draftCampaign.dailyBudget || 300) * (draftCampaign.durationDays || 7);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const cmp = commitCampaign();
      setIsProcessing(false);
      setCreatedCampaign(cmp);
      setIsSuccess(true);
    }, 1200);
  };

  const handleFinish = () => {
    navigate('/advertise/dashboard');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none relative">
      {/* Header */}
      <div className="px-4 pt-[56px] pb-3 flex items-center justify-between shrink-0 bg-[#F7F7F4]">
        <button
          type="button"
          onClick={() => navigate('/advertise/review')}
          className="w-[46px] h-[46px] rounded-[14px] bg-white border border-[#D1D5DB] flex items-center justify-center text-[#2B2437] shadow-2xs cursor-pointer active:scale-95 transition-transform"
        >
          <ArrowLeft2 size={20} color="#2B2437" />
        </button>
        <h1 className="text-[18px] font-bold text-[#2B2437]">पेमेंट करें</h1>
        <div className="w-[46px]" />
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-4">
          {/* Top Card: कुल पेमेंट राशि */}
          <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB] shadow-2xs text-center space-y-2">
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center mx-auto shadow-2xs">
              <Card size={24} color="#E39026" variant="Bold" />
            </div>

            <div>
              <span className="text-[12px] font-semibold tracking-wider text-[#6B7280] uppercase block">
                कुल पेमेंट राशि
              </span>
              <span className="text-[34px] font-black text-[#2B2437] leading-tight block mt-0.5">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-[#2B2437] pt-1">
              <TickCircle size={16} color="#2B2437" variant="Bold" />
              <span>100% सुरक्षित पेमेंट</span>
            </div>
          </div>

          {/* Itemized Tax Breakdown Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-2.5">
            <span className="text-[13px] font-bold text-[#2B2437] block">
              बिल का हिसाब (Bill Details)
            </span>
            <div className="space-y-1.5 text-[12.5px]">
              <div className="flex justify-between text-[#4B5563]">
                <span>विज्ञापन बजट (₹{draftCampaign.dailyBudget || 300} × {draftCampaign.durationDays || 7} दिन)</span>
                <span className="font-semibold text-[#2B2437] font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#4B5563]">
                <span>18% GST</span>
                <span className="font-semibold text-[#2B2437] font-mono">+ ₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between font-bold text-[14px] text-[#2B2437]">
                <span>कुल राशि</span>
                <span className="text-[#E39026] font-black font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11.5px] text-[#6B7280] font-normal pt-1">
              * पेमेंट के बाद GST इनवॉइस आपके अकाउंट में मिल जाएगी।
            </p>
          </div>

          {/* UPI App Selection */}
          <div className="space-y-2.5">
            <span className="text-[13px] font-bold text-[#2B2437] block pl-1">
              UPI ऐप चुनें
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {UPI_APPS.map((app) => {
                const isSelected = selectedUpiApp === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedUpiApp(app.id)}
                    className={`p-3.5 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                      isSelected
                        ? 'border-[#2B2437] bg-white ring-1 ring-[#2B2437]'
                        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                    }`}
                  >
                    <span className="text-[14px] font-bold text-[#2B2437]">
                      {app.name}
                    </span>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#2B2437] bg-[#2B2437] text-white'
                          : 'border-[#D1D5DB] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VPA / UPI ID Input */}
          <div className="space-y-2">
            <span className="text-[13px] font-bold text-[#2B2437] block pl-1">
              या UPI आईडी डालें
            </span>

            <div className="h-[50px] bg-white rounded-[14px] border border-[#D1D5DB] flex items-center px-3.5 shadow-2xs focus-within:border-[#2B2437] transition-colors">
              <Mobile size={18} color="#6B7280" className="mr-2.5 shrink-0" />
              <input
                type="text"
                value={vpaId}
                onChange={(e) => setVpaId(e.target.value)}
                placeholder="उदा. mobile@upi"
                className="w-full text-[14px] font-medium text-[#2B2437] outline-none"
              />
            </div>
          </div>

          {/* Security footnote */}
          <div className="bg-[#FFF9EE] border border-[#FDE68A] rounded-[16px] p-3 flex items-start gap-2.5">
            <ShieldSecurity size={18} color="#E39026" variant="Bold" className="shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#2B2437] font-medium leading-relaxed">
              आपका पेमेंट 100% सुरक्षित है। सभी ट्रांजेक्शन सुरक्षित एन्क्रिप्शन के साथ होते हैं।
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>पेमेंट हो रहा है...</span>
              </div>
            ) : (
              <>
                <Card size={20} color="#FFFFFF" variant="Bold" />
                <span>₹{grandTotal.toLocaleString('en-IN')} पेमेंट करें</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[24px] p-6 text-center max-w-[340px] w-full shadow-2xl space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center mx-auto text-[#E39026]">
                <TickCircle size={36} color="#E39026" variant="Bold" />
              </div>

              <div>
                <h3 className="text-[20px] font-bold text-[#2B2437] leading-tight">
                  पेमेंट सफल रहा!
                </h3>
                <p className="text-[13px] text-[#6B7280] font-medium mt-1 leading-snug">
                  आपका विज्ञापन शुरू हो गया है।
                </p>
              </div>

              <div className="bg-[#F7F7F4] rounded-[16px] p-3.5 text-left space-y-1.5 text-[12.5px] border border-[#E5E7EB]">
                <div className="flex justify-between text-[#6B7280]">
                  <span>पेमेंट राशि:</span>
                  <span className="font-bold text-[#2B2437]">₹{grandTotal}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>विज्ञापन स्थिति:</span>
                  <span className="font-bold text-[#2B2437]">लाइव (Active)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full h-[50px] rounded-[16px] bg-[#2B2437] text-white font-medium text-[16px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#3D334E] transition-all"
              >
                <span>मेरे विज्ञापन देखें</span>
                <ArrowRight size={18} color="#FFFFFF" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
