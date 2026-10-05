import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Global,
  VideoPlay,
  Grid2,
  Cards,
  Gallery,
  CardTick1,
  Call,
  Link2,
  Location,
  Profile2User,
  Filter,
} from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import BudgetEditSheet from '../../components/advertiser/BudgetEditSheet';
import { useAdvertiser } from '../../context/AdvertiserContext';

// 3 Core Advertising Goals Metadata
const GOAL_META = {
  reach: {
    id: 'reach',
    shortLabel: 'पहुंच',
    fullTitle: 'ज्यादा पहुंच (Reach)',
    pillText: '📢 पहुंच (Reach)',
    badgeClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    badgeBg: '#EFF6FF',
    badgeText: '#1D4ED8',
    badgeBorder: '#BFDBFE',
    icon: Eye,
    heroIconColor: '#2563EB',
    heroColorClass: 'text-[#2563EB]',
    heroMetricLabel: 'कुल व्यूज (Views)',
    metric2Label: 'पहुंचे पाठक (Reach)',
    metric3Label: 'लागत / 1k व्यू (CPM)',
    metric4Label: 'कुल खर्च',
    destinationPrefix: '📍 स्थानीय दायरा',
    actionDesc: 'इलाके में अधिकतम ब्रांड अवेयरनेस व पाठकों तक पहुंच',
  },
  engagement: {
    id: 'engagement',
    shortLabel: 'कॉल व मैसेज',
    fullTitle: 'कॉल और मैसेज (Engagement)',
    pillText: '💬 कॉल व मैसेज (Engagement)',
    badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    badgeBg: '#ECFDF5',
    badgeText: '#047857',
    badgeBorder: '#A7F3D0',
    icon: Messages3,
    heroIconColor: '#059669',
    heroColorClass: 'text-[#059669]',
    heroMetricLabel: 'कॉल व WhatsApp (Leads)',
    metric2Label: 'कुल विज्ञापन व्यूज',
    metric3Label: 'पूछताछ दर (Lead Rate)',
    metric4Label: 'कुल खर्च',
    destinationPrefix: '📞 ग्राहक संपर्क',
    actionDesc: 'सीधे कॉल या WhatsApp पर 1-on-1 पूछताछ हेतु अनुकूलित',
  },
  ctrs: {
    id: 'ctrs',
    shortLabel: 'वेबसाइट क्लिक्स',
    fullTitle: 'वेबसाइट क्लिक्स (CTR)',
    pillText: '🔗 वेबसाइट क्लिक्स (CTR)',
    badgeClass: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
    badgeBg: '#F5F3FF',
    badgeText: '#6D28D9',
    badgeBorder: '#DDD6FE',
    icon: Global,
    heroIconColor: '#7C3AED',
    heroColorClass: 'text-[#7C3AED]',
    heroMetricLabel: 'वेबसाइट क्लिक्स',
    metric2Label: 'क्लिक दर (CTR %)',
    metric3Label: 'प्रति क्लिक खर्च (CPC)',
    metric4Label: 'कुल खर्च',
    destinationPrefix: '🌐 गंतव्य वेबसाइट',
    actionDesc: 'वेबसाइट, स्टोर लिंक या सोशल पेज पर ट्रैफिक लाने हेतु अनुकूलित',
  },
};

