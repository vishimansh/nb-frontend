import { describe, it, expect } from 'vitest';
import { formatIN, formatLakh, formatRange, formatRupees } from '../formatIN';

describe('formatIN Utility', () => {
  it('formats Indian numbers correctly with comma grouping', () => {
    expect(formatIN(103435)).toBe('1,03,435');
    expect(formatIN(98200)).toBe('98,200');
    expect(formatIN(1750)).toBe('1,750');
    expect(formatIN(500)).toBe('500');
    expect(formatIN(0)).toBe('0');
  });

  it('formats large numbers into lakh format correctly', () => {
    expect(formatLakh(103000)).toBe('1.03 लाख');
    expect(formatLakh(210000)).toBe('2.1 लाख');
    expect(formatLakh(98200)).toBe('98,200');
  });

  it('formats ranges using en-dash', () => {
    expect(formatRange(6000, 7600)).toBe('6,000–7,600');
  });

  it('formats rupee currency with prefix', () => {
    expect(formatRupees(2065)).toBe('₹2,065');
  });
});
