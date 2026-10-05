import React, { useState, useEffect } from 'react';
import V2Header from '../components/chrome/V2Header';
import StickyCTA from '../components/chrome/StickyCTA';
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
  Shop,
  Edit2,
  Logout,
  Timer1,
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

  // Account-level summary for the hero strip
  const liveCount = campaigns.filter((c) => c.status === 'live').length;
  const totalSpent = campaigns.reduce(
    (sum, c) => sum + (c.metrics?.spent || (c.status === 'live' ? Math.round((c.money?.subtotal || 1750) * 0.42) : 0)),
    0
  );
  const totalViews = campaigns.reduce(
    (sum, c) => sum + (c.metrics?.views || (c.status === 'live' ? 2840 : 0)),
    0
  );

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#FAF9F6] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={() => navigateTo('intro')}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Dashboard Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col gap-3 scrollbar-none">
        {/* Level 3 (quietest): who is logged in */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#2B2437] text-white flex items-center justify-center font-bold text-[13px] overflow-hidden shrink-0">
              {shop.logoDataUrl ? (
                <img src={shop.logoDataUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{(shop.name || 'द').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-[16px] font-extrabold text-[#2B2437] leading-tight truncate tracking-tight">
                {shop.name || 'आपकी दुकान'}
              </h1>
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="text-[#8C8C94] hover:text-[#E39026] p-2 rounded-lg hover:bg-amber-50 cursor-pointer"
              title="दुकान की जानकारी बदलें"
              aria-label="दुकान की जानकारी बदलें"
            >
              <Edit2 size={15} color="currentColor" />
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="text-[#8C8C94] hover:text-[#DC2626] p-2 rounded-lg hover:bg-red-50 cursor-pointer"
              title="लॉगआउट"
              aria-label="लॉगआउट"
            >
              <Logout size={15} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Level 1: the two numbers an advertiser cares about */}
        {campaigns.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-[#FFF8E7] border border-[#F6DFA8] p-3.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#854D0E]">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${liveCount > 0 ? 'bg-[#16A34A] animate-pulse' : 'bg-[#9CA3AF]'}`} />
                कितनी बार दिखा
              </div>
              <div className="text-[26px] font-black text-[#2B2437] tabular-nums leading-none mt-2 tracking-tight">
                {formatIN(totalViews)}
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-[#EDEDEA] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-3.5">
              <div className="text-[11px] font-bold text-[#8C8C94]">अब तक खर्च</div>
              <div className="text-[26px] font-black text-[#2B2437] tabular-nums leading-none mt-2 tracking-tight">
                ₹{formatIN(totalSpent)}
              </div>
            </div>
          </div>
        )}

        {/* Level 2 header */}
        {campaigns.length > 0 && (
          <div className="flex items-center justify-between px-0.5 pt-1">
            <h2 className="text-[14px] font-extrabold text-[#2B2437] tracking-tight">आपके विज्ञापन</h2>
          </div>
        )}

        {/* Campaign List or Empty State */}
        {campaigns.length === 0 ? (
          /* Empty State */
          <div className="text-center py-10 bg-white rounded-2xl border border-[#EDEDEA] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] border border-[#F6DFA8] flex items-center justify-center text-[#D97706] mx-auto shadow-2xs">
              <Shop size={28} color="#D97706" variant="Bold" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[17px] font-bold text-[#2B2437]">
                अभी कोई विज्ञापन नहीं चल रहा
              </h3>
              <p className="text-[12px] text-[#8C8C94] font-medium leading-relaxed max-w-[270px] mx-auto">
                अपना पहला विज्ञापन बनाइए और अपने शहर के ग्राहकों तक सीधे पहुँचिए।
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartNewAd}
              className="w-full h-[46px] rounded-xl bg-[#2B2437] text-white font-bold text-[14px] shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-[#3D334E]"
            >
              + पहला विज्ञापन बनाएँ
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

              const heroValue = goalObj.id === 'reach' ? impressionsCount : clicksCount;
              const heroLabel =
                goalObj.id === 'reach'
                  ? 'बार दिखा'
                  : goalObj.id === 'engagement'
                  ? 'कॉल व मैसेज आए'
                  : 'वेबसाइट क्लिक';
              const goalTag =
                goalObj.id === 'reach'
                  ? 'ज़्यादा लोगों तक'
                  : goalObj.id === 'engagement'
                  ? 'कॉल व मैसेज'
                  : 'वेबसाइट पर';

              return (
                <div
                  key={camp.id}
                  className={`bg-white rounded-2xl border p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3.5 ${
                    isNeedsChanges ? 'border-[#FECACA]' : 'border-[#EDEDEA]'
                  }`}
                >
                  {/* Identity + status */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#EDEDEA] overflow-hidden shrink-0 flex items-center justify-center">
                      {firstImg ? (
                        <img src={firstImg} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#A6A4A9]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14.5px] font-extrabold text-[#2B2437] leading-snug truncate">
                        {headline}
                      </h3>
                      <span className="text-[11px] text-[#8C8C94] block truncate leading-snug mt-0.5">
                        {goalTag} · ₹{camp.money?.daily || 250}/दिन · {camp.money?.days || 7} दिन
                      </span>
                    </div>

                    {isPending ? (
                      <div className="px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-[#FFF8E7] text-[#B45309] border border-[#F6DFA8] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                        <span>जाँच में</span>
                      </div>
                    ) : isNeedsChanges ? (
                      <div className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] shrink-0">
                        बदलाव चाहिए
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleCampaignPause(camp.id)}
                        title="स्थिति बदलें"
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                          isLive
                            ? 'bg-[#EEF8F2] text-[#2F8F5B] border-[#A7F3D0]'
                            : 'bg-[#F4F4F2] text-[#6B7280] border-[#EDEDEA]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isLive ? 'bg-[#2F8F5B] animate-pulse' : 'bg-[#9CA3AF]'
                          }`}
                        />
                        <span>{isLive ? 'चल रहा है' : 'रुका हुआ'}</span>
                      </button>
                    )}
                  </div>

                  {/* Pending review */}
                  {isPending && (
                    <div className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#FDE68A] flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#FDE68A] flex items-center justify-center shrink-0">
                          <Timer1 size={16} color="#E39026" variant="Bold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-[#2B2437] font-bold leading-snug">
                            {remainingSeconds > 0
                              ? `लगभग ${remainingSeconds} सेकंड में शुरू होगा`
                              : 'बस थोड़ी देर और…'}
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#FDE68A]/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(camp.id, 'live')}
                        className="self-end text-[11.5px] text-[#E39026] hover:text-[#C97F1E] font-bold cursor-pointer"
                      >
                        अभी शुरू करें →
                      </button>
                    </div>
                  )}

                  {/* Result: one hero number, supporting numbers on the side */}
                  {!isPending && !isNeedsChanges && (
                    <div className={`flex flex-col gap-2.5 ${isPaused ? 'opacity-60' : ''}`}>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <div className="text-[30px] font-black text-[#2B2437] tabular-nums leading-none tracking-tight">
                            {formatIN(heroValue)}
                          </div>
                          <span className="text-[12px] font-bold text-[#B45309] block mt-1">
                            {heroLabel}
                          </span>
                        </div>
                        <div className="text-right text-[11.5px] text-[#8C8C94] font-medium leading-relaxed">
                          <div>
                            {goalObj.id === 'reach' ? 'पहुँचे पाठक' : 'कितनों ने किया'}{' '}
                            <span className="font-bold text-[#2B2437] tabular-nums">
                              {goalObj.id === 'reach'
                                ? formatIN(Math.round(impressionsCount * 0.88))
                                : `${ctrVal}%`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="w-full h-1.5 rounded-full bg-[#EDEDEA] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-300"
                            style={{ width: `${spendPercentage}%` }}
                          />
                        </div>
                        <span className="text-[10.5px] font-medium text-[#8C8C94]">
                          {STRINGS.dashboard.spendLine(formatIN(spent), formatIN(subtotal))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions: 1 primary, 1 secondary, 2 quiet */}
                  {isNeedsChanges ? (
                    <button
                      type="button"
                      onClick={() => handleFixAndResubmit(camp)}
                      className="w-full h-10 rounded-xl bg-[#DC2626] text-white text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="leading-snug">{STRINGS.dashboard.fixAndResubmit}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 pt-2.5 border-t border-[#F4F4F2]">
                      <button
                        type="button"
                        onClick={() => navigateTo('analytics')}
                        className="flex-1 h-10 rounded-xl bg-[#2B2437] hover:bg-[#3D334E] text-white text-[12.5px] font-bold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                      >
                        नतीजे देखें
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBudgetCampaign(camp)}
                        className="h-10 px-3.5 rounded-xl text-[#2B2437] text-[12.5px] font-bold hover:bg-[#F4F4F2] active:scale-95 transition-all cursor-pointer"
                      >
                        बजट बदलें
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditAd(camp)}
                        title="विज्ञापन बदलें"
                        aria-label="विज्ञापन बदलें"
                        className="w-9 h-10 rounded-xl text-[#8C8C94] hover:text-[#E39026] hover:bg-amber-50 flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRerun(camp)}
                        title="फिर से चलाएँ"
                        aria-label="फिर से चलाएँ"
                        className="w-9 h-10 rounded-xl text-[#8C8C94] hover:text-[#E39026] hover:bg-amber-50 flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {campaigns.length > 0 && (
        <StickyCTA label="+ नया विज्ञापन बनाएँ" onClick={handleStartNewAd} showArrow={false} />
      )}

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
