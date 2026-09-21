import React, { useRef, useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import {
  HambergerMenu,
  Notification,
  SearchNormal1,
  DocumentText,
  Location,
  Buildings,
} from 'iconsax-react';
import WhiteNavaBharatLogo from './WhiteNavaBharatLogo';
import { FeedContext, INERT_TABS } from '../../context/FeedContext';
import { useOnboarding } from '../../context/OnboardingContext';
import {
  CANONICAL_CATEGORY_ORDER,
  CATEGORY_METADATA,
} from '../../theme/categoryMeta';

export default function TopNavShell({ activeCategory: propActiveCategory, onSelectCategory, onSelectTab }) {
  const navigate = useNavigate();
  const feedContext = useContext(FeedContext);
  const { selectedCategories = [], setSelectedCategories } = useOnboarding();

  const rawActive =
    propActiveCategory ||
    feedContext?.activeCategory ||
    'top_news';

  const normalizedActive = (rawActive === 'top-news' || rawActive === 'top_news') ? 'top_news' : rawActive;

  // Fixed initial 3 tabs (cannot be reordered or displaced)
  const fixedTabs = [
    { id: 'top_news', label: 'टॉप न्यूज़', icon: DocumentText, isFixed: true },
    { id: 'city', label: 'शहर', icon: Location, isFixed: true },
    { id: 'state', label: 'राज्य', icon: Buildings, isFixed: true },
  ];

  // Draggable categories in user custom order
  const fallbackCategories = [
    'politics',
    'entertainment',
    'sports',
    'business',
    'tech',
    'education',
    'astro',
    'health',
    'lifestyle',
    'auto',
  ];

  const categoryIds = (
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories
      : fallbackCategories
  );

  // Local state for 60fps buttery-smooth reordering during drag
  const [localCategoryIds, setLocalCategoryIds] = useState(categoryIds);
  const localOrderRef = useRef(categoryIds);
  const isDraggingRef = useRef(false);

  // Sync local order when selectedCategories changes externally
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalCategoryIds(categoryIds);
      localOrderRef.current = categoryIds;
    }
  }, [categoryIds]);

  const navRef = useRef(null);
  const tabRefs = useRef({});

  // Auto-scroll centering when activeCategory changes
  useEffect(() => {
    const activeElement =
      tabRefs.current[normalizedActive] ||
      tabRefs.current[rawActive] ||
      tabRefs.current[rawActive === 'top_news' ? 'top-news' : 'top_news'];
    if (activeElement && !isDraggingRef.current) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [normalizedActive, rawActive]);

  // Framer Motion Reorder handler (updates local state dynamically so items glide and create space)
  const handleReorder = (newOrder) => {
    localOrderRef.current = newOrder;
    setLocalCategoryIds(newOrder);
  };

  // On drag start
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  // On drag end: commit final order to context & localStorage
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    if (setSelectedCategories) {
      setSelectedCategories(localOrderRef.current);
    }
  };

  const handleTabClick = (tabId) => {
    if (isDraggingRef.current) {
      return;
    }
    if (INERT_TABS.includes(tabId)) {
      return;
    }

    const targetCategory = (tabId === 'top-news' || tabId === 'top_news') ? 'top_news' : tabId;

    if (onSelectCategory) {
      onSelectCategory(targetCategory);
    } else if (onSelectTab) {
      onSelectTab(tabId);
    } else if (feedContext?.goToCategory) {
      feedContext.goToCategory(targetCategory);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2B2437] w-full flex flex-col shadow-md flex-shrink-0 select-none">
      {/* Status Bar Clearance (pt-[24px] + 18px text + pb-[24px] = 66px) */}
      <div className="h-[66px] w-full shrink-0 pointer-events-none" />

      {/* Brand & Header Row (52px, px-[16px]) */}
      <div className="h-[52px] px-[16px] flex items-center justify-between">
        {/* Left: Hamburger Menu (28px × 28px) -> Navigates to /menu */}
        <button
          type="button"
          onClick={() => navigate('/menu')}
          aria-label="मेनू खोलें"
          className="text-white hover:text-white/80 transition-colors cursor-pointer flex items-center justify-center active:scale-95"
        >
          <HambergerMenu size={28} color="#FFFFFF" variant="Linear" />
        </button>

        {/* Center-Left: Official Nava Bharat White Vector Logo / Dynamic Greeting */}
        <div className="flex items-center flex-1 min-w-0 max-w-[260px] justify-start pl-2">
          <WhiteNavaBharatLogo className="w-[164px] h-[40px] object-contain" />
        </div>

        {/* Right Action Group: Notification Bell + Search (28px × 28px each, 24px gap) */}
        <div className="flex items-center gap-[24px]">
          {/* Notification with persistent red unread dot */}
          <button
            type="button"
            onClick={() => navigate('/notifications')}
            aria-label="नोटिफिकेशन"
            className="relative cursor-pointer text-white hover:text-white/80 transition-colors flex items-center justify-center active:scale-95"
          >
            <Notification size={28} color="#FFFFFF" variant="Linear" />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#EF4444] absolute -top-0.5 -right-0.5 border-2 border-[#2B2437]"
              aria-label="नया नोटिफिकेशन"
            />
          </button>

          {/* Search Icon */}
          <button
            type="button"
            onClick={() => navigate('/search')}
            aria-label="खोजें"
            className="cursor-pointer text-white hover:text-white/80 transition-colors flex items-center justify-center active:scale-95"
          >
            <SearchNormal1 size={26} color="#FFFFFF" variant="Linear" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Tab Strip with Smooth Physics-based Dynamic Space Creation */}
      <nav
        ref={navRef}
        aria-label="समाचार श्रेणियां"
        className="h-[112px] w-full px-[16px] py-[16px] flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth touch-pan-x"
      >
        {/* 1. Fixed Initial 3 Tabs: Top News, City, State */}
        {fixedTabs.map((tab) => {
          const isTopNews = tab.id === 'top_news' || tab.id === 'top-news';
          const isActive =
            (isTopNews && (normalizedActive === 'top_news' || normalizedActive === 'top-news')) ||
            normalizedActive === tab.id ||
            rawActive === tab.id;
          const isInert = INERT_TABS.includes(tab.id);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`w-[64px] min-w-[64px] max-w-[64px] h-[80px] min-h-[80px] max-h-[80px] flex flex-col items-center justify-center rounded-[8px] transition-all duration-200 ease-out shrink-0 select-none ${
                isActive
                  ? 'border border-[#F5B55C] bg-[#3D334E] cursor-pointer'
                  : isInert
                  ? 'border border-transparent bg-[#3D334E] opacity-80 cursor-default'
                  : 'border border-transparent bg-[#3D334E] hover:bg-[#3D334E]/85 cursor-pointer active:scale-[0.96]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                  isActive
                    ? 'bg-[#F5B55C] text-[#2B2437] shadow-xs'
                    : 'bg-transparent text-[#94A3B8]'
                }`}
              >
                {Icon && (
                  <Icon
                    size={22}
                    color={isActive ? '#2B2437' : '#94A3B8'}
                    variant="Linear"
                  />
                )}
              </div>

              <span
                className={`text-[13.5px] mt-[8px] leading-tight tracking-tight truncate w-full text-center px-1 transition-colors duration-300 ease-out ${
                  isActive
                    ? 'font-bold text-[#F5B55C]'
                    : 'font-normal text-[#CBD5E1]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 2. Draggable Tabs with Dynamic Space Creation via Framer Motion Reorder */}
        <Reorder.Group
          axis="x"
          values={localCategoryIds}
          onReorder={handleReorder}
          as="div"
          className="flex items-center gap-2 shrink-0"
        >
          {localCategoryIds.map((id) => {
            const meta = CATEGORY_METADATA[id];
            const Icon = meta?.iconComponent || meta?.icon || DocumentText;
            const isActive = normalizedActive === id || rawActive === id;
            const isInert = INERT_TABS.includes(id);

            return (
              <Reorder.Item
                key={id}
                value={id}
                as="div"
                role="button"
                tabIndex={0}
                id={`tab-${id}`}
                ref={(el) => (tabRefs.current[id] = el)}
                dragElastic={0.15}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                whileDrag={{
                  scale: 1.08,
                  boxShadow: '0 14px 30px rgba(0, 0, 0, 0.65)',
                  zIndex: 50,
                  cursor: 'grabbing',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                }}
                onClick={() => handleTabClick(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTabClick(id);
                  }
                }}
                className={`relative w-[64px] min-w-[64px] max-w-[64px] h-[80px] min-h-[80px] max-h-[80px] flex flex-col items-center justify-center rounded-[8px] shrink-0 select-none group cursor-grab active:cursor-grabbing transition-colors duration-200 ${
                  isActive
                    ? 'border border-[#F5B55C] bg-[#3D334E]'
                    : isInert
                    ? 'border border-transparent bg-[#3D334E] opacity-80 cursor-default'
                    : 'border border-transparent bg-[#3D334E] hover:bg-[#3D334E]/85'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-[#F5B55C] text-[#2B2437] shadow-xs'
                      : 'bg-transparent text-[#94A3B8]'
                  }`}
                >
                  {Icon && (
                    <Icon
                      size={22}
                      color={isActive ? '#2B2437' : '#94A3B8'}
                      variant="Linear"
                    />
                  )}
                </div>

                <span
                  className={`text-[13.5px] mt-[8px] leading-tight tracking-tight truncate w-full text-center px-1 transition-colors duration-300 ease-out ${
                    isActive
                      ? 'font-bold text-[#F5B55C]'
                      : 'font-normal text-[#CBD5E1]'
                  }`}
                >
                  {meta?.label || id}
                </span>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </nav>
    </header>
  );
}
