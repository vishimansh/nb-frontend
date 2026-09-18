import React from 'react';

/**
 * AISummaryCard:
 * Key highlights card replicating the exact Figma export.
 * Features:
 * - Linear gradient from bottom-left pale peach (#FFF4E3) to top-right ice-blue (#E8F0FC)
 * - 24px extrabold headline in #18253B
 * - Sparkle subtitle in #64748B + amber ✦
 * - Subtle hairline divider
 * - 22px bold amber (#D9822B) tabular numbers (01 to 05)
 * - 16px font-medium body text in #334155 with 1.45 line-height
 */
export default function AISummaryCard({ points = [], aiSummary, className = "" }) {
  const defaultPoints = [
    "सुप्रीम कोर्ट ने भोपाल नगर निगम को सख्त निर्देश दिए",
    "आवासीय क्षेत्रों में चल रहे व्यावसायिक प्रतिष्ठानों पर कार्रवाई शुरू",
    "अब तक 200 से अधिक दुकानों को नोटिस जारी",
    "व्यापारी संगठनों ने कार्रवाई का विरोध जताया",
    "नगर निगम आयुक्त ने कहा - सभी को नियमानुसार समय दिया जाएगा"
  ];

  const rawList =
    Array.isArray(points) && points.length > 0
      ? points
      : Array.isArray(aiSummary?.points)
      ? aiSummary.points
      : Array.isArray(aiSummary) && aiSummary.length > 0
      ? aiSummary
      : defaultPoints;

  const resolvedPoints = rawList.map((p) =>
    typeof p === 'string' ? p : p?.text || p?.point || String(p)
  );

  return (
    <div className={`rounded-[24px] bg-gradient-to-tr from-[#FFF4E3] via-[#F8FAFD] to-[#E8F0FC] border border-[#E4E9F2] p-6 shadow-xs select-none ${className}`}>
      {/* 1. Header: अब तक की मुख्य बातें */}
      <h2 className="text-[24px] font-extrabold text-[#18253B] leading-tight tracking-tight">
        अब तक की मुख्य बातें
      </h2>

      {/* 2. Subtitle: ✦ AI सारांश • नवभारत द्वारा समीक्षित */}
      <div className="text-[12px] font-medium text-[#64748B] flex items-center gap-1.5 mt-1.5 mb-4">
        <span className="text-[#D9822B] text-[13px] leading-none">✦</span>
        <span>AI सारांश • नवभारत द्वारा समीक्षित</span>
      </div>

      {/* 3. Hairline Divider */}
      <div className="w-full h-[1px] bg-[#E2E8F0]/80 mb-5" />

      {/* 4. Numbered Points (01 to 05) */}
      <div className="space-y-5">
        {resolvedPoints.map((pointText, index) => {
          const num = String(index + 1).padStart(2, '0');
          return (
            <div key={index} className="flex items-start gap-[10px]">
              <span className="text-[22px] font-bold text-[#D9822B] shrink-0 font-sans tracking-tight leading-none pt-0.5 tabular-nums">
                {num}
              </span>
              <p className="text-[16px] font-medium text-[#334155] leading-[1.45] tracking-normal">
                {pointText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
