import { describe, it, expect } from 'vitest';
import { calculateSubtotal, calculateGst, calculateTotal, getMoneyBreakdown } from '../money';

describe('Money Engine', () => {
  it('calculates trial package accurately (100 daily, 3 days)', () => {
    const sub = calculateSubtotal(100, 3);
    const gst = calculateGst(sub);
    const tot = calculateTotal(sub);

    expect(sub).toBe(300);
    expect(gst).toBe(54);
    expect(tot).toBe(354);
  });

  it('calculates standard package accurately (250 daily, 7 days)', () => {
    const sub = calculateSubtotal(250, 7);
    const gst = calculateGst(sub);
    const tot = calculateTotal(sub);

    expect(sub).toBe(1750);
    expect(gst).toBe(315);
    expect(tot).toBe(2065);
  });

  it('calculates boost package accurately (500 daily, 7 days)', () => {
    const sub = calculateSubtotal(500, 7);
    const gst = calculateGst(sub);
    const tot = calculateTotal(sub);

    expect(sub).toBe(3500);
    expect(gst).toBe(630);
    expect(tot).toBe(4130);
  });

  it('returns structured breakdown helper', () => {
    const breakdown = getMoneyBreakdown(250, 7);
    expect(breakdown).toEqual({
      daily: 250,
      days: 7,
      subtotal: 1750,
      gst: 315,
      total: 2065,
    });
  });
});
