import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EditBudgetSheet from '../components/sheets/EditBudgetSheet';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { formatIN } from '../utils/formatIN';
import { getFormatById } from '../data/formats';
import { CONFIG } from '../config';
import { STRINGS } from '../strings/hi';
import {
  Pause,
  Play,
  DollarSign,
  RotateCw,
  Plus,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

export default function S11_CampaignDetail({ onOpenFacilitator }) {
  const {
    state,
    resetDraft,
    loadDraftFromCampaign,
    toggleCampaignPause,
    updateCampaignBudget,
  } = useAdvertiserV2();
  const { goBack, navigateTo } = useFlowNav();

  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  // Focus campaign (first one or fallback)
  const campaign = state.campaigns[0] || {
    id: 'cmp-mock',
    orderId: 'NB-ADV-48213',
    status: 'live',
    snapshot: {
      draft: {
        headline: 'शर्मा स्वीट्स · ताज़ा मिठाई',
        format: 'feed_card_ad',
        budget: { days: 7 },
      },
    },
    money: { daily: 250, days: 7, subtotal: 1750, total: 2065 },
    metrics: { views: 0, clicks: 0, contactTaps: 0, spent: 0 },
    sampleSeries: null,
  };

  const snapDraft = campaign.snapshot?.draft || {};
  const headline = snapDraft.headline || 'विज्ञापन';
  const formatObj = getFormatById(snapDraft.format);
  const goalId = snapDraft.goal || 'engagement';
  const firstImg = snapDraft.media?.images?.[0]?.dataUrl;

  const status = campaign.status || 'live';
  const isLive = status === 'live';
  const isPaused = status === 'paused';

  const subtotal = campaign.money?.subtotal || 1750;
  const spent = campaign.metrics?.spent || 0;
  const views = campaign.metrics?.views || 0;
  const clicks = campaign.metrics?.clicks || 0;
  const contactTaps = campaign.metrics?.contactTaps || 0;

  const spendPercentage = Math.min(100, Math.round((spent / subtotal) * 100));

  // Insight card only when views >= MIN_SAMPLE_FOR_INSIGHT
  const showInsight = views >= CONFIG.MIN_SAMPLE_FOR_INSIGHT;
  const hourlyPeak = campaign.sampleSeries?.hourlyPeak || 'शाम 6 से रात 10 बजे';

  const handleStartNewAd = () => {
    resetDraft();
    navigateTo('goal');
  };

  const handleRerun = () => {
    loadDraftFromCampaign(campaign.id);
    navigateTo('review');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header */}
      <V2Header
        showBack
        onBack={goBack}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
        rightAction={
          state.sim?.sampleData ? (
            <Badge variant="amber">{STRINGS.analytics.sampleDataNotice}</Badge>
          ) : null
        }
      />

      {/* Main Analytics Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Title */}
        <div className="text-center pt-1">
          <h2 className="text-[22px] font-extrabold text-[#2B2437] tracking-tight">
            {STRINGS.analytics.title}
          </h2>
        </div>

        {/* 1. Identity Card */}
        <div className="p-3.5 rounded-[22px] bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-[12px] bg-[#F7F7F4] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center">
              {firstImg ? (
                <img src={firstImg} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#A6A4A9]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-[15px] text-[#2B2437] truncate leading-snug">
                {headline}
              </h4>
              <span className="text-[12px] text-[#6B7280]">
                {formatObj.title} · #{campaign.orderId}
              </span>
            </div>
          </div>

          <Badge variant={isLive ? 'success' : isPaused ? 'muted' : 'ink'}>
            {isLive ? 'लाइव' : isPaused ? 'रुका हुआ' : status}
          </Badge>
        </div>

        {/* 2. Four KPI Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* कितनी बार दिखा */}
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-[#6B7280]">
              {STRINGS.dashboard.metricViews}
            </span>
            <span className="text-[20px] font-extrabold text-[#2B2437] font-mono tracking-tight tabular-nums">
              {views > 0 ? formatIN(views) : <span className="text-[12px] font-normal text-[#A6A4A9]">{STRINGS.dashboard.dataComing}</span>}
            </span>
          </div>

          {/* क्लिक */}
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-[#6B7280]">
              {STRINGS.dashboard.metricClicks}
            </span>
            <span className="text-[20px] font-extrabold text-[#2B2437] font-mono tracking-tight tabular-nums">
              {clicks > 0 ? formatIN(clicks) : <span className="text-[12px] font-normal text-[#A6A4A9]">{STRINGS.dashboard.dataComing}</span>}
            </span>
          </div>

          {/* संपर्क या लिंक टैप */}
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-[#6B7280]">
              {goalId === 'ctrs' ? STRINGS.dashboard.metricTapCtrs : STRINGS.dashboard.metricTapEngagement}
            </span>
            <span className="text-[20px] font-extrabold text-[#2B2437] font-mono tracking-tight tabular-nums">
              {contactTaps > 0 ? formatIN(contactTaps) : <span className="text-[12px] font-normal text-[#A6A4A9]">{STRINGS.dashboard.dataComing}</span>}
            </span>
          </div>

          {/* कुल खर्च */}
          <div className="p-3.5 rounded-[18px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-1">
            <span className="text-[11.5px] font-medium text-[#6B7280]">
              {STRINGS.dashboard.metricSpent}
            </span>
            <span className="text-[20px] font-extrabold text-[#2B2437] font-mono tracking-tight tabular-nums">
              ₹{formatIN(spent)}
            </span>
          </div>
        </div>

        {/* 3. Spend Progress Bar */}
        <div className="p-3.5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-[12.5px] font-bold text-[#2B2437]">
            <span>{STRINGS.analytics.spendProgress(formatIN(spent), formatIN(subtotal))}</span>
            <span className="text-[11.5px] text-[#6B7280] font-normal">
              {STRINGS.analytics.daysLeft(4)}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-300"
              style={{ width: `${spendPercentage}%` }}
            />
          </div>
        </div>

        {/* 4. One Insight Card (Only when views >= 1,000) */}
        {showInsight && (
          <div className="p-3.5 rounded-[18px] bg-[#FFF9EE] border border-[#FDE68A] flex items-start gap-2.5 animate-fadeIn shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#E39026] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-[#C97F1E]">पाठक गतिविधि</span>
              <p className="text-[13px] font-medium text-[#2B2437] leading-snug">
                आपका विज्ञापन {hourlyPeak} के बीच सबसे ज़्यादा देखा जा रहा है.
              </p>
            </div>
          </div>
        )}

        {/* 5. Control Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          {/* Pause / Resume */}
          {(isLive || isPaused) && (
            <Button
              variant="outline"
              onClick={() => toggleCampaignPause(campaign.id)}
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4 text-[#4A4358]" />
                  <span>{STRINGS.dashboard.btnPause}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#2F8F5B]" />
                  <span>{STRINGS.dashboard.btnResume}</span>
                </>
              )}
            </Button>
          )}

          {/* Edit Budget */}
          <Button variant="outline" onClick={() => setShowEditBudget(true)}>
            <DollarSign className="w-4 h-4 text-[#E39026]" />
            <span>{STRINGS.dashboard.btnEditBudget}</span>
          </Button>

          {/* Rerun */}
          <Button variant="outline" onClick={handleRerun}>
            <RotateCw className="w-4 h-4" />
            <span>{STRINGS.dashboard.btnRerun}</span>
          </Button>

          {/* New Ad */}
          <Button onClick={handleStartNewAd} showArrow>
            <Plus className="w-4 h-4" />
            <span>{STRINGS.dashboard.newAdBtn}</span>
          </Button>
        </div>
      </div>

      {/* Edit Budget Sheet */}
      <EditBudgetSheet
        isOpen={showEditBudget}
        onClose={() => setShowEditBudget(false)}
        campaign={campaign}
        onSaveNewBudget={(id, newDaily) => {
          updateCampaignBudget(id, newDaily);
          setShowEditBudget(false);
        }}
      />

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
