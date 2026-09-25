import React from 'react';

/**
 * AstroZodiacWheelIcon (राशि चक्र)
 * Lightweight, hollow line-art icon matching Lucide and Iconsax aesthetics:
 * - 100% outline/stroke based (no solid fills or heavy dots)
 * - Beautiful open astrological wheel with 12 houses (rashis)
 * - Concentric dashed astrological orbit ring
 * - Hollow radiant Sun (Surya) core
 * - Same color inheritance as other icons (via `color`, default 'currentColor')
 * - Same stroke weight (1.8) and standard 24x24 viewBox
 */
export default function AstroZodiacWheelIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.8,
  className = '',
  style = {},
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...props}
    >
      {/* Outer Celestial Wheel Dial Rim */}
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} fill="none" />

      {/* 12 Clean Radial House Dividers (The 12 Astrological Houses / 30° each) */}
      <g stroke={color} strokeWidth={strokeWidth * 0.7}>
        <line x1="12" y1="2.5" x2="12" y2="6.4" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(30 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(60 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(90 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(120 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(150 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(180 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(210 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(240 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(270 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(300 12 12)" />
        <line x1="12" y1="2.5" x2="12" y2="6.4" transform="rotate(330 12 12)" />
      </g>

      {/* Concentric Inner Ring */}
      <circle cx="12" cy="12" r="5.6" stroke={color} strokeWidth={strokeWidth * 0.75} fill="none" />

      {/* Delicate Dashed Astrological Orbit Ring */}
      <circle
        cx="12"
        cy="12"
        r="4.2"
        stroke={color}
        strokeWidth={strokeWidth * 0.6}
        strokeDasharray="1.2 1.6"
        fill="none"
      />

      {/* Hollow Central Sun Core (No heavy solid fill) */}
      <circle cx="12" cy="12" r="1.8" stroke={color} strokeWidth={strokeWidth * 0.75} fill="none" />

      {/* Central Sun Radiating Rays (8 clean rays) */}
      <g stroke={color} strokeWidth={strokeWidth * 0.65}>
        <line x1="12" y1="8.9" x2="12" y2="9.8" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(45 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(90 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(135 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(180 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(225 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(270 12 12)" />
        <line x1="12" y1="8.9" x2="12" y2="9.8" transform="rotate(315 12 12)" />
      </g>
    </svg>
  );
}
