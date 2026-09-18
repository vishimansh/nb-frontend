import React from 'react';

/**
 * LiveUpdatesSection:
 * Replicating the exact Figma export for the Live Updates module.
 * Features:
 * - Pale warm cream-blush card surface (#FAF5F2) with #F0E2DA border and rounded-[24px]
 * - Dual-concentric crimson live indicator
 * - 24px bold headline "लाइव अपडेट्स" with #A6342E "अपडेट जारी"
 * - #E6D0C5 hairline divider
 * - Exact left vertical hairline rail with solid red nodes
 * - Crimson time capsules (#991B1B)
 * - 16px bold update headlines and 13.5px muted slate details
 */
export default function LiveUpdatesSection({ updates = [], className = "" }) {
  const defaultUpdates = [
    {
      id: "upd-1",
      time: "10:24 AM",
      headline: "कोर्ट ने केंद्र और राज्यों से 4 हफ्ते में जवाब मांगा,",
      detail: "मामले में अगली सुनवाई से पहले विस्तृत जवाब दाखिल करने को कहा।"
    },
    {
      id: "upd-2",
      time: "10:02 AM",
      headline: "डेटा सुरक्षा पर नई गाइडलाइन तैयार करने के संकेत,",
      detail: "केंद्र सरकार ने सभी हितधारकों से सुझाव लेने की प्रक्रिया शुरू करने पर विचार किया।"
    },
    {
      id: "upd-3",
      time: "09:37 AM",
      headline: "अगली सुनवाई 15 अक्टूबर को तय,",
      detail: "सुप्रीम कोर्ट ने कहा कि तब तक सभी पक्ष अपनी-अपनी तैयारियां पूरी रखें।"
    },
    {
      id: "upd-4",
      time: "09:15 AM",
      headline: "भोपाल नगर निगम की टीम मौके पर पहुंची,",
      detail: "अधिकारियों ने प्रभावित इलाकों का निरीक्षण कर स्थानीय लोगों से बातचीत की।"
    },
    {
      id: "upd-5",
      time: "08:50 AM",
      headline: "स्थानीय व्यापारियों ने प्रशासन से मुलाकात की,",
      detail: "व्यापारिक गतिविधियों पर पड़ रहे असर को लेकर जल्द समाधान की मांग रखी।"
    }
  ];

  const list = updates && updates.length > 0 ? updates : defaultUpdates;

  return (
    <div className={`rounded-[24px] bg-[#FAF5F2] border border-[#F0E2DA] p-6 shadow-xs select-none ${className}`}>
      {/* 1. Header: Concentric Live Indicator + लाइव अपडेट्स + अपडेट जारी */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Concentric red live indicator matching Figma */}
          <div className="w-5 h-5 rounded-full bg-[#E5B8B1]/70 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8E2323]" />
          </div>

          <h3 className="text-[24px] font-bold text-[#1E213D] leading-none tracking-tight">
            लाइव अपडेट्स
          </h3>
        </div>

        <span className="text-[13px] font-medium text-[#A6342E]">
          अपडेट जारी
        </span>
      </div>

      {/* Hairline Divider */}
      <div className="w-full h-[1px] bg-[#E6D0C5] mt-4 mb-6" />

      {/* 2. Vertical Timeline with Continuous Rail */}
      <div className="relative pl-1">
        {/* Continuous Vertical Rail Line */}
        <div className="absolute left-[3.5px] top-1.5 bottom-6 w-[1.5px] bg-[#E6D0C5]" />

        {/* Timeline Items List */}
        <div className="space-y-6">
          {list.map((item, idx) => {
            const time = item.time || item.timestamp;
            const heading = item.headline || item.title;
            const detail = item.detail || item.content || item.description;

            return (
              <div key={item.id || idx} className="relative flex items-start gap-3.5">
                {/* Red Node Dot on the Rail */}
                <div className="relative z-10 w-2 h-2 rounded-full bg-[#991B1B] shrink-0 mt-[6px]" />

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  {/* Crimson Capsule Time Pill */}
                  <span className="bg-[#991B1B] text-white text-[11px] font-semibold px-2.5 py-[3px] rounded-[6px] inline-block tracking-wide shadow-2xs leading-tight font-sans">
                    {time}
                  </span>

                  {/* Headline (16px bold) */}
                  <h4 className="text-[16px] font-bold text-[#1E213D] leading-[1.38] mt-2.5 tracking-tight">
                    {heading}
                  </h4>

                  {/* Detail (13.5px slate) */}
                  {detail && (
                    <p className="text-[13.5px] font-normal text-[#64748B] leading-[1.48] mt-1.5">
                      {detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
