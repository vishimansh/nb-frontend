import React, { useState } from 'react';
import { Whatsapp } from 'iconsax-react';

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
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2B2437]/85 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5B55C] inline-block shrink-0" />
            <span>{resolvedLocation}</span>
          </div>
        )}

        {/* Top-Right: Share Icon Only (WhatsApp glyph matching Figma, no bookmark, no 3-dots) */}
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="शेयर करें"
          className="w-7 h-7 rounded-full bg-[#2B2437]/70 backdrop-blur-xs flex items-center justify-center text-white absolute top-2.5 right-2.5 z-10 cursor-pointer active:scale-90 shadow-sm border border-white/15 transition-transform"
        >
          <Whatsapp size={15} color="#FFFFFF" variant="Bold" />
        </button>

        {/* Copy Feedback */}
        {copied && (
          <div className="absolute top-11 right-2.5 bg-[#2B2437] text-white text-[10px] px-2 py-0.5 rounded shadow-md z-20 animate-fade-in">
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
