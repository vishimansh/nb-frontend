import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add, Eye, Mouse, TrendUp, MoneyChange, Shop, Edit2, Logout, Timer1 } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import BudgetEditSheet from '../../components/advertiser/BudgetEditSheet';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserDashboardScreen() {
  const navigate = useNavigate();
  const {
    campaigns,
    toggleCampaignStatus,
    approveCampaign,
    updateCampaignBudget,
    resetDraftCampaign,
    isBusinessProfileSaved,
    businessProfile,
    advertiserAuth,
    logoutAdvertiser,
  } = useAdvertiser();

  const [activeBudgetEditCampaign, setActiveBudgetEditCampaign] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Dynamic ticking clock for smooth 5-second countdown
  useEffect(() => {
    const hasPending = campaigns.some((c) => c.status === 'pending_review');
    if (!hasPending) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, [campaigns]);

  // Automatically transition pending campaigns to 'live' exactly 5 seconds after posting
  useEffect(() => {
    campaigns.forEach((cmp) => {
      if (cmp.status === 'pending_review') {
        const createdAt = cmp.createdAt || (now - 5000);
        const elapsed = now - createdAt;
        if (elapsed >= 5000) {
          approveCampaign(cmp.id);
        }
      }
    });
  }, [campaigns, now, approveCampaign]);

  const handleStartNewCampaign = () => {
    resetDraftCampaign();
    navigate('/advertise/goal');
  };

  const handleConfirmLogout = () => {
    logoutAdvertiser();
    setShowLogoutModal(false);
    navigate('/menu');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      {/* Header */}
      <AdvertiserHeader
        title="ऐड्स डैशबोर्ड"
        onBack={() => navigate('/menu')}
        rightAction={
          <button
            type="button"
            onClick={handleStartNewCampaign}
            className="h-10 px-3.5 rounded-[12px] bg-[#2B2437] text-white text-[13px] font-medium flex items-center gap-1 shadow-xs hover:bg-[#3D334E] active:scale-95 transition-all cursor-pointer"
          >
            <Add size={16} color="#FFFFFF" />
            <span>नया ऐड</span>
          </button>
        }
      />

      <div className="p-4 space-y-4 flex-1">
        {/* Business Profile Top Card */}
        {isBusinessProfileSaved && businessProfile?.businessName && (
          <div className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#2B2437] text-white flex items-center justify-center font-bold text-[14px] overflow-hidden shrink-0 shadow-xs">
                {businessProfile.businessLogoUrl ? (
                  <img src={businessProfile.businessLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>{businessProfile.businessName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight truncate">
                  {businessProfile.businessName}
                </h2>
                <span className="text-[12.5px] text-[#6B7280] font-normal block mt-0.5 truncate">
                  {businessProfile.storeAddress ? `${businessProfile.storeAddress} • ` : ''}
                  {businessProfile.hasGstin && businessProfile.gstin ? `GST: ${businessProfile.gstin}` : 'वेरिफाइड'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => navigate('/advertise/business-profile', { state: { fromDashboard: true } })}
                className="h-8.5 px-3 rounded-[10px] bg-[#F7F7F4] border border-[#E5E7EB] text-[#2B2437] text-[12.5px] font-medium flex items-center gap-1 hover:bg-[#EBECEF] active:scale-95 transition-all cursor-pointer"
                title="प्रोफ़ाइल एडिट करें"
              >
                <Edit2 size={13} color="#2B2437" />
                <span>एडिट</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="w-8.5 h-8.5 rounded-[10px] bg-[#F7F7F4] border border-[#E5E7EB] text-[#DC2626] flex items-center justify-center hover:bg-[#FEE2E2] active:scale-95 transition-all cursor-pointer"
                title="लॉगआउट"
              >
                <Logout size={14} color="#DC2626" />
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {campaigns.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mx-auto shadow-2xs">
              <Shop size={32} color="#E39026" variant="Bold" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-bold text-[#2B2437]">
                कोई ऐक्टिव ऐड नहीं है
              </h3>
              <p className="text-[13.5px] text-[#6B7280] font-normal leading-relaxed max-w-[270px] mx-auto">
                नवभारत पर ऐड चलाकर अपने शहर के ग्राहकों तक सीधे पहुंचें।
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartNewCampaign}
              className="w-full h-[48px] rounded-[14px] bg-[#2B2437] text-white font-medium text-[15px] shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-[#3D334E]"
            >
              + नया ऐड बनाएं
            </button>
          </div>
        ) : (
          campaigns.map((cmp) => {
            const isPending = cmp.status === 'pending_review';
            const isLive = cmp.status === 'live';
            const isPaused = cmp.status === 'paused';

            const createdAt = cmp.createdAt || now;
            const elapsed = Math.max(0, now - createdAt);
            const remainingSeconds = Math.max(0, Math.ceil((5000 - elapsed) / 1000));
            const progressPercent = Math.min(100, Math.max(0, (elapsed / 5000) * 100));

            return (
              <div
                key={cmp.id}
                className="bg-white rounded-[20px] border border-[#E5E7EB] p-4 shadow-sm space-y-4"
              >
                {/* Top Row: Business Name + Status Toggle */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-[17.5px] font-bold text-[#2B2437] leading-tight truncate">
                      {cmp.businessName}
                    </h3>
                    <span className="text-[12.5px] text-[#6B7280] font-normal mt-0.5 block truncate">
                      {cmp.businessCategory ? `${cmp.businessCategory} • ` : ''}₹{cmp.dailyBudget}/दिन
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isPending ? (
                    <div className="h-8 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 bg-[#FFF9EE] text-[#D97706] border border-[#FDE68A] shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#E39026] animate-ping" />
                      <span>रिव्यू जारी ({remainingSeconds}s)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleCampaignStatus(cmp.id)}
                      title="स्थिति बदलें"
                      className={`h-8 px-3.5 rounded-full text-[12.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isLive
                          ? 'bg-[#2B2437] text-white shadow-xs hover:bg-[#3D334E]'
                          : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isLive
                            ? 'bg-[#10B981] animate-pulse'
                            : 'bg-[#9CA3AF]'
                        }`}
                      />
                      <span>{isLive ? 'लाइव' : 'पॉज्ड'}</span>
                    </button>
                  )}
                </div>

                {/* State 1: If Pending Review */}
                {isPending && (
                  <div className="bg-[#FFFBF0] border border-[#FDE68A] rounded-[16px] p-3.5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8.5 h-8.5 rounded-full bg-[#FDE68A]/60 flex items-center justify-center text-[#D97706] shrink-0">
                          <Timer1 size={18} color="#D97706" variant="Bold" />
                        </div>
                        <div>
                          <h4 className="text-[13.5px] font-bold text-[#2B2437] leading-tight">
                            ऐड रिव्यू हो रहा है
                          </h4>
                          <p className="text-[12px] text-[#92400E] font-medium mt-0.5">
                            {remainingSeconds > 0 ? `${remainingSeconds}s में लाइव होगा...` : 'सत्यापित हो रहा है...'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[13.5px] font-black text-[#D97706] font-mono px-2.5 py-0.5 rounded-lg bg-white/80 border border-[#FDE68A]">
                        00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#FDE68A]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-2 gap-2 text-[12px] bg-white/80 rounded-[12px] p-2.5 border border-[#FDE68A]/60">
                      <div>
                        <span className="text-[#6B7280] block text-[11px] font-medium">अनुमानित रीच</span>
                        <span className="font-bold text-[#2B2437] text-[13.5px] font-mono">
                          ~{cmp.impressions?.toLocaleString('en-IN') || '7,631'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] block text-[11px] font-medium">बजट और अवधि</span>
                        <span className="font-bold text-[#2B2437] text-[13.5px]">
                          ₹{cmp.dailyBudget}/दिन ({cmp.durationDays || 7} दिन)
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={() => approveCampaign(cmp.id)}
                        className="text-[12px] text-[#B45309] font-bold underline cursor-pointer hover:text-[#78350F]"
                      >
                        तुरंत लाइव करें →
                      </button>
                    </div>
                  </div>
                )}

                {/* State 2 & 3: Live or Paused Metrics */}
                {!isPending && (
                  <div className={`grid grid-cols-2 gap-2.5 ${isPaused ? 'opacity-70' : ''}`}>
                    {/* Views */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[12.5px] font-medium">
                        <Eye size={15} color="#6B7280" />
                        <span>Views (इम्प्रेशन्स)</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#2B2437] mt-1 font-mono tracking-tight">
                        {cmp.impressions?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Clicks */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[12.5px] font-medium">
                        <Mouse size={15} color="#6B7280" />
                        <span>Clicks (क्लिक्स)</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#2B2437] mt-1 font-mono tracking-tight">
                        {cmp.clicks?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* CTR */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[12.5px] font-medium">
                        <TrendUp size={15} color="#6B7280" />
                        <span>CTR (क्लिक दर)</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#E39026] mt-1 font-mono tracking-tight">
                        {cmp.ctr}%
                      </div>
                    </div>

                    {/* Spend */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[12.5px] font-medium">
                        <MoneyChange size={15} color="#6B7280" />
                        <span>कुल खर्च</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#2B2437] mt-1 font-mono tracking-tight">
                        ₹{Number(cmp.totalSpend).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/advertise/analytics', { state: { campaignId: cmp.id } })}
                    className="h-11 rounded-[14px] bg-[#2B2437] text-white text-[13.5px] font-medium shadow-xs flex items-center justify-center hover:bg-[#3D334E] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    एनालिटिक्स देखें
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBudgetEditCampaign(cmp)}
                    className="h-11 rounded-[14px] bg-white border border-[#2B2437] text-[#2B2437] text-[13.5px] font-medium shadow-xs flex items-center justify-center hover:bg-[#2B2437]/5 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    बजट बदलें
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Account Info Footer */}
      <div className="px-4 py-3 text-center">
        <p className="text-[11.5px] text-[#9CA3AF]">
          अकाउंट: <span className="font-mono text-[#6B7280]">+91 {advertiserAuth?.phone || businessProfile?.phone || '—'}</span>
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-[22px] p-5 max-w-[300px] w-full shadow-2xl text-center space-y-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
              <Logout size={22} color="#DC2626" variant="Bold" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#2B2437]">
                लॉगआउट करना चाहते हैं?
              </h3>
              <p className="text-[12.5px] text-[#6B7280] font-normal mt-1 leading-relaxed">
                दोबारा लॉगिन के लिए OTP की ज़रूरत होगी।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-9.5 rounded-[11px] bg-[#F3F4F6] text-[#4B5563] text-[12.5px] font-medium hover:bg-[#E5E7EB] active:scale-95 transition-all cursor-pointer"
              >
                कैंसिल
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="h-9.5 rounded-[11px] bg-[#DC2626] text-white text-[12.5px] font-medium hover:bg-[#B91C1C] active:scale-95 transition-all cursor-pointer"
              >
                लॉगआउट
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Edit Bottom Sheet Modal */}
      <BudgetEditSheet
        isOpen={Boolean(activeBudgetEditCampaign)}
        campaign={activeBudgetEditCampaign}
        onClose={() => setActiveBudgetEditCampaign(null)}
        onSaveBudget={(id, newBudget) => {
          updateCampaignBudget(id, newBudget);
        }}
      />
    </div>
  );
}
