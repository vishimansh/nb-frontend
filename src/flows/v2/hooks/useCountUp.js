import { useState, useEffect, useRef } from 'react';

/**
 * Animates a numerical value up/down over durationMs using cubic ease-out.
 * Respects prefers-reduced-motion by jumping immediately.
 */
export function useCountUp(targetValue, durationMs = 600) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValRef = useRef(targetValue);
  const targetValRef = useRef(targetValue);
  const animRef = useRef(null);

  useEffect(() => {
    targetValRef.current = Number(targetValue) || 0;
    const startVal = displayValue;
    startValRef.current = startVal;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || durationMs <= 0 || startVal === targetValRef.current) {
      setDisplayValue(targetValRef.current);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Ease-out cubic: 1 - pow(1 - progress, 3)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetValRef.current - startVal) * eased);

      setDisplayValue(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValRef.current);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [targetValue, durationMs]);

  return displayValue;
}
