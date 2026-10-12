import { describe, it, expect, beforeEach } from 'vitest';
import { initialV2State, v2Reducer } from '../../context/AdvertiserV2Context';
import { STEP_ORDER } from '../../router/screens';

describe('Flow B 6-step Back Button Navigation Bugfix', () => {
  it('correctly rewinds history and state backwards: budget (5) -> ad (4) -> format (3) -> goal (2) -> shop (1) -> intro', () => {
    // Initial state: User reached Step 5 (budget)
    let state = {
      ...initialV2State,
      nav: {
        current: 'budget',
        history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget'],
        direction: 'forward',
        fromReview: false,
        focusField: null,
        resubmitFor: null,
      },
    };

    // 1st back click: from step 5 (budget) to step 4 (ad)
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'ad', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('ad');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal', 'format', 'ad']);
    expect(state.nav.direction).toBe('backward');

    // 2nd back click: from step 4 (ad) to step 3 (format) - MUST NOT GO BACK TO 5!
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'format', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('format');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal', 'format']);
    expect(state.nav.direction).toBe('backward');

    // 3rd back click: from step 3 (format) to step 2 (goal)
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'goal', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('goal');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal']);

    // 4th back click: from step 2 (goal) to step 1 (shop)
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'shop', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('shop');
    expect(state.nav.history).toEqual(['intro', 'shop']);

    // 5th back click: from step 1 (shop) to intro
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'intro', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('intro');
    expect(state.nav.history).toEqual(['intro']);
  });

  it('heals corrupted ping-pong history [ad, budget, ad, budget] and navigates cleanly back to format (3)', () => {
    // Corrupted state simulating the user bug report:
    // User was at screen 5, clicked back to 4, clicked back again and got ping-ponged
    let state = {
      ...initialV2State,
      nav: {
        current: 'budget',
        history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget', 'ad', 'budget'],
        direction: 'backward',
      },
    };

    // Navigating back from budget -> ad:
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'ad', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('ad');
    // Notice that all subsequent wizard steps (budget) are stripped
    expect(state.nav.history).not.toContain('budget');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal', 'format', 'ad']);

    // Navigating back from ad -> format:
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'format', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('format');
    expect(state.nav.history).not.toContain('ad');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal', 'format']);
  });

  it('handles Step 6 (review) back navigation to Step 5 (budget)', () => {
    let state = {
      ...initialV2State,
      nav: {
        current: 'review',
        history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget', 'review'],
        direction: 'forward',
      },
    };

    // Back from review (6) goes to budget (5)
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'budget', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('budget');
    expect(state.nav.history).toEqual(['intro', 'shop', 'goal', 'format', 'ad', 'budget']);
  });

  it('handles editing from review (fromReview: true) and resets fromReview flag when returning', () => {
    let state = {
      ...initialV2State,
      nav: {
        current: 'goal',
        history: ['intro', 'shop', 'goal', 'format', 'ad', 'budget', 'review', 'goal'],
        direction: 'forward',
        fromReview: true,
      },
    };

    // User clicks back while in edit mode: returns to review
    state = v2Reducer(state, {
      type: 'NAVIGATE',
      payload: { screenId: 'review', options: { direction: 'backward' } },
    });
    expect(state.nav.current).toBe('review');
    expect(state.nav.fromReview).toBe(false);
  });

  it('GO_BACK action pops current screen and safely falls back to intro when stack is shallow', () => {
    let state = {
      ...initialV2State,
      nav: {
        current: 'login',
        history: ['intro', 'login'],
        direction: 'forward',
      },
    };

    state = v2Reducer(state, { type: 'GO_BACK' });
    expect(state.nav.current).toBe('intro');
    expect(state.nav.history).toEqual(['intro']);

    // Calling GO_BACK again when history has only 1 element falls back to intro safely
    state = v2Reducer(state, { type: 'GO_BACK' });
    expect(state.nav.current).toBe('intro');
    expect(state.nav.history).toEqual(['intro']);
  });

  it('verifies STEP_ORDER consists of precisely the 6 wizard steps in correct order', () => {
    expect(STEP_ORDER).toEqual(['shop', 'goal', 'format', 'ad', 'budget', 'review']);
  });
});
