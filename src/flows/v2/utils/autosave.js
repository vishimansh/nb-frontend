/**
 * Autosave utilities for localStorage with nb2_ keys.
 */

const STATE_KEY = 'nb2_state';
const ACCOUNT_KEY = 'nb2_account';
const SIM_KEY = 'nb2_sim';

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load nb2_state:', e);
    return null;
  }
}

export function saveState(state) {
  try {
    // Separate sim from state if needed
    const { sim, ...rest } = state;
    localStorage.setItem(STATE_KEY, JSON.stringify(rest));
    if (sim) {
      localStorage.setItem(SIM_KEY, JSON.stringify(sim));
    }
  } catch (e) {
    console.warn('Failed to save nb2_state:', e);
  }
}

export function loadSavedSim() {
  try {
    const raw = localStorage.getItem(SIM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load nb2_sim:', e);
    return null;
  }
}

export function loadSavedAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load nb2_account:', e);
    return null;
  }
}

export function saveAccount(account) {
  try {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  } catch (e) {
    console.warn('Failed to save nb2_account:', e);
  }
}

export function clearFlowV2Session() {
  try {
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(SIM_KEY);
    localStorage.removeItem(ACCOUNT_KEY);
    localStorage.removeItem('nb2_events');
  } catch (e) {
    console.warn('Failed to clear Flow B session:', e);
  }
}
