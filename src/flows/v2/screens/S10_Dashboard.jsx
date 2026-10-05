import React, { useState, useEffect } from 'react';
import V2Header from '../components/chrome/V2Header';
import ProfileMenu from '../components/sheets/ProfileMenu';
import LogoutConfirm from '../components/sheets/LogoutConfirm';
import EditBudgetSheet from '../components/sheets/EditBudgetSheet';
import BillingSheet from '../components/sheets/BillingSheet';
import PaymentSheet from '../components/sheets/PaymentSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { useToastV2 } from '../context/ToastV2Context';
import { formatIN } from '../utils/formatIN';
import { getFormatById } from '../data/formats';
import { getGoalById } from '../data/goals';
import { STRINGS } from '../strings/hi';
import {
  Add,
  Eye,
  Mouse,
  TrendUp,
  MoneyChange,
  Shop,
  Edit2,
  Logout,
  Timer1,
  Messages3,
} from 'iconsax-react';
import {
  Pencil,
  RotateCw,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

const EMPTY_CAMPAIGNS = [];

export default function S10_Dashboard({ onOpenFacilitator }) {
  const {
    state,
    resetDraft,
    loadDraftFromCampaign,
    toggleCampaignPause,
    setCampaignStatus,
    updateCampaignBudget,
    logout,
  } = useAdvertiserV2();
  const { navigateTo } = useFlowNav();
  const { showToast } = useToastV2();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showBillingSheet, setShowBillingSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  const [editingBudgetCampaign, setEditingBudgetCampaign] = useState(null);
  const [differencePaymentData, setDifferencePaymentData] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const shop = state.shop || {};
  const campaigns = state.campaigns || EMPTY_CAMPAIGNS;
  const identity = state.identity || {};
  const phone = state.auth?.phone || '9876543210';

  // Dynamic ticking clock for smooth 5-second countdown on in_review campaigns
  useEffect(() => {
    const hasPending = campaigns.some((c) => c.status === 'in_review');
    if (!hasPending) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, [campaigns]);

  // Automatically transition pending campaigns to 'live' exactly 5 seconds after creation
  useEffect(() => {
    campaigns.forEach((cmp) => {
      if (cmp.status === 'in_review') {
        const createdAt = cmp.createdAt || (now - 5000);
        const elapsed = now - createdAt;
        if (elapsed >= 5000) {
          setCampaignStatus(cmp.id, 'live');
        }
      }
    });
  }, [campaigns, now, setCampaignStatus]);

  const handleStartNewAd = () => {
    resetDraft();
    const isShopComplete = !!(shop.name && shop.categoryId && (shop.cityId || shop.city));
    if (!isShopComplete) {
      navigateTo('shop');
    } else {
      navigateTo('goal');
    }
  };

  const handleEditAd = (camp) => {
    loadDraftFromCampaign(camp.id);
    showToast(STRINGS.dashboard.adRecheckNotice);
    navigateTo('ad', { resubmitFor: camp.id });
  };

  const handleRerun = (camp) => {
    loadDraftFromCampaign(camp.id);
    navigateTo('review');
  };

  const handleFixAndResubmit = (camp) => {
    loadDraftFromCampaign(camp.id);
    navigateTo('ad', { resubmitFor: camp.id, focusField: camp.rejection?.field || 'headline' });
  };

  const handleSaveNewDaily = (campId, newDaily) => {
    updateCampaignBudget(campId, newDaily);
    showToast('नया बजट अपडेट हो गया');
  };

  const handleRequestPayDifference = (diffTotal, newDaily) => {
    setDifferencePaymentData({
      total: diffTotal,
      newDaily,
      campaignId: editingBudgetCampaign.id,
    });
    setEditingBudgetCampaign(null);
  };

  const handleDifferencePaymentSuccess = () => {
    if (differencePaymentData) {
      updateCampaignBudget(differencePaymentData.campaignId, differencePaymentData.newDaily);
      showToast('अतिरिक्त बजट का भुगतान सफल!');
    }
    setDifferencePaymentData(null);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={() => navigateTo('intro')}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
        rightAction={
          <button
            type="button"
            onClick={handleStartNewAd}
            className="h-8.5 px-3 rounded-xl bg-[#2B2437] text-white text-[12px] font-bold flex items-center gap-1 shadow-xs hover:bg-[#3D334E] active:scale-95 transition-all cursor-pointer"
          >
            <Add size={15} color="#FFFFFF" />
            <span>नया ऐड</span>
          </button>
        }
      />

      {/* Main Dashboard Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col gap-3 scrollbar-none">
        {/* Business Profile Top Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#2B2437] text-white flex items-center justify-center font-bold text-[14px] overflow-hidden shrink-0 shadow-xs">
              {shop.logoDataUrl ? (
                <img src={shop.logoDataUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{(shop.name || 'द').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-[#2B2437] leading-snug truncate">
                {shop.name || 'आपकी दुकान'}
              </h2>
              <span className="text-[11.5px] text-[#8C8C94] font-medium block mt-0.5 truncate leading-snug">
                {shop.address ? `${shop.address} • ` : ''}
                {shop.city || 'शहर'}
                {identity?.verified ? ' • वेरिफाइड ✓' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="h-8 px-2.5 rounded-lg bg-[#FAF9F6] border border-[#EDEDEA] text-[#2B2437] text-[11.5px] font-semibold flex items-center gap-1 hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer"
              title="प्रोफ़ाइल एडिट करें"
            >
              <Edit2 size={12} color="#2B2437" />
              <span>एडिट</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#EDEDEA] text-[#DC2626] flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
              title="लॉगआउट"
            >
              <Logout size={13} color="#DC2626" />
            </button>
          </div>
        </div>

        {/* Campaign List or Empty State */}
        {campaigns.length === 0 ? (
          /* Empty State */
          <div className="text-center py-10 bg-white rounded-2xl border border-[#EDEDEA] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] mx-auto shadow-2xs">
              <Shop size={28} color="#D97706" variant="Bold" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#2B2437]">
                कोई ऐक्टिव ऐड नहीं है
              </h3>
              <p className="text-[12px] text-[#8C8C94] font-medium leading-relaxed max-w-[270px] mx-auto">
                नवभारत पर विज्ञापन चलाकर अपने शहर के ग्राहकों तक सीधे पहुंचें।
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartNewAd}
              className="w-full h-[46px] rounded-xl bg-[#2B2437] text-white font-bold text-[14px] shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-[#3D334E]"
            >
              + नया विज्ञापन बनाएं
            </button>
          </div>
        ) : (
          /* List of Campaigns */
          <div className="flex flex-col gap-3">
            {campaigns.map((camp) => {
              const snapDraft = camp.snapshot?.draft || {};
              const headline = snapDraft.headline?.trim() || `विज्ञापन #${camp.id.slice(-4)}`;
              const formatObj = getFormatById(snapDraft.format);
              const goalObj = getGoalById(snapDraft.goal || 'engagement');
              const firstImg = snapDraft.media?.images?.[0]?.dataUrl;

              const isPending = camp.status === 'in_review';
              const isLive = camp.status === 'live';
              const isPaused = camp.status === 'paused';
              const isNeedsChanges = camp.status === 'needs_changes';

              const createdAt = camp.createdAt || now;
              const elapsed = Math.max(0, now - createdAt);
              const remainingSeconds = Math.max(0, Math.ceil((5000 - elapsed) / 1000));
              const progressPercent = Math.min(100, Math.max(0, (elapsed / 5000) * 100));

              const subtotal = camp.money?.subtotal || 1750;
              const spent = camp.metrics?.spent || (isLive ? Math.round(subtotal * 0.42) : 0);
              const spendPercentage = Math.min(100, Math.round((spent / subtotal) * 100));

              const impressionsCount = camp.metrics?.views || (isLive ? 2840 : 0);
              const clicksCount = camp.metrics?.clicks || (isLive ? 218 : 0);
              const ctrVal = camp.metrics?.ctr || (isLive ? '7.6' : '0.0');

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-[#EDEDEA] p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3"
                >
                  {/* Top Bar: Dual Badges (Goal + Format) */}
                  <div className="flex items-center justify-between gap-1.5 border-b border-[#F4F4F2] pb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                        goalObj.id === 'reach'
                          ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                          : goalObj.id === 'engagement'
                          ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                          : 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]'
                      }`}>
                        {goalObj.id === 'reach' ? '📢 पहुंच' : goalObj.id === 'engagement' ? '💬 कॉल व मैसेज' : '🔗 वेबसाइट'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FAF9F6] text-[#78350F] border border-[#EDEDEA]">
                        {formatObj.title}
                      </span>
                    </div>

                    <span className="text-[10.5px] font-mono text-[#9CA3AF]">
                      #{camp.id.slice(-4)}
                    </span>
                  </div>

                  {/* Top Row: Thumbnail + Headline + Status Toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 pr-1 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EDEDEA] overflow-hidden shrink-0 flex items-center justify-center">
                        {firstImg ? (
                          <img src={firstImg} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-[#A6A4A9]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14.5px] font-bold text-[#2B2437] leading-snug truncate">
                          {headline}
                        </h3>
                        <span className="text-[11.5px] text-[#8C8C94] font-medium mt-0.5 block truncate leading-snug">
                          {formatObj.title} • ₹{camp.money?.daily || 250}/दिन • {camp.money?.days || 7} दिन
                        </span>
                      </div>
                    </div>

                    {/* Status Toggle Indicator */}
                    {isPending ? (
                      <div className="h-7.5 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1 bg-[#FFF8E7] text-[#D97706] border border-[#F6DFA8] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-ping" />
                        <span>रिव्यू ({remainingSeconds}s)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleCampaignPause(camp.id)}
                        title="स्थिति बदलें"
                        className={`h-7.5 px-3 rounded-full text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                          isLive
                            ? 'bg-[#2B2437] text-white shadow-2xs hover:bg-[#3D334E]'
                            : 'bg-[#F4F4F2] text-[#6B7280] border border-[#EDEDEA] hover:bg-[#EBEBE8]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isLive ? 'bg-[#16A34A] animate-pulse' : 'bg-[#9CA3AF]'
                          }`}
                        />
                        <span>{isLive ? 'लाइव' : 'पॉज्ड'}</span>
                      </button>
                    )}
                  </div>

                  {/* 1. Pending Review State Card (Signature warm amber design) */}
                  {isPending && (
                    <div className="bg-[#FFF8E7] border border-[#F6DFA8] rounded-xl p-3 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#FDE68A]/60 flex items-center justify-center text-[#D97706] shrink-0">
                            <Timer1 size={16} color="#D97706" variant="Bold" />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-[#2B2437] leading-snug">
                              ऐड रिव्यू हो रहा है
                            </h4>
                            <p className="text-[11.5px] text-[#854D0E] font-medium leading-snug">
                              {remainingSeconds > 0
                                ? `${remainingSeconds}s में लाइव होगा...`
                                : 'सत्यापित हो रहा है...'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[12px] font-black text-[#D97706] font-mono px-2 py-0.5 rounded-md bg-white/80 border border-[#F6DFA8]">
                          00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full h-1.5 bg-[#FDE68A]/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {/* Summary Row */}
                      <div className="grid grid-cols-2 gap-2 text-[11.5px] bg-white/80 rounded-lg p-2 border border-[#F6DFA8]/60">
                        <div>
                          <span className="text-[#8C8C94] block text-[10.5px] font-medium">अनुमानित पाठक संख्या</span>
                          <span className="font-bold text-[#2B2437] text-[13px] font-mono">
                            ~7,631
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8C8C94] block text-[10.5px] font-medium">बजट और अवधि</span>
                          <span className="font-bold text-[#2B2437] text-[13px]">
                            ₹{camp.money?.daily || 250}/दिन ({camp.money?.days || 7} दिन)
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-0.5">
                        <button
                          type="button"
                          onClick={() => setCampaignStatus(camp.id, 'live')}
                          className="text-[11.5px] text-[#B45309] font-bold underline cursor-pointer hover:text-[#78350F]"
                        >
                          तुरंत लाइव करें →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Live or Paused Metrics: Goal-Calibrated 2x2 Grid */}
                  {!isPending && (
                    <div className={`grid grid-cols-2 gap-2 ${isPaused ? 'opacity-60' : ''}`}>
                      {/* Metric 1 (Hero Metric customized by Goal - Signature Warm Amber) */}
                      <div className="rounded-xl p-3 border bg-[#FFF8E7] border-[#F6DFA8]">
                        <div className="flex items-center gap-1.5 mb-1">
                          {goalObj.id === 'reach' ? (
                            <Eye size={13} color="#D97706" />
                          ) : goalObj.id === 'engagement' ? (
                            <Messages3 size={13} color="#D97706" />
                          ) : (
                            <Mouse size={13} color="#D97706" />
                          )}
                          <span className="text-[11px] font-bold leading-snug text-[#854D0E]">
                            {goalObj.id === 'reach'
                              ? 'कुल व्यूज'
                              : goalObj.id === 'engagement'
                              ? 'कॉल व मैसेज'
                              : 'वेबसाइट क्लिक'}
                          </span>
                        </div>
                        <div className="text-[20px] font-black font-mono tracking-tight leading-none text-[#854D0E]">
                          {goalObj.id === 'reach'
                            ? formatIN(impressionsCount)
                            : formatIN(clicksCount)}
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="bg-[#FAF9F6] rounded-xl p-3 border border-[#EDEDEA]">
                        <div className="flex items-center gap-1.5 text-[#8C8C94] mb-1">
                          <Eye size={13} color="#8C8C94" />
                          <span className="text-[11px] font-semibold leading-snug text-[#8C8C94]">
                            {goalObj.id === 'reach' ? 'पहुंचे पाठक' : 'कुल व्यूज'}
                          </span>
                        </div>
                        <div className="text-[20px] font-black text-[#2B2437] font-mono tracking-tight leading-none">
                          {goalObj.id === 'reach'
                            ? formatIN(Math.round(impressionsCount * 0.88))
                            : formatIN(impressionsCount)}
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="bg-[#FAF9F6] rounded-xl p-3 border border-[#EDEDEA]">
                        <div className="flex items-center gap-1.5 text-[#8C8C94] mb-1">
                          <TrendUp size={13} color="#8C8C94" />
                          <span className="text-[11px] font-semibold leading-snug text-[#8C8C94]">
                            {goalObj.id === 'reach'
                              ? 'औसत दर'
                              : goalObj.id === 'engagement'
                              ? 'पूछताछ दर'
                              : 'क्लिक दर'}
                          </span>
                        </div>
                        <div className="text-[20px] font-black text-[#D97706] font-mono tracking-tight leading-none">
                          {goalObj.id === 'reach'
                            ? `₹${impressionsCount > 0 ? ((spent / impressionsCount) * 1000).toFixed(1) : '3.6'}`
                            : `${ctrVal}%`}
                        </div>
                      </div>

                      {/* Spend */}
                      <div className="bg-[#FAF9F6] rounded-xl p-3 border border-[#EDEDEA]">
                        <div className="flex items-center gap-1.5 text-[#8C8C94] mb-1">
                          <MoneyChange size={13} color="#8C8C94" />
                          <span className="text-[11px] font-semibold leading-snug text-[#8C8C94]">कुल खर्च</span>
                        </div>
                        <div className="text-[20px] font-black text-[#2B2437] font-mono tracking-tight leading-none">
                          ₹{formatIN(spent)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Spend Progress Bar */}
                  {!isPending && (
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-semibold text-[#6B7280] leading-snug">{STRINGS.dashboard.spendLine(formatIN(spent), formatIN(subtotal))}</span>
                        <span className="text-[10.5px] font-bold text-[#2B2437] font-mono bg-[#FAF9F6] border border-[#EDEDEA] px-1.5 py-0.2 rounded-md">{spendPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#EDEDEA] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-300"
                          style={{ width: `${spendPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Action Buttons: 2-Column Primary Grid + Secondary Actions */}
                  {isNeedsChanges ? (
                    <button
                      type="button"
                      onClick={() => handleFixAndResubmit(camp)}
                      className="w-full h-10 rounded-xl bg-[#DC2626] text-white text-[13px] font-bold shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="leading-snug">{STRINGS.dashboard.fixAndResubmit}</span>
                    </button>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => navigateTo('analytics')}
                          className="h-10 rounded-xl bg-[#2B2437] text-white text-[12.5px] font-bold shadow-xs flex items-center justify-center gap-1 hover:bg-[#3D334E] active:scale-[0.99] transition-all cursor-pointer leading-snug"
                        >
                          एनालिटिक्स
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingBudgetCampaign(camp)}
                          className="h-10 rounded-xl bg-white border border-[#2B2437] text-[#2B2437] text-[12.5px] font-bold shadow-xs flex items-center justify-center gap-1 hover:bg-[#2B2437]/5 active:scale-[0.99] transition-all cursor-pointer leading-snug"
                        >
                          बजट बदलें
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5 px-0.5 text-[#8C8C94]">
                        <button
                          type="button"
                          onClick={() => handleEditAd(camp)}
                          className="hover:text-[#2B2437] hover:underline flex items-center gap-1 cursor-pointer leading-snug font-medium"
                        >
                          <Pencil className="w-3 h-3 shrink-0" />
                          <span>विज्ञापन एडिट करें</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRerun(camp)}
                          className="hover:text-[#2B2437] hover:underline flex items-center gap-1 cursor-pointer leading-snug font-medium"
                        >
                          <RotateCw className="w-3 h-3 shrink-0" />
                          <span>दोबारा चलाएं</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Account Info Footer */}
        <div className="py-2.5 text-center text-[11px] text-[#A6A4A9] leading-snug">
          अकाउंट: <span className="font-mono text-[#6B7280]">+91 {phone}</span>
        </div>
      </div>

      {/* Profile Menu Sheet */}
      <ProfileMenu
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        onEditShop={() => navigateTo('shop')}
        onOpenBilling={() => setShowBillingSheet(true)}
        onTriggerLogout={() => setShowLogoutConfirm(true)}
      />

      {/* Logout Confirm Sheet */}
      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirmLogout={logout}
      />

      {/* Edit Budget Sheet */}
      <EditBudgetSheet
        isOpen={!!editingBudgetCampaign}
        onClose={() => setEditingBudgetCampaign(null)}
        campaign={editingBudgetCampaign}
        onSaveNewBudget={handleSaveNewDaily}
        onRequestPayDifference={handleRequestPayDifference}
      />

      {/* Difference Payment Sheet */}
      {differencePaymentData && (
        <PaymentSheet
          isOpen={!!differencePaymentData}
          onClose={() => setDifferencePaymentData(null)}
          totalAmount={differencePaymentData.total}
          onPaymentSuccess={handleDifferencePaymentSuccess}
        />
      )}

      {/* Billing & Invoice Sheet */}
      <BillingSheet
        isOpen={showBillingSheet}
        onClose={() => setShowBillingSheet(false)}
        campaigns={campaigns}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
