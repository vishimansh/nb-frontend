import React, { useRef, useEffect } from 'react';
import { Location, Edit } from 'iconsax-react';

/**
 * Single-Tier State Chip Filter Bar
 * Styled exactly matching the City Screen chips:
 * - Active state chip: solid navy pill (bg-[#1E213D]), rounded-full, h-[34px], px-4, text-[13px] font-medium, with leading white MapPin icon; clicking it opens state selection
 * - Inactive state chip: transparent pill, border-[#9CA3AF], rounded-full, h-[34px], px-4, text-[13px] font-medium text-[#1E213D]
 * - Horizontal scroll: When state names are half visible or overflow the available container width, smooth horizontal scrolling is enabled for the state chips
 * - Auto-scroll: Selected/active state chip automatically scrolls smoothly into view
 * - Input support: Native touch, trackpad, mouse wheel, and drag-to-scroll
 * - Trailing "✎ अपने राज्य चुनें": transparent pill, border-[#9CA3AF], rounded-full, h-[34px], px-4, text-[13px] font-medium text-[#1E213D] with PencilSimple icon
 */
export default function StateFilterBar({
  states = [],
  activeStateId,
  onSelectState,
  onEditClick,
}) {
  const chipsRowRef = useRef(null);
  const activeChipRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const didDragRef = useRef(false);

  // Auto-scroll active state chip into view when selected
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
  }, [activeStateId]);

  // Handle desktop mouse wheel horizontal scrolling
  const handleWheel = (e) => {
    if (chipsRowRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      chipsRowRef.current.scrollLeft += e.deltaY;
    }
  };

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    didDragRef.current = false;
    startXRef.current = e.pageX - (chipsRowRef.current?.offsetLeft || 0);
    scrollLeftRef.current = chipsRowRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !chipsRowRef.current) return;
    const x = e.pageX - chipsRowRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    if (Math.abs(walk) > 4) {
      didDragRef.current = true;
    }
    chipsRowRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleChipClick = (id, isActive) => {
    if (didDragRef.current) {
      // Prevent accidental click if user was dragging
      return;
    }
    if (isActive) {
      onEditClick();
    } else {
      onSelectState(id);
    }
  };

  return (
    <div className="w-full px-3 pt-2.5 pb-2 bg-transparent flex items-center justify-between gap-1.5 overflow-hidden select-none z-20 shrink-0">
      {/* State Chips container with horizontal scroll when names exceed width */}
      <div
        ref={chipsRowRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-none scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {states.map((st) => {
          const isActive = activeStateId === st.id;

          if (isActive) {
            return (
              <button
                ref={activeChipRef}
                key={st.id}
                type="button"
                className="bg-[#1E213D] text-white border border-[#1E213D] rounded-full h-[34px] px-4 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                onClick={() => handleChipClick(st.id, true)}
                title={`${st.name} - राज्य बदलें या चुनें`}
              >
                <Location size={14} color="#FFFFFF" variant="Bold" className="shrink-0" />
                <span className="text-[13px] font-medium text-white leading-none whitespace-nowrap">
                  {st.name}
                </span>
              </button>
            );
          }

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => handleChipClick(st.id, false)}
              className="bg-transparent border border-[#9CA3AF] rounded-full h-[34px] px-4 flex items-center justify-center cursor-pointer hover:border-[#1E213D] shrink-0 transition-all active:scale-95"
            >
              <span className="text-[13px] font-medium text-[#1E213D] leading-none whitespace-nowrap">
                {st.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trailing Action Chip: "✎ अपने राज्य चुनें" */}
      <button
        type="button"
        onClick={onEditClick}
        className="bg-transparent border border-[#9CA3AF] text-[#1E213D] rounded-full h-[34px] px-4 flex items-center gap-1.5 text-[13px] font-medium shrink-0 cursor-pointer hover:border-[#1E213D] active:scale-95 transition-all ml-1"
      >
        <Edit size={13} color="#1E213D" variant="Linear" className="shrink-0" />
        <span className="leading-none whitespace-nowrap">अपने राज्य चुनें</span>
      </button>
    </div>
  );
}
