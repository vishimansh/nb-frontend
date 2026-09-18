import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight2,
  Edit2,
  Crown,
  Folder2,
  Location,
  Notification,
  ArchiveBook,
  TickSquare,
  Setting2,
  User,
} from 'iconsax-react';
import { useOnboarding } from '../context/OnboardingContext';
import {
  CANONICAL_CATEGORY_ORDER,
  CATEGORY_METADATA,
  ListSearchIcon,
  ExclamationCircleIcon,
  LogoutIcon,
} from '../theme/categoryMeta';

import BackButton from '../components/common/BackButton';

export default function MenuScreen() {
  const navigate = useNavigate();
  const { selectedCategories = [], userProfile = {} } = useOnboarding();

  // Mask phone number: +91 98••••••42
  const rawPhone = userProfile.phone || '+91 9876543210';
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const prefix = cleanPhone.slice(0, 5); // "+9198"
  const suffix = cleanPhone.slice(-2); // "42"
  const maskedPhone = `${prefix.slice(0, 3)} ${prefix.slice(3)}••••••${suffix}`;

  // Sort selected categories in canonical order
  const sortedSelected = CANONICAL_CATEGORY_ORDER.filter((id) =>
    selectedCategories.includes(id)
  );

  // Unselected categories in canonical order
  const sortedUnselected = CANONICAL_CATEGORY_ORDER.filter(
    (id) => !selectedCategories.includes(id)
  );

  return (
    <div className="w-full h-full bg-[#F7F7F4] flex flex-col relative select-none overflow-hidden">
      {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0" />

      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center gap-3 bg-[#F7F7F4] shrink-0 sticky top-[54px] z-20">
        <BackButton onClick={() => navigate('/feed')} ariaLabel="वापस जाएं" />
        <h1 className="text-[22px] font-bold text-[#18253B] tracking-tight">मेनू</h1>
      </div>

      {/* Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 pb-14 space-y-4">
        {/* 1. Profile Card with Heritage Skyline Silhouette */}
        <div className="p-3.5 rounded-[22px] bg-gradient-to-r from-white via-[#F8FAFC] to-[#EEF3F9] border border-[#E2E6EE] shadow-sm relative overflow-hidden flex items-center justify-between">
          {/* Heritage Cityscape & Flying Birds Vector Artwork */}
          <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-64 opacity-35 overflow-hidden flex items-end justify-end">
            <svg
              viewBox="0 0 280 80"
              fill="none"
              className="w-full h-auto text-[#627D98]"
            >
              {/* Flying Birds */}
              <path
                d="M130 18 Q134 14 138 18 Q142 14 146 18"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M150 25 Q153 22 156 25 Q159 22 162 25"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
              />
              {/* Skyline silhouette: Fort, Domes, Minarets, Gateway */}
              <path
                d="M0 80 
                   L0 74 L15 74 L15 62 L22 62 L22 55 L30 55 L30 74 
                   L42 74 L42 48 L46 48 L46 42 Q50 34 54 42 L54 48 L58 48 L58 74 
                   L70 74 L70 58 L78 58 L78 74 
                   L88 74 L88 44 Q96 32 104 44 L104 74 
                   L114 74 L114 60 L122 60 L122 74 
                   L132 74 L132 36 L136 36 L136 28 Q142 20 148 28 L148 36 L152 36 L152 74 
                   L164 74 L164 52 L172 52 L172 74 
                   L184 74 L184 40 Q192 30 200 40 L200 74 
                   L210 74 L210 56 L218 56 L218 74 
                   L228 74 L228 46 L232 46 L236 38 L240 46 L244 46 L244 74 
                   L256 74 L256 62 L266 62 L266 74 L280 74 L280 80 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Left Profile Identity Stack */}
          <div
            onClick={() => navigate('/profile', { state: { from: 'menu' } })}
            className="flex items-center relative z-10 cursor-pointer active:opacity-90"
          >
            <div className="w-14 h-14 rounded-full ring-[2.5px] ring-[#D48E28] ring-offset-2 overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] shrink-0 mr-3.5 flex items-center justify-center shadow-xs">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#18253B] via-[#233550] to-[#0F172A] flex items-center justify-center text-white">
                  <User size={26} color="#FFFFFF" variant="Bold" />
                </div>
              )}
            </div>

            <div>
              <span className="text-[17px] font-bold text-[#18253B] block leading-tight">
                {userProfile.name || 'हिमांशु विश्वकर्मा'}
              </span>
              <span className="text-[13px] text-[#64748B] font-medium mt-1 block">
                {maskedPhone}
              </span>
            </div>
          </div>

          {/* Right Edit Button */}
          <button
            type="button"
            onClick={() => navigate('/profile', { state: { from: 'menu' } })}
            className="w-10 h-10 rounded-[12px] bg-[#18253B] flex items-center justify-center text-white cursor-pointer active:scale-95 shadow-xs relative z-10 hover:bg-[#233550] transition-all shrink-0"
            title="प्रोफ़ाइल संपादित करें"
          >
            <Edit2 size={17} color="#FFFFFF" variant="Bold" />
          </button>
        </div>

        {/* 2. Premium Membership Button (Centered text with gold crown & arrow) */}
        <button
          type="button"
          onClick={() => navigate('/about')}
          className="w-full h-[52px] rounded-[18px] bg-white border border-[#D48E28]/70 relative flex items-center justify-center px-4 shadow-2xs active:scale-[0.99] cursor-pointer hover:bg-amber-50/20 transition-all"
        >
          <Crown size={20} color="#D48E28" variant="Bold" className="absolute left-4" />
          <span className="text-[15px] font-bold text-[#D48E28]">
            प्रीमियम सदस्यता
          </span>
          <ArrowRight2 size={18} color="#D48E28" className="absolute right-4" />
        </button>

        {/* 3. "मेरी सामग्री" (My Content) Section Card */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm">
          {/* Section Header with amber badge */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
              <Folder2 size={16} color="#D48E28" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B]">मेरी सामग्री</h2>
          </div>

          {/* Individual Rounded Action Rows */}
          <div className="space-y-2.5">
            {/* Row 1: चुनी गई लोकेशन */}
            <div
              onClick={() => navigate('/state')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Location size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  चुनी गई लोकेशन
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>

            {/* Row 2: नोटिफिकेशन */}
            <div
              onClick={() => navigate('/notifications')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Notification size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  नोटिफिकेशन
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>

            {/* Row 3: श्रेणी आधारित सूचनाएं */}
            <div
              onClick={() => navigate('/notifications/categories')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Notification size={18} color="#FFFFFF" variant="Outline" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  श्रेणी आधारित सूचनाएं
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>

            {/* Row 3: सेव की गई खबरें */}
            <div
              onClick={() => navigate('/saved')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ArchiveBook size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  सेव की गई खबरें
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* 4. "चयनित श्रेणियां" (Selected Categories) Section Card */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm">
          {selectedCategories.length === 0 ? (
            /* Empty State: Prompt Row inside card */
            <>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
                  <TickSquare size={16} color="#D48E28" variant="Bold" />
                </div>
                <h2 className="text-[16px] font-bold text-[#18253B]">चयनित श्रेणियां</h2>
              </div>

              <div
                onClick={() => navigate('/menu/categories')}
                className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <ListSearchIcon size={18} color="#FFFFFF" />
                  </div>
                  <span className="text-[14px] font-semibold text-[#18253B]">
                    पसंदीदा श्रेणियाँ चुनें
                  </span>
                </div>
                <ArrowRight2 size={16} color="#9CA3AF" />
              </div>
            </>
          ) : (
            /* Filled State: 2-column Grid of Selected Categories */
            <>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
                    <TickSquare size={16} color="#D48E28" variant="Bold" />
                  </div>
                  <h2 className="text-[16px] font-bold text-[#18253B]">चयनित श्रेणियां</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/menu/categories')}
                  className="text-[14px] font-semibold text-[#D48E28] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  एडिट करें
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {sortedSelected.map((catId) => {
                  const meta = CATEGORY_METADATA[catId];
                  if (!meta) return null;
                  const IconComp = meta.iconComponent;

                  return (
                    <div
                      key={catId}
                      className="h-[56px] bg-[#F9FAFB] border border-[#F0F1F3] rounded-[16px] px-3.5 flex items-center gap-3 shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                        {IconComp && <IconComp size={18} color="#FFFFFF" variant="Bold" />}
                      </div>
                      <span className="text-[14px] font-bold text-[#18253B] truncate">
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 5. "अन्य श्रेणियां" (Unselected Categories) Separate Section Card */}
        {selectedCategories.length > 0 && sortedUnselected.length > 0 && (
          <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm">
            <div className="mb-3.5">
              <h2 className="text-[16px] font-bold text-[#18253B]">अन्य श्रेणियां</h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {sortedUnselected.map((catId) => {
                const meta = CATEGORY_METADATA[catId];
                if (!meta) return null;
                const IconComp = meta.iconComponent;

                return (
                  <div
                    key={catId}
                    className="h-[56px] bg-[#F9FAFB] border border-[#F0F1F3] rounded-[16px] px-3.5 flex items-center gap-3 shadow-2xs select-none"
                  >
                    <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                      {IconComp && <IconComp size={18} color="#FFFFFF" variant="Bold" />}
                    </div>
                    <span className="text-[14px] font-bold text-[#18253B] truncate">
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. "ऐप सेटिंग्स" (App Settings) Section Card */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F6E0BB] flex items-center justify-center text-[#D48E28] shrink-0">
              <Setting2 size={16} color="#D48E28" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#18253B]">ऐप सेटिंग्स</h2>
          </div>

          <div className="space-y-2.5">
            {/* Row 1: सेटिंग्स और प्राइवेसी with Setting gear */}
            <div
              onClick={() => navigate('/settings')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Setting2 size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  सेटिंग्स और प्राइवेसी
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>

            {/* Row 2: ऐप की जानकारी with exclamation mark in circle */}
            <div
              onClick={() => navigate('/about')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#18253B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ExclamationCircleIcon size={18} color="#FFFFFF" />
                </div>
                <span className="text-[14px] font-semibold text-[#18253B]">
                  ऐप की जानकारी
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* 7. Log Out Action Button */}
        <div className="h-[52px] rounded-[18px] bg-[#ECE4D4] border border-[#DDD3BF] flex items-center justify-center gap-2.5 select-none shadow-2xs cursor-pointer active:scale-[0.99] transition-transform">
          <LogoutIcon size={18} color="#7C7262" />
          <span className="text-[15px] font-bold text-[#7C7262]">लॉग आउट करें</span>
        </div>
      </div>
    </div>
  );
}
