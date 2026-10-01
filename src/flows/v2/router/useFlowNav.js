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
      safeNavigate('review');
      return;
    }
    goBack();
  }, [isFromReview, safeNavigate, goBack]);

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
