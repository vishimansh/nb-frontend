import { useCallback } from 'react';
import { useAdvertiserV2 } from '../context/AdvertiserV2Context';
import { useToastV2 } from '../context/ToastV2Context';
import { SCREENS, STEP_ORDER } from './screens';
import { checkScreenGuard } from './guards';
import { STRINGS } from '../strings/hi';

export function useFlowNav() {
  const { state, navigateTo, goBack } = useAdvertiserV2();
  const { showToast } = useToastV2();

  const currentScreenId = state.nav.current;
  const currentConfig = SCREENS[currentScreenId] || SCREENS.intro;
  const isFromReview = state.nav.fromReview;
  const isResubmitting = !!state.nav.resubmitFor;

  const safeNavigate = useCallback(
    (targetScreenId, options = {}) => {
      const guardResult = checkScreenGuard(targetScreenId, state);
      if (!guardResult.ok) {
        if (guardResult.reason) {
          showToast(guardResult.reason);
        }
        navigateTo(guardResult.redirectTo, options);
        return false;
      }
      navigateTo(targetScreenId, options);
      return true;
    },
    [state, navigateTo, showToast]
  );

  const proceedNextStep = useCallback(() => {
    // If opened from review or resubmission
    if (isFromReview) {
      safeNavigate('review');
      return;
    }
    if (isResubmitting) {
      safeNavigate('status');
      return;
    }

    const currentIndex = STEP_ORDER.indexOf(currentScreenId);
    if (currentIndex >= 0 && currentIndex < STEP_ORDER.length - 1) {
      const nextScreen = STEP_ORDER[currentIndex + 1];
      safeNavigate(nextScreen);
    }
  }, [currentScreenId, isFromReview, isResubmitting, safeNavigate]);

  const handleBack = useCallback(() => {
    if (isFromReview) {
      safeNavigate('review', { direction: 'backward' });
      return;
    }
    if (isResubmitting) {
      safeNavigate('status', { direction: 'backward' });
      return;
    }

    // Step navigation for the 6-step process (shop -> goal -> format -> ad -> budget -> review)
    const currentIndex = STEP_ORDER.indexOf(currentScreenId);
    if (currentIndex > 0) {
      const prevStepScreen = STEP_ORDER[currentIndex - 1];
      safeNavigate(prevStepScreen, { direction: 'backward' });
      return;
    }

    if (currentIndex === 0) {
      // Step 1 ('shop'): find the last non-wizard screen in history, or fallback to 'intro'
      const history = state.nav?.history || [];
      let targetScreen = null;
      for (let i = history.length - 1; i >= 0; i--) {
        const scr = history[i];
        if (scr !== currentScreenId && scr !== 'area' && !STEP_ORDER.includes(scr)) {
          targetScreen = scr;
          break;
        }
      }
      safeNavigate(targetScreen || 'intro', { direction: 'backward' });
      return;
    }

    // Fallback for non-wizard screens (e.g. status, analytics, dashboard)
    const history = state.nav?.history || [];
    if (history.length > 1) {
      let prevIndex = history.length - 2;
      while (prevIndex >= 0 && (history[prevIndex] === 'area' || history[prevIndex] === currentScreenId)) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        safeNavigate(history[prevIndex], { direction: 'backward' });
        return;
      }
    }

    goBack();
  }, [isFromReview, isResubmitting, currentScreenId, safeNavigate, state.nav?.history, goBack]);

  // Primary CTA label depending on mode
  const getCtaLabel = (defaultLabel = STRINGS.common.next) => {
    if (isResubmitting) return STRINGS.ad.resubmitBtn;
    if (isFromReview) return STRINGS.common.save;
    return defaultLabel;
  };

  return {
    currentScreenId,
    stepNumber: currentConfig.stepNumber,
    isFromReview,
    isResubmitting,
    focusField: state.nav.focusField,
    direction: state.nav.direction,
    navigateTo: safeNavigate,
    goBack: handleBack,
    proceedNextStep,
    getCtaLabel,
  };
}
