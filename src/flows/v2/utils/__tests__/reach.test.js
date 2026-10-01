import { describe, it, expect } from 'vitest';
import {
  viewsBought,
  peopleReached,
  areaReaders,
  audienceFactor,
  reachRange,
  limitedBy,
  recommendedDaily,
} from '../reach';

describe('Reach Engine', () => {
  it('calculates views bought correctly', () => {
    // 250 daily * 7 days * 28.5 = 49875
    expect(viewsBought(250, 7)).toBe(49875);
  });

  it('calculates budget-limited people reached correctly', () => {
    // floor(49875 / 3) = 16625 <= 98200
    expect(peopleReached(98200, 250, 7)).toBe(16625);
    expect(limitedBy(98200, 250, 7)).toBe('budget');
  });

  it('calculates audience-limited people reached correctly', () => {
    // floor(49875 / 3) = 16625 > 7631 -> capped at 7631
    expect(peopleReached(7631, 250, 7)).toBe(7631);
    expect(limitedBy(7631, 250, 7)).toBe('audience');
  });

  it('ensures demographic filters never increase reach', () => {
    const allAudience = { gender: 'all', ages: ['18-27', '28-43', '44-59', '60+'] };
    const baseFactor = audienceFactor(allAudience);
    expect(baseFactor).toBe(1);

    const maleOnly = { gender: 'male', ages: ['18-27', '28-43', '44-59', '60+'] };
    expect(audienceFactor(maleOnly)).toBeLessThanOrEqual(baseFactor);

    const partialAge = { gender: 'all', ages: ['18-27'] };
    expect(audienceFactor(partialAge)).toBeLessThanOrEqual(baseFactor);

    const partialBoth = { gender: 'female', ages: ['28-43'] };
    expect(audienceFactor(partialBoth)).toBeLessThanOrEqual(baseFactor);

    const cityIds = ['indore'];
    const baseReaders = areaReaders(cityIds, allAudience);
    const filteredReaders = areaReaders(cityIds, partialBoth);
    expect(filteredReaders).toBeLessThan(baseReaders);
  });

  it('formats reach range properly with rounding', () => {
    const range = reachRange(16625);
    expect(range.hi).toBe(16600);
    expect(range.lo).toBe(13300);
    expect(range.lo).toBeLessThanOrEqual(range.hi);
  });

  it('determines recommended daily budget when audience limited', () => {
    const rec = recommendedDaily(7631, 7);
    expect(rec).not.toBeNull();
    expect(rec % 25).toBe(0);
    expect(rec).toBeGreaterThanOrEqual(100);
  });
});
