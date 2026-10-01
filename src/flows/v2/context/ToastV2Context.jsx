import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastV2Context = createContext(null);

export function ToastV2Provider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, durationMs = 2400) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(message);
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, durationMs);
  }, []);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  return (
    <ToastV2Context.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastV2Context.Provider>
  );
}

export function useToastV2() {
  const context = useContext(ToastV2Context);
  if (!context) {
    throw new Error('useToastV2 must be used within a ToastV2Provider');
  }
  return context;
}
