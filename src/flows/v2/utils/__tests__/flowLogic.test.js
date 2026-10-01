import { describe, it, expect } from 'vitest';
import { initialV2State, initialDraftState } from '../../context/AdvertiserV2Context';
import { checkScreenGuard } from '../../router/guards';
import { resolveSelectedCities } from '../geo';
import { lookupCityByPincode } from '../../data/pincodes';
import { checkBlockedWords, checkClaimWords } from '../../data/policyWords';
import { getMoneyBreakdown } from '../money';
import { peopleReached, areaReaders } from '../reach';
import { getFormatById } from '../../data/formats';
import { getGoalById } from '../../data/goals';
import { getCtaConfig } from '../../data/ctaOptions';

describe('Flow B Architecture and Guard Validation', () => {
  it('guards unauthenticated access from protected screens', () => {
    const unauthState = { ...initialV2State, auth: { phone: '', otpVerified: false } };

    // Intro and Login do not require auth
    expect(checkScreenGuard('intro', unauthState).ok).toBe(true);
    expect(checkScreenGuard('login', unauthState).ok).toBe(true);

    // Shop, Goal, Review require auth
    const shopGuard = checkScreenGuard('shop', unauthState);
    expect(shopGuard.ok).toBe(false);
    expect(shopGuard.redirectTo).toBe('login');

    const goalGuard = checkScreenGuard('goal', unauthState);
    expect(goalGuard.ok).toBe(false);
    expect(goalGuard.redirectTo).toBe('login');
  });

  it('guards missing shop details for steps 2 to 7', () => {
    const authNoShopState = {
      ...initialV2State,
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: '', categoryId: '', cityId: '' },
    };

    // Step 1 (shop) requires auth but not prior shop info
    expect(checkScreenGuard('shop', authNoShopState).ok).toBe(true);

    // Step 2 (goal) requires shop info
    const goalGuard = checkScreenGuard('goal', authNoShopState);
    expect(goalGuard.ok).toBe(false);
    expect(goalGuard.redirectTo).toBe('shop');

    // Step 7 (review) requires shop info
    const reviewGuard = checkScreenGuard('review', authNoShopState);
    expect(reviewGuard.ok).toBe(false);
    expect(reviewGuard.redirectTo).toBe('shop');
  });

  it('allows access to all steps when auth and shop are complete', () => {
    const completeState = {
      ...initialV2State,
      auth: { phone: '9876543210', otpVerified: true },
      shop: { name: 'शर्मा स्वीट्स', categoryId: 'restaurant', cityId: 'indore', city: 'इंदौर' },
    };

    expect(checkScreenGuard('shop', completeState).ok).toBe(true);
    expect(checkScreenGuard('goal', completeState).ok).toBe(true);
    expect(checkScreenGuard('format', completeState).ok).toBe(true);
    expect(checkScreenGuard('ad', completeState).ok).toBe(true);
    expect(checkScreenGuard('area', completeState).ok).toBe(true);
    expect(checkScreenGuard('budget', completeState).ok).toBe(true);
    expect(checkScreenGuard('review', completeState).ok).toBe(true);
  });

  it('resolves cities with locked home city, auto radius, manual additions, and exclusions', () => {
    const home = 'indore';
    const auto = ['indore', 'ujjain'];
    const manual = ['bhopal'];
    const excluded = ['ujjain'];

    const resolved = resolveSelectedCities(home, auto, manual, excluded);
    // Home city 'indore' must be present
    expect(resolved).toContain('indore');
    // Manual 'bhopal' must be present
    expect(resolved).toContain('bhopal');
    // Excluded 'ujjain' must be removed
    expect(resolved).not.toContain('ujjain');
    // Home city cannot be excluded even if passed in excluded list
    const resolvedLocked = resolveSelectedCities(home, auto, manual, ['indore']);
    expect(resolvedLocked).toContain('indore');
  });

  it('performs exact and prefix pincode lookups', () => {
    expect(lookupCityByPincode('452001')?.id).toBe('indore');
    expect(lookupCityByPincode('462001')?.id).toBe('bhopal');
    expect(lookupCityByPincode('452999')?.id).toBe('indore'); // 3-digit prefix fallback
    expect(lookupCityByPincode('999999')).toBeNull();
  });

  it('flags blocked words and detects claim words', () => {
    expect(checkBlockedWords('यह सट्टा का विज्ञापन है')).toBe('सट्टा');
    expect(checkBlockedWords('यह चमत्कारी इलाज है')).toBe('चमत्कारी इलाज');
    expect(checkBlockedWords('ताज़ा मिठाइयाँ')).toBeNull();

    expect(checkClaimWords('100% गारंटी के साथ')).toBe('100% गारंटी');
    expect(checkClaimWords('No.1 दुकान')).toBe('No.1');
    expect(checkClaimWords('शुद्ध घी से निर्मित')).toBeNull();
  });

  it('verifies campaign object creation and money invariant', () => {
    const daily = 250;
    const days = 7;
    const money = getMoneyBreakdown(daily, days);

    expect(money.subtotal).toBe(1750);
    expect(money.gst).toBe(315);
    expect(money.total).toBe(2065);

    // People reached can never exceed area readers
    const totalReaders = areaReaders(['indore']);
    const reached = peopleReached(totalReaders, daily, days);
    expect(reached).toBeLessThanOrEqual(totalReaders);
  });

  it('verifies format default and media expectations', () => {
    const feedCard = getFormatById('feed_card_ad');
    expect(feedCard.isDefault).toBe(true);
    expect(feedCard.minImages).toBe(1);

    const videoAd = getFormatById('video_ad');
    expect(videoAd.mediaType).toBe('video');
  });

  it('verifies goal and cta contact requirements', () => {
    const goal = getGoalById('engagement');
    expect(goal.defaultCtaKey).toBe('whatsapp_us');

    const whatsappConfig = getCtaConfig('engagement', 'whatsapp_us');
    expect(whatsappConfig.contactNeeded).toBe('whatsapp');

    const learnMoreConfig = getCtaConfig('reach', 'learn_more');
    expect(learnMoreConfig.contactNeeded).toBe('none');

    const viewNowConfig = getCtaConfig('ctrs', 'view_now');
    expect(viewNowConfig.contactNeeded).toBe('link');
  });
});
