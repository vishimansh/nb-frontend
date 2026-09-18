import React from 'react';

/**
 * Block type 1 — Body text (ArticleTextBlock)
 * 
 * Prop shape:
 *   { text: string, isLeadParagraph: boolean, location?: string }
 *
 * Requirements:
 * - Standard paragraph text, regular weight, comfortable line-height for long-form Devanagari reading.
 * - Dateline convention: the article's opening paragraph leads with a bold city name + colon inline
 *   (e.g. "भोपाल:") followed by regular-weight text in the same paragraph.
 * - Sits directly on page background with clear blank-line separation between paragraphs (no card/border).
 */
export default function ArticleTextBlock({
  text,
  isLeadParagraph = false,
  location = "भोपाल",
  leadDateline,
  block,
}) {
  const resolvedText = text || block?.text || "";
  const isLead = isLeadParagraph ?? leadDateline ?? block?.isLeadParagraph ?? block?.isLead ?? false;
  const resolvedLocation = location || block?.location || "भोपाल";

  if (!resolvedText) return null;

  return (
    <p className="text-[18px] text-[#334155] leading-[1.72] font-normal tracking-normal mb-4 last:mb-0 select-text">
      {isLead && resolvedLocation && (
        <strong className="font-bold text-[#18253B]">
          {resolvedLocation}:&nbsp;
        </strong>
      )}
      {resolvedText}
    </p>
  );
}
