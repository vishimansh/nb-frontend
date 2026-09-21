import React from 'react';
import { DocumentText } from 'iconsax-react';

export default function NotificationSectionHeader({
  title,
  icon: Icon = DocumentText,
  badgeBg = '#FFF9EE',
  badgeBorder = '#F5B55C',
  iconColor = '#F5B55C',
  className = '',
}) {
  return (
    <div className={`w-[370px] flex items-center gap-2 mb-3 px-1 ${className}`}>
      {/* Left Badge: 28×28px rounded-[9px] */}
      <div
        style={{ backgroundColor: badgeBg, borderColor: badgeBorder }}
        className="w-7 h-7 rounded-[9px] border flex items-center justify-center shadow-2xs flex-shrink-0"
      >
        <Icon color={iconColor} size={16} variant="Bold" />
      </div>

      {/* Bold Title: 17px matching search screen */}
      <h2 className="text-[17px] font-bold text-[#2B2437] leading-none">{title}</h2>
    </div>
  );
}
