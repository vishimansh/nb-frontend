import React, { useState } from "react";
import { User, QuoteUp } from "iconsax-react";

/**
 * Block type 3 — Quote / opinion card (QuoteCard)
 *
 * Prop shape:
 * {
 *   quote: string,
 *   authorName: string,
 *   authorTitle: string,
 *   authorPhoto: string | null, // falls back to placeholder icon when null
 * }
 *
 * Requirements:
 * - White rounded card, drop shadow, floating over page background.
 * - Large quote text at top.
 * - Thin divider line.
 * - Attribution row: circular avatar photo + bold name + smaller gray designation/title line below name.
 * - Decorative oversized quotation-mark glyph, gold/tan color, bottom-right corner — purely ornamental.
 * - Avatar fallback placeholder when authorPhoto is null or fails to load.
 */
export default function QuoteCard({
  quote,
  authorName,
  authorTitle,
  authorPhoto,
  className = "",
  // Backwards compatibility for raw block object
  block,
}) {
  const [imgError, setImgError] = useState(false);

  // Extract from props or nested objects
  const rawQuote = quote || block?.quote;
  const quoteText =
    typeof rawQuote === "string"
      ? rawQuote
      : rawQuote?.quoteText || rawQuote?.text || block?.text || "";

  const name =
    authorName ||
    (typeof rawQuote === "object" ? rawQuote?.authorName || rawQuote?.author?.name : null) ||
    block?.author?.name ||
    "डॉ. अनिल मेहता";

  const title =
    authorTitle ||
    (typeof rawQuote === "object" ? rawQuote?.authorTitle || rawQuote?.author?.title : null) ||
    block?.author?.title ||
    "शहरी नियोजन विशेषज्ञ, भोपाल";

  const photo =
    authorPhoto !== undefined
      ? authorPhoto
      : (typeof rawQuote === "object"
          ? rawQuote?.authorPhoto || rawQuote?.avatarUrl || rawQuote?.author?.avatarUrl
          : null) ??
        block?.author?.avatarUrl ??
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80";

  if (!quoteText) return null;

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#E5E7EB]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative select-none ${className}`}
    >
      {/* Large Quote Text at the top */}
      <p className="text-[#334155] text-[16.5px] leading-[1.65] font-normal tracking-normal select-text">
        {quoteText}
      </p>

      {/* Thin Horizontal Hairline Divider */}
      <div className="w-full h-[1px] bg-[#E2E8F0] my-4" />

      {/* Attribution Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with Sensible Fallback */}
          {photo && !imgError ? (
            <img
              src={photo}
              alt={name}
              onError={() => setImgError(true)}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100 shadow-2xs"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] shrink-0">
              <User size={24} color="#94A3B8" variant="Bold" />
            </div>
          )}

          {/* Name & Title */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-[16px] font-bold text-[#2B2437] truncate leading-tight">
              {name}
            </h4>
            <p className="text-[13px] text-[#64748B] truncate leading-tight mt-1">
              {title}
            </p>
          </div>
        </div>

        {/* Decorative Oversized Gold/Tan Quotation-mark Glyph */}
        <div className="shrink-0 text-[#E0BA78] flex items-center justify-end select-none pr-1 opacity-90">
          <QuoteUp size={36} color="#E0BA78" variant="Bold" />
        </div>
      </div>
    </div>
  );
}
