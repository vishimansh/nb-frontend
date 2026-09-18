import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft2 } from 'iconsax-react';

/**
 * Standardized Back Button used throughout the entire application
 * Matches the canonical Search Screen back button:
 * - 46px × 46px square footprint
 * - 14px rounded corners (rounded-[14px])
 * - Clean white background (#FFFFFF)
 * - Subtle border (#D1D5DB)
 * - 20px Iconsax ArrowLeft2 icon in navy (#18253B)
 * - Micro-interaction active:scale-95 transition
 */
export default function BackButton({
  onClick,
  ariaLabel = 'पीछे जाएं',
  className = '',
  iconSize = 20,
  iconColor = '#18253B',
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`w-[46px] h-[46px] rounded-[14px] bg-white border border-[#D1D5DB] flex items-center justify-center shadow-2xs cursor-pointer active:scale-95 flex-shrink-0 transition-transform text-[#18253B] ${className}`}
    >
      <ArrowLeft2 size={iconSize} color={iconColor} variant="Linear" />
    </button>
  );
}
