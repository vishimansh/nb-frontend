import React, { useState } from "react";

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
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}

          {/* Name & Title */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-[16px] font-bold text-[#1E213D] truncate leading-tight">
              {name}
            </h4>
            <p className="text-[13px] text-[#64748B] truncate leading-tight mt-1">
              {title}
            </p>
          </div>
        </div>

        {/* Decorative Oversized Gold/Tan Quotation-mark Glyph (Figma Screenshot 2) */}
        <div className="shrink-0 text-[#E0BA78] flex items-center justify-end select-none pr-1">
          <svg
            className="w-10 h-10 fill-current opacity-90"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M12.5 12C9.5 14.5 7.5 18 7.5 22.5C7.5 25.5 9.5 27.5 12.5 27.5C15 27.5 17 25.5 17 23C17 20.5 15 18.5 12.5 18.5C12 18.5 11.5 18.6 11 18.8C11.5 16 13.5 13.5 15.5 12.5L12.5 12ZM27.5 12C24.5 14.5 22.5 18 22.5 22.5C22.5 25.5 24.5 27.5 27.5 27.5C30 27.5 32 25.5 32 23C32 20.5 30 18.5 27.5 18.5C27 18.5 26.5 18.6 26 18.8C26.5 16 28.5 13.5 30.5 12.5L27.5 12Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
