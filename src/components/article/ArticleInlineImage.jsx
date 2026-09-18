import React, { useState } from 'react';

/**
 * Block type 2 — Inline image (ArticleInlineImage)
 * Distinct from the hero image — do not reuse that component.
 *
 * Prop shape:
 * {
 *   image: string,
 *   caption: string,
 *   location: string,
 * }
 *
 * Requirements:
 * - Inset, not full-bleed: rounded corners, sits within the article's text column margins,
 *   with a white card border/shadow around it.
 * - Top-left overlay: small location tag (dot + city name), compact size.
 * - Top-right overlay: share icon only — no bookmark, no three-dot menu.
 * - Bottom-left overlay: dynamic caption text on a dark gradient scrim.
 */
export default function ArticleInlineImage({
  image,
  caption,
  location,
  onShare,
  imageBlock,
  block,
}) {
  const [copied, setCopied] = useState(false);

  // Resolve props from multiple possible formats for compatibility
  const resolvedImage = image || imageBlock?.imageUrl || imageBlock?.image || block?.imageUrl || block?.image;
  const resolvedCaption = caption || imageBlock?.caption || block?.caption || "";
  const resolvedLocation = location || imageBlock?.location || block?.location || "भोपाल";

  if (!resolvedImage) return null;

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="w-full rounded-[20px] overflow-hidden border border-white/60 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative select-none">
      {/* 16:10 Aspect Ratio Inset Image Container */}
      <div className="w-full aspect-[16/10.5] relative overflow-hidden bg-gray-100">
        <img
          src={resolvedImage}
          alt={resolvedCaption || "Article Inline Photo"}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Bottom Dark Gradient Scrim for caption legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-0" />

        {/* Top-Left: Compact Location Tag (dot + city name) */}
        {resolvedLocation && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#1E213D]/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EEEBDA] inline-block shrink-0" />
            <span>{resolvedLocation}</span>
          </div>
        )}

        {/* Top-Right: Share Icon Only (WhatsApp glyph matching Figma, no bookmark, no 3-dots) */}
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="शेयर करें"
          className="w-7 h-7 rounded-full bg-[#1E213D]/70 backdrop-blur-xs flex items-center justify-center text-white absolute top-2.5 right-2.5 z-10 cursor-pointer active:scale-90 shadow-sm border border-white/15 transition-transform"
        >
          {/* WhatsApp / Share Glyph */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.04 3.67Z" />
          </svg>
        </button>

        {/* Copy Feedback */}
        {copied && (
          <div className="absolute top-11 right-2.5 bg-[#1E213D] text-white text-[10px] px-2 py-0.5 rounded shadow-md z-20 animate-fade-in">
            लिंक कॉपी हुआ!
          </div>
        )}

        {/* Bottom-Left: Dynamic Caption Text on Scrim */}
        {resolvedCaption && (
          <div className="absolute bottom-0 inset-x-0 p-3 pt-6 z-10">
            <p className="text-white/95 text-[12px] leading-[1.38] font-normal drop-shadow-sm">
              {resolvedCaption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
