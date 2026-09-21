import React from "react";
import { LampOn } from "iconsax-react";
import pt1Illustration from "../../assets/illustrations/infographic_pt1.png";
import pt2Illustration from "../../assets/illustrations/infographic_pt2.png";
import pt3Illustration from "../../assets/illustrations/infographic_pt3.png";

const defaultIllustrations = [pt1Illustration, pt2Illustration, pt3Illustration];

/**
 * Block type 4 — Infographic card (InfographicCard)
 *
 * Prop shape:
 * {
 *   title: string,
 *   subtitle: string,
 *   points: [
 *     { number: number, title: string, description: string, illustration: string }
 *   ], // variable length; illustration is a custom asset per point
 *   bigPicture: { heading: string, text: string },
 * }
 *
 * Requirements:
 * - White rounded card, drop shadow.
 * - Header row: bold title with vertical accent bar, gray subtitle top-right.
 * - Variable-length numbered points (01, 02, 03...):
 *   circular numbered badge (tan/peach fill, bold number) + bold point title +
 *   description paragraph + themed flat illustration to the right of each point.
 * - Closing callout: "💡 बड़ी तस्वीर" (Big Picture) box — light amber/tan background,
 *   bulb icon + heading + one-line takeaway text.
 */
export default function InfographicCard({
  title,
  subtitle,
  points,
  bigPicture,
  className = "",
  // Backwards compatibility for raw block object
  infographic,
  block,
}) {
  const data = infographic || block || {};
  const resolvedTitle = title || data.title || "3 बड़े बिंदु";
  const resolvedSubtitle = subtitle || data.subtitle || "इस खबर की मुख्य बातें";

  const rawPoints = points || data.points || [];
  const resolvedBigPicture = bigPicture || data.bigPicture || {
    heading: data.bigPicture?.title || "बड़ी तस्वीर",
    text:
      data.bigPicture?.text ||
      "शहर के संतुलित विकास के लिए आवासीय और व्यावसायिक उपयोग के नियमों का पालन जरूरी है।",
  };

  return (
    <div
      className={`rounded-[24px] bg-white border border-[#E5E7EB]/80 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] select-none ${className}`}
    >
      {/* Header Row: Accent Bar + Title & Subtitle */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-1.5 h-6 bg-[#C86414] rounded-full shrink-0" />
          <h3 className="text-[22px] font-bold text-[#2B2437] leading-none tracking-tight">
            {resolvedTitle}
          </h3>
        </div>
        {resolvedSubtitle && (
          <span className="text-[13px] text-[#64748B] font-medium leading-none shrink-0">
            {resolvedSubtitle}
          </span>
        )}
      </div>

      {/* Variable-length Numbered Points */}
      <div className="flex flex-col">
        {rawPoints.map((pt, idx) => {
          const pointNum = String(pt.number ?? idx + 1).padStart(2, "0");
          const illustrationSrc =
            pt.illustration && !pt.illustration.includes("unsplash.com")
              ? pt.illustration
              : defaultIllustrations[idx % defaultIllustrations.length];

          return (
            <React.Fragment key={idx}>
              {idx > 0 && <div className="w-full h-[1px] bg-[#F1F5F9] my-4" />}

              <div className="flex items-start justify-between gap-3">
                {/* Left Side: Number badge, title & description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    {/* Circular Badge */}
                    <div className="w-9 h-9 rounded-full bg-[#FDF2E9] border border-[#FADCC7] flex items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-[14.5px] font-bold text-[#C86414] leading-none">
                        {pointNum}
                      </span>
                    </div>

                    {/* Point Title */}
                    <h4 className="text-[16px] font-bold text-[#2B2437] leading-snug">
                      {pt.title}
                    </h4>
                  </div>

                  {/* Description Paragraph */}
                  <p className="text-[13.5px] text-[#475569] leading-[1.55] font-normal mt-2.5 pl-0.5">
                    {pt.description}
                  </p>
                </div>

                {/* Right Side: Themed Flat Illustration */}
                {illustrationSrc && (
                  <div className="w-[120px] shrink-0 flex items-center justify-center self-center pl-1">
                    <img
                      src={illustrationSrc}
                      alt={pt.title || "Illustration"}
                      className="w-full h-auto max-h-[105px] object-contain block"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Closing Callout: "💡 बड़ी तस्वीर" (Big Picture) Box */}
      {resolvedBigPicture && (
        <div className="bg-[#FDF6ED] border border-[#FCECD8] rounded-[16px] p-3.5 mt-5 flex items-center gap-3">
          {/* Bulb Icon + Heading */}
          <div className="flex items-center gap-1.5 shrink-0">
            <LampOn size={20} color="#B45309" variant="Bold" className="shrink-0" />
            <span className="text-[15px] font-bold text-[#B45309] leading-none">
              {resolvedBigPicture.heading || resolvedBigPicture.title || "बड़ी तस्वीर"}
            </span>
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-[1px] bg-[#E8D7C6] shrink-0" />

          {/* One-line Takeaway Text */}
          <p className="text-[12.5px] text-[#475569] leading-[1.4] font-normal min-w-0">
            {resolvedBigPicture.text}
          </p>
        </div>
      )}
    </div>
  );
}
