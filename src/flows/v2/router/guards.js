import { SCREENS } from './screens';
import { STRINGS } from '../strings/hi';

/**
 * Validates whether state fulfills screen requirements.
 * Returns { ok: true } or { ok: false, redirectTo: string, reason: string }
 */
export function checkScreenGuard(screenId, state) {
  const config = SCREENS[screenId];
  if (!config) return { ok: true };

  // Check auth requirement
  if (config.requiresAuth && !state.auth?.otpVerified) {
    return {
      ok: false,
      redirectTo: 'login',
      reason: 'कृपया पहले लॉगिन करें',
    };
  }

  // Check shop requirements for goal -> review
  if (config.requiresShop) {
    const hasName = !!state.shop?.name?.trim();
    const hasCategory = !!state.shop?.categoryId;
    const hasCity = !!(state.shop?.cityId || state.shop?.city);

    if (!hasName || !hasCategory || !hasCity) {
      return {
        ok: false,
        redirectTo: 'shop',
        reason: STRINGS.guardToast.fillShopFirst,
      };
    }
  }

  return { ok: true };
}
