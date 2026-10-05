import React, { useState } from 'react';
import V2Header from '../components/chrome/V2Header';
import Button from '../components/ui/Button';
import HelpSheet from '../components/sheets/HelpSheet';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useFlowNav } from '../router/useFlowNav';
import { getRejectionReasonById } from '../data/rejectionReasons';
import { formatIN } from '../utils/formatIN';
import { track } from '../utils/track';
import { STRINGS } from '../strings/hi';
import { openWhatsAppSupport } from '../utils/whatsapp';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
  AlertCircle,
} from 'lucide-react';

const TIMELINE_STEPS = [
  { id: 'payment', label: STRINGS.status.step1 },
  { id: 'in_review', label: STRINGS.status.step2 },
  { id: 'approved', label: STRINGS.status.step3 },
  { id: 'live', label: STRINGS.status.step4 },
];

export default function S09_Status({ onOpenFacilitator }) {
  const { state, updatePrefs, loadDraftFromCampaign } = useAdvertiserV2();
  const { navigateTo } = useFlowNav();

  const [showHelpSheet, setShowHelpSheet] = useState(false);

  // Latest campaign
  const campaign = state.campaigns[0] || {
    id: 'cmp-mock',
    orderId: 'NB-ADV-48213',
    status: 'in_review',
    money: { total: 2065 },
    extraCheck: false,
    rejection: null,
  };

  const status = campaign.status || 'in_review';
  const whatsappUpdates = state.prefs?.whatsappUpdates ?? true;

  // Determine current timeline step index
  let activeStepIndex = 1; // 0=payment, 1=in_review, 2=approved, 3=live
  if (status === 'approved' || status === 'scheduled') {
    activeStepIndex = 2;
  } else if (status === 'live' || status === 'completed') {
    activeStepIndex = 3;
  }

  const handleFixAndResubmit = () => {
    track('resubmit', { campaignId: campaign.id });
    loadDraftFromCampaign(campaign.id);

    const reason = getRejectionReasonById(campaign.rejection?.reasonId);
    if (reason.field === 'none') {
      openWhatsAppSupport('नमस्ते! मेरे विज्ञापन के लिए अतिरिक्त कागज़ात की जाँच में सहायता चाहिए.');
      return;
    }

    navigateTo('ad', {
      focusField: reason.field || 'headline',
      resubmitFor: campaign.id,
    });
  };

  const rejectionReason = getRejectionReasonById(campaign.rejection?.reasonId);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F7F4] overflow-hidden select-none">
      {/* Header (Back button navigates to Dashboard) */}
      <V2Header
        showBack
        onBack={() => navigateTo('dashboard')}
        onHelp={() => setShowHelpSheet(true)}
        onLogoLongPress={onOpenFacilitator}
      />

      {/* Main Status Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none">
        {/* Order Card Banner */}
        <div className="p-3.5 rounded-[20px] bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11.5px] font-bold text-[#6B7280] uppercase tracking-wider">
              ऑर्डर विवरण
            </span>
            <span className="text-[15px] font-extrabold text-[#2B2437] mt-0.5">
              {campaign.orderId} • {formatIN(campaign.money?.total || 2065)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#EEF8F2] border border-[#A7F3D0] flex items-center justify-center text-[#2F8F5B]">
            <CheckCircle2 className="w-4 h-4 text-[#2F8F5B]" />
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
          <h3 className="text-[15px] font-extrabold text-[#2B2437]">
            प्रक्रिया की स्थिति
          </h3>

          <div className="flex flex-col">
            {TIMELINE_STEPS.map((step, idx) => {
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isLast = idx === TIMELINE_STEPS.length - 1;

              return (
                <div key={step.id} className="flex items-start gap-3.5">

                  {/* Left column: node + connector segment */}
                  <div className="flex flex-col items-center shrink-0 w-8">
                    {/* Step Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isPast
                          ? 'bg-[#2F8F5B] text-white shadow-2xs'
                          : isCurrent
                          ? 'bg-white border-2 border-[#E39026] shadow-[0_0_0_3px_rgba(227,144,38,0.15)]'
                          : 'bg-[#F3F4F6] border border-[#E5E7EB]'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-[#E39026] animate-pulse" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
                      )}
                    </div>

                    {/* Connector segment between this node and the next */}
                    {!isLast && (
                      <div
                        className={`w-[2px] rounded-full my-1 transition-all duration-500 ${
                          isPast ? 'bg-[#2F8F5B]' : 'bg-[#E5E7EB]'
                        }`}
                        style={{ height: isCurrent ? '34px' : '22px' }}
                      />
                    )}
                  </div>

                  {/* Right column: label + optional subtitle */}
                  <div className={`flex flex-col justify-center min-w-0 pt-0.5 ${
                    !isLast ? (isCurrent ? 'pb-4' : 'pb-2') : 'pb-1'
                  }`}>
                    <span
                      className={`text-[14px] leading-snug ${
                        isCurrent
                          ? 'font-bold text-[#2B2437]'
                          : isPast
                          ? 'font-semibold text-[#2F8F5B]'
                          : 'font-medium text-[#9CA3AF]'
                      }`}
                    >
                      {step.label}
                    </span>

                    {isCurrent && (
                      <span className="text-[11.5px] text-[#E39026] font-semibold mt-0.5 leading-snug">
                        प्रक्रिया जारी है...
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[11px] text-[#6EBA98] font-medium mt-0.5 leading-snug">
                        पूरा हुआ ✓
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* State-specific Interactive Card */}
        {status === 'in_review' && (
          <div className="p-4 rounded-[22px] bg-[#FFF9EE] border border-[#FDE68A] flex flex-col gap-3 animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-2.5 text-[#C97F1E]">
              <div className="w-8 h-8 rounded-[12px] bg-white border border-[#FDE68A] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#E39026]" />
              </div>
              <div>
                <h4 className="font-extrabold text-[14.5px] text-[#2B2437]">
                  {STRINGS.status.inReviewTitle}
                </h4>
                <p className="text-[12px] font-medium text-[#6B7280]">
                  {STRINGS.status.inReviewSubtitle}
                </p>
              </div>
            </div>

            {campaign.extraCheck && (
              <span className="text-[11.5px] font-semibold text-[#C97F1E] bg-white/80 p-2 rounded-xl border border-amber-200">
                {STRINGS.status.extraCheckNotice}
              </span>
            )}

            {/* WhatsApp Updates Switch */}
            <div className="pt-2 border-t border-[#FDE68A]/60 flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-[#4A4358]">
                {STRINGS.status.whatsappUpdatesToggle}
              </span>
              <input
                type="checkbox"
                checked={whatsappUpdates}
                onChange={(e) => updatePrefs({ whatsappUpdates: e.target.checked })}
                className="w-4 h-4 accent-[#E39026] cursor-pointer"
              />
            </div>
          </div>
        )}

        {status === 'needs_changes' && (
          <div className="p-4 rounded-[22px] bg-[#FEF2F2] border border-[#FECACA] flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5 text-[#DC2626]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="font-extrabold text-[15.5px]">
                {STRINGS.status.needsChangesTitle}
              </h4>
            </div>

            <p className="text-[13.5px] text-[#DC2626] font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-[#FECACA]">
              {rejectionReason.text}
            </p>

            <Button onClick={handleFixAndResubmit}>
              {rejectionReason.field === 'none'
                ? STRINGS.status.needSupportBtn
                : STRINGS.status.fixAndResubmitBtn}
            </Button>
          </div>
        )}

        {(status === 'approved' || status === 'scheduled') && (
          <div className="p-4 rounded-[22px] bg-[#EEF8F2] border border-[#A7F3D0] flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-[#2F8F5B]">
              <Sparkles className="w-5 h-5 text-[#2F8F5B]" />
              <h4 className="font-extrabold text-[15px]">
                {STRINGS.status.approvedTitle}
              </h4>
            </div>

            <span className="text-[13px] text-[#2F8F5B] font-medium">
              {STRINGS.status.startImmediate}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTo('dashboard')}
            >
              {STRINGS.status.dashboardBtn}
            </Button>
          </div>
        )}

        {status === 'live' && (
          <div className="p-4 rounded-[22px] bg-white border border-[#2B2437] shadow-sm flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-[#2F8F5B]">
              <Radio className="w-5 h-5 animate-pulse text-[#2F8F5B]" />
              <h4 className="font-extrabold text-[16px] text-[#2B2437]">
                {STRINGS.status.liveTitle}
              </h4>
            </div>

            <Button onClick={() => navigateTo('dashboard')}>
              {STRINGS.status.dashboardBtn}
            </Button>
          </div>
        )}
      </div>

      <HelpSheet
        isOpen={showHelpSheet}
        onClose={() => setShowHelpSheet(false)}
      />
    </div>
  );
}
