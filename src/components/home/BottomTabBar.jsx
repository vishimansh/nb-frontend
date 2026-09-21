import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, VideoPlay, DocumentText, User } from 'iconsax-react';

const BOTTOM_TABS = [
  { id: 'home', label: 'होम', icon: Home },
  { id: 'video', label: 'वीडियो', icon: VideoPlay },
  { id: 'epaper', label: 'ई-पेपर', icon: DocumentText },
  { id: 'user', label: 'यूज़र', icon: User },
];

export default function BottomTabBar({ activeTab = 'home', activeTabId = 'home', onSelectTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalTab, setInternalTab] = useState(activeTab || activeTabId || 'home');

  const currentActive = activeTab || activeTabId || internalTab;

  const handleTabClick = (id) => {
    setInternalTab(id);
    if (onSelectTab) {
      onSelectTab(id);
      return;
    }
    if (id === 'user') {
      navigate('/profile', { state: { from: 'tab', previousRoute: location.pathname } });
    } else if (id === 'home') {
      navigate('/feed');
    } else if (id === 'epaper') {
      navigate('/epaper');
    } else if (id === 'video') {
      navigate('/videos');
    }
  };

  return (
    <nav
      aria-label="मुख्य नेविगेशन"
      className="sticky bottom-0 z-40 bg-white border-t border-[#E5E7EB] h-[75px] w-full px-[40px] flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.04)] shrink-0 select-none"
    >
      {BOTTOM_TABS.map((tab) => {
        const isActive = currentActive === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className="flex flex-col items-center justify-center cursor-pointer group transition-transform active:scale-95"
          >
            <Icon
              size={24}
              color={isActive ? '#2B2437' : '#6B7280'}
              variant={isActive ? 'Bold' : 'Linear'}
              className="transition-colors"
            />
            <span
              className={`text-[13px] font-medium mt-[6px] leading-none ${
                isActive
                  ? 'text-[#2B2437] font-bold'
                  : 'text-[#6B7280] group-hover:text-[#2B2437]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
