import React from 'react';
import { Buildings2, Global, TrendUp } from 'iconsax-react';

/**
 * Standardized Search Icons using iconsax-react library
 */
export function StatueHeritageIcon({ size = 18, color = '#F5B55C', variant = 'Bold' }) {
  return <Buildings2 size={size} color={color} variant={variant} />;
}

export function IndiaMapOutlineIcon({ size = 18, color = '#2B2437', variant = 'Bold' }) {
  return <Global size={size} color={color} variant={variant} />;
}

export function TrendUpArrowIcon({ size = 16, color = 'currentColor', variant = 'Linear', className = '' }) {
  return <TrendUp size={size} color={color} variant={variant} className={className} />;
}
