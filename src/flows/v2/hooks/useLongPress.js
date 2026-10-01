import { useRef, useCallback } from 'react';

/**
 * Hook to trigger a callback when an element is long-pressed for delayMs (default 800ms).
 */
export function useLongPress(callback, delayMs = 800) {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (event) => {
      isLongPressRef.current = false;
      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        callback(event);
      }, delayMs);
    },
    [callback, delayMs]
  );

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
}
