import React from 'react';

/**
 * Raja Bhoj Statue / Heritage Monument icon for City Trending Card
 */
export function StatueHeritageIcon({ size = 18, color = '#EEEBDA' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crown & Head */}
      <circle cx="12" cy="4" r="1.7" fill={color} />
      <path d="M10.8 2.2l1.2-1.2 1.2 1.2" />
      {/* Royal Robes & Torso */}
      <path d="M9.5 7.2L12 6l2.5 1.2v4.5l-2.5 1.8-2.5-1.8z" />
      {/* Upraised Sword in hand */}
      <path d="M6.8 9.5l-2 3.8 1.4.8 1.8-3" />
      <path d="M4.5 13.5l-1.5 4" />
      {/* Royal sash & legs */}
      <path d="M14.5 7.5l2.2 2.2-1 1.8-1.2-.8" />
      <path d="M10.5 13.5v5M13.5 13.5v5" />
      {/* Historic Circular Pedestal / Bastion */}
      <path d="M7 18.5h10" />
      <path d="M6 21h12" />
      <path d="M8 18.5v2.5M12 18.5v2.5M16 18.5v2.5" />
    </svg>
  );
}

/**
 * Clean silhouette vector of India Map for National Trending Card
 */
export function IndiaMapOutlineIcon({ size = 18, color = '#1E213D' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      className="shrink-0"
    >
      {/* Stylized vector map outline of India */}
      <path d="M16 2.5c-.7 0-1.3.5-1.8 1.1-.4.5-.8 1-1.4 1.3-.6.3-1.1.2-1.6.6-.4.4-.7 1-.9 1.6-.2.6-.6 1.1-1.2 1.4-.7.4-1.2.9-1.5 1.6-.3.6-.8 1.1-1.5 1.3-.7.2-1.2.7-1.5 1.3-.4.7-.9 1.1-1.6 1.3-.6.2-1.1.6-1.3 1.2-.3.7-.8 1.1-1.5 1.3-.7.2-1.2.7-1.4 1.4-.2.6.1 1.2.6 1.6.4.3.7.8.8 1.3.1.6.5 1.1 1.1 1.3.5.2.9.6 1.1 1.1.2.6.7 1 1.3 1.1.6.1 1 .5 1.3 1 .3.6.8 1 1.4 1.1.6.1 1 .5 1.3 1 .4.6.9 1 1.6 1.1.6.1 1 .5 1.3 1 .3.6.8 1 1.4 1.1.6.1 1 .6 1.2 1.2.3.7.8 1.1 1.5 1.1.5 0 1-.3 1.3-.8.4-.6.9-.9 1.6-.8.6.1 1.1-.2 1.4-.7.4-.6.9-.8 1.6-.7.6.1 1.1-.2 1.4-.7.4-.7 1-1 1.7-.9.7.1 1.2-.3 1.5-.9.4-.7 1-1 1.7-.9.6.1 1.1-.3 1.4-.8.4-.6.9-.8 1.6-.7.6.1 1.1-.3 1.4-.8.4-.7 1-1 1.7-.9.5.1 1-.2 1.3-.7.3-.6.7-1 1.3-1.1.6-.1 1-.5 1.3-1 .3-.6.7-1 1.3-1.1.6-.1 1-.5 1.3-1 .3-.6.7-1 1.3-1.1.5-.1.9-.5 1.1-1 .2-.6.5-1.1 1-1.3.5-.2.8-.7.9-1.3.1-.6.4-1.1.8-1.4.5-.4.7-.9.7-1.5 0-.6.3-1.1.7-1.4.5-.4.7-.9.7-1.5 0-.6.3-1.1.7-1.4.4-.4.7-.9.7-1.5 0-.7-.4-1.3-.9-1.6-.5-.3-.8-.8-.9-1.4-.1-.7-.5-1.2-1-1.4-.5-.3-.8-.8-.9-1.4-.1-.7-.5-1.2-1.1-1.4-.5-.2-.9-.7-1-1.3-.2-.7-.6-1.2-1.2-1.4-.5-.2-.9-.7-1.1-1.3-.2-.7-.6-1.2-1.2-1.4-.5-.2-.9-.7-1.1-1.3-.2-.7-.6-1.2-1.2-1.4-.5-.2-.9-.7-1.1-1.3-.2-.7-.7-1.2-1.3-1.4-.6-.2-1-.7-1.2-1.4-.3-.7-.8-1.2-1.5-1.4-.6-.2-1.1-.7-1.3-1.4-.3-.7-.8-1.2-1.5-1.4-.6-.2-1.1-.7-1.3-1.4-.3-.6-.8-1.1-1.5-1.3-.7-.2-1.2-.7-1.4-1.3-.2-.6-.7-1.1-1.3-1.2-.6 0-1.1-.4-1.4-.9-.4-.7-.9-1.1-1.6-1.2-.6 0-1.1-.4-1.4-.9-.4-.7-.9-1.1-1.6-1.2-.6 0-1.1-.4-1.4-.9-.5-.8-1.2-1.2-2-1.2z" />
    </svg>
  );
}

/**
 * Line-art trending up arrow matching the Figma reference design exactly
 */
export function TrendUpArrowIcon({ size = 13, color = 'currentColor', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
