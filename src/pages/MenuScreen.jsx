import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  InfoCircle,
  Logout,
  SearchNormal1,
} from 'iconsax-react';
import { useOnboarding } from '../context/OnboardingContext';
import {
  CANONICAL_CATEGORY_ORDER,
  CATEGORY_METADATA,
} from '../theme/categoryMeta';

import BackButton from '../components/common/BackButton';
import profileSkyline from '../assets/illustrations/profile_skyline_bhopal.png';

export default function MenuScreen() {
  const navigate = useNavigate();
  const { selectedCategories = [], userProfile = {} } = useOnboarding();
  const [isExiting, setIsExiting] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      navigate('/feed');
    }, 440);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - (touchStartY.current || 0);
    // If user swipes left by > 50px with predominantly horizontal motion, close menu
    if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {
      handleBack();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

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
    <div className="w-full h-full absolute inset-0 overflow-hidden pointer-events-auto">
      {/* Dark Scrim Backdrop over the underlying feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.46, ease: 'easeOut' }}
        onClick={handleBack}
        className="absolute inset-0 bg-black/40 z-10 cursor-pointer"
      />

      {/* Menu Screen Drawer Content */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={isExiting ? { x: '-100%' } : { x: '0%' }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          willChange: 'transform',
          boxShadow: '14px 0 40px rgba(0, 0, 0, 0.28)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="absolute inset-0 w-full h-full bg-[#F7F7F4] flex flex-col select-none overflow-hidden z-20"
      >
        {/* 54px Light status bar clearance */}
      <div className="h-[54px] w-full shrink-0" />

      {/* Header Bar */}
      <div className="px-4 py-3 flex items-center gap-3 bg-[#F7F7F4] shrink-0 sticky top-[54px] z-20">
        <BackButton onClick={handleBack} ariaLabel="वापस जाएं" />
        <h1 className="text-[22px] font-bold text-[#2B2437] tracking-tight">मेनू</h1>
      </div>

      {/* Vertically Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 pb-14 space-y-4">
        {/* 1. Profile Card with Heritage Skyline Silhouette */}
        <div className="p-3.5 rounded-[22px] bg-white border border-[#E2E6EE] shadow-sm relative overflow-hidden flex items-center justify-between">
          {/* Heritage Cityscape Artwork Provided by User */}
          <img
            src={profileSkyline}
            alt="Heritage Cityscape"
            className="pointer-events-none absolute right-0 bottom-0 h-full w-auto max-w-[80%] object-contain object-right-bottom select-none z-0 opacity-35 mix-blend-multiply -translate-x-[20%]"
          />

          {/* Left Profile Identity Stack */}
          <div
            onClick={() => navigate('/profile', { state: { from: 'menu' } })}
            className="flex items-center relative z-10 cursor-pointer active:opacity-90"
          >
            <div className="w-14 h-14 rounded-full ring-[2.5px] ring-[#F5B55C] ring-offset-2 overflow-hidden bg-gradient-to-br from-[#2B2437] to-[#1E1927] shrink-0 mr-3.5 flex items-center justify-center shadow-xs">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2B2437] via-[#3D334E] to-[#1E1927] flex items-center justify-center text-white">
                  <User size={26} color="#FFFFFF" variant="Bold" />
                </div>
              )}
            </div>

            <div>
              <span className="text-[17px] font-bold text-[#2B2437] block leading-tight">
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
            className="w-10 h-10 rounded-[12px] bg-[#2B2437] flex items-center justify-center text-white cursor-pointer active:scale-95 shadow-xs relative z-10 hover:bg-[#3D334E] transition-all shrink-0"
            title="प्रोफ़ाइल संपादित करें"
          >
            <Edit2 size={17} color="#FFFFFF" variant="Bold" />
          </button>
        </div>

        {/* 2. Premium Membership Button (Centered text with gold crown & arrow) */}
        <button
          type="button"
          onClick={() => navigate('/about')}
          className="w-full h-[52px] rounded-[18px] bg-white border border-[#F5B55C]/70 relative flex items-center justify-center px-4 shadow-2xs active:scale-[0.99] cursor-pointer hover:bg-[#F5B55C]/10 transition-all"
        >
          <Crown size={20} color="#F5B55C" variant="Bold" className="absolute left-4" />
          <span className="text-[15px] font-bold text-[#F5B55C]">
            प्रीमियम सदस्यता
          </span>
          <ArrowRight2 size={18} color="#F5B55C" className="absolute right-4" />
        </button>

        {/* 3. "मेरी सामग्री" (My Content) Section Card */}
        <div className="bg-white rounded-[24px] border border-[#EBECEF] p-4 shadow-sm">
          {/* Section Header with badge */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
              <Folder2 size={16} color="#F5B55C" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#2B2437]">मेरी सामग्री</h2>
          </div>

          {/* Individual Rounded Action Rows */}
          <div className="space-y-2.5">
            {/* Row 1: चुनी गई लोकेशन */}
            <div
              onClick={() => navigate('/state')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Location size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
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
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Notification size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
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
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Notification size={18} color="#FFFFFF" variant="Outline" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
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
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ArchiveBook size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
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
                <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
                  <TickSquare size={16} color="#F5B55C" variant="Bold" />
                </div>
                <h2 className="text-[16px] font-bold text-[#2B2437]">चयनित श्रेणियां</h2>
              </div>

              <div
                onClick={() => navigate('/menu/categories')}
                className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <SearchNormal1 size={18} color="#FFFFFF" />
                  </div>
                  <span className="text-[14px] font-semibold text-[#2B2437]">
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
                  <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
                    <TickSquare size={16} color="#F5B55C" variant="Bold" />
                  </div>
                  <h2 className="text-[16px] font-bold text-[#2B2437]">चयनित श्रेणियां</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/menu/categories')}
                  className="text-[14px] font-semibold text-[#F5B55C] cursor-pointer hover:opacity-80 transition-opacity"
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
                      <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                        {IconComp && <IconComp size={18} color="#FFFFFF" variant="Bold" />}
                      </div>
                      <span className="text-[14px] font-bold text-[#2B2437] truncate">
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
              <h2 className="text-[16px] font-bold text-[#2B2437]">अन्य श्रेणियां</h2>
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
                    <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                      {IconComp && <IconComp size={18} color="#FFFFFF" variant="Bold" />}
                    </div>
                    <span className="text-[14px] font-bold text-[#2B2437] truncate">
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
            <div className="w-8 h-8 rounded-[10px] bg-[#FDF5E8] border border-[#F5B55C]/60 flex items-center justify-center text-[#F5B55C] shrink-0">
              <Setting2 size={16} color="#F5B55C" variant="Bold" />
            </div>
            <h2 className="text-[16px] font-bold text-[#2B2437]">ऐप सेटिंग्स</h2>
          </div>

          <div className="space-y-2.5">
            {/* Row 1: सेटिंग्स और प्राइवेसी with Setting gear */}
            <div
              onClick={() => navigate('/settings')}
              className="h-[56px] px-3.5 bg-[#F9FAFB] rounded-[14px] border border-[#F0F1F3] flex items-center justify-between hover:bg-gray-100/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 mr-2">
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Setting2 size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
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
                <div className="w-9 h-9 rounded-[10px] bg-[#2B2437] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <InfoCircle size={18} color="#FFFFFF" variant="Bold" />
                </div>
                <span className="text-[14px] font-semibold text-[#2B2437]">
                  ऐप की जानकारी
                </span>
              </div>
              <ArrowRight2 size={16} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* 7. Log Out Action Button */}
        <div className="h-[52px] rounded-[18px] bg-[#ECE4D4] border border-[#DDD3BF] flex items-center justify-center gap-2.5 select-none shadow-2xs cursor-pointer active:scale-[0.99] transition-transform">
          <Logout size={18} color="#7C7262" variant="Bold" />
          <span className="text-[15px] font-bold text-[#7C7262]">लॉग आउट करें</span>
        </div>
      </div>
    </motion.div>
  </div>
  );
}
