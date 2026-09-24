import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  Mouse,
  MoneyChange,
  TrendUp,
  Profile2User,
  Man,
  Woman,
  ArrowRight,
} from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import BudgetEditSheet from '../../components/advertiser/BudgetEditSheet';
import { useAdvertiser } from '../../context/AdvertiserContext';

export default function AdvertiserAnalyticsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { campaigns, resetDraftCampaign, updateCampaignBudget } = useAdvertiser();
  const [isBudgetSheetOpen, setIsBudgetSheetOpen] = useState(false);

  const campaignId = location.state?.campaignId;
  const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0] || {
    id: 'cmp-default',
    orderId: 'NB-ADV-84219',
    businessName: 'भोपाल स्वाद रेस्टोरेंट',
    format: 'video_ad',
    impressions: 48200,
    clicks: 453,
    ctr: 0.94,
    dailyBudget: 400,
    totalSpend: 2800.0,
    durationDays: 7,
    status: 'live',
  };

  const dynamicAgeDistribution = useMemo(() => {
    if (campaign.ageRange) {
      const minA = campaign.ageRange[0];
      const maxA = campaign.ageRange[1];
      const p1 = minA <= 24 ? 24 : 10;
      const p2 = minA <= 34 && maxA >= 25 ? 46 : 24;
      const p3 = maxA >= 35 ? 22 : 14;
      const p4 = 100 - (p1 + p2 + p3);
      return [
        { bracket: '18–24 वर्ष', percent: p1 },
        { bracket: '25–34 वर्ष', percent: p2 },
        { bracket: '35–44 वर्ष', percent: p3 },
        { bracket: '45+ वर्ष', percent: p4 },
      ];
    }
    return [
      { bracket: '18–24 वर्ष', percent: 18 },
      { bracket: '25–34 वर्ष', percent: 46 },
      { bracket: '35–44 वर्ष', percent: 28 },
      { bracket: '45+ वर्ष', percent: 8 },
    ];
  }, [campaign.ageRange]);

  const impressions = campaign.impressions || 48200;
  const clicks = campaign.clicks || 453;
  const totalSpend = campaign.totalSpend || (campaign.dailyBudget || 400) * (campaign.durationDays || 7);
  const cpc = clicks > 0 ? (totalSpend / clicks).toFixed(2) : '6.26';
  const ctr = campaign.ctr || ((clicks / impressions) * 100).toFixed(2);

  const formatNameMap = {
    video_ad: 'रील वीडियो विज्ञापन',
    grid_ad: 'ग्रिड विज्ञापन',
    carousel_ad: 'कैरोसेल विज्ञापन',
    feed_card_ad: 'फ़ीड कार्ड विज्ञापन',
    sponsored_ad: 'प्रायोजित कार्ड विज्ञापन',
  };

  const handleCreateNewCampaign = () => {
    resetDraftCampaign();
    navigate('/advertise/goal');
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      {/* Header */}
      <AdvertiserHeader
        variant="centered"
        title="विज्ञापन रिपोर्ट"
        subtitle="विज्ञापन के आंकड़े और परफॉर्मेंस"
        onBack={() => navigate('/advertise/dashboard')}
      />

      <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
        <div className="space-y-3.5">
          {/* 1. Campaign Identity Card */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#2B2437] text-white flex items-center justify-center font-bold text-[17px] shrink-0 shadow-2xs">
                {campaign.businessName?.charAt(0) || 'व्या'}
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#2B2437] leading-tight">
                  {campaign.businessName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#6B7280]">
                  <span>{formatNameMap[campaign.format] || 'रील विज्ञापन'}</span>
                  <span>•</span>
                  <span>#{campaign.orderId || 'NB-ADV-84219'}</span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-[#2B2437] text-white shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>लाइव</span>
            </span>
          </div>

          {/* 2. Primary 4 Performance Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* कुल व्यूज */}
            <div className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                  <Eye size={18} color="#E39026" variant="Bold" />
                </div>
                <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF9EE] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  +14% रीच
                </span>
              </div>
              <div>
                <span className="text-[12px] font-medium text-[#6B7280] block">
                  कुल व्यूज
                </span>
                <span className="text-[20px] font-bold text-[#2B2437] leading-tight block font-mono">
                  {Number(impressions).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-[#6B7280] font-normal block mt-0.5">
                  देखे गए विज्ञापन
                </span>
              </div>
            </div>

            {/* कुल क्लिक्स */}
            <div className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[12px] bg-[#F7F7F4] border border-[#E5E7EB] flex items-center justify-center text-[#2B2437]">
                  <Mouse size={18} color="#2B2437" variant="Bold" />
                </div>
                <span className="text-[10px] font-bold text-[#2B2437] bg-[#F7F7F4] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                  {ctr}% CTR
                </span>
              </div>
              <div>
                <span className="text-[12px] font-medium text-[#6B7280] block">
                  कुल क्लिक्स
                </span>
                <span className="text-[20px] font-bold text-[#2B2437] leading-tight block font-mono">
                  {Number(clicks).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-[#6B7280] font-normal block mt-0.5">
                  ग्राहकों का जुड़ाव
                </span>
              </div>
            </div>

            {/* कुल खर्च */}
            <div className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[12px] bg-[#F7F7F4] border border-[#E5E7EB] flex items-center justify-center text-[#2B2437]">
                  <MoneyChange size={18} color="#2B2437" variant="Bold" />
                </div>
                <span className="text-[11px] font-medium text-[#6B7280]">
                  {campaign.durationDays || 7} दिन
                </span>
              </div>
              <div>
                <span className="text-[12px] font-medium text-[#6B7280] block">
                  कुल खर्च
                </span>
                <span className="text-[20px] font-bold text-[#2B2437] leading-tight block font-mono">
                  ₹{Number(totalSpend).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-[#6B7280] font-normal block mt-0.5">
                  बजट: ₹{campaign.dailyBudget || 400}/दिन
                </span>
              </div>
            </div>

            {/* प्रति क्लिक लागत (CPC) */}
            <div className="bg-white rounded-[20px] p-3.5 border border-[#E5E7EB] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[12px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                  <TrendUp size={18} color="#E39026" variant="Bold" />
                </div>
                <span className="text-[10px] font-bold text-[#D97706] bg-[#FFF9EE] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  किफायती
                </span>
              </div>
              <div>
                <span className="text-[12px] font-medium text-[#6B7280] block">
                  प्रति क्लिक खर्च
                </span>
                <span className="text-[20px] font-bold text-[#2B2437] leading-tight block font-mono">
                  ₹{cpc}
                </span>
                <span className="text-[11px] text-[#6B7280] font-normal block mt-0.5">
                  औसत दर से बेहतर
                </span>
              </div>
            </div>
          </div>

          {/* 3. Audience Demographics (Gender + Age Breakdown) */}
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E7EB] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center text-[#E39026]">
                  <Profile2User size={18} color="#E39026" variant="Bold" />
                </div>
                <h3 className="text-[15px] font-bold text-[#2B2437]">
                  उम्र और जेंडर
                </h3>
              </div>
              <span className="text-[11.5px] font-medium text-[#6B7280]">
                सत्यापित पाठक
              </span>
            </div>

            {/* Gender Ratio Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px] font-medium">
                <span className="flex items-center gap-1 text-[#2B2437]">
                  <Man size={15} color="#2B2437" variant="Bold" />
                  <span>पुरुष 54%</span>
                </span>
                <span className="flex items-center gap-1 text-[#E39026]">
                  <Woman size={15} color="#E39026" variant="Bold" />
                  <span>महिला 46%</span>
                </span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-[#F3F4F6]">
                <div className="bg-[#2B2437]" style={{ width: '54%' }} />
                <div className="bg-[#E39026]" style={{ width: '46%' }} />
              </div>
            </div>

            {/* Age Distribution */}
            <div className="space-y-2 pt-2 border-t border-[#F3F4F6]">
              <span className="text-[13px] font-semibold text-[#2B2437] block">
                उम्र के अनुसार
              </span>
              <div className="space-y-1.5">
                {dynamicAgeDistribution.map((item) => (
                  <div key={item.bracket} className="space-y-1">
                    <div className="flex justify-between text-[12px] font-medium text-[#2B2437]">
                      <span>{item.bracket}</span>
                      <span className="font-bold">{item.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2B2437] rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Concise Smart AI Advice Card */}
          <div className="bg-gradient-to-br from-[#FFF9EE] via-[#FFFDF9] to-[#FEF3C7]/40 border border-[#FDE68A] rounded-[20px] p-3.5 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#D97706] text-[13px] font-bold">
              <span>✨</span>
              <span>सुझाव</span>
            </div>
            <p className="text-[12.5px] text-[#2B2437] font-medium leading-relaxed">
              आपका विज्ञापन <span className="font-bold text-[#2B2437]">25-34 उम्र के लोगों</span> में सबसे लोकप्रिय रहा। शाम 6 बजे से रात 10 बजे के दौरान सबसे ज्यादा क्लिक्स मिले।
            </p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 pb-2">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsBudgetSheetOpen(true)}
              className="h-[50px] rounded-[16px] bg-white border border-[#2B2437] text-[#2B2437] font-medium text-[15px] shadow-xs flex items-center justify-center cursor-pointer hover:bg-[#2B2437]/5 active:scale-[0.99] transition-all"
            >
              बजट बदलें
            </button>

            <button
              type="button"
              onClick={handleCreateNewCampaign}
              className="h-[50px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[15px] shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] transition-all"
            >
              <span>नया विज्ञापन</span>
              <ArrowRight size={18} color="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>

      {/* Budget Adjustment Bottom Sheet */}
      <BudgetEditSheet
        isOpen={isBudgetSheetOpen}
        onClose={() => setIsBudgetSheetOpen(false)}
        campaign={campaign}
        onSaveBudget={(campId, newBudget) => {
          updateCampaignBudget(campId, newBudget);
        }}
      />
    </div>
  );
}
