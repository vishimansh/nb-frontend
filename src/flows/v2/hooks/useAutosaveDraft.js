import { useEffect, useRef } from 'react';
import { useToastV2 } from '../context/ToastV2Context';
import { STRINGS } from '../strings/hi';

const SHOWN_KEY = 'nb2_draft_toast_shown';

/**
 * Shows a one-time toast "आपका ड्राफ़्ट सेव है" if returning to a non-empty draft.
 */
export function useAutosaveDraft(hasDraftContent) {
  const { showToast } = useToastV2();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    try {
      const alreadyShown = sessionStorage.getItem(SHOWN_KEY);
      if (!alreadyShown && hasDraftContent) {
        showToast(STRINGS.guardToast.draftRestored, 2200);
        sessionStorage.setItem(SHOWN_KEY, 'true');
      }
    } catch {}
  }, [hasDraftContent, showToast]);
}
