import { useState, useEffect } from 'react';

/**
 * Tracks scroll position of a scroll container ref and returns isCollapsed when scrolled past thresholdPx (default 120px).
 */
export function useScrollCollapse(containerRef, thresholdPx = 120) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const target = containerRef?.current;
    if (!target) return;

    const handleScroll = () => {
      const scrollTop = target.scrollTop || 0;
      setIsCollapsed(scrollTop > thresholdPx);
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [containerRef, thresholdPx]);

  return isCollapsed;
}