// 5 Dedicated Ad Formats Metadata
const FORMAT_META = {
  video_ad: {
    id: 'video_ad',
    label: 'वीडियो रील (9:16)',
    shortLabel: 'रील',
    spec: '9:16 वर्टिकल साउंड रील',
    icon: VideoPlay,
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
    iconColor: '#EA580C',
  },
  grid_ad: {
    id: 'grid_ad',
    label: '2×2 फोटो ग्रिड',
    shortLabel: 'ग्रिड',
    spec: '4 तस्वीरों का फोटो ग्रिड',
    icon: Grid2,
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
    iconColor: '#EA580C',
  },
  carousel_ad: {
    id: 'carousel_ad',
    label: 'स्वाइप कार्ड्स',
    shortLabel: 'कैरोसेल',
    spec: 'मल्टी-कार्ड कैरोसेल स्लाइडर',
    icon: Cards,
    badgeClass: 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]',
    iconColor: '#EA580C',
  },
  feed_card_ad: {
    id: 'feed_card_ad',
    label: 'न्यूज़ फ़ीड कार्ड',
    shortLabel: 'फ़ीड कार्ड',
    spec: 'न्यूज़ रीडर फ़ीड बैनर',
    icon: Gallery,
    badgeClass: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
    iconColor: '#4B5563',
  },
  sponsored_ad: {
    id: 'sponsored_ad',
    label: 'प्रायोजित लेख',
    shortLabel: 'प्रायोजित',
    spec: 'नेगेटिव प्रायोजित स्टोरी कार्ड',
    icon: CardTick1,
    badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    iconColor: '#D97706',
  },
};

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
    loadSampleCampaigns,
  } = useAdvertiser();

  const [activeBudgetEditCampaign, setActiveBudgetEditCampaign] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Goal & Format Filter State
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('all'); // 'all' | 'reach' | 'engagement' | 'ctrs'
  const [selectedFormatFilter, setSelectedFormatFilter] = useState('all'); // 'all' | 5 formats

  // Dynamic ticking clock for smooth 5-second countdown on pending campaigns
  useEffect(() => {
    const hasPending = campaigns.some((c) => c.status === 'pending_review');
    if (!hasPending) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => clearInterval(interval);
  }, [campaigns]);

  // Automatically transition pending campaigns to 'live' exactly 5 seconds after creation
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

  // Counts by Goal
  const goalCounts = useMemo(() => {
    const counts = { all: campaigns.length, reach: 0, engagement: 0, ctrs: 0 };
    campaigns.forEach((c) => {
      const g = c.goal === 'ctrs' ? 'ctrs' : c.goal === 'engagement' ? 'engagement' : 'reach';
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  // Counts by Format
  const formatCounts = useMemo(() => {
    const counts = { all: campaigns.length };
    campaigns.forEach((c) => {
      const f = FORMAT_META[c.format] ? c.format : 'video_ad';
      counts[f] = (counts[f] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const g = c.goal === 'ctrs' ? 'ctrs' : c.goal === 'engagement' ? 'engagement' : 'reach';
      const f = FORMAT_META[c.format] ? c.format : 'video_ad';

      const matchGoal = selectedGoalFilter === 'all' || g === selectedGoalFilter;
      const matchFormat = selectedFormatFilter === 'all' || f === selectedFormatFilter;
      return matchGoal && matchFormat;
    });
  }, [campaigns, selectedGoalFilter, selectedFormatFilter]);

  // Aggregate stats across all campaigns
  const aggregateStats = useMemo(() => {
    let totalImpressions = 0;
    let totalInteractions = 0;
    let totalSpend = 0;
    let liveCount = 0;

    campaigns.forEach((c) => {
      if (c.status === 'live') liveCount++;
      totalImpressions += Number(c.impressions || 0);
      totalInteractions += Number(c.clicks || 0);
      totalSpend += Number(c.totalSpend || 0);
    });

    return { totalImpressions, totalInteractions, totalSpend, liveCount };
  }, [campaigns]);

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
            className="h-10 px-3.5 rounded-[12px] bg-[#2B2437] text-white text-[13px] font-medium flex items-center gap-1.5 shadow-xs hover:bg-[#3D334E] active:scale-95 transition-all cursor-pointer"
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
                <span className="text-[12px] text-[#6B7280] font-normal block mt-0.5 truncate">
                  {businessProfile.storeAddress ? `${businessProfile.storeAddress} • ` : ''}
                  {businessProfile.hasGstin && businessProfile.gstin ? `GST: ${businessProfile.gstin}` : 'सत्यापित खाता'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => navigate('/advertise/business-profile', { state: { fromDashboard: true } })}
                className="h-8.5 px-3 rounded-[10px] bg-[#F7F7F4] border border-[#E5E7EB] text-[#2B2437] text-[12px] font-medium flex items-center gap-1 hover:bg-[#EBECEF] active:scale-95 transition-all cursor-pointer"
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

        {/* Aggregate Summary Ribbon when campaigns exist */}
        {campaigns.length > 0 && (
          <div className="bg-[#2B2437] text-white rounded-[20px] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[13px] font-bold tracking-tight">
                  {aggregateStats.liveCount} लाइव अभियान सक्रिय
                </span>
              </div>
              <span className="text-[11.5px] font-medium text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                कुल {campaigns.length} विज्ञापन
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center">
              <div>
                <span className="text-[11px] text-white/60 block">कुल व्यूज</span>
                <span className="text-[16px] font-bold font-mono mt-0.5 block">
                  {aggregateStats.totalImpressions.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/60 block">लीड्स / क्लिक्स</span>
                <span className="text-[16px] font-bold font-mono mt-0.5 text-[#FDE68A] block">
                  {aggregateStats.totalInteractions.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white/60 block">कुल बजट</span>
                <span className="text-[16px] font-bold font-mono mt-0.5 block">
                  ₹{Math.round(aggregateStats.totalSpend).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 1. Goal Filter Pills (The 3 Goals) */}
        {campaigns.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">
                लक्ष्य के अनुसार विज्ञापन (3 Goals)
              </span>
              <span className="text-[11.5px] text-[#9CA3AF]">
                {filteredCampaigns.length} परिणाम
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {/* All Goals */}
              <button
                type="button"
                onClick={() => setSelectedGoalFilter('all')}
                className={`h-9 px-3.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedGoalFilter === 'all'
                    ? 'bg-[#2B2437] text-white shadow-xs'
                    : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F3F4F6]'
                }`}
              >
                <span>सभी लक्ष्य</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedGoalFilter === 'all' ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                }`}>
                  {goalCounts.all}
                </span>
              </button>

              {/* Goal 1: Reach */}
              <button
                type="button"
                onClick={() => setSelectedGoalFilter('reach')}
                className={`h-9 px-3.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedGoalFilter === 'reach'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] hover:bg-[#DBEAFE]'
                }`}
              >
                <Eye size={14} />
                <span>पहुंच (Reach)</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedGoalFilter === 'reach' ? 'bg-white/25 text-white' : 'bg-white text-[#1D4ED8]'
                }`}>
                  {goalCounts.reach}
                </span>
              </button>

              {/* Goal 2: Engagement */}
              <button
                type="button"
                onClick={() => setSelectedGoalFilter('engagement')}
                className={`h-9 px-3.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedGoalFilter === 'engagement'
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] hover:bg-[#D1FAE5]'
                }`}
              >
                <Messages3 size={14} />
                <span>कॉल व मैसेज</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedGoalFilter === 'engagement' ? 'bg-white/25 text-white' : 'bg-white text-[#047857]'
                }`}>
                  {goalCounts.engagement}
                </span>
              </button>

              {/* Goal 3: CTR */}
              <button
                type="button"
                onClick={() => setSelectedGoalFilter('ctrs')}
                className={`h-9 px-3.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedGoalFilter === 'ctrs'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE] hover:bg-[#EDE9FE]'
                }`}
              >
                <Global size={14} />
                <span>वेबसाइट क्लिक्स</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedGoalFilter === 'ctrs' ? 'bg-white/25 text-white' : 'bg-white text-[#6D28D9]'
                }`}>
                  {goalCounts.ctrs}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Format Filter Chips (The 5 Formats) */}
        {campaigns.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none items-center text-[12px]">
            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase mr-1 shrink-0">
              प्रकार:
            </span>

            <button
              type="button"
              onClick={() => setSelectedFormatFilter('all')}
              className={`h-7 px-2.5 rounded-lg text-[11.5px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedFormatFilter === 'all'
                  ? 'bg-[#2B2437] text-white'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
              }`}
            >
              सभी (5 प्रकार)
            </button>

            {Object.values(FORMAT_META).map((fmt) => {
              const count = formatCounts[fmt.id] || 0;
              const isSelected = selectedFormatFilter === fmt.id;
              const IconComponent = fmt.icon;

              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormatFilter(fmt.id)}
                  className={`h-7 px-2.5 rounded-lg text-[11.5px] font-medium whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#E39026] text-white shadow-2xs'
                      : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <IconComponent size={12} color={isSelected ? '#FFFFFF' : fmt.iconColor} />
                  <span>{fmt.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1 rounded-sm ${isSelected ? 'bg-black/20' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {campaigns.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026] mx-auto shadow-2xs">
              <Shop size={32} color="#E39026" variant="Bold" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[18px] font-bold text-[#2B2437]">
                कोई ऐक्टिव ऐड नहीं है
              </h3>
              <p className="text-[13px] text-[#6B7280] font-normal leading-relaxed max-w-[290px] mx-auto">
                नवभारत पर 3 लक्ष्यों (रीच, एंगेजमेंट, या वेबसाइट क्लिक्स) और 5 आधुनिक प्रारूपों में ऐड चलाएं।
              </p>
            </div>

            <div className="space-y-2.5 pt-2 max-w-[280px] mx-auto">
              <button
                type="button"
                onClick={handleStartNewCampaign}
                className="w-full h-[48px] rounded-[14px] bg-[#2B2437] text-white font-medium text-[15px] shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-[#3D334E]"
              >
                + नया ऐड बनाएं
              </button>

              {loadSampleCampaigns && (
                <button
                  type="button"
                  onClick={loadSampleCampaigns}
                  className="w-full h-[42px] rounded-[14px] bg-[#FFF9EE] border border-[#FDE68A] text-[#B45309] font-semibold text-[13px] active:scale-95 transition-all cursor-pointer hover:bg-[#FEF3C7]"
                >
                  ⚡ सैंपल अभियान लोड करें (3 लक्ष्य डेमो)
                </button>
              )}
            </div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          /* Filter Empty State */
          <div className="text-center py-10 bg-white rounded-[20px] border border-[#E5E7EB] p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center mx-auto">
              <Filter size={24} color="#6B7280" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-[#2B2437]">
                इस फ़िल्टर में कोई विज्ञापन नहीं है
              </h4>
              <p className="text-[12.5px] text-[#6B7280] mt-0.5">
                चुने गए लक्ष्य या प्रकार में कोई एक्टिव ऐड नहीं मिला।
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedGoalFilter('all');
                setSelectedFormatFilter('all');
              }}
              className="text-[12.5px] font-bold text-[#2563EB] hover:underline cursor-pointer pt-1"
            >
              सभी फ़िल्टर साफ़ करें
            </button>
          </div>
        ) : (
          /* List of Campaigns */
          filteredCampaigns.map((cmp) => {
            const isPending = cmp.status === 'pending_review';
            const isLive = cmp.status === 'live';
            const isPaused = cmp.status === 'paused';

            const createdAt = cmp.createdAt || now;
            const elapsed = Math.max(0, now - createdAt);
            const remainingSeconds = Math.max(0, Math.ceil((5000 - elapsed) / 1000));
            const progressPercent = Math.min(100, Math.max(0, (elapsed / 5000) * 100));

            // Goal & Format Metadata
            const goalKey = cmp.goal === 'ctrs' ? 'ctrs' : cmp.goal === 'engagement' ? 'engagement' : 'reach';
            const goalInfo = GOAL_META[goalKey];

            const formatKey = FORMAT_META[cmp.format] ? cmp.format : 'video_ad';
            const formatInfo = FORMAT_META[formatKey];
            const FormatIconComponent = formatInfo.icon;
            const GoalIconComponent = goalInfo.icon;

            // Media Preview Thumbnail
            const previewMedia =
              cmp.details?.uploadedCreativeUrl ||
              cmp.details?.feedCardImage ||
              cmp.details?.sponsoredCardImage ||
              (cmp.details?.gridImages && cmp.details.gridImages.find(Boolean)) ||
              (cmp.details?.carouselImages && cmp.details.carouselImages.find(Boolean));

            // Metrics calculation
            const impressions = Number(cmp.impressions || 7631);
            const totalSpend = Number(cmp.totalSpend || (cmp.dailyBudget * (cmp.durationDays || 7)));
            const ctrPercent = Number(cmp.ctr || (goalKey === 'ctrs' ? 1.6 : goalKey === 'engagement' ? 1.25 : 0.94));
            const clicksOrInquiries = Number(cmp.clicks || Math.round(impressions * (ctrPercent / 100)));

            // Goal-specific values:
            let metric1Val, metric2Val, metric3Val, metric4Val;
            if (goalKey === 'reach') {
              metric1Val = impressions.toLocaleString('en-IN');
              metric2Val = `~${Math.round(impressions * 0.88).toLocaleString('en-IN')}`;
              metric3Val = `₹${impressions > 0 ? ((totalSpend / impressions) * 1000).toFixed(1) : '3.6'}`;
              metric4Val = `₹${totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
            } else if (goalKey === 'engagement') {
              metric1Val = clicksOrInquiries.toLocaleString('en-IN');
              metric2Val = impressions.toLocaleString('en-IN');
              metric3Val = `${ctrPercent}%`;
              metric4Val = `₹${totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
            } else {
              // ctrs
              metric1Val = clicksOrInquiries.toLocaleString('en-IN');
              metric2Val = `${ctrPercent}%`;
              metric3Val = `₹${clicksOrInquiries > 0 ? (totalSpend / clicksOrInquiries).toFixed(1) : '5.5'}`;
              metric4Val = `₹${totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
            }

            // Destination summary string
            let destinationText = '';
            if (goalKey === 'engagement') {
              destinationText = cmp.details?.callNumber || cmp.details?.destinationUrl || cmp.details?.phone || businessProfile?.phone || '+91 9826012345';
            } else if (goalKey === 'ctrs') {
              destinationText = (cmp.details?.destinationUrl || 'https://navabharat.com').replace(/^https?:\/\//, '');
            } else {
              destinationText = cmp.details?.targetingType === 'radius'
                ? `दुकान के आसपास ${cmp.details?.radiusKm || 10} किमी दायरा`
                : `${(cmp.details?.selectedDistricts || []).length || 1} शहर / राज्य`;
            }

            return (
              <div
                key={cmp.id}
                className="bg-white rounded-[22px] border border-[#E5E7EB] p-4 shadow-xs space-y-3.5 hover:border-[#D1D5DB] transition-all"
              >
                {/* 1. Header Row: Dual Badges (Goal + Format) and Status Button */}
                <div className="flex items-center justify-between gap-2 border-b border-[#F3F4F6] pb-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Goal Pill */}
                    <span
                      className={`h-7 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1 border ${goalInfo.badgeClass}`}
                    >
                      <GoalIconComponent size={12} color={goalInfo.badgeText} />
                      <span>{goalInfo.pillText}</span>
                    </span>

                    {/* Format Pill */}
                    <span
                      className={`h-7 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1 border ${formatInfo.badgeClass}`}
                    >
                      <FormatIconComponent size={12} color={formatInfo.iconColor} />
                      <span>{formatInfo.label}</span>
                    </span>
                  </div>

                  {/* Status Toggle / Pending Badge */}
                  {isPending ? (
                    <div className="h-7 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-[#FFF9EE] text-[#D97706] border border-[#FDE68A] shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E39026] animate-ping" />
                      <span>रिव्यू ({remainingSeconds}s)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleCampaignStatus(cmp.id)}
                      title="स्थिति बदलें"
                      className={`h-7 px-3 rounded-full text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        isLive
                          ? 'bg-[#2B2437] text-white shadow-2xs hover:bg-[#3D334E]'
                          : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'
                        }`}
                      />
                      <span>{isLive ? 'लाइव' : 'पॉज्ड'}</span>
                    </button>
                  )}
                </div>

                {/* 2. Creative & Campaign Info Row */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F7F7F4] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center">
                    {previewMedia ? (
                      <img src={previewMedia} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FormatIconComponent size={22} color={formatInfo.iconColor} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15.5px] font-bold text-[#2B2437] leading-snug truncate">
                      {cmp.details?.headline || cmp.businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] mt-0.5 truncate">
                      <span className="font-medium text-[#2B2437]">₹{cmp.dailyBudget}/दिन</span>
                      <span>•</span>
                      <span>{cmp.durationDays || 7} दिन</span>
                      <span>•</span>
                      <span>{formatInfo.spec}</span>
                    </div>
                  </div>
                </div>

                {/* 3. State 1: If Pending Review */}
                {isPending && (
                  <div className="bg-[#FFFBF0] border border-[#FDE68A] rounded-[16px] p-3 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer1 size={17} color="#D97706" variant="Bold" />
                        <div>
                          <h4 className="text-[13px] font-bold text-[#2B2437]">
                            विज्ञापन की गुणवत्ता जांची जा रही है
                          </h4>
                          <span className="text-[11.5px] text-[#92400E]">
                            {remainingSeconds > 0 ? `${remainingSeconds}s में ऑटोमैटिक लाइव होगा...` : 'सत्यापित हो रहा है...'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[12px] font-black text-[#D97706] font-mono px-2 py-0.5 rounded-lg bg-white/80 border border-[#FDE68A]">
                        00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#FDE68A]/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#E39026] to-[#F59E0B] rounded-full transition-all duration-200"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => approveCampaign(cmp.id)}
                        className="text-[11.5px] text-[#B45309] font-bold underline cursor-pointer hover:text-[#78350F]"
                      >
                        तुरंत लाइव करें →
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. State 2 & 3: Goal-Calibrated 4-Grid Metrics */}
                {!isPending && (
                  <div className={`grid grid-cols-2 gap-2 ${isPaused ? 'opacity-65' : ''}`}>
                    {/* Metric 1 (Hero Metric customized by Goal) */}
                    <div className={`rounded-[16px] p-3 border ${
                      goalKey === 'reach'
                        ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                        : goalKey === 'engagement'
                        ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                        : 'bg-[#F5F3FF] border-[#DDD6FE]'
                    }`}>
                      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#4B5563]">
                        {goalKey === 'reach' ? (
                          <Eye size={14} color="#2563EB" />
                        ) : goalKey === 'engagement' ? (
                          <Messages3 size={14} color="#059669" />
                        ) : (
                          <Mouse size={14} color="#7C3AED" />
                        )}
                        <span>{goalInfo.heroMetricLabel}</span>
                      </div>
                      <div className={`text-[21px] font-extrabold mt-1 font-mono tracking-tight ${goalInfo.heroColorClass}`}>
                        {metric1Val}
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[11.5px] font-semibold">
                        {goalKey === 'reach' ? (
                          <Profile2User size={14} color="#6B7280" />
                        ) : goalKey === 'engagement' ? (
                          <Eye size={14} color="#6B7280" />
                        ) : (
                          <TrendUp size={14} color="#6B7280" />
                        )}
                        <span>{goalInfo.metric2Label}</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#2B2437] mt-1 font-mono tracking-tight">
                        {metric2Val}
                      </div>
                    </div>

                    {/* Metric 3 (Efficiency rate customized by Goal: CPM / Lead Rate / CPC) */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[11.5px] font-semibold">
                        <TrendUp size={14} color="#6B7280" />
                        <span>{goalInfo.metric3Label}</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#E39026] mt-1 font-mono tracking-tight">
                        {metric3Val}
                      </div>
                    </div>

                    {/* Metric 4 (Total Budget Spent) */}
                    <div className="bg-[#F7F7F4] rounded-[16px] p-3 border border-[#EBECEF]">
                      <div className="flex items-center gap-1.5 text-[#6B7280] text-[11.5px] font-semibold">
                        <MoneyChange size={14} color="#6B7280" />
                        <span>{goalInfo.metric4Label}</span>
                      </div>
                      <div className="text-[20px] font-bold text-[#2B2437] mt-1 font-mono tracking-tight">
                        {metric4Val}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Destination & Goal Channel Target Banner */}
                <div className="bg-[#F7F7F4] rounded-[14px] px-3 py-2 border border-[#EBECEF] flex items-center justify-between text-[11.5px]">
                  <div className="flex items-center gap-1.5 text-[#4B5563] truncate">
                    {goalKey === 'engagement' ? (
                      <Call size={13} color="#059669" className="shrink-0" />
                    ) : goalKey === 'ctrs' ? (
                      <Link2 size={13} color="#7C3AED" className="shrink-0" />
                    ) : (
                      <Location size={13} color="#2563EB" className="shrink-0" />
                    )}
                    <span className="font-semibold text-[#2B2437] shrink-0">
                      {goalInfo.destinationPrefix}:
                    </span>
                    <span className="truncate font-mono font-medium text-[#4B5563]">
                      {destinationText}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-[#9CA3AF] shrink-0 ml-2">
                    {cmp.startDate || 'सक्रिय'}
                  </span>
                </div>

                {/* 6. Action Buttons Row */}
                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => navigate('/advertise/analytics', { state: { campaignId: cmp.id } })}
                    className="h-10.5 rounded-[13px] bg-[#2B2437] text-white text-[13px] font-medium shadow-xs flex items-center justify-center hover:bg-[#3D334E] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    एनालिटिक्स देखें
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBudgetEditCampaign(cmp)}
                    className="h-10.5 rounded-[13px] bg-white border border-[#2B2437] text-[#2B2437] text-[13px] font-medium shadow-xs flex items-center justify-center hover:bg-[#2B2437]/5 active:scale-[0.99] transition-all cursor-pointer"
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
      <div className="px-4 py-3 text-center border-t border-[#EBECEF] bg-white/50">
        <p className="text-[11.5px] text-[#9CA3AF]">
          अकाउंट: <span className="font-mono text-[#6B7280]">+91 {advertiserAuth?.phone || businessProfile?.phone || '—'}</span> • नवभारत विज्ञापन नेटवर्क
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
        onSave={(newDailyBudget) => {
          if (activeBudgetEditCampaign) {
            updateCampaignBudget(activeBudgetEditCampaign.id, newDailyBudget);
            setActiveBudgetEditCampaign(null);
          }
        }}
      />
    </div>
  );
}
