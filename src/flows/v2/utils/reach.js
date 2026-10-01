import { CONFIG } from '../config';
import { getCityById } from '../data/cities';

/**
 * Calculates audience reduction factor based on gender and age selection.
 * Gender share x sum(selected age shares), clamped to [0.2, 1.0].
 * Filters can only REDUCE reach.
 */
export function audienceFactor(audience) {
  if (!audience) return 1;

  const genderShare = CONFIG.DEMO_GENDER_SHARES[audience.gender] ?? 1;

  const selectedAges = audience.ages && audience.ages.length > 0
    ? audience.ages
    : Object.keys(CONFIG.DEMO_AGE_SHARES);

  let ageShare = 0;
  for (const age of selectedAges) {
    ageShare += CONFIG.DEMO_AGE_SHARES[age] || 0;
  }
  // If all ages selected, ageShare sums to 1.0
  ageShare = Math.min(1, Math.max(0, ageShare));

  const factor = genderShare * ageShare;
  return Math.min(1, Math.max(0.2, Number(factor.toFixed(4))));
}

/**
 * Total readers in the selected cities, scaled by audience factor.
 */
export function areaReaders(selectedCityIds = [], audience = null) {
  if (!selectedCityIds || selectedCityIds.length === 0) return 0;

  let totalRawReaders = 0;
  for (const id of selectedCityIds) {
    const city = getCityById(id);
    if (city) {
      totalRawReaders += city.readers || 0;
    }
  }

  const factor = audienceFactor(audience);
  return Math.round(totalRawReaders * factor);
}

/**
 * Total views purchased for a daily budget and duration.
 */
export function viewsBought(daily, days) {
  const d = Math.max(0, Number(daily) || 0);
  const n = Math.max(0, Number(days) || 0);
  return Math.round(d * n * CONFIG.VIEWS_PER_RUPEE);
}

/**
 * Number of unique people reached for this budget.
 * Never exceeds total area readers.
 */
export function peopleReached(areaReadersN, daily, days) {
  const readers = Math.max(0, Number(areaReadersN) || 0);
  const potential = Math.floor(viewsBought(daily, days) / CONFIG.FREQUENCY_CAP);
  return Math.min(readers, potential);
}

/**
 * Computes range { lo, hi } for display, rounding appropriately.
 */
export function reachRange(x) {
  const num = Math.max(0, Math.round(Number(x) || 0));
  const roundUnit = num < 1000 ? 50 : 100;

  const loRaw = num * CONFIG.RANGE_LOW_FACTOR;
  const lo = Math.round(loRaw / roundUnit) * roundUnit;
  const hi = Math.round(num / roundUnit) * roundUnit;

  return {
    lo: Math.max(roundUnit, lo),
    hi: Math.max(roundUnit, Math.max(lo, hi)),
  };
}

/**
 * Identifies whether reach is constrained by audience size or budget.
 */
export function limitedBy(areaReadersN, daily, days) {
  const readers = Math.max(0, Number(areaReadersN) || 0);
  const potential = Math.floor(viewsBought(daily, days) / CONFIG.FREQUENCY_CAP);
  return potential >= readers ? 'audience' : 'budget';
}

/**
 * Smallest daily budget on the 25-step grid (>= MIN_DAILY) that reaches all area readers.
 * Returns null if even MAX_DAILY is not enough.
 */
export function recommendedDaily(areaReadersN, days) {
  const readers = Math.max(0, Number(areaReadersN) || 0);
  const n = Math.max(1, Number(days) || 1);

  for (
    let daily = CONFIG.MIN_DAILY;
    daily <= CONFIG.MAX_DAILY;
    daily += CONFIG.DAILY_STEP
  ) {
    const potential = Math.floor(viewsBought(daily, n) / CONFIG.FREQUENCY_CAP);
    if (potential >= readers) {
      return daily;
    }
  }

  return null;
}
