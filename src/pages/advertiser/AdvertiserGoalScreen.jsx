import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Messages3, Global, ArrowRight, Radar } from 'iconsax-react';
import AdvertiserHeader from '../../components/advertiser/AdvertiserHeader';
import { useAdvertiser } from '../../context/AdvertiserContext';

const GOALS = [
  {
    id: 'reach',
    title: 'ज्यादा लोगों तक पहुंच (Reach)',
    desc: 'अपने इलाके में ज्यादा से ज्यादा लोगों को विज्ञापन दिखाएं',
    icon: Eye,
    defaultCta: 'अधिक जानें',
  },
  {
    id: 'engagement',
    title: 'कॉल और मैसेज (Inquiries)',
    desc: 'ग्राहकों से सीधे कॉल या व्हाट्सएप पर पूछताछ पाएं',
    icon: Messages3,
    defaultCta: 'व्हाट्सएप करें',
  },
  {
    id: 'ctrs',
    title: 'वेबसाइट या लिंक क्लिक्स (Clicks)',
    desc: 'अपनी वेबसाइट, सोशल मीडिया या स्टोर लिंक पर लोग लाएं',
    icon: Global,
    defaultCta: 'अभी देखें',
  },
];

export default function AdvertiserGoalScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromReview = location.state?.fromReview;
  const { draftCampaign, updateDraftCampaign } = useAdvertiser();
  const [selectedGoal, setSelectedGoal] = useState(draftCampaign.goal || 'reach');

  const handleProceed = () => {
    const goalObj = GOALS.find((g) => g.id === selectedGoal);
    updateDraftCampaign({
      goal: selectedGoal,
      ctaText: goalObj?.defaultCta || 'अधिक जानें',
    });

    if (fromReview) {
      navigate('/advertise/review');
    } else {
      navigate('/advertise/format');
    }
  };

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-y-auto scrollbar-none">
      <AdvertiserHeader
        variant="brand"
        step="1"
        totalSteps="7"
        onBack={() => {
          if (fromReview) {
            navigate('/advertise/review');
          } else {
            navigate('/advertise/dashboard');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between p-4 pb-8">
        <div>
          {/* Target Hero Icon from iconsax */}
          <div className="w-14 h-14 rounded-[16px] bg-[#FFF9EE] border border-[#FDE68A] flex items-center justify-center mx-auto mt-2 shadow-xs">
            <Radar size={28} color="#E39026" variant="Bold" />
          </div>

          <h1 className="text-[20px] font-bold text-[#2B2437] text-center mt-3 leading-tight">
            विज्ञापन का उद्देश्य चुनें
          </h1>
          <p className="text-[13px] text-[#6B7280] font-normal text-center mt-1">
            आप विज्ञापन से क्या हासिल करना चाहते हैं?
          </p>

          {/* Unified Card Stack */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-2.5 space-y-2 shadow-xs mt-4">
            {GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              const Icon = goal.icon;

              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`p-3.5 rounded-[16px] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-[#F9FAFB] border border-[#2B2437] ring-1 ring-[#2B2437] shadow-xs'
                      : 'hover:bg-[#F9FAFB]/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 pr-2">
                    <div className="w-11 h-11 rounded-[14px] bg-[#F7F7F4] flex items-center justify-center text-[#2B2437] shrink-0">
                      <Icon size={20} color="#2B2437" variant="Bold" />
                    </div>

                    <div>
                      <h2 className="text-[15px] font-bold text-[#2B2437] leading-tight">
                        {goal.title}
                      </h2>
                      <p className="text-[12.5px] text-[#6B7280] font-normal mt-0.5 leading-snug">
                        {goal.desc}
                      </p>
                    </div>
                  </div>

                  {/* Radio */}
                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#2B2437] bg-white'
                          : 'border-[#D1D5DB] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2B2437]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTA matching MVP onboarding button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full h-[56px] rounded-[16px] bg-[#2B2437] hover:bg-[#3D334E] text-white font-medium text-[18px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-colors"
          >
            <span>आगे बढ़ें</span>
            <ArrowRight size={20} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>
    </div>
  );
}
