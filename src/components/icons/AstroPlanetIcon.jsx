import React, { useId } from 'react';

/**
 * 10/10 Astro Planet Icon
 * Faithful recreation of the cosmic ringed planet with orbital belts,
 * dynamic speed accents, spherical depth contours, and 4-pointed sparkle stars.
 *
 * Supports:
 * - size (number | string, default 24)
 * - color (string, default 'currentColor')
 * - gradient (boolean, default false - enables the screenshot's magenta-purple-cyan cosmic gradient)
 * - strokeWidth (number, default 2.2)
 */
export default function AstroPlanetIcon({
  size = 24,
  color = 'currentColor',
  gradient = false,
  strokeWidth = 2.2,
  className = '',
  style = {},
  ...props
}) {
  const rawId = useId();
  const gradId = `astro-cosmic-grad-${rawId.replace(/[:]/g, '')}`;
  const maskId = `astro-planet-mask-${rawId.replace(/[:]/g, '')}`;

  const strokeColor = gradient || color === 'gradient' ? `url(#${gradId})` : color;
  const fillColor = gradient || color === 'gradient' ? `url(#${gradId})` : color;

  // Star helper: 4-pointed sparkle with smooth flared curves
  const renderStar = (cx, cy, sy, sx = sy * 0.72) => (
    <path
      d={`M ${cx} ${cy - sy} Q ${cx} ${cy} ${cx + sx} ${cy} Q ${cx} ${cy} ${cx} ${cy + sy} Q ${cx} ${cy} ${cx - sx} ${cy} Q ${cx} ${cy} ${cx} ${cy - sy} Z`}
      fill={fillColor}
      stroke="none"
    />
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...props}
    >
      <defs>
        {/* Screenshot cosmic gradient: magenta -> deep purple -> periwinkle -> teal/slate */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C2479" />
          <stop offset="25%" stopColor="#AD3386" />
          <stop offset="55%" stopColor="#715B9A" />
          <stop offset="80%" stopColor="#4E7BAA" />
          <stop offset="100%" stopColor="#5E999E" />
        </linearGradient>

        {/* Mask that hides rear rings behind the planet sphere */}
        <mask id={maskId}>
          <rect x="-100" y="-100" width="200" height="200" fill="#ffffff" />
          {/* Planet sphere occlusion */}
          <circle cx="0" cy="0" r="20" fill="#000000" />
        </mask>
      </defs>

      {/* 4-Pointed Sparkle Stars (placed per screenshot composition) */}
      <g className="astro-stars">
        {renderStar(45.5, 9, 7.2, 5)}       {/* Top center star */}
        {renderStar(73.5, 14.5, 6.2, 4.4)}   {/* Top right star */}
        {renderStar(82.5, 44, 5.8, 4)}       {/* Mid-right star */}
        {renderStar(79.5, 78, 4.2, 3)}       {/* Bottom-right small star */}
        {renderStar(51, 91, 5.5, 3.8)}       {/* Bottom center star */}
        {renderStar(23, 83.5, 7, 4.8)}       {/* Bottom-left star */}
        {renderStar(15.5, 54, 5.5, 3.8)}     {/* Mid-left star */}
      </g>

      {/* Planet & Orbiting Ring System (tilted ~41° diagonal) */}
      <g
        transform="translate(50, 50) rotate(41)"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* REAR RINGS (pass behind the upper hemisphere of the planet) */}
        <g mask={`url(#${maskId})`}>
          {/* Outer rear ring arc */}
          <path d="M -46 0 A 46 13.6 0 0 1 46 0" />
          {/* Middle rear ring groove */}
          <path d="M -42 0 A 42 11.8 0 0 1 42 0" />
          {/* Inner rear ring arc */}
          <path d="M -37.5 0 A 37.5 9.8 0 0 1 37.5 0" />
        </g>

        {/* PLANET SPHERE OUTLINE */}
        {/* Upper hemisphere (visible behind front rings) */}
        <path d="M -20 0 A 20 20 0 0 1 20 0" />
        {/* Lower hemisphere (emerges underneath front rings) */}
        <path d="M -16.5 11.3 A 20 20 0 0 0 16.5 11.3" />

        {/* SPHERICAL CRATER & ATMOSPHERE DETAIL CURVES */}
        <path
          d="M -7 -13.5 C -1.5 -16, 7.5 -15, 12 -9.5"
          strokeWidth={strokeWidth * 0.85}
        />
        <path
          d="M -3.5 -8.5 C 1.5 -10.5, 7 -9.5, 10 -6"
          strokeWidth={strokeWidth * 0.75}
        />
        <path
          d="M 13.5 4.5 C 15 7.5, 14 11, 12 13.5"
          strokeWidth={strokeWidth * 0.75}
        />

        {/* FRONT RINGS (sweep across the lower hemisphere of the planet) */}
        {/* Outer front ring arc */}
        <path d="M -46 0 A 46 13.6 0 0 0 46 0" />
        {/* Middle front ring groove */}
        <path d="M -42 0 A 42 11.8 0 0 0 42 0" />
        {/* Inner front ring arc */}
        <path d="M -37.5 0 A 37.5 9.8 0 0 0 37.5 0" />

        {/* DYNAMIC ORBITAL MOTION / SPEED ACCENT STROKES */}
        {/* Top-left outer speed accent */}
        <path
          d="M -39 -17 C -29 -18.5, -17 -17, -9 -14"
          strokeWidth={strokeWidth * 0.9}
        />
        {/* Top-left near-ring speed accent */}
        <path
          d="M -29 -11.5 C -23 -12.5, -17 -11.5, -13 -9.5"
          strokeWidth={strokeWidth * 0.8}
        />
        {/* Bottom-right outer speed accent */}
        <path
          d="M 11 15 C 21 17.5, 31 17.5, 39 14.5"
          strokeWidth={strokeWidth * 0.9}
        />
        {/* Bottom-right near-ring speed accent */}
        <path
          d="M 15 11.5 C 23 13.5, 29 13.5, 33 11.5"
          strokeWidth={strokeWidth * 0.8}
        />
      </g>
    </svg>
  );
}
